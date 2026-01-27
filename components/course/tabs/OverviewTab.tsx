import React from 'react';

interface OverviewTabProps {
  data: {
    about: string;
    tools: string[];
  };
}

export default function OverviewTab({ data }: OverviewTabProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-fade-in">
      <div className="md:col-span-2 space-y-6">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <h3 className="text-xl font-bold mb-4 dark:text-white">About this Class</h3>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
            {data.about}
          </p>
        </div>
      </div>
      <div className="space-y-6">
        <div className="bg-blue-50 dark:bg-slate-800 p-5 rounded-2xl border border-blue-100 dark:border-slate-700">
          <h4 className="font-bold text-slate-900 dark:text-white mb-3 text-sm uppercase">
            Tools Needed
          </h4>
          <ul className="space-y-2">
            {data.tools.map((tool, idx) => (
              <li key={idx} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                <span className="material-symbols-outlined text-[16px] text-blue-500">check_circle</span>
                {tool}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}