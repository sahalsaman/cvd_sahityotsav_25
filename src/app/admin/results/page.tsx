'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Result {
  _id?: string;
  category: string;
  compotition: string;
  resultNumber: string;
  publish?: boolean;
  f_name: string;
  f_team: string;
  s_name?: string;
  s_team?: string;
  s2_name?: string;
  s2_team?: string;
  t_name?: string;
  t_team?: string;
  t2_name?: string;
  t2_team?: string;
}

interface Category {
  _id: string;
  category: string;
  competitions: { name: string; published: boolean }[];
}

interface Team {
  _id: string;
  team: string;
}

export default function ResultPage() {
  const [results, setResults] = useState<Result[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Result>({
    category: '',
    compotition: '',
    resultNumber: '',
    f_name: '',
    f_team: '',
  });

  const userId = typeof window !== 'undefined' ? localStorage.getItem('cvdsahiAuth') : '';
  const router = useRouter();

  useEffect(() => {
    if (!userId) router.push('/admin/login');
    fetchResults();
    fetchCategories();
    fetchTeams();
  }, []);

  const fetchResults = async () => {
    const res = await fetch(`/api/result?userId=${userId}`);
    const data = await res.json();
    setResults(data);
  };

  const fetchCategories = async () => {
    const res = await fetch(`/api/category?userId=${userId}`);
    const data = await res.json();
  
    const filtered = data.map((cat: any) => ({
      ...cat,
      competitions: cat.competitions.filter((comp: any) => !comp.resultAdded),
    })).filter((cat: any) => cat.competitions.length > 0); // remove empty categories
  
    setCategories(filtered);
  };
  

  const fetchTeams = async () => {
    const res = await fetch(`/api/team?userId=${userId}`);
    const data = await res.json();
    setTeams(data);
  };

  const handleSubmit = async () => {
    const method = editId ? 'PUT' : 'POST';
    const url = editId ? `/api/result?id=${editId}` : '/api/result';
    const body = JSON.stringify({ ...formData, userId });

    await fetch(url, { method, body, headers: { 'Content-Type': 'application/json' } });
    setShowModal(false);
    setEditId(null);
    setFormData({ category: '', compotition: '', resultNumber: '', f_name: '', f_team: '' });
    fetchResults();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this result?')) return;
    await fetch(`/api/result?id=${id}`, { method: 'DELETE' });
    fetchResults();
  };

  const handlePublish = async (id: string, status: string) => {
    if (!confirm('Publish this result?')) return;
    await fetch(`/api/result?id=${id}&&publish=${status}`, { method: 'PUT' });
    fetchResults();
  };

  const openEditModal = (result: Result) => {
    setFormData(result);
    setEditId(result._id!);
    setShowModal(true);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex justify-between mb-4">
        <h1 className="text-xl font-bold">Result Management</h1>
        <button
          onClick={() => {setShowModal(true); setFormData({
            category: '',
            compotition: '',
            resultNumber: '',
            f_name: '',
            f_team: '',
          });
            setEditId(null);}}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add Result
        </button>
      </div>

      <table className="w-full border text-left">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2">#</th>
            <th className="p-2">Category</th>
            <th className="p-2">Competition</th>
            <th className="p-2">First</th>
            <th className="p-2">Second</th>
            <th className="p-2">Third</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {results.map((res) => (
            <tr key={res._id} className="border-b">
              <td className="p-2">{res.resultNumber}</td>
              <td className="p-2">{res.category}</td>
              <td className="p-2">{res.compotition}</td>
              <td className="p-2">{res.f_name} ({res.f_team})</td>
              <td className="p-2">{res.s_name} ({res.s_team})</td>
              <td className="p-2">{res.t_name} ({res.t_team})</td>
              <td className="p-2">
                {res.publish ? <button
                  onClick={() => handlePublish(res._id!, "false")}
                  className="text-green-600 text-sm mr-2"
                >
                  Unublish
                </button> : <button
                  onClick={() => handlePublish(res._id!, "true")}
                  className="text-green-600 text-sm mr-2"
                >
                  Publish
                </button>}
               {!res.publish && <><button
                  onClick={() => openEditModal(res)}
                  className="text-blue-600 text-sm mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(res._id!)}
                  className="text-red-600 text-sm"
                >
                  Delete
                </button></>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow p-6 w-full max-w-xl">
            <h2 className="text-lg font-bold mb-4">{editId ? 'Edit' : 'Add'} Result</h2>
            <div className="grid md:grid-cols-3 gap-4 mb-5">
              {editId&&formData.category?<div>Category: {formData.category}</div>:<select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value, compotition: '' })}
                className="border p-2 rounded"
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat.category}>{cat.category}</option>
                ))}
              </select>}
              {editId&&formData.compotition?<div>Compotition: {formData.compotition}</div>:
              <select
                value={formData.compotition}
                onChange={(e) => setFormData({ ...formData, compotition: e.target.value })}
                className="border p-2 rounded"
              >
                <option value="">Select Competition</option>
                {categories.find(c => c.category === formData.category)?.competitions.map((comp, i) => (
                  <option key={i} value={comp.name}>{comp.name}</option>
                ))}
              </select>}

              <input
                type="text"
                placeholder="Result Number"
                value={formData.resultNumber}
                onChange={(e) => setFormData({ ...formData, resultNumber: e.target.value })}
                className="border p-2 rounded"
              />
              </div>
               <div className="grid grid-cols-2 gap-4">
              <div className="flex w-full items-end justify-between gap-4">
                <span className='text-2xl  '>1.</span>
                <input
                  type="text"
                  placeholder="First Name"
                  value={formData.f_name}
                  onChange={(e) => setFormData({ ...formData, f_name: e.target.value })}
                  className="border p-2 rounded w-full"
                />
              </div>

              <select
                value={formData.f_team}
                onChange={(e) => setFormData({ ...formData, f_team: e.target.value })}
                className="border p-2 rounded"
              >
                <option value="">Select First Team</option>
                {teams.map(team => (
                  <option key={team._id} value={team.team}>{team.team}</option>
                ))}
              </select>
              <div className="flex w-full items-end justify-between gap-4">
                <span className='text-2xl  '>2.</span>
              <input
                type="text"
                placeholder="Second Name"
                value={formData.s_name || ''}
                onChange={(e) => setFormData({ ...formData, s_name: e.target.value })}
                className="border p-2 rounded w-full"
              />
              </div>

              <select
                value={formData.s_team || ''}
                onChange={(e) => setFormData({ ...formData, s_team: e.target.value })}
                className="border p-2 rounded"
              >
                <option value="">Select Second Team</option>
                {teams.map(team => (
                  <option key={team._id} value={team.team}>{team.team}</option>
                ))}
              </select>
              <div className="flex w-full items-end justify-between gap-4">
                <span className='text-2xl  '>3.</span>
              <input
                type="text"
                placeholder="Third Name"
                value={formData.t_name || ''}
                onChange={(e) => setFormData({ ...formData, t_name: e.target.value })}
                className="border p-2 rounded w-full"
              />
              </div>

              <select
                value={formData.t_team || ''}
                onChange={(e) => setFormData({ ...formData, t_team: e.target.value })}
                className="border p-2 rounded"
              >
                <option value="">Select Third Team</option>
                {teams.map(team => (
                  <option key={team._id} value={team.team}>{team.team}</option>
                ))}
              </select>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 rounded border">Cancel</button>
              <button onClick={handleSubmit} className="px-4 py-2 bg-blue-600 text-white rounded">
                {editId ? 'Update' : 'Add'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}