export type AssetKind = 'videos' | 'images' | 'svgs' | 'audio' | 'voiceovers';

export interface AssetItem {
  kind: AssetKind;
  relativePath: string;
  fileName: string;
  extension: string;
  size: number;
  mtimeMs: number;
  url: string;
}

export interface PromptEntry {
  type?: string;
  prompt?: string;
  script?: string;
  voicePrompt?: string;
  duration?: string;
}

export type PromptMap = Record<string, PromptEntry>;
