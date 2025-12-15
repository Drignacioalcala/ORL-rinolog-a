import React from 'react';
import { LoemResult, LoadingState } from '../types';
import { Copy, Check, AlertTriangle } from 'lucide-react';

interface ResultSectionProps {
  result: LoemResult | null;
  state: LoadingState;
}

const ComponentCard = ({ letter, title, data }: { letter: string, title: string, data: { value: string, description: string, originalText: string } }) => (
  <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 hover:border-blue-200 transition-colors">
    <div className="flex items-start justify-between mb-2">
      <div className="flex items-center gap-2">
        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold text-lg">
          {letter}
        </span>
        <span className="font-semibold text-slate-700 text-sm uppercase tracking-wide">{title}</span>
      </div>
      <div className="bg-white px-2 py-1 rounded border border-slate-200 text-slate-800 font-mono font-bold text-sm shadow-sm">
        {data.value}
      </div>
    </div>
    
    <div className="space-y-2">
        <p className="text-slate-600 text-sm leading-snug">
            {data.description}
        </p>
        {data.originalText && (
            <div className="text-xs text-slate-400 italic border-l-2 border-slate-200 pl-2 mt-2">
                "{data.originalText}"
            </div>
        )}
    </div>
  </div>
);

export const ResultSection: React.FC<ResultSectionProps> = ({ result, state }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    if (result) {
      navigator.clipboard.writeText(result.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (state === LoadingState.IDLE) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-slate-400 p-8 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
            <span className="text-2xl font-bold text-slate-300">LOEM</span>
        </div>
        <p className="text-center font-medium">Esperando datos del paciente</p>
        <p className="text-center text-sm mt-1">Pega el informe en el panel izquierdo para comenzar el análisis.</p>
      </div>
    );
  }

  if (state === LoadingState.ERROR) {
    return (
        <div className="h-full flex flex-col items-center justify-center text-red-500 p-8 border border-red-100 rounded-xl bg-red-50">
            <AlertTriangle className="w-12 h-12 mb-4" />
            <h3 className="text-lg font-bold mb-2">Error en el análisis</h3>
            <p className="text-center text-sm text-red-600">No se pudo procesar el informe. Por favor verifica tu conexión o intenta con un texto diferente.</p>
        </div>
    );
  }

  if (state === LoadingState.LOADING || !result) {
    return (
        <div className="animate-pulse space-y-4">
             <div className="h-24 bg-slate-100 rounded-xl w-full"></div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="h-32 bg-slate-100 rounded-lg"></div>
                <div className="h-32 bg-slate-100 rounded-lg"></div>
                <div className="h-32 bg-slate-100 rounded-lg"></div>
                <div className="h-32 bg-slate-100 rounded-lg"></div>
             </div>
        </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Main Result Card */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
            <span className="text-9xl font-bold">LOEM</span>
        </div>
        
        <div className="relative z-10">
            <h3 className="text-blue-100 text-sm font-medium mb-1">Código LOEM Calculado</h3>
            <div className="flex items-end gap-3 mb-4">
                <span className="text-4xl font-bold tracking-wider font-mono">{result.code}</span>
                <button 
                    onClick={handleCopy}
                    className="mb-1 p-1.5 hover:bg-white/20 rounded-md transition-colors text-white/80 hover:text-white"
                    title="Copiar código"
                >
                    {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                </button>
            </div>
            
            <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm border border-white/10">
                <p className="text-sm text-blue-50 leading-relaxed">
                    <span className="font-semibold text-white">Resumen:</span> {result.summary}
                </p>
            </div>
            
            <div className="mt-4 flex items-center justify-between text-xs text-blue-200">
                <span>Confianza del modelo: {result.confidence}%</span>
                <span>Generado por Gemini AI</span>
            </div>
        </div>
      </div>

      {/* Components Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ComponentCard letter="L" title="Localización" data={result.components.L} />
        <ComponentCard letter="O" title="Origen / Ocurrencia" data={result.components.O} />
        <ComponentCard letter="E" title="Extensión / Tamaño" data={result.components.E} />
        <ComponentCard letter="M" title="Morfología" data={result.components.M} />
      </div>

      {/* Disclaimer */}
      <div className="bg-amber-50 border border-amber-100 rounded-lg p-3 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
        <div className="text-xs text-amber-800">
            <strong>Aviso Legal:</strong> Esta herramienta utiliza inteligencia artificial para asistir en la codificación y puede cometer errores. El código LOEM generado debe ser verificado siempre por un profesional médico cualificado antes de ser incluido en la historia clínica oficial.
        </div>
      </div>
    </div>
  );
};
