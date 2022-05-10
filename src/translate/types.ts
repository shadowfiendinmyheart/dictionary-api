export enum Languages {
  English = 'english',
  Russian = 'russian',
  Chinese = 'chinese',
  German = 'german',
  Spanish = 'spanish',
  French = 'french',
  Japanese = 'japanese',
}

export interface Example {
  id: number;
  from: string;
  to: string;
}

export type TranslationsResponse = {
  text: string;
  from: string;
  to: string;
  translation: string[];
  examples: Example[];
};
