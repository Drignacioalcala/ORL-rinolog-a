import React from 'react';
import { ClipboardPaste, Eraser } from 'lucide-react';

interface InputSectionProps {
  value: string;
  onChange: (value: string) => void;
  onAnalyze: () => void;
  isLoading: boolean;
}

export const InputSection: React.FC<InputSectionProps> = ({ value, onChange, onAnalyze, isLoading }) => {
  
  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      onChange(text);
    } catch (err) {
      console.error('Failed to read clipboard contents: ', err);
    }
  };

  const handleClear = () => onChange('');

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col h-full overflow-hidden">
      <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
        <h2 className="font-semibold text-slate-800">Historia Clínica / Informe Quirúrgico</h2>
        <div className="flex gap-2">
            <button 
                onClick={handleClear}
                className="text-slate-500 hover:text-red-500 p-1.5 rounded-md hover:bg-slate-200 transition-colors"
                title="Limpiar"
            >
                <Eraser className="w-4 h-4" />
            </button>
            <button 
                onClick={handlePaste}
                className="text-blue-600 hover:text-blue-700 font-medium text-xs flex items-center gap-1 px-2 py-1 rounded-md hover:bg-blue-50 transition-colors"
            >
                <ClipboardPaste className="w-3.5 h-3.5" />
                Pegar texto
            </button>
        </div>
      </div>
      
      <div className="flex-grow p-4">
        <textarea
          className="w-full h-full min-h-[300px] sm:min-h-[400px] resize-none outline-none text-slate-600 text-sm leading-relaxed placeholder:text-slate-400"
          placeholder="Pegue aquí el fragmento del informe quirúrgico o la historia clínica describiendo el pólipo..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>

      <div className="p-4 border-t border-slate-100 bg-slate-50">
        <button
          onClick={onAnalyze}
          disabled={!value.trim() || isLoading}
          className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all shadow-md
            ${!value.trim() || isLoading 
              ? 'bg-slate-300 cursor-not-allowed shadow-none' 
              : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg active:scale-[0.99]'
            } flex items-center justify-center gap-2`}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Analizando informe...
            </>
          ) : (
            'Generar Código LOEM'
          )}
        </button>
      </div>
    </div>
  );
};
