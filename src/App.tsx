import React, { useState, useEffect } from 'react';
import { BenchmarkItem, DashboardMetrics, EvaluationRecord } from './types';
import {
  calculateDashboardMetrics,
  getVaultRecords,
  bootstrapDefaultAuditRecords,
  saveVaultRecords
} from './engine/vaultStore';
import { SviDashboard } from './components/SviDashboard';
import { WebGroundingScanner } from './components/WebGroundingScanner';
import { AuditSandbox } from './components/AuditSandbox';
import { TestKitExplorer } from './components/TestKitExplorer';
import { EvidenceVault } from './components/EvidenceVault';
import {
  PieChart,
  Globe,
  FlaskConical,
  Database,
  Shield,
  Play,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'webscanner' | 'sandbox' | 'dataset' | 'vault'>('dashboard');
  const [vaultRecords, setVaultRecords] = useState<EvaluationRecord[]>([]);
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [sandboxPromptItem, setSandboxPromptItem] = useState<BenchmarkItem | null>(null);
  const [isRunningBatch, setIsRunningBatch] = useState<boolean>(false);
  const [batchProgress, setBatchProgress] = useState<string>('');

  // Initial load
  useEffect(() => {
    refreshRecords();
  }, []);

  const refreshRecords = () => {
    const records = getVaultRecords();
    setVaultRecords(records);
    const m = calculateDashboardMetrics(records);
    setMetrics(m);
  };

  const handleRunBatchAudit = async () => {
    setIsRunningBatch(true);
    setBatchProgress('Running 60-Eval Batch across 15 Tri-Domain Benchmark Items...');

    setTimeout(() => {
      const freshRecords = bootstrapDefaultAuditRecords();
      saveVaultRecords(freshRecords);
      refreshRecords();
      setIsRunningBatch(false);
      setBatchProgress('');
      setActiveTab('dashboard');
    }, 600);
  };

  const handleLoadItemIntoSandbox = (item: BenchmarkItem) => {
    setSandboxPromptItem(item);
    setActiveTab('sandbox');
  };

  return (
    <div className="font-sans antialiased min-h-screen flex flex-col bg-[#070a12] text-slate-200">
      {/* TOP APP NAV HEADER */}
      <header className="border-b border-slate-800 bg-[#0a0f1d]/90 sticky top-0 z-50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo & Identity */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-600 via-amber-500 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-orange-500/20 font-brand text-xl">
              कसौ
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                  BOL-KASAUTI
                  <span className="text-xs px-2 py-0.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 font-mono font-medium">
                    बोल-कसौटी v1.2
                  </span>
                </h1>
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-1.5">
                <span>Problem Statement 1.2: Satya & Pramaan Bharat</span>
                <span className="text-slate-600">•</span>
                <span className="text-amber-400">Truth & AI Verification</span>
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden lg:flex items-center gap-1 bg-[#111827] p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'dashboard'
                  ? 'text-white bg-orange-600/90 shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <PieChart className="w-3.5 h-3.5" />
              <span>SVI Dashboard</span>
            </button>

            <button
              onClick={() => setActiveTab('webscanner')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'webscanner'
                  ? 'text-white bg-cyan-600 shadow'
                  : 'text-cyan-400 hover:text-white'
              }`}
            >
              <Globe className="w-3.5 h-3.5 text-cyan-300" />
              <span>Web Grounded Risk Scanner</span>
            </button>

            <button
              onClick={() => setActiveTab('sandbox')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'sandbox'
                  ? 'text-white bg-orange-600/90 shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <FlaskConical className="w-3.5 h-3.5" />
              <span>4-Script Audit Sandbox</span>
            </button>

            <button
              onClick={() => setActiveTab('dataset')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'dataset'
                  ? 'text-white bg-orange-600/90 shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span>Test Kit Explorer</span>
            </button>

            <button
              onClick={() => setActiveTab('vault')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'vault'
                  ? 'text-white bg-orange-600/90 shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Evidence Vault & SHA-256</span>
            </button>
          </nav>

          {/* Right Action & Health */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Python 3.15 Stdlib (Zero-C++ Deps)</span>
            </div>

            <button
              onClick={handleRunBatchAudit}
              disabled={isRunningBatch}
              className="px-3.5 py-1.5 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white text-xs font-semibold rounded-lg shadow-md transition-all flex items-center gap-1.5 disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{isRunningBatch ? 'Evaluating...' : 'Run 60-Eval Batch'}</span>
            </button>
          </div>
        </div>

        {/* Mobile Nav Tabs Bar */}
        <div className="lg:hidden flex items-center overflow-x-auto px-4 py-2 bg-[#0c1220] border-t border-slate-800 gap-1 text-xs">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-3 py-1 rounded-lg whitespace-nowrap ${
              activeTab === 'dashboard' ? 'bg-orange-600 text-white' : 'text-slate-400'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('webscanner')}
            className={`px-3 py-1 rounded-lg whitespace-nowrap ${
              activeTab === 'webscanner' ? 'bg-cyan-600 text-white' : 'text-cyan-400'
            }`}
          >
            🌐 Web Scanner
          </button>
          <button
            onClick={() => setActiveTab('sandbox')}
            className={`px-3 py-1 rounded-lg whitespace-nowrap ${
              activeTab === 'sandbox' ? 'bg-orange-600 text-white' : 'text-slate-400'
            }`}
          >
            Sandbox
          </button>
          <button
            onClick={() => setActiveTab('dataset')}
            className={`px-3 py-1 rounded-lg whitespace-nowrap ${
              activeTab === 'dataset' ? 'bg-orange-600 text-white' : 'text-slate-400'
            }`}
          >
            Test Kit
          </button>
          <button
            onClick={() => setActiveTab('vault')}
            className={`px-3 py-1 rounded-lg whitespace-nowrap ${
              activeTab === 'vault' ? 'bg-orange-600 text-white' : 'text-slate-400'
            }`}
          >
            Evidence Vault
          </button>
        </div>
      </header>

      {/* MAIN VIEWPORT CONTAINER */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'dashboard' && metrics && (
          <SviDashboard
            metrics={metrics}
            onNavigateToSandbox={() => setActiveTab('sandbox')}
            onNavigateToScanner={() => setActiveTab('webscanner')}
          />
        )}

        {activeTab === 'webscanner' && (
          <WebGroundingScanner
            onScanCompleted={() => refreshRecords()}
            onNavigateToVault={() => setActiveTab('vault')}
          />
        )}

        {activeTab === 'sandbox' && (
          <AuditSandbox
            initialPromptItem={sandboxPromptItem}
            onAuditCompleted={() => refreshRecords()}
          />
        )}

        {activeTab === 'dataset' && (
          <TestKitExplorer onLoadItemIntoSandbox={handleLoadItemIntoSandbox} />
        )}

        {activeTab === 'vault' && (
          <EvidenceVault records={vaultRecords} onVaultUpdated={() => refreshRecords()} />
        )}
      </main>

      {/* FOOTER */}
      <footer className="border-t border-slate-800 bg-[#070b14] py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-orange-500"></span>
            <span className="text-slate-400 font-medium">Bol-Kasauti (बोल-कसौटी)</span> — Truth & AI Verification in Indian Languages
          </div>
          <div className="flex items-center gap-4 font-mono text-[11px] flex-wrap justify-center">
            <span>Standard Library Python 3.15</span>
            <span>•</span>
            <span>Judge-Free 3-Layer Math Scorer</span>
            <span>•</span>
            <span>Zero-Leak SHA-256 Vault</span>
            <span>•</span>
            <span>Live Web Grounding</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
