import React, { useState } from 'react';
import { Zap, BarChart3, Lightbulb, RefreshCw, Cpu } from 'lucide-react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';

const MODEL_LIMITS = {
  'llama-3.3-70b-versatile': { rpm: 30, rpd: 1000, tpm: 12000, tpd: 100000 },
  'llama-3.1-8b-instant': { rpm: 30, rpd: 14400, tpm: 6000, tpd: 500000 },
  'groq/compound': { rpm: 30, rpd: 250, tpm: 70000, tpd: null },
};

const App = () => {
  const [selectedModel, setSelectedModel] = useState('llama-3.3-70b-versatile');
  const [prompt, setPrompt] = useState('');
  const [optimizedPrompt, setOptimizedPrompt] = useState('');
  const [executionResult, setExecutionResult] = useState('');
  const [isOptimizing, setIsOptimizing] = useState(false);

  // Usage tracking state (mocked/local for now)
  const [usage, setUsage] = useState(() => {
    const saved = {};
    Object.keys(MODEL_LIMITS).forEach(model => {
      saved[model] = {
        requestsThisMinute: 0,
        requestsToday: 0,
        tokensThisMinute: 0,
        tokensToday: 0,
        lastMinuteReset: Date.now(),
        lastDayReset: Date.now(),
      };
    });
    return saved;
  });

  const estimateTokens = (text) => Math.ceil(text.length / 4);

  // Smart Optimization using Backend API
  const handleSmartOptimize = async () => {
    if (!prompt.trim()) return;
    setIsOptimizing(true);
    setExecutionResult(''); // Clear previous execution

    try {
      // Call our backend instead of direct OpenAI/LM Studio
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const response = await axios.post(`${API_URL}/api/optimize`, { prompt });

      // Backend returns { result: "..." }
      if (response.data && response.data.result) {
        setOptimizedPrompt(response.data.result);
      }
    } catch (error) {
      alert("Optimization Error: Ensure backend is running on port 3000");
      console.error(error);
    } finally {
      setIsOptimizing(false);
    }
  };

  // Execute API Call via Backend
  const handleExecute = async () => {
    if (!prompt.trim() && !optimizedPrompt.trim()) return;

    // Use optimized prompt if available, otherwise original
    const inputPrompt = optimizedPrompt || prompt;

    // Limits check could go here, but we'll focus on functionality

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const response = await axios.post(`${API_URL}/api/execute`, {
        prompt: inputPrompt,
        model: selectedModel
      });

      if (response.data && response.data.output_text) {
        console.log(response.data.output_text); // As requested by user
        setExecutionResult(response.data.output_text);
      }
    } catch (error) {
      console.error("Execution Error:", error);
      alert("Execution failed. Check backend logs and keys.");
    }
  };

  const originalTokens = estimateTokens(prompt);
  const optimizedTokens = estimateTokens(optimizedPrompt);
  const tokensSaved = originalTokens - optimizedTokens;

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6 font-sans">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-10">
          <h1 className="text-4xl font-black tracking-tight flex items-center justify-center gap-3">
            <Zap className="text-yellow-400 fill-yellow-400" size={40} />
            PROMPT ENGINE
          </h1>
          <p className="text-slate-400 mt-2">Groq AI Optimization + Limit Tracking</p>
        </header>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left: Input Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-xl">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <Lightbulb size={20} className="text-yellow-400" /> Input Prompt
                </h3>
                <span className="text-xs text-slate-500 bg-slate-900 px-2 py-1 rounded">
                  {originalTokens} tokens
                </span>
              </div>
              <textarea
                className="w-full h-40 bg-slate-900 border border-slate-700 rounded-xl p-4 text-slate-200 focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Paste your messy, wordy prompt here..."
              />
              <button
                onClick={handleSmartOptimize}
                disabled={isOptimizing || !prompt}
                className="w-full mt-4 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all"
              >
                {isOptimizing ? <RefreshCw className="animate-spin" /> : <Cpu size={20} />}
                {isOptimizing ? "Groq is thinking..." : "Smart Optimize (Groq)"}
              </button>
            </div>

            {optimizedPrompt && (
              <div className="bg-emerald-900/20 border border-emerald-500/30 rounded-2xl p-6 animate-in fade-in slide-in-from-bottom-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-emerald-400">Optimized Output</h3>
                  <div className="flex gap-4 text-xs font-mono">
                    <span className="text-emerald-400">{optimizedTokens} tokens</span>
                    <span className="text-yellow-400">-{tokensSaved > 0 ? ((tokensSaved / originalTokens) * 100).toFixed(0) : 0}% Reduction</span>
                  </div>
                </div>
                <div className="bg-slate-900 p-4 rounded-xl border border-emerald-500/20 text-slate-300 italic">
                  {optimizedPrompt}
                </div>
              </div>
            )}

            {executionResult && (
              <div className="bg-blue-900/20 border border-blue-500/30 rounded-2xl p-6 animate-in fade-in slide-in-from-bottom-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-blue-400 flex items-center gap-2">
                    <Cpu size={20} /> Execution Result
                  </h3>
                </div>
                <div className="bg-slate-900 p-4 rounded-xl border border-blue-500/20 text-slate-300 overflow-y-auto max-h-[500px]">
                  <div className="prose prose-invert prose-sm max-w-none">
                    <ReactMarkdown>{executionResult}</ReactMarkdown>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right: Limits & Stats */}
          <div className="space-y-6 sticky top-6 h-fit">
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <BarChart3 size={20} className="text-blue-400" /> Target Model
              </h3>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 p-3 rounded-lg outline-none"
              >
                {Object.keys(MODEL_LIMITS).map(m => <option key={m} value={m}>{m}</option>)}
              </select>

              <div className="mt-6 space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">RPM Limit</span>
                  <span className="font-mono">{MODEL_LIMITS[selectedModel].rpm}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">TPM Limit</span>
                  <span className="font-mono">{MODEL_LIMITS[selectedModel].tpm && MODEL_LIMITS[selectedModel].tpm.toLocaleString()}</span>
                </div>
              </div>

              <button
                onClick={handleExecute}
                className="w-full mt-6 bg-blue-600 hover:bg-blue-500 py-3 rounded-xl font-bold transition-all"
              >
                Execute API Call
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
