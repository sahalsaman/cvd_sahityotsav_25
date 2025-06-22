'use client';
import { useEffect, useState } from 'react';

interface ICategory {
  _id: string;
  name: string;
  competitions: ICompetition[];
}

interface ICompetition {
  _id: string;
  name: string;
  published: boolean;
  resultAdded: boolean;
  categoryId: string;
}

export default function CategoryCompetitionPage() {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [newCategory, setNewCategory] = useState('');
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [editCategoryName, setEditCategoryName] = useState('');
  const [editCompId, setEditCompId] = useState<string | null>(null);
  const [editCompName, setEditCompName] = useState('');

  const userId = typeof window !== 'undefined' ? localStorage.getItem('cvdsahiAuth') : '';

  const fetchAll = async () => {
    const res = await fetch('/api/category');
    const cats = await res.json();
    setCategories(cats);
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleAddCategory = async () => {
    if (!newCategory || !userId) return;
    await fetch('/api/category', {
      method: 'POST',
      body: JSON.stringify({ name: newCategory, userId }),
      headers: { 'Content-Type': 'application/json' },
    });
    setNewCategory('');
    fetchAll();
  };

  const handleDeleteCategory = async (id: string, competitions: ICompetition[]) => {
    const hasComp = competitions.length > 0;
    if (hasComp || !confirm('Delete this category?')) return;
    await fetch(`/api/category?id=${id}`, { method: 'DELETE' });
    fetchAll();
  };

  const handleAddCompetition = async (categoryId: string, name: string) => {
    if (!name.trim()) return;
    await fetch('/api/competition', {
      method: 'POST',
      body: JSON.stringify({ categoryId, name, userId }),
      headers: { 'Content-Type': 'application/json' },
    });
    fetchAll();
  };

  const handleDeleteCompetition = async (id: string) => {
    if (!confirm('Delete this competition?')) return;
    await fetch(`/api/competition?id=${id}`, { method: 'DELETE' });
    fetchAll();
  };

  const handleEditCategory = async () => {
    if (!editingCatId || !editCategoryName) return;
    await fetch(`/api/category?id=${editingCatId}`, {
      method: 'PUT',
      body: JSON.stringify({ name: editCategoryName }),
      headers: { 'Content-Type': 'application/json' },
    });
    setEditingCatId(null);
    setEditCategoryName('');
    fetchAll();
  };

  const handleEditCompetition = async () => {
    if (!editCompId || !editCompName) return;
    await fetch(`/api/competition?id=${editCompId}`, {
      method: 'PUT',
      body: JSON.stringify({ name: editCompName }),
      headers: { 'Content-Type': 'application/json' },
    });
    setEditCompId(null);
    setEditCompName('');
    fetchAll();
  };

  return (
    <div className="p-5">
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          placeholder="New Category"
          className="border p-2 rounded w-full sm:w-1/2"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
        />
        <button onClick={handleAddCategory} className="bg-blue-600 text-white px-4 py-2 rounded">
          Add Category
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {categories.map((cat) => {
          const comps = cat.competitions || [];
          const hasResults = comps.some((c) => c.resultAdded);

          return (
            <div key={cat._id} className="border rounded shadow-md">
              <div className="flex justify-between items-center bg-gray-100 p-4">
                {editingCatId === cat._id ? (
                  <>
                    <input
                      value={editCategoryName}
                      onChange={(e) => setEditCategoryName(e.target.value)}
                      className="border p-1 w-full"
                    />
                    <button onClick={handleEditCategory} className="bg-green-500 text-white px-2 rounded">
                      Save
                    </button>
                  </>
                ) : (
                  <>
                    <h2 className="font-semibold">{cat.name}</h2>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditingCatId(cat._id);
                          setEditCategoryName(cat.name);
                        }}
                        className="text-blue-600 text-sm"
                      >
                        Edit
                      </button>
                      {!hasResults && comps.length === 0 && (
                        <button
                          onClick={() => handleDeleteCategory(cat._id, comps)}
                          className="text-red-600 text-sm"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </>
                )}
              </div>

              <div className="p-3 space-y-2">
                {comps.map((comp) => (
                  <div key={comp._id} className="flex justify-between items-center border p-2 rounded">
                    {editCompId === comp._id ? (
                      <>
                        <input
                          value={editCompName}
                          onChange={(e) => setEditCompName(e.target.value)}
                          className="border p-1 w-full"
                        />
                        <button
                          onClick={handleEditCompetition}
                          className="bg-green-500 text-white px-2 rounded text-sm"
                        >
                          Save
                        </button>
                      </>
                    ) : (
                      <>
                        <span>{comp.name}</span>
                        <div className="flex gap-2">
                          {comp.resultAdded && <span className="text-green-600 text-xs">Result Added</span>}
                          {comp.published && <span className="text-blue-600 text-xs">Published</span>}
                          {!comp.resultAdded && !comp.published && (
                            <>
                              <button
                                onClick={() => {
                                  setEditCompId(comp._id);
                                  setEditCompName(comp.name);
                                }}
                                className="text-blue-500 text-sm"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteCompetition(comp._id)}
                                className="text-red-500 text-sm"
                              >
                                Delete
                              </button>
                            </>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                ))}

                <div className="flex gap-2 mt-2">
                  <input
                    type="text"
                    placeholder="New Competition"
                    className="border p-2 rounded w-full"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        const name = (e.target as HTMLInputElement).value;
                        handleAddCompetition(cat._id, name);
                        (e.target as HTMLInputElement).value = '';
                      }
                    }}
                  />
                  <button
                    onClick={(e) => {
                      const input = (e.currentTarget.previousSibling as HTMLInputElement);
                      handleAddCompetition(cat._id, input.value);
                      input.value = '';
                    }}
                    className="bg-green-600 text-white px-4 py-2 rounded"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}