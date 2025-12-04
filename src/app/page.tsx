// TODO: El candidato debe refactorizar este archivo.
// Es un Server Component por defecto en Next.js (app dir), pero está escrito como si fuera React viejo.
// Contiene: Bad Performance, Any types, Fetching waterfall, Logic coupling.

"use client";

import React, { useState, useEffect } from 'react';
import { generateMockData, initialData } from '../lib/mockData';
import { Loading } from '@/components/Loading';
import { Header } from '@/components/Header';
import { Filter } from '@/components/Filter';
import { Stats } from '@/components/Stats';
import { FilteredData } from '@/components/FilteredData';

const expensiveCalculation = (data: any[]) => {
  console.log("Calculando estadísticas pesadas...");
  let sum = 0;
  for (let i = 0; i < data.length; i++) {
    for (let j = 0; j < 10000; j++) {
      sum += Math.random();
    }
  }
  return data.map(item => ({ ...item, complexScore: sum }));
};

const LegacyDashboard = () => {
  const [data, setData] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [sort, setSort] = useState("asc");
  const [stats, setStats] = useState<any>({});

  // Fetching de datos simulado
  useEffect(() => {
    setData(initialData);
    setFilteredData(initialData);
    setLoading(false);
  }, []);

  useEffect(() => {
    const lowerFilter = filter.toLowerCase();

    // Algoritmo ineficiente de filtrado
    let result = data.filter((item: any) => {
      return item.name.toLowerCase().includes(lowerFilter) ||
        item.description.toLowerCase().includes(lowerFilter) ||
        item.category.toLowerCase().includes(lowerFilter);
    });

    if (sort === 'asc') {
      result = result.sort((a, b) => a.price - b.price);
    } else {
      result = result.sort((a, b) => b.price - a.price);
    }

    const processed = expensiveCalculation(result);

    setFilteredData(processed);

    const totalValue = result.reduce((acc, curr) => acc + curr.price, 0);
    setStats({ totalItems: result.length, totalValue });

  }, [filter, sort, data]);

  const handleFilterChange = (e: any) => {
    setFilter(e.target.value);
  };

  // Renderiza el loading mientras carga
  if (loading) return <Loading />

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-xl shadow-2xl p-8">
          
          <Header />
          
          <Filter filter={filter} handleFilterChange={handleFilterChange} sort={sort} setSort={setSort} />

          <Stats totalItems={stats.totalItems} totalValue={stats.totalValue} />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            <FilteredData filteredData={filteredData} />
                      
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default LegacyDashboard;