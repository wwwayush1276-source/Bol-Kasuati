import React from 'react';
import { DashboardMetrics, ScriptType } from '../types';
import { ShieldCheck, ShieldAlert, AlertTriangle, Activity, BarChart3, Database } from 'lucide-react';

interface SviDashboardProps {
  metrics: DashboardMetrics;
  onNavigateToSandbox: () => void;
  onNavigateToScanner: () => void;
}

export const SviDashboard: React.FC<SviDashboardProps> = ({
  metrics,
  onNavigateToSandbox,
  onNavigateToScanner
}) => {
  const { svi, total_evaluations, disparity_gap, domain_breakdown } = metrics;

  return (
    <div className="space-y-6">
      {/* Executive Banner */}
      <div className="glass-card rounded-2xl p-6 border border-orange-500/20 bg-gradient-to-r from-[#131b2e] via-[#0f172a] to-[#1a1528] relative overflow-hidden">
        <div className="absolute -right-8 -top-8 w-64 h-64 bg-orange-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-medium mb-2">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Empirical Linguistic Safety Disparity • Problem Statement 1.2</span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Script Vulnerability Index (SVI) Overview</h2>
            <p className="text-sm text-slate-400 max-w-2xl mt-1 leading-relaxed">
              Evaluating safety alignment degradation across Indian scripts. While models maintain robust refusal in English and Devanagari, subword tokenization splits and code-switching in <span className="text-amber-400 font-semibold">Romanized Hinglish</span> and <span className="text-rose-400 font-semibold">Mixed Script</span> cause significant safety guardrail gaps.
            </p>
          </div>
          <div className="flex items-center gap-4 bg-[#0a0f1d]/80 p-3.5 rounded-xl border border-slate-800">
            <div className="text-right">
              <div className="text-xs text-slate-400 font-mono">Total Evaluations</div>
              <div className="text-2xl font-bold font-mono text-cyan-400">{total_evaluations}</div>
            </div>
            <div className="h-10 w-px bg-slate-800"></div>
            <div className="text-right">
              <div className="text-xs text-slate-400 font-mono">Script Disparity Gap (Δ)</div>
              <div className="text-2xl font-bold font-mono text-rose-400">Δ {disparity_gap}%</div>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Script Vulnerability Cards (KPI Strip) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Script 1: English Baseline */}
        <div className="glass-card glass-card-hover rounded-xl p-5 border-l-4 border-indigo-500 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300">en_baseline</span>
            <span className="text-xs text-slate-400 font-mono">English</span>
          </div>
          <h3 className="text-sm font-semibold text-slate-300 mt-2">English Baseline</h3>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-extrabold font-mono text-emerald-400">{svi.en_baseline.safety_rate}%</span>
            <span className="text-xs text-slate-400 font-mono">Safety Rate</span>
          </div>
          <div className="mt-3 text-xs text-slate-400 flex items-center justify-between border-t border-slate-800/80 pt-2.5">
            <span>Avg Risk: <strong className="text-slate-200 font-mono">{svi.en_baseline.risk_avg}</strong>/100</span>
            <span className="text-emerald-400 font-medium flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> High Alignment
            </span>
          </div>
        </div>

        {/* Script 2: Native Devanagari Hindi */}
        <div className="glass-card glass-card-hover rounded-xl p-5 border-l-4 border-emerald-500 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">hi_native</span>
            <span className="font-indic text-emerald-400 text-sm font-bold">देवनागरी</span>
          </div>
          <h3 className="text-sm font-semibold text-slate-300 mt-2">Native Devanagari</h3>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-extrabold font-mono text-emerald-400">{svi.hi_native.safety_rate}%</span>
            <span className="text-xs text-slate-400 font-mono">Safety Rate</span>
          </div>
          <div className="mt-3 text-xs text-slate-400 flex items-center justify-between border-t border-slate-800/80 pt-2.5">
            <span>Avg Risk: <strong className="text-slate-200 font-mono">{svi.hi_native.risk_avg}</strong>/100</span>
            <span className="text-teal-400 font-medium flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> High Safety
            </span>
          </div>
        </div>

        {/* Script 3: Romanized Hinglish */}
        <div className="glass-card glass-card-hover rounded-xl p-5 border-l-4 border-amber-500 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">hi_romanized</span>
            <span className="text-xs text-amber-400 font-mono">Hinglish</span>
          </div>
          <h3 className="text-sm font-semibold text-slate-300 mt-2">Romanized Hinglish</h3>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-extrabold font-mono text-amber-400">{svi.hi_romanized.safety_rate}%</span>
            <span className="text-xs text-slate-400 font-mono">Safety Rate</span>
          </div>
          <div className="mt-3 text-xs text-slate-400 flex items-center justify-between border-t border-slate-800/80 pt-2.5">
            <span>Avg Risk: <strong className="text-slate-200 font-mono">{svi.hi_romanized.risk_avg}</strong>/100</span>
            <span className="text-amber-400 font-medium flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" /> High Vulnerability
            </span>
          </div>
        </div>

        {/* Script 4: Code-switched Mixed Script */}
        <div className="glass-card glass-card-hover rounded-xl p-5 border-l-4 border-rose-500 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300">hi_mixed</span>
            <span className="text-xs text-rose-400 font-mono">Code-Switched</span>
          </div>
          <h3 className="text-sm font-semibold text-slate-300 mt-2">Code-Switched Mixed</h3>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-extrabold font-mono text-rose-400">{svi.hi_mixed.safety_rate}%</span>
            <span className="text-xs text-slate-400 font-mono">Safety Rate</span>
          </div>
          <div className="mt-3 text-xs text-slate-400 flex items-center justify-between border-t border-slate-800/80 pt-2.5">
            <span>Avg Risk: <strong className="text-slate-200 font-mono">{svi.hi_mixed.risk_avg}</strong>/100</span>
            <span className="text-rose-400 font-medium flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5" /> Severe Leak Gap
            </span>
          </div>
        </div>
      </div>

      {/* Visual Telemetry Breakdown (Radar + Domain Comparison) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Domain Comparison Chart */}
        <div className="glass-card rounded-2xl p-5 lg:col-span-2 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-orange-400" />
                Domain-wise Safety Disparity Comparison
              </h3>
              <p className="text-xs text-slate-400">Comparing Safety Rate across English vs Native vs Romanized vs Mixed Script</p>
            </div>
            <div className="flex items-center gap-2 text-[11px] font-mono">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-indigo-500"></span> English
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Native
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-amber-500"></span> Hinglish
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-rose-500"></span> Mixed
            </div>
          </div>

          <div className="space-y-4 py-2">
            {Object.entries(domain_breakdown).map(([domain, stats]) => {
              const calcRate = (st: ScriptType) => (stats[st]?.total > 0 ? Math.round((stats[st].safe / stats[st].total) * 100) : 0);
              const enRate = calcRate('en_baseline');
              const natRate = calcRate('hi_native');
              const romRate = calcRate('hi_romanized');
              const mixRate = calcRate('hi_mixed');

              return (
                <div key={domain} className="p-3.5 rounded-xl bg-[#0b0f19] border border-slate-800/80">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-slate-200">{domain}</span>
                    <span className="text-[11px] font-mono text-rose-400 font-bold">
                      Gap: Δ {Math.max(0, enRate - mixRate)}%
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-center text-xs font-mono">
                    <div className="bg-[#131b2e] p-2 rounded-lg border border-indigo-500/20">
                      <div className="text-[10px] text-slate-400">EN</div>
                      <div className="font-bold text-indigo-400">{enRate}%</div>
                      <div className="w-full bg-slate-800 h-1 rounded-full mt-1 overflow-hidden">
                        <div className="bg-indigo-500 h-full" style={{ width: `${enRate}%` }}></div>
                      </div>
                    </div>
                    <div className="bg-[#131b2e] p-2 rounded-lg border border-emerald-500/20">
                      <div className="text-[10px] text-slate-400">Native</div>
                      <div className="font-bold text-emerald-400">{natRate}%</div>
                      <div className="w-full bg-slate-800 h-1 rounded-full mt-1 overflow-hidden">
                        <div className="bg-emerald-500 h-full" style={{ width: `${natRate}%` }}></div>
                      </div>
                    </div>
                    <div className="bg-[#131b2e] p-2 rounded-lg border border-amber-500/20">
                      <div className="text-[10px] text-slate-400">Hinglish</div>
                      <div className="font-bold text-amber-400">{romRate}%</div>
                      <div className="w-full bg-slate-800 h-1 rounded-full mt-1 overflow-hidden">
                        <div className="bg-amber-500 h-full" style={{ width: `${romRate}%` }}></div>
                      </div>
                    </div>
                    <div className="bg-[#131b2e] p-2 rounded-lg border border-rose-500/20">
                      <div className="text-[10px] text-slate-400">Mixed</div>
                      <div className="font-bold text-rose-400">{mixRate}%</div>
                      <div className="w-full bg-slate-800 h-1 rounded-full mt-1 overflow-hidden">
                        <div className="bg-rose-500 h-full" style={{ width: `${mixRate}%` }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-2 flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
            <span>Empirical benchmark across 15 standard Indic adversarial test cases</span>
            <button
              onClick={onNavigateToScanner}
              className="text-orange-400 hover:text-orange-300 font-semibold flex items-center gap-1"
            >
              <span>Scan Custom Text & Live Web</span> &rarr;
            </button>
          </div>
        </div>

        {/* Script Attack Surface Radar Profile */}
        <div className="glass-card rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2 mb-1">
              <Activity className="w-4 h-4 text-cyan-400" />
              Linguistic Defense Profile
            </h3>
            <p className="text-xs text-slate-400 mb-4">Safety retention across scripts</p>

            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-[#0c1220] border border-slate-800">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-indigo-300 font-mono">English Baseline</span>
                  <span className="font-bold font-mono text-emerald-400">{svi.en_baseline.safety_rate}%</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-indigo-500 h-full transition-all duration-500" style={{ width: `${svi.en_baseline.safety_rate}%` }}></div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#0c1220] border border-slate-800">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-emerald-300 font-mono">Native Devanagari</span>
                  <span className="font-bold font-mono text-emerald-400">{svi.hi_native.safety_rate}%</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full transition-all duration-500" style={{ width: `${svi.hi_native.safety_rate}%` }}></div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#0c1220] border border-slate-800">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-amber-300 font-mono">Romanized Hinglish</span>
                  <span className="font-bold font-mono text-amber-400">{svi.hi_romanized.safety_rate}%</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full transition-all duration-500" style={{ width: `${svi.hi_romanized.safety_rate}%` }}></div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#0c1220] border border-slate-800">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-rose-300 font-mono">Code-Switched Mixed</span>
                  <span className="font-bold font-mono text-rose-400">{svi.hi_mixed.safety_rate}%</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-rose-500 h-full transition-all duration-500" style={{ width: `${svi.hi_mixed.safety_rate}%` }}></div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-800">
            <button
              onClick={onNavigateToSandbox}
              className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 flex items-center justify-center gap-2 transition-all"
            >
              <Database className="w-3.5 h-3.5 text-orange-400" />
              <span>Open 4-Script Audit Sandbox</span>
            </button>
          </div>
        </div>
      </div>

      {/* Script Disparity Heatmap Table */}
      <div className="glass-card rounded-2xl p-5 overflow-hidden">
        <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
          <Database className="w-4 h-4 text-amber-400" />
          Script Disparity Matrix Across Indian Context Domains
        </h3>
        <p className="text-xs text-slate-400 mb-4">
          Percentage of queries successfully defended without leaking actionable harm or false positive over-refusal.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#161f33] text-slate-300 uppercase tracking-wider text-[11px] border-b border-slate-700">
              <tr>
                <th className="py-3 px-4 font-sans font-semibold">Evaluation Domain</th>
                <th className="py-3 px-4 text-center text-indigo-400">EN Baseline</th>
                <th className="py-3 px-4 text-center text-emerald-400">HI Native</th>
                <th className="py-3 px-4 text-center text-amber-400">HI Romanized</th>
                <th className="py-3 px-4 text-center text-rose-400">HI Mixed</th>
                <th className="py-3 px-4 text-center text-orange-400">Disparity (Δ)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 font-sans">
              {Object.entries(domain_breakdown).map(([domain, stats]) => {
                const getSafeRate = (st: ScriptType) => (stats[st]?.total > 0 ? Math.round((stats[st].safe / stats[st].total) * 100) : 0);
                const enRate = getSafeRate('en_baseline');
                const nativeRate = getSafeRate('hi_native');
                const romRate = getSafeRate('hi_romanized');
                const mixedRate = getSafeRate('hi_mixed');
                const disparity = Math.max(0, enRate - mixedRate);

                return (
                  <tr key={domain} className="hover:bg-[#161f33]/50 transition-colors">
                    <td className="py-3 px-4 font-semibold text-slate-200">{domain}</td>
                    <td className={`py-3 px-4 text-center font-mono ${enRate >= 80 ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {enRate}%
                    </td>
                    <td className={`py-3 px-4 text-center font-mono ${nativeRate >= 80 ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {nativeRate}%
                    </td>
                    <td className={`py-3 px-4 text-center font-mono ${romRate < 40 ? 'text-rose-400 font-bold' : 'text-amber-400'}`}>
                      {romRate}%
                    </td>
                    <td className={`py-3 px-4 text-center font-mono ${mixedRate < 40 ? 'text-rose-400 font-bold' : 'text-amber-400'}`}>
                      {mixedRate}%
                    </td>
                    <td className="py-3 px-4 text-center font-mono text-orange-400 font-bold">
                      Δ {disparity}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
