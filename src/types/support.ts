export type ScenarioId = 'retail' | 'saas' | 'booking';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  shouldEscalate?: boolean;
  handoffSummary?: string;
}

export interface ScenarioConfig {
  id: ScenarioId;
  label: string;
  companyName: string;
  greeting: string;
  starterQuestions: string[];
  policyNote: string;
}
