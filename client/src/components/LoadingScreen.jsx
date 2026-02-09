import React from 'react';
import { RefreshCw, Zap } from 'lucide-react';

const LoadingScreen = () => {
  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full text-center space-y-8 animate-in fade-in zoom-in duration-500">
        <div className="relative">
          <div className="absolute inset-0 bg-yellow-400/20 blur-3xl rounded-full"></div>
          <Zap className="text-yellow-400 fill-yellow-400 mx-auto relative z-10 animate-pulse" size={80} />
        </div>
        
        <div className="space-y-4">
          <h1 className="text-3xl font-black tracking-tight">Waking up the Engine</h1>
          <p className="text-slate-400 leading-relaxed">
            Your free-tier backend is currently spinning up. This usually takes about 30-50 seconds after a period of inactivity.
          </p>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 p-4 rounded-xl flex items-center gap-4 text-left">
          <RefreshCw className="text-purple-400 animate-spin flex-shrink-0" size={24} />
          <div>
            <p className="text-sm font-medium text-slate-200">Checking connection...</p>
            <p className="text-xs text-slate-500">Redirecting automatically once ready.</p>
          </div>
        </div>

        <div className="pt-8">
          <div className="h-1 w-48 bg-slate-800 mx-auto rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-purple-500 to-blue-500 animate-progress origin-left"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
