import React, { useEffect, useState } from 'react';
import { User, Building2, ArrowLeft, AlertCircle } from 'lucide-react';
import { fetchResearchResults } from './services/supabaseService';
import { ResearchData, LoadingState } from '../../../types';
import ResultCard from './components/ResultCard';
import SkeletonCard from './components/SkeletonCard';

const CompanyProfile: React.FC = () => {
  const [data, setData] = useState<ResearchData | null>(null);
  const [loading, setLoading] = useState<LoadingState>(LoadingState.IDLE);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(LoadingState.LOADING);
      setError(null);
      const result = await fetchResearchResults();
      setData(result);
      setLoading(LoadingState.SUCCESS);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch research data from Supabase. Please check your connection.');
      setLoading(LoadingState.ERROR);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-20">
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div></div>
            <div className="flex items-center gap-4">
               <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
                 <span className="sr-only">Help</span>
                 <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-xs">JD</div>
               </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
            <button className="hover:text-blue-600 flex items-center gap-1 transition-colors">
              <ArrowLeft size={14} /> Back to Search
            </button>
            <span>/</span>
            <span>Results</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Research Summary</h1>
        </div>

        {/* Error State */}
        {loading === LoadingState.ERROR && (
          <div className="rounded-lg bg-red-50 border border-red-200 p-4 mb-8 flex items-start gap-3">
            <AlertCircle className="text-red-500 mt-0.5" size={20} />
            <div>
              <h3 className="font-semibold text-red-800">Error Loading Data</h3>
              <p className="text-red-700 text-sm mt-1">{error}</p>
              <button onClick={loadData} className="mt-3 text-sm font-medium text-red-600 hover:text-red-800 underline">Try Again</button>
            </div>
          </div>
        )}

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Professional Research Section */}
          <section className="flex flex-col h-full">
            {loading === LoadingState.LOADING || !data ? (
              <SkeletonCard />
            ) : (
              <ResultCard 
                title="Professional Profile" 
                icon={User} 
                data={data.professional}
                colorTheme="blue"
              />
            )}
          </section>

          {/* Company Research Section */}
          <section className="flex flex-col h-full">
            {loading === LoadingState.LOADING || !data ? (
              <SkeletonCard />
            ) : (
              <ResultCard 
                title="Company Analysis" 
                icon={Building2} 
                data={data.company}
                colorTheme="blue"
              />
            )}
          </section>

        </div>
        
        {/* Footer Disclaimer */}
        <div className="mt-12 border-t border-slate-200 pt-6 text-center">
            <p className="text-xs text-slate-400">
                Data provided by Internal Research DB (Supabase). Confidential. Generated on {new Date().toLocaleDateString()}.
            </p>
        </div>

      </main>
    </div>
  );
};

export default CompanyProfile;