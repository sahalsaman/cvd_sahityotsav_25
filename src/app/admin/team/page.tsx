'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Team {
  _id: string;
  userId: string;
  team: string;
  point: number;
  totalResult: number;
}

export default function TeamListPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [newTeam, setNewTeam] = useState('');
  const [editingTeamId, setEditingTeamId] = useState<string | null>(null);
  const [editData, setEditData] = useState({ team: ''});
  const router = useRouter(); 
  let userId:string|null=''
  useEffect(() => {
     userId = localStorage.getItem('cvdsahiAuth');
    if (!userId) {
      router.push('/admin/login');
    } else {
      fetchTeams();
    }
  }, []);

  const fetchTeams = async () => {
    const res = await fetch(`/api/team?userId=${userId}`);
    const data = await res.json();
    setTeams(data);
  };

  const handleAdd = async () => {
    if (!newTeam.trim()) return;
    const res = await fetch('/api/team', {
      method: 'POST',
      body: JSON.stringify({
        userId,
        team: newTeam,
      }),
      headers: { 'Content-Type': 'application/json' },
    });
    if (res.ok) {
      setNewTeam('');
      fetchTeams();
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm('Are you sure you want to delete this team?');
    if (!confirmed) return;
    await fetch(`/api/team?id=${id}`, { method: 'DELETE' });
    fetchTeams();
  };

  const handleEditStart = (team: Team) => {
    setEditingTeamId(team._id);
    setEditData({
      team: team.team,
    });
  };

  const handleEditSave = async () => {
    if (!editingTeamId) return;
    await fetch(`/api/team?id=${editingTeamId}`, {
      method: 'PUT',
      body: JSON.stringify({
        team: editData.team,
      }),
      headers: { 'Content-Type': 'application/json' },
    });
    setEditingTeamId(null);
    fetchTeams();
  };

  return (
    <div className="p-10 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Team Management</h1>

      {/* Add Team */}
      <div className="flex gap-3 mb-6">
        <input
          type="text"
          placeholder="Team"
          value={newTeam}
          onChange={(e) => setNewTeam(e.target.value)}
          className="border p-2 rounded w-1/3"
        />
  
        <button onClick={handleAdd} className="bg-blue-600 text-white px-4 rounded">
          Add
        </button>
      </div>

      {/* Team Table */}
      <table className="w-full border text-left">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3">Team</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {teams.map((team) =>
            editingTeamId === team._id ? (
              <tr key={team._id} className="border-b">
                <td className="p-2">
                  <input
                    className="border p-1 rounded w-full"
                    value={editData.team}
                    onChange={(e) => setEditData({ ...editData, team: e.target.value })}
                  />
                </td>
             
                <td className="p-2 flex gap-2">
                  <button onClick={handleEditSave} className="bg-green-600 text-white px-3 py-1 rounded">
                    Save
                  </button>
                  <button onClick={() => setEditingTeamId(null)} className="bg-gray-500 text-white px-3 py-1 rounded">
                    Cancel
                  </button>
                </td>
              </tr>
            ) : (
              <tr key={team._id} className="border-b">
                <td className="p-3">{team.team}</td>
                <td className="p-3 flex gap-2">
                  <button
                    onClick={() => handleEditStart(team)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(team._id)}
                    className="bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
}
