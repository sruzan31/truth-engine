export interface EvidenceItem {
  category: string;
  title: string;
  description: string;
  status: 'success' | 'info' | 'warning' | 'danger';
  weight: number;
  score: number;
}

export interface AnalysisResult {
  scan_id: string;
  scan_type: 'url' | 'email' | 'text' | 'image' | 'qr' | 'pdf';
  target: string;
  trust_score: number;
  risk_level: 'low' | 'medium' | 'high' | 'critical';
  confidence_score: number;
  reasoning: string;
  recommendation: string;
  evidence: EvidenceItem[];
  created_at: string;
  user_id?: string | null;
}

export interface RiskBreakdown {
  low: number;
  medium: number;
  high: number;
  critical: number;
}

export interface TypeBreakdown {
  url: number;
  email: number;
  text: number;
  image: number;
  qr: number;
  pdf: number;
}

export interface RecentTrendItem {
  date: string;
  score: number;
  type: string;
}

export interface DashboardStats {
  total_scans: number;
  average_trust_score: number;
  risk_breakdown: RiskBreakdown;
  type_breakdown: TypeBreakdown;
  recent_trends: RecentTrendItem[];
}
