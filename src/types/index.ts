export interface Note {
  id: string;
  title: string;
  content: string;
  summary: string;
  createdAt: string;
  updatedAt: string;
}

export type SummaryLength = 'short' | 'medium' | 'long';
export type DetailLevel = 'low' | 'medium' | 'high';

export interface SummaryOptions {
  length: SummaryLength;
  detailLevel: DetailLevel;
} 