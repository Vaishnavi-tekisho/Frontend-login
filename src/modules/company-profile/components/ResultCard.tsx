import React from 'react';
import { LucideIcon } from 'lucide-react';
import { ResearchProfile } from '../../../../types';

interface ResultCardProps {
  title: string;
  icon: LucideIcon;
  data: ResearchProfile;
  colorTheme: 'blue' | 'indigo' | 'emerald';
}

const ResultCard: React.FC<ResultCardProps> = ({ title, icon: Icon, data, colorTheme }) => {
  const themeClasses = {
    blue: {
      bg: 'bg-blue-50',
      text: 'text-blue-900',
      border: 'border-blue-100',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      bullet: 'bg-blue-500'
    },
    indigo: {
      bg: 'bg-indigo-50',
      text: 'text-indigo-900',
      border: 'border-indigo-100',
      iconBg: 'bg-indigo-100',
      iconColor: 'text-indigo-600',
      bullet: 'bg-indigo-500'
    },
    emerald: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-900',
      border: 'border-emerald-100',
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-600',
      bullet: 'bg-emerald-500'
    }
  };

  const theme = themeClasses[colorTheme];

  return (
    <div className={`rounded-xl border ${theme.border} bg-white shadow-sm overflow-hidden flex flex-col h-full`}>
      {/* Header */}
      <div className={`px-6 py-4 border-b ${theme.border} ${theme.bg} flex items-center justify-between`}>
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${theme.iconBg} ${theme.iconColor}`}>
            <Icon size={20} />
          </div>
          <div>
            <h3 className={`font-semibold ${theme.text} text-lg leading-tight`}>{title}</h3>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mt-0.5">
              {data.name}
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex-1 flex flex-col gap-6">
        
        {/* Summary Section */}
        <div>
          <h4 className="text-sm font-semibold text-slate-800 mb-2 flex items-center gap-2">
            Executive Summary
          </h4>
          <p className="text-slate-600 text-sm leading-relaxed text-justify">
            {data.summary}
          </p>
        </div>

        {/* Highlights Section */}
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2">
            Key Insights
          </h4>
          <ul className="space-y-3">
            {data.keyInsights.map((point, idx) => (
              <li key={idx} className="flex items-start gap-3 text-sm text-slate-700">
                <span className={`mt-1.5 h-1.5 w-1.5 rounded-full flex-shrink-0 ${theme.bullet}`} />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="mt-auto pt-4 border-t border-slate-100">
            <p className="text-xs text-slate-400 italic">Last Updated: {new Date(data.lastUpdated).toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
};

export default ResultCard;