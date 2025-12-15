import React, { useState } from 'react';
import { Header } from './components/Header';
import { InputSection } from './components/InputSection';
import { ResultSection } from './components/ResultSection';
import { analyzeSurgicalReport } from './services/geminiService';
import { LoemResult, LoadingState } from './types';

function App() {
  const [inputText, setInputText] = useState('');
  const [result, setResult] = useState<LoemResult | null>(null);
  const [loadingState, setLoadingState] = useState<LoadingState>(LoadingState.IDLE);

  const handleAnalyze = async () => {
    if (!inputText.trim()) return;

    setLoadingState(LoadingState.LOADING);
    setResult(null);

    try {
      const data = await analyzeSurgicalReport(inputText);
      setResult(data);
      setLoadingState(LoadingState.SUCCESS);
    } catch (error) {
      console.error(error);
      setLoadingState(LoadingState.ERROR);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Header />

      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[calc(100vh-8rem)] min-h-[600px]">
          
          {/* Left Column: Input */}
          <section className="h-full">
             <InputSection 
                value={inputText} 
                onChange={setInputText} 
                onAnalyze={handleAnalyze}
                isLoading={loadingState === LoadingState.LOADING}
             />
          </section>

          {/* Right Column: Results */}
          <section className="h-full overflow-y-auto pr-1">
            <ResultSection result={result} state={loadingState} />
          </section>

        </div>
      </main>
    </div>
  );
}

export default App;
