const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

function authHeaders(token: string | null): HeadersInit {
  return token ? { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } : {};
}

export interface ScanResult {
  filename:        string;
  disease:         string;
  risk_level:      string;
  confidence:      string;
  recommendations: string[];
  metrics?:        Record<string, number>;
  gradcam_url?:    string;
  error?:          string;
}

export interface ScanHistoryItem {
  id?:             number;
  filename:        string;
  disease:         string;
  risk_level:      string;
  confidence:      string;
  metrics:         Record<string, number>;
  recommendations: string[];
  timestamp:       string;
}

export const api = {

  /** Register a new user */
  register: async (name: string, email: string, password: string, gender: string, age: number) => {
    const r = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, gender, age }),
    });
    if (!r.ok) {
      const err = await r.json();
      throw new Error(err.detail || 'Registration failed');
    }
    return r.json();
  },

  /** Login with email + password */
  login: async (email: string, password: string) => {
    const r = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!r.ok) {
      const err = await r.json();
      throw new Error(err.detail || 'Login failed');
    }
    return r.json();
  },

  /** Upload dermoscopic image for AI analysis */
  uploadDermoscopicImage: async (imageFile: File | Blob, token: string | null, symptoms: string[] = [], filename = 'scan.jpg'): Promise<ScanResult> => {
    const form = new FormData();
    form.append('file', imageFile, filename);
    if (symptoms.length > 0) {
      form.append('symptoms_json', JSON.stringify(symptoms));
    }
    try {
      const headers: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {};
      const r = await fetch(`${API_BASE}/upload`, { method: 'POST', headers, body: form });
      if (!r.ok) throw new Error(`Backend error ${r.status}`);
      return r.json();
    } catch (err: any) {
      return { filename, disease: 'Analysis Failed (Connection Error)', risk_level: 'Unknown', confidence: '0.0%', recommendations: [], error: err.message };
    }
  },

  /** Submit symptom questionnaire */
  submitSymptoms: async (symptoms: string[], token: string | null) => {
    try {
      const r = await fetch(`${API_BASE}/scan`, {
        method: 'POST',
        headers: authHeaders(token) as any,
        body: JSON.stringify({ symptoms }),
      });
      return r.json();
    } catch { return null; }
  },

  /** Fetch per-user scan history */
  getHistory: async (token: string): Promise<ScanHistoryItem[]> => {
    try {
      const r = await fetch(`${API_BASE}/history`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!r.ok) return [];
      const data = await r.json();
      return data.history || [];
    } catch { return []; }
  },

  /** Generate PDF report */
  generatePDF: async (token: string): Promise<void> => {
    const r = await fetch(`${API_BASE}/report/generate`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!r.ok) throw new Error('PDF generation failed');
    const blob = await r.blob();
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = `skindetect_report_${new Date().toISOString().slice(0, 10)}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
  },

  /** Admin: get all users */
  adminGetUsers: async (token: string) => {
    const r = await fetch(`${API_BASE}/admin/users`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!r.ok) return { users: [] };
    return r.json();
  },

  /** Admin: toggle user status */
  adminToggleStatus: async (token: string, userId: number, status: string) => {
    const r = await fetch(`${API_BASE}/admin/users/${userId}/status?status=${status}`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` },
    });
    return r.json();
  },

  /** Admin: delete user */
  adminDeleteUser: async (token: string, userId: number) => {
    const r = await fetch(`${API_BASE}/admin/users/${userId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    return r.json();
  },

  /** Admin: get stats */
  adminGetStats: async (token: string) => {
    const r = await fetch(`${API_BASE}/admin/stats`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!r.ok) return null;
    return r.json();
  },

  /** Update user profile */
  updateProfile: async (token: string, data: { name?: string; gender?: string; age?: number }) => {
    const r = await fetch(`${API_BASE}/auth/me`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return r.json();
  },

  /** Admin: get specific user history */
  adminGetUserHistory: async (userId: number, token: string) => {
    const r = await fetch(`${API_BASE}/admin/users/${userId}/history`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!r.ok) return { history: [] };
    return r.json();
  },
  
  /** Delete a specific scan record */
  deleteScan: async (scanId: number, token: string) => {
    const r = await fetch(`${API_BASE}/history/${scanId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    return r.json();
  },
};
