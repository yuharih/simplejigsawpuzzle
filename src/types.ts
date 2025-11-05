export interface PuzzlePiece {
  id: string;
  row: number;
  col: number;
  imageUrl: string;
  x: number;
  y: number;
  isPlaced: boolean;
  originalX: number;
  originalY: number;
  // ジグソー形状: true = 突起, false = 凹み, null = まっすぐ（外枠）
  topTab: boolean | null;
  rightTab: boolean | null;
  bottomTab: boolean | null;
  leftTab: boolean | null;
}

export interface PuzzleImage {
  id: string;
  url: string;
  name: string;
  isTodayImage?: boolean;
}

export type PuzzleDifficulty = 'easy' | 'normal' | 'test';

export interface PuzzleConfig {
  difficulty: PuzzleDifficulty;
  rows: number;
  cols: number;
  totalPieces: number;
  estimatedTime: string;
}

