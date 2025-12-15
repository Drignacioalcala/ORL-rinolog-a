import React from 'react';
import { Activity, Info } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">LOEM Calculator</h1>
            <p className="text-xs text-slate-500 font-medium">Asistente de Clasificación Poliposis</p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-4 text-sm text-slate-600">
           <span className="flex items-center gap-1">
             <Info className="w-4 h-4" />
             <span>Uso exclusivo investigación/médico</span>
           </span>
        </div>
      </div>
    </header>
  );
};
