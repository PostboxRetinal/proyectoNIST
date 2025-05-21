export interface AuditoryResponse {
  success: boolean;
  forms: Auditory[];
}

export interface Auditory {
  id: string;
  name: string;
}

export interface AxiosError {
  message: string;
  response?: {
    data?: {
      message?: string;
      error?: string;
    };
    statusText?: string;
  };
  request?: unknown;
  config?: unknown;
}
export interface AuditFormData {
  program: string;
  sections: Array<{
    section: string;
    title: string;
    subsections: Array<{
      subsection: string;
      title: string;
      questions: Array<{
        id: string;
        text: string;
        options: Array<{
          value: string;
          label: string;
          description: string;
        }>;
        response?: string | null;
        observations?: string;
        evidence_url?: string;
        esObligatoria?: boolean;
      }>;
    }>;
  }>;
}