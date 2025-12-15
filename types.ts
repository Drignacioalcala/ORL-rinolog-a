export interface LoemResult {
  code: string;
  components: {
    L: { value: string; description: string; originalText: string };
    O: { value: string; description: string; originalText: string };
    E: { value: string; description: string; originalText: string };
    M: { value: string; description: string; originalText: string };
  };
  summary: string;
  confidence: number;
}

export enum LoadingState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}