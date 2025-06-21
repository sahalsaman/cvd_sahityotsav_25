'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaUsers, FaTrophy, FaCheckCircle, FaClipboardList } from 'react-icons/fa';

export default function Admin() {
  const router = useRouter();
  const [teamCount, setTeamCount] = useState(0);
  const [teamPoints, setTeamPoints] = useState(0);
  const [totalResult, setTotalResult] = useState(0);
  const [publishedResults, setPublishedResults] = useState(0);
  const userId = localStorage.getItem('cvdsahiAuth');

  useEffect(() => {
    if (!userId) {
      router.push('/admin/login');
    } else {
      fetchData();
    }
  }, []);

  const fetchData = async () => {
    try {
      const [teamRes, resultRes] = await Promise.all([
        fetch(`/api/team?userId=${userId}`),
        fetch(`/api/result?userId=${userId}`),
      ]);
      const teams = await teamRes.json();
      const result = await resultRes.json();
      const published= result.filter((item:any)=>item.publish===true)
      setTeamCount(teams.length);
      setTeamPoints(teams[0].totalResult);
      setTotalResult(result.length);
      setPublishedResults(published.length);
    } catch (err) {
      console.error("Error loading dashboard data:", err);
    }
  };

  const cards = [
    {
      title: 'Teams',
      count: teamCount,
      icon: <FaUsers size={24} className="text-blue-500" />,
    },
    {
      title: 'Published Team Points',
      count: teamPoints,
      icon: <FaTrophy size={24} className="text-yellow-500" />,
    },
    {
      title: 'Results Entered',
      count: totalResult,
      icon: <FaClipboardList size={24} className="text-green-600" />,
    },
    {
      title: 'Results Published',
      count: publishedResults,
      icon: <FaCheckCircle size={24} className="text-purple-500" />,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <div className="flex justify-between items-center mb-8 bg-green-800 md:px-32 p-5">
        <h1 className="text-xl font-bold text-white">Welcome to Dashboard</h1>
        <button
          onClick={() => {
            localStorage.removeItem('cvdsahiAuth');
            router.push('/admin/login');
          }}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:px-32 px-5 mb-10">
        {cards.map((card, idx) => (
          <div
            key={idx}
            className="bg-white rounded-lg shadow p-4 flex items-center gap-4 hover:shadow-md transition"
          >
            {card.icon}
            <div>
              <h4 className="text-sm text-gray-500">{card.title}</h4>
              <p className="text-xl font-bold">{card.count}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Menu Cards */}
      <div className="md:px-32 px-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {[
            { title: 'Teams management', path: '/admin/team' },
            { title: 'Competitions', path: '/admin/competitions' },
            { title: 'Team point', path: '/admin/team-point' },
            { title: 'Results', path: '/admin/results' },
          ].map((card, idx) => (
            <div
              key={idx}
              onClick={() => router.push(card.path)}
              className="cursor-pointer p-6 bg-green-100 rounded-lg shadow hover:shadow-lg text-center"
            >
              <h2 className="text-xl font-semibold">{card.title}</h2>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
