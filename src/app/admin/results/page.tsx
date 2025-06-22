'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ICategory, ICompetition, IResult, ITeam } from '@/app/interface';

export default function ResultPage() {
  const [results, setResults] = useState<IResult[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [teams, setTeams] = useState<ITeam[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [formData, setFormData] = useState<IResult>({
    categoryId: '',
    competitionId: '',
    resultNumber: '',
    f_name: '',
    f_team: '',
  });

  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const uid = localStorage.getItem('cvdsahiAuth');
    if (!uid) router.push('/auth/login');
    setUserId(uid);

    fetchResults();
    fetchCategories();
    fetchTeams();
  }, []);

  const fetchResults = async () => {
    const res = await fetch(`/api/result`);
    const data = await res.json();
    setResults(data);
  };

  const fetchCategories = async () => {
    const res = await fetch(`/api/category`);
    const data = await res.json();

    const filtered = data
      .map((cat: ICategory) => ({
        ...cat,
        competitions: cat?.competitions?.filter((comp: ICompetition) => !comp.resultAdded),
      }))
      .filter((cat: ICategory) => cat?.competitions&&cat?.competitions?.length > 0);

    setCategories(filtered);
  };

  const fetchTeams = async () => {
    const res = await fetch(`/api/team`);
    const data = await res.json();
    setTeams(data);
  };

  const handleSubmit = async () => {
    const method = editId ? 'PUT' : 'POST';
    const url = editId ? `/api/result?id=${editId}` : '/api/result';
    const body = JSON.stringify({ ...formData, userId });

    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body,
    });

    resetForm();
    fetchResults();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this result?')) return;
    await fetch(`/api/result?id=${id}`, { method: 'DELETE' });
    fetchResults();
  };

  const handlePublish = async (id: string, status: string) => {
    if (!confirm(`${status === "true" ? "Publish" : "Unpublish"} this result?`)) return;
    await fetch(`/api/result?id=${id}&publish=${status}`, { method: 'PUT' });
    fetchResults();
  };

  const openEditModal = (result: IResult) => {
    setFormData(result);
    setEditId(result._id!);
    setShowModal(true);
  };

  const resetForm = (modatl:boolean=false) => {
    setShowModal(modatl??false)
    setEditId(null);
    setFormData({
      categoryId: '',
      competitionId: '',
      resultNumber: '',
      f_name: '',
      f_team: '',
    });
  };

  return (
    <div className="mx-auto">
      <div className="flex justify-between mb-4">
        <h1 className="text-xl font-bold">Result Management</h1>
        <button
          onClick={() => {
            resetForm(true);
          }}
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
              <td className="p-2">{res.category?.name}</td>
              <td className="p-2">{res.competition?.name}</td>
              <td className="p-2">{res.f_name} ({res.f_team})</td>
              <td className="p-2">{res.s_name} ({res.s_team})</td>
              <td className="p-2">{res.t_name} ({res.t_team})</td>
              <td className="p-2">
                {res.published ? (
                  <button
                    onClick={() => handlePublish(res._id!, "false")}
                    className="text-green-600 text-sm mr-2"
                  >
                    Unpublish
                  </button>
                ) : (
                  <button
                    onClick={() => handlePublish(res._id!, "true")}
                    className="text-green-600 text-sm mr-2"
                  >
                    Publish
                  </button>
                )}
                {!res.published && (
                  <>
                    <button
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
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow p-6 w-full max-w-xl">
            <h2 className="text-lg font-bold mb-4">{editId ? 'Edit' : 'Add'} Result</h2>
            <div className="grid md:grid-cols-3 gap-4 mb-5">
              {editId && formData.category ? (
                <div>Category: {formData.category?.name}</div>
              ) : (
                <select
                  value={formData.category?._id}
                  onChange={(e) =>
                    setFormData({ ...formData, categoryId: e.target.value, competitionId: '' })
                  }
                  className="border p-2 rounded"
                >
                  <option value="">Select Category</option>
                  {categories.map((cat:ICategory) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              )}

              {editId && formData.competition ? (
                <div>Competition: {formData.competition?.name}</div>
              ) : (
                <select
                  value={formData.competition?._id}
                  onChange={(e) =>
                    setFormData({ ...formData, competitionId: e.target.value })
                  }
                  className="border p-2 rounded"
                >
                  <option value="">Select Competition</option>
                  {categories&&categories?.find((c) => c?._id === formData.categoryId)
                    ?.competitions?.map((comp, i) => (
                      <option key={i} value={comp._id}>
                        {comp.name}
                      </option>
                    ))}
                </select>
              )}

              <input
                type="text"
                placeholder="Result Number"
                value={formData.resultNumber}
                onChange={(e) => setFormData({ ...formData, resultNumber: e.target.value })}
                className="border p-2 rounded"
              />
            </div>

            {/* Winners */}
            <div className="grid grid-cols-2 gap-4">
  {/* 1st Place */}
  <div className="contents">
    <div className="flex items-end gap-2">
      <span className="text-xl">1.</span>
      <input
        type="text"
        placeholder="Name"
        value={formData.f_name || ''}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, f_name: e.target.value }))
        }
        className="border p-2 rounded w-full"
      />
    </div>
    <select
      value={formData.f_team || ''}
      onChange={(e) =>
        setFormData((prev) => ({ ...prev, f_team: e.target.value }))
      }
      className="border p-2 rounded"
    >
      <option value="">Select Team</option>
      {teams.map((team) => (
        <option key={team._id} value={team.team}>
          {team.team}
        </option>
      ))}
    </select>
  </div>

  {/* 2nd Place */}
  <div className="contents">
    <div className="flex items-end gap-2">
      <span className="text-xl">2.</span>
      <input
        type="text"
        placeholder="Name"
        value={formData.s_name || ''}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, s_name: e.target.value }))
        }
        className="border p-2 rounded w-full"
      />
    </div>
    <select
      value={formData.s_team || ''}
      onChange={(e) =>
        setFormData((prev) => ({ ...prev, s_team: e.target.value }))
      }
      className="border p-2 rounded"
    >
      <option value="">Select Team</option>
      {teams.map((team) => (
        <option key={team._id} value={team.team}>
          {team.team}
        </option>
      ))}
    </select>
  </div>

  {/* 3rd Place */}
  <div className="contents">
    <div className="flex items-end gap-2">
      <span className="text-xl">3.</span>
      <input
        type="text"
        placeholder="Name"
        value={formData.t_name || ''}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, t_name: e.target.value }))
        }
        className="border p-2 rounded w-full"
      />
    </div>
    <select
      value={formData.t_team || ''}
      onChange={(e) =>
        setFormData((prev) => ({ ...prev, t_team: e.target.value }))
      }
      className="border p-2 rounded"
    >
      <option value="">Select Team</option>
      {teams.map((team) => (
        <option key={team._id} value={team.team}>
          {team.team}
        </option>
      ))}
    </select>
  </div>
</div>

            <div className="mt-4 flex justify-end gap-2">
              <button onClick={()=>resetForm(false)} className="px-4 py-2 rounded border">
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                {editId ? 'Update' : 'Add'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
