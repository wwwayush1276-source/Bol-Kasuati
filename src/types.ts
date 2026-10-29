export type ScriptType = 'en_baseline' | 'hi_native' | 'hi_romanized' | 'hi_mixed';

export type ClassificationType = 'SAFE' | 'UNSAFE_LEAK' | 'FALSE_POSITIVE_OVER_REFUSAL';

export interface LayerBreakdown {
  layer1_cosine_risk: number;
  layer1_sim_safe: number;
  layer1_sim_unsafe: number;
  layer2_refusal_risk: number;
  layer2_refusal_strength: number;
  layer3_actionable_risk: number;
  layer3_harm_tokens_detected: string[];
}

export interface EvaluationRecord {
  audit_id: string;
  timestamp: string;
  script_type: ScriptType;
  prompt_text: string;
  response_text: string;
  is_safe: boolean;
  classification: ClassificationType;
  risk_score: number;
  is_redacted: boolean;
  redaction_reason?: string;
  evidence_hash: string;
  response_hash: string;
  layer_breakdown: LayerBreakdown;
  grounding_sources?: WebGroundingSource[];
}

export interface BenchmarkItem {
  id: string;
  category: string;
  sub_domain: string;
  severity: 'HIGH' | 'MEDIUM' | 'LOW' | 'BENIGN';
  is_benign: boolean;
  description: string;
  en_baseline: string;
  hi_native: string;
  hi_romanized: string;
  hi_mixed: string;
  golden_safe_anchor: string;
  golden_unsafe_anchor: string;
}

export interface WebGroundingSource {
  title: string;
  url: string;
  snippet: string;
  sourceType: 'wikipedia' | 'duckduckgo' | 'google_grounding';
  confidence: number;
  verifiedAt: string;
}

export interface WebScannerResult {
  scan_id: string;
  input_text: string;
  detected_language: string;
  grounding_sources: WebGroundingSource[];
  perturbations: {
    en_baseline: string;
    hi_native: string;
    hi_romanized: string;
    hi_mixed: string;
  };
  evaluations: EvaluationRecord[];
  composite_risk_average: number;
  primary_status: ClassificationType;
  sha256_receipt: string;
  scanned_at: string;
}

export interface SviMetricItem {
  safety_rate: number;
  risk_avg: number;
  total: number;
  safe: number;
}

export interface DashboardMetrics {
  total_evaluations: number;
  disparity_gap: number;
  svi: {
    en_baseline: SviMetricItem;
    hi_native: SviMetricItem;
    hi_romanized: SviMetricItem;
    hi_mixed: SviMetricItem;
  };
  domain_breakdown: Record<string, Record<ScriptType, { safe: number; total: number }>>;
}
