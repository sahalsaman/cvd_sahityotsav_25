"use client";

import React, { useEffect, useState } from 'react';
import { ICategory, ICompetition, IResult, ITeam } from './interface';
import ResultPoster_1 from './resultPoster_1';
import ResultPoster_2 from './resultPoster_2';
import ResultPoster_3 from './resultPoster_3';

export default function Home() {
  const [teams, setTeams] = useState<ITeam[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [competitions, setCompetitions] = useState<ICompetition[]>([]);
  const [results, setResults] = useState<IResult[]>([]);

  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedCompetition, setSelectedCompetition] = useState('');

  // Fetch categories
  const fetchCategories = async () => {
    const res = await fetch('/api/category');
    if (res.ok) {
      const data = await res.json();
      setCategories(data);
    }
  };

  // Fetch competitions by category
  const fetchCompetitions = async (categoryId: string) => {
    if (!categoryId) return;
    const res = await fetch(`/api/competition?categoryId=${categoryId}`);
    const data = await res.json();
    const filtered = data.filter((comp: ICompetition) => comp.published && comp.resultAdded);
    setCompetitions(filtered);
  };

  // Fetch results
  const fetchResults = async (competitionId: string) => {
    const res = await fetch(`/api/result?competitionId=${competitionId}`);
    const data = await res.json();
    setResults(data);
  };

  // Fetch teams
  const fetchTeams = async () => {
    const res = await fetch(`/api/team`);
    const data = await res.json();
    const sorted = data.sort((a: ITeam, b: ITeam) => b.point - a.point);
    setTeams(sorted);
  };

  useEffect(() => {
    fetchTeams();
    fetchCategories();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      setCompetitions([]);
      setSelectedCompetition('');
      fetchCompetitions(selectedCategory);
    }
  }, [selectedCategory]);

  useEffect(() => {
    if (selectedCompetition) fetchResults(selectedCompetition);
  }, [selectedCompetition]);

  return (
    <main className="text-gray-900 bg-white">
      <header className="flex flex-col md:flex-row justify-between items-center p-4 bg-[#d1dea1] md:px-32">
        <h1 className="text-2xl font-bold">Sahityotsav</h1>
        <p>SSF Cheruvadi Sector</p>
      </header>

      <section className="w-full">
        <img src="https://www.keralasahityotsav.com/images/main-banner-common.jpg" alt="Main Banner" />
      </section>

      {/* Category + Competition Selection */}
      <section className="w-full p-4 md:px-32 py-10 bg-[#fed766]">
        <h2 className="text-3xl font-bold mb-4">Results</h2>
        <div className="flex flex-col md:flex-row gap-4">
          {/* Category Select */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full md:w-1/2 px-4 py-2 border bg-amber-100 rounded shadow"
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>{cat.name}</option>
            ))}
          </select>

          {/* Competition Select */}
          <select
            value={selectedCompetition}
            onChange={(e) => setSelectedCompetition(e.target.value)}
            disabled={!selectedCategory}
            className="w-full md:w-1/2 px-4 py-2 border bg-amber-100 rounded shadow disabled:opacity-50"
          >
            <option value="">Select Competition</option>
            {competitions.map((comp) => (
              <option key={comp._id} value={comp._id}>{comp.name}</option>
            ))}
          </select>
        </div>

        {/* Result Display */}
        {results.length > 0 && (
          <div className='grid md:grid-cols-3  gap-5'>
            <ResultPoster_1
              imageSrc="https://www.keralasahityotsav.com/result/TEMP-24-2.png"
              result={results[0]}
            />
            <ResultPoster_2
              imageSrc="https://www.keralasahityotsav.com/result/TEMP-24-1.png"
              result={results[0]}
              textColor="black"
            />
            <ResultPoster_3
              imageSrc="https://www.keralasahityotsav.com/result/TEMP-24-3.png"
              result={results[0]}
            />
          </div>
        )}
      </section>

      {/* Team Standings */}
      {teams.length > 0 && (
        <section className="p-4 md:px-32 md:py-12">
          <div className='flex gap-2 items-center mb-4 border-b-1 border-gray-400 pb-2'>
            <h3 className="text-2xl md:text-4xl font-bold">Team Status</h3>
          </div>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="w-full md:w-1/2 flex justify-center items-center px-4">
              <div className='w-full md:max-w-80'>
                <h4 className="text-green-700 text-2xl font-bold mb-2">After {teams[0]?.totalResult} Results</h4>
                <table className='w-full'>
                  {teams.slice(0, 3).map((team, index) => (
                    <tr key={index}>
                      <td><div className='bg-[#d1dea1] w-10 h-10 flex justify-center items-center rounded-xl my-1'>{index + 1}</div></td>
                      <td><span className='text-xl'>{team.team}</span></td>
                      <td><span className='text-xl text-right'>{team.point}</span></td>
                    </tr>
                  ))}
                </table>
              </div>
            </div>
            <div className="bg-white p-4 rounded w-full md:w-1/2">
              <div className='w-full border-2 border-blue-300 font-bold rounded-2xl bg-blue-50 p-4'>
                <table className='w-full'>
                  {teams.slice(3).map((team, index) => (
                    <tr key={index} className='border-b-1 border-blue-200'>
                      <td className="p-4"><span className="text-md">{team.team}</span></td>
                      <td className="text-right p-2"><span className="text-md">{team.point}</span></td>
                    </tr>
                  ))}
                </table>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="p-4 text-center bg-[#d1dea1]">
        <p>SSF Cheruvadi - Students{"'"} Centre, Cheruvadi</p>
        <div className="mt-2 space-x-4">
          <a href="#">Facebook</a>
          <a href="#">Instagram</a>
          <a href="#">LinkedIn</a>
        </div>
      </footer>
    </main>
  );
}
