"use client";

import React, { useEffect } from 'react';
import { useState } from 'react';

interface Team {
  _id: string;
  userId: string;
  team: string;
  point: number;
  totalResult: number;
}

export default function Home() {
  const [teams, setTeams] = useState<Team[]>([]);

  const fetchTeams = async () => {
    const res = await fetch(`/api/team`);
    const data = await res.json();

    const sorted = data.sort((a: Team, b: Team) => b.point - a.point);
    setTeams(sorted);
  };

  useEffect(() => {
  
     fetchTeams();
   
 }, []);



    const categoryOptions = [
    {
      name: 'Literature',
      competitions: ['Poetry', 'Story Writing', 'Essay'],
    },
    {
      name: 'Speech',
      competitions: ['Debate', 'Elocution'],
    },
    {
      name: 'Visual Arts',
      competitions: ['Painting', 'Poster Making'],
    },
    {
      name: 'Performing Arts',
      competitions: ['Dance', 'Drama'],
    },
  ];

  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedCompetition, setSelectedCompetition] = useState('');

  const competitions = categoryOptions.find(cat => cat.name === selectedCategory)?.competitions || [];



  return (
    <main className="text-gray-900">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-center p-4 bg-[#d1dea1] md:px-32">
        <h1 className="text-2xl font-bold">Sahityotsav</h1>
        <p>SSF Cheruvadi Sector</p>
      </header>

      {/* Hero Banner */}
      <section className=" w-full ">
        <img
          src="https://www.keralasahityotsav.com/images/main-banner-common.jpg"
          alt="Main Banner"
        />
      </section>
        <section className="w-full p-4 md:px-32 py-10 bg-[#fed766]">
          <h2 className="text-3xl font-bold ">Results</h2>
        <div className="mx-auto py-4 w-full flex md:flex-row flex-col gap-4">
      {/* Category Select */}
      <div className='w-full md:w-1/2'>
        <select
          id="category"
          value={selectedCategory}
          onChange={e => {
            setSelectedCategory(e.target.value);
            setSelectedCompetition(''); // reset on change
          }}
          className="block w-full px-4 py-2 border bg-amber-100 border-gray-300 rounded-md shadow-sm focus:ring-green-600 focus:border-green-600"
        >
          <option value="">Select Category</option>
          {categoryOptions.map(cat => (
            <option key={cat.name} value={cat.name}>{cat.name}</option>
          ))}
        </select>
      </div>

      {/* Competition Select */}
      <div className='w-full md:w-1/2'>
        <select
          id="competition"
          value={selectedCompetition}
          onChange={e => setSelectedCompetition(e.target.value)}
          disabled={!selectedCategory}
          className="block w-full px-4 py-2 border bg-amber-100 border-gray-300 rounded-md shadow-sm focus:ring-green-600 focus:border-green-600 disabled:opacity-50"
        >
          <option value="">Select Competition</option>
          {competitions.map(comp => (
            <option key={comp} value={comp}>{comp}</option>
          ))}
        </select>
      </div>
    </div>

      </section>

  
   {teams.length?   <section className="p-4 md:px-32 md:py-12">
        <h3 className="text-2xl md:text-4xl font-bold mb-4 border-b-1 border-gray-400 md:pb-5 pb-2">Team Status</h3>
        <div className="flex flex-col md:flex-row gap-4">
          <div className=" w-full md:w-1/2 flex justify-center items-center px-4">
          <div className='w-full md:max-w-80'>

            <h4 className="text-green-700 text-2xl font-bold mb-2">After {teams[0]?.totalResult} Results</h4>
              <table className='w-full text-left border-collapse max-w-80'>
              {teams?.slice(0, 3)?.map((team, index) => (
                <tr key={index}>
                  <td className=''>
                    <div className=' bg-[#d1dea1] w-10 h-10 flex justify-center items-center rounded-xl my-1'>{index + 1}</div>
                  </td>
                  <td>
                    <span className='text-xl'>{team?.team}</span>
                  </td>
                  <td>
                    <span className='text-xl text-right'>{team?.point}</span></td>
                </tr>
              ))}


            </table>
          </div>

          </div>
          <div className="bg-white p-4 rounded  w-full md:w-1/2">
            <div className='w-full border-2 border-blue-300 font-bold rounded-2xl bg-blue-50 p-4'>
              <table className='w-full '>
                {teams?.slice(3, 10)?.map((team, index) => (
                  <tr key={index} className='border-b-1 border-blue-200'>
                    <td className="p-4">
                      <span className="text-md">{team?.team}</span>

                    </td>
                    <td className="text-right p-2">
                      <span className="text-md">{team?.point}</span>
                    </td>

                  </tr>))}
              </table></div>
          </div>
        </div>
      </section>:""}

    





      {/* Footer */}
      <footer className="p-4 text-center bg-[#d1dea1]">
        <p>SSF Cheruvadi - Students{"'"} Centre, Cheruvadi </p>
        <div className="mt-2 space-x-4">
          <a href="#">Facebook</a>
          <a href="#">Instagram</a>
          <a href="#">LinkedIn</a>
        </div>
      </footer>
    </main>
  );
}
