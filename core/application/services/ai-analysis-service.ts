export type OpenTextAnalysisRequest = {
  patientId: string;
  assignmentId: string;
  questionId: string;
  answer: string;
  locale: string;
};

export type OpenTextAnalysisResult = {
  status: "not_configured" | "completed";
  summary?: string;
  signals?: string[];
};

export interface AIAnalysisService {
  analyzeOpenText(request: OpenTextAnalysisRequest): Promise<OpenTextAnalysisResult>;
}

export class PlaceholderAIAnalysisService implements AIAnalysisService {
  async analyzeOpenText(): Promise<OpenTextAnalysisResult> {
    return { status: "not_configured" };
  }
}
