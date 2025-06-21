'use client';
import { useEffect, useState } from 'react';

interface Competition {
  name: string;
  resultAdded: boolean;
}

interface Category {
  _id: string;
  category: string;
  competitions: Competition[];
}

export default function CategoryCompetitionPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState('');
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [editCategoryName, setEditCategoryName] = useState('');
  const [editingComp, setEditingComp] = useState<{ catId: string; index: number } | null>(null);
  const [editCompName, setEditCompName] = useState('');


  const fetchCategories = async () => {
    const res = await fetch(`/api/category?userId=${userId}`);
    const data = await res.json();
    setCategories(data);
  };

  let userId:string|null=''
  useEffect(() => {
     userId = localStorage.getItem('cvdsahiAuth');
    fetchCategories();
  }, []);

  const handleAddCategory = async () => {
    if (!newCategory || !userId) return;
    await fetch('/api/category', {
      method: 'POST',
      body: JSON.stringify({ category: newCategory, userId }),
      headers: { 'Content-Type': 'application/json' },
    });
    setNewCategory('');
    fetchCategories();
  };

  const handleDeleteCategory = async (id: string, competitions: Competition[]) => {
    const hasPublished = competitions.some((c) => c.resultAdded);
    const hasAny = competitions.length > 0;
    if (hasPublished || hasAny) return;

    if (!confirm('Are you sure you want to delete this category?')) return;
    await fetch(`/api/category?id=${id}`, { method: 'DELETE' });
    fetchCategories();
  };

  const handleAddCompetition = async (id: string, compName: string) => {
    if (!compName.trim()) return;
    await fetch(`/api/category/competition?id=${id}`, {
      method: 'POST',
      body: JSON.stringify({ name: compName }),
      headers: { 'Content-Type': 'application/json' },
    });
    fetchCategories();
  };

  const handleDeleteCompetition = async (categoryId: string, name: string) => {
    if (!confirm(`Delete competition "${name}"?`)) return;
    await fetch(`/api/category/competition/delete?id=${categoryId}`, {
      method: 'POST',
      body: JSON.stringify({ name }),
      headers: { 'Content-Type': 'application/json' },
    });
    fetchCategories();
  };

  const handleEditCategory = async () => {
    if (!editCategoryName || !editingCatId) return;
    await fetch(`/api/category?id=${editingCatId}`, {
      method: 'PUT',
      body: JSON.stringify({ category: editCategoryName }),
      headers: { 'Content-Type': 'application/json' },
    });
    setEditingCatId(null);
    setEditCategoryName('');
    fetchCategories();
  };

  const handleEditCompetition = async () => {
    if (!editingComp || !editCompName) return;
    const { catId, index } = editingComp;

    await fetch(`/api/category/competition?id=${catId}`, {
      method: 'PUT',
      body: JSON.stringify({ index, newName: editCompName }),
      headers: { 'Content-Type': 'application/json' },
    });
    setEditingComp(null);
    setEditCompName('');
    fetchCategories();
  };

  return (
    <div className="max-w-5xl mx-auto p-4">
      {/* Add Category */}
      <div className="flex flex-col sm:flex-row gap-2 mb-6">
        <input
          type="text"
          placeholder="New Category"
          className="border p-2 rounded w-full sm:w-1/2"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
        />
        <button
          onClick={handleAddCategory}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add Category
        </button>
      </div>

      {/* Categories */}
      <div className="grid md:grid-cols-3 gap-5">
        {categories.map((cat) => {
          const hasPublished = cat.competitions.some((c) => c.resultAdded);
          const hasCompetitions = cat.competitions.length > 0;
          return (
            <div key={cat._id} className="border rounded-lg shadow-md">
              <div className="flex justify-between items-center bg-gray-100 p-4">
                {editingCatId === cat._id ? (
                  <div className="flex gap-2 w-full">
                    <input
                      value={editCategoryName}
                      onChange={(e) => setEditCategoryName(e.target.value)}
                      className="border p-1 w-full"
                    />
                    <button
                      onClick={handleEditCategory}
                      className="bg-green-600 text-white px-3 py-1 rounded text-sm"
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <>
                    <h2 className="text-lg font-bold">{cat.category}</h2>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditingCatId(cat._id);
                          setEditCategoryName(cat.category);
                        }}
                        className="text-blue-600 hover:underline text-sm"
                      >
                        Edit
                      </button>
                      {!hasPublished && !hasCompetitions && (
                        <button
                          onClick={() => handleDeleteCategory(cat._id, cat.competitions)}
                          className="text-red-600 hover:underline text-sm"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </>
                )}
              </div>

              {/* Competitions */}
              <div className="p-4 space-y-2">
                {cat.competitions?.length > 0 ? (
                  cat.competitions.map((comp, idx) => (
                    <div key={idx} className="flex justify-between items-center border p-2 rounded">
                      {editingComp && editingComp.catId === cat._id && editingComp.index === idx ? (
                        <div className="flex gap-2 w-full">
                          <input
                            value={editCompName}
                            onChange={(e) => setEditCompName(e.target.value)}
                            className="border p-1 w-full"
                          />
                          <button
                            onClick={handleEditCompetition}
                            className="bg-green-600 text-white px-3 py-1 rounded text-sm"
                          >
                            Save
                          </button>
                        </div>
                      ) : (
                        <>
                          <span>
                            {comp.name} {comp.resultAdded && <span className="text-green-500">(Published)</span>}
                          </span>
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                setEditingComp({ catId: cat._id, index: idx });
                                setEditCompName(comp.name);
                              }}
                              className="text-blue-500 text-sm"
                            >
                              Edit
                            </button>
                           {!comp.resultAdded&& <button
                              onClick={() => handleDeleteCompetition(cat._id, comp.name)}
                              className="text-sm text-red-500 hover:underline"
                            >
                              Delete
                            </button>}
                          </div>
                        </>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No competitions</p>
                )}

                {/* Add Competition */}
                <div className="flex gap-2 mt-2">
                  <input
                    type="text"
                    placeholder="New Competition"
                    className="border p-2 rounded w-full"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleAddCompetition(cat._id, (e.target as HTMLInputElement).value);
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
