import React, { useState } from 'react';
import { EvaluationRecord } from '../types';
import { clearVault, getVaultRecords, verifyVaultProof } from '../engine/vaultStore';
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  Search,
  Download,
  Trash2,
  Copy,
  CheckCircle2,
  XCircle,
  Fingerprint,
  Lock
} from 'lucide-react';

interface EvidenceVaultProps {
  records: EvaluationRecord[];
  onVaultUpdated: () => void;
}

export const EvidenceVault: React.FC<EvidenceVaultProps> = ({
  records,
  onVaultUpdated
}) => {
  const [claimInput, setClaimInput] = useState<string>('');
  const [verificationResult, setVerificationResult] = useState<{
    isVerified: boolean;
    matchingRecord?: EvaluationRecord;
    message: string;
  } | null>(null);

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  const handleVerify = () => {
    if (!claimInput.trim()) return;
    const res = verifyVaultProof(claimInput.trim());
    setVerificationResult(res);
  };

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(records, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `audit_vault_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleClear = () => {
    if (confirm('Are you sure you want to clear all vault records?')) {
      clearVault();
      onVaultUpdated();
      setVerificationResult(null);
    }
  };

  const copyHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  const filteredRecords = records.filter(r => {
    const q = searchQuery.toLowerCase();
    return (
      r.audit_id.toLowerCase().includes(q) ||
      r.prompt_text.toLowerCase().includes(q) ||
      r.evidence_hash.toLowerCase().includes(q) ||
      r.script_type.toLowerCase().includes(q)
    );
  });

  return (
    <div id="view-vault" className="space-y-6">
      {/* Zero-Leak Philosophy Banner */}
      <div className="glass-card rounded-2xl p-6 border-l-4 border-cyan-500 bg-gradient-to-r from-[#0c1626] to-[#0e172a]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Shield className="w-5 h-5 text-cyan-400" />
              <span>Zero-Leak Cryptographic Evidence Vault</span>
            </h3>
            <p className="text-xs text-slate-300 mt-1.5 max-w-3xl leading-relaxed">
              <strong className="text-cyan-400">Core Principle:</strong> <em>Never publish or store raw harmful content. Verify the claim, preserve immutable proof.</em>{' '}
              When any AI evaluation violates safety thresholds (Risk &gt; 50), the body is immediately redacted to prevent harm proliferation, while sealing the output with an immutable 256-bit SHA-256 cryptographic proof token.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportJson}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 flex items-center gap-2 transition-all"
            >
              <Download className="w-4 h-4 text-cyan-400" />
              <span>Export Audit Kit (JSON)</span>
            </button>
            <button
              onClick={handleClear}
              title="Clear Vault Records"
              className="px-3 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-semibold rounded-xl transition-all"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Live Auditor Claim Verifier Tool */}
      <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Fingerprint className="w-4 h-4 text-orange-400" />
            <span>Forensic Auditor Claim Verifier</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Paste any raw candidate text or 64-character SHA-256 hash to prove whether an alleged violation occurred and verify its authentic record in the immutable vault.
          </p>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Raw Suspected AI Response String or SHA-256 Hash Signature
            </label>
            <textarea
              rows={3}
              value={claimInput}
              onChange={e => setClaimInput(e.target.value)}
              placeholder="Paste suspected AI text output or 64-char SHA-256 hash here to verify authenticity against vault hash..."
              className="w-full bg-[#131b2e] border border-slate-700 rounded-xl p-3 text-xs text-slate-200 font-mono focus:outline-none focus:border-cyan-500 leading-relaxed"
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span className="text-[11px] text-slate-500 font-mono">Algorithm: SHA-256 / UTF-8 Digest Verification</span>
            <button
              onClick={handleVerify}
              disabled={!claimInput.trim()}
              className="px-5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Verify Cryptographic Proof</span>
            </button>
          </div>
        </div>

        {/* Verification Result Box */}
        {verificationResult && (
          <div
            className={`mt-4 p-4 rounded-xl border ${
              verificationResult.isVerified
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
            } space-y-2`}
          >
            <div className="flex items-center gap-2 font-bold text-sm">
              {verificationResult.isVerified ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              ) : (
                <XCircle className="w-5 h-5 text-rose-400" />
              )}
              <span>{verificationResult.message}</span>
            </div>

            {verificationResult.matchingRecord && (
              <div className="text-xs font-mono grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-300 mt-2 p-3 bg-[#0a0f1d]/70 rounded-lg border border-emerald-500/20">
                <div>
                  Record ID: <strong className="text-white">{verificationResult.matchingRecord.audit_id}</strong>
                </div>
                <div>
                  Script Type: <strong className="text-white">{verificationResult.matchingRecord.script_type}</strong>
                </div>
                <div>
                  Classification:{' '}
                  <strong className={verificationResult.matchingRecord.classification === 'UNSAFE_LEAK' ? 'text-rose-400' : 'text-emerald-400'}>
                    {verificationResult.matchingRecord.classification}
                  </strong>
                </div>
                <div>
                  Risk Score:{' '}
                  <strong className="text-white">{verificationResult.matchingRecord.risk_score}/100</strong>
                </div>
                <div className="col-span-1 sm:col-span-2 truncate">
                  SHA-256 Digest: <span className="text-cyan-400">{verificationResult.matchingRecord.evidence_hash}</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Historical Audit Records Table */}
      <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Lock className="w-4 h-4 text-slate-400" />
            <span>Historical Vault Audit Log ({records.length} Sealed Proofs)</span>
          </h3>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by ID, prompt or hash..."
              className="bg-[#131b2e] border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 font-mono w-64 focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#141d30] text-slate-300 uppercase text-[11px] border-b border-slate-700">
              <tr>
                <th className="py-3 px-3">Audit ID</th>
                <th className="py-3 px-3">Timestamp</th>
                <th className="py-3 px-3">Script</th>
                <th className="py-3 px-3">Classification</th>
                <th className="py-3 px-3 text-center">Risk Score</th>
                <th className="py-3 px-3">Immutable SHA-256 Digest</th>
                <th className="py-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 font-sans">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-6 text-center text-slate-500 font-mono">
                    No matching audit records in vault.
                  </td>
                </tr>
              ) : (
                filteredRecords.map(r => (
                  <tr key={r.audit_id} className="hover:bg-[#161f33]/40 transition-colors">
                    <td className="py-3 px-3 font-mono font-semibold text-slate-200">{r.audit_id}</td>
                    <td className="py-3 px-3 text-slate-400 text-[11px] font-mono">
                      {r.timestamp.split('T')[1]?.replace('Z', '').slice(0, 8) || r.timestamp}
                    </td>
                    <td className="py-3 px-3 font-mono text-xs text-slate-300">{r.script_type}</td>
                    <td className="py-3 px-3">
                      <span
                        className={`text-[11px] px-2 py-0.5 rounded font-mono font-semibold ${
                          r.classification === 'UNSAFE_LEAK'
                            ? 'bg-rose-500/20 text-rose-400'
                            : r.classification === 'FALSE_POSITIVE_OVER_REFUSAL'
                            ? 'bg-amber-500/20 text-amber-400'
                            : 'bg-emerald-500/20 text-emerald-400'
                        }`}
                      >
                        {r.classification}
                      </span>
                    </td>
                    <td
                      className={`py-3 px-3 text-center font-mono font-bold ${
                        r.risk_score > 50 ? 'text-rose-400' : 'text-emerald-400'
                      }`}
                    >
                      {r.risk_score}
                    </td>
                    <td className="py-3 px-3 font-mono text-[11px] text-cyan-400" title={r.evidence_hash}>
                      {r.evidence_hash.substring(0, 16)}...
                    </td>
                    <td className="py-3 px-3 text-right font-mono">
                      <button
                        onClick={() => copyHash(r.evidence_hash)}
                        className="text-slate-400 hover:text-white mr-3 transition-colors"
                        title="Copy Evidence Hash"
                      >
                        {copiedHash === r.evidence_hash ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 inline" />
                        ) : (
                          <Copy className="w-3.5 h-3.5 inline" />
                        )}
                      </button>
                      <button
                        onClick={() => {
                          setClaimInput(r.response_hash);
                          handleVerify();
                        }}
                        className="text-orange-400 hover:text-orange-300 transition-colors"
                        title="Verify Claim in Tool"
                      >
                        <Fingerprint className="w-3.5 h-3.5 inline" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
