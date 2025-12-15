import React from 'react';

const SkeletonCard: React.FC = () => {
  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden h-full animate-pulse">
      <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex items-center gap-3">
        <div className="h-10 w-10 rounded-lg bg-slate-200"></div>
        <div className="space-y-2">
          <div className="h-4 w-32 bg-slate-200 rounded"></div>
          <div className="h-3 w-20 bg-slate-200 rounded"></div>
        </div>
      </div>
      <div className="p-6 space-y-8 flex-1 flex flex-col">
        {/* Summary Skeleton */}
        <div className="space-y-3">
          <div className="h-4 w-1/3 bg-slate-200 rounded mb-2"></div>
          <div className="h-3 w-full bg-slate-100 rounded"></div>
          <div className="h-3 w-full bg-slate-100 rounded"></div>
          <div className="h-3 w-11/12 bg-slate-100 rounded"></div>
        </div>

        {/* Insights Skeleton */}
        <div className="space-y-4 flex-1">
          <div className="h-4 w-1/4 bg-slate-200 rounded mb-2"></div>
          <div className="flex gap-3">
             <div className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-1.5"></div>
             <div className="h-3 w-10/12 bg-slate-100 rounded"></div>
          </div>
          <div className="flex gap-3">
             <div className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-1.5"></div>
             <div className="h-3 w-11/12 bg-slate-100 rounded"></div>
          </div>
          <div className="flex gap-3">
             <div className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-1.5"></div>
             <div className="h-3 w-9/12 bg-slate-100 rounded"></div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 mt-auto">
             <div className="h-3 w-1/3 bg-slate-100 rounded"></div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonCard;