import React, { useState } from 'react';
import { BenchmarkItem } from '../types';
import { SEED_DATASET } from '../engine/dataset';
import { Database, Filter, ArrowRight } from 'lucide-react';

interface TestKitExplorerProps {
  onLoadItemIntoSandbox: (item: BenchmarkItem) => void;
}

export const TestKitExplorer: React.FC<TestKitExplorerProps> = ({
  onLoadItemIntoSandbox
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const filteredItems = selectedCategory === 'ALL'
    ? SEED_DATASET
    : selectedCategory === 'BENIGN'
    ? SEED_DATASET.filter(x => x.is_benign)
    : SEED_DATASET.filter(x => x.category === selectedCategory);

  return (
    <div id="view-dataset" className="space-y-6">
      <div className="glass-card rounded-2xl p-6 border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-slate-800 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium mb-1.5">
              <Database className="w-3.5 h-3.5" />
              <span>Tri-Domain Adversarial Test Kit • 15 Pre-Engineered Prompts</span>
            </div>
            <h2 className="text-xl font-bold text-white">Seed Evaluation Dataset Explorer</h2>
            <p className="text-xs text-slate-400 mt-1">
              Complete test suite spanning Healthcare Guidance, Consumer Finance & Lending, Civic & Public Information, and Benign Controls. Every item pre-includes all 4 script perturbations and golden token vectors.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="bg-[#131b2e] border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-orange-500"
            >
              <option value="ALL">All Categories ({SEED_DATASET.length})</option>
              <option value="Healthcare Guidance">Healthcare Guidance</option>
              <option value="Consumer Finance & Lending">Consumer Finance & Lending</option>
              <option value="Civic & Public Information">Civic & Public Information</option>
              <option value="BENIGN">Benign Controls Only</option>
            </select>
          </div>
        </div>

        <div className="space-y-4">
          {filteredItems.map(item => (
            <div
              key={item.id}
              className="glass-card rounded-xl p-5 border border-slate-800 space-y-3 hover:border-slate-700 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-200">
                    {item.id}
                  </span>
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded ${
                      item.is_benign ? 'bg-blue-500/20 text-blue-300' : 'bg-rose-500/20 text-rose-300'
                    }`}
                  >
                    {item.severity}
                  </span>
                  <span className="text-xs text-slate-400">
                    {item.category} • <strong className="text-slate-200">{item.sub_domain}</strong>
                  </span>
                </div>

                <button
                  onClick={() => onLoadItemIntoSandbox(item)}
                  className="text-xs text-orange-400 hover:text-orange-300 font-semibold flex items-center gap-1 transition-colors"
                >
                  <span>Load into Sandbox</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <p className="text-xs text-slate-300 italic">{item.description}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-sans">
                <div className="p-2.5 rounded-lg bg-[#0e1424] border border-slate-800">
                  <span className="text-[10px] font-mono text-indigo-400 uppercase font-semibold">
                    1. English Baseline:
                  </span>
                  <p className="text-slate-200 mt-0.5">{item.en_baseline}</p>
                </div>

                <div className="p-2.5 rounded-lg bg-[#0e1424] border border-slate-800 font-indic">
                  <span className="text-[10px] font-mono text-emerald-400 uppercase font-semibold font-sans">
                    2. Native Devanagari:
                  </span>
                  <p className="text-slate-200 mt-0.5">{item.hi_native}</p>
                </div>

                <div className="p-2.5 rounded-lg bg-[#0e1424] border border-slate-800">
                  <span className="text-[10px] font-mono text-amber-400 uppercase font-semibold">
                    3. Romanized Hinglish:
                  </span>
                  <p className="text-slate-200 mt-0.5">{item.hi_romanized}</p>
                </div>

                <div className="p-2.5 rounded-lg bg-[#0e1424] border border-slate-800">
                  <span className="text-[10px] font-mono text-rose-400 uppercase font-semibold">
                    4. Code-Switched Mixed:
                  </span>
                  <p className="text-slate-200 mt-0.5">{item.hi_mixed}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
