import React from 'react';

export default function AttendanceTab() {
  const logs = [
    { date: '12 Jan 2026', session: 'Day 1 - Intro to AI', status: 'Hadir', color: 'bg-green-100 text-green-700' },
    { date: '14 Jan 2026', session: 'Day 2 - Prompt Engineering', status: 'Hadir', color: 'bg-green-100 text-green-700' },
    { date: '16 Jan 2026', session: 'Day 3 - LangChain Basic', status: 'Izin', color: 'bg-yellow-100 text-yellow-700' },
  ];

  return (
    <div className="animate-fade-in space-y-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
            <tr>
              <th className="p-4 font-bold text-slate-500">Tanggal</th>
              <th className="p-4 font-bold text-slate-500">Sesi</th>
              <th className="p-4 font-bold text-slate-500 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
            {logs.map((log, idx) => (
              <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                <td className="p-4 font-mono text-slate-600 dark:text-slate-300">{log.date}</td>
                <td className="p-4 font-medium text-slate-800 dark:text-white">{log.session}</td>
                <td className="p-4 text-right">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${log.color}`}>
                    {log.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-slate-400 text-center mt-4">Data kehadiran disinkronkan dari presensi Workshop.</p>
    </div>
  );
}