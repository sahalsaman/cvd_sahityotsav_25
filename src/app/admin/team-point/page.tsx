'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ITeam } from '@/app/interface';



export default function TeamPointPage() {
  const [teams, setTeams] = useState<ITeam[]>([]);
  const [editData, setEditData] = useState<Record<string, number>>({});
  const [newTotalResult, setNewTotalResult] = useState('');
  const router = useRouter();
 let userId:string|null=''
  useEffect(() => {
     userId = localStorage.getItem('cvdsahiAuth');
    if (!userId) {
      router.push('/auth/login');
    } else {
      fetchTeams();
    }
  }, []);

  const fetchTeams = async () => {
    const res = await fetch("/api/team");
    const data = await res.json();

    // Sort teams by point descending
    const sorted = data.sort((a: ITeam, b: ITeam) => b.point - a.point);
    setTeams(sorted);

    // Pre-fill edit data
    const pointsMap: Record<string, number> = {};
    sorted.forEach((team: ITeam) => {
      pointsMap[team._id] = team.point;
    });
    setEditData(pointsMap);
  };

  const handlePointChange = (id: string, value: string) => {
    setEditData((prev) => ({
      ...prev,
      [id]: Number(value),
    }));
  };

  const handleSaveAll = async () => {
    if (!newTotalResult) return alert('Enter totalResult to set for all');

    await Promise.all(
      teams.map(async (team) => {
        await fetch(`/api/team?id=${team._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            point: editData[team._id],
            totalResult: Number(newTotalResult),
          }),
        });
      })
    );

    alert('All teams updated successfully!');
    setNewTotalResult('');
    fetchTeams();
  };

  return (
    <div className="x-auto">
      <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold">Team Point</h1>
        <div className="flex gap-2 items-center">

      <h5 className="text-xl font-bold">After {teams[0]?.totalResult} Result</h5>
          <input
            type="number"
            placeholder="Set total result"
            className="border p-2 rounded w-40"
            value={newTotalResult}
            onChange={(e) => setNewTotalResult(e.target.value)}
          />
          <button
            onClick={handleSaveAll}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Publish
          </button>
        </div>
      </div>

      {/* Team Table */}
      <table className="w-full border text-left">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3">No</th>
            <th className="p-3">Team</th>
            <th className="p-3">Published Point</th>
            <th className="p-3">New Point</th>
          </tr>
        </thead>
        <tbody>
          {teams.map((team, index) => (
            <tr key={team._id} className="border-b">
              <td className="p-3">{index + 1}</td>
              <td className="p-3">{team.team}</td>
              <td className="p-3">{team.point}</td>
              <td className="p-3">
                <input
                  type="number"
                  className="border p-2 rounded w-full"
                  value={editData[team._id] ?? ''}
                  onChange={(e) => handlePointChange(team._id, e.target.value)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
