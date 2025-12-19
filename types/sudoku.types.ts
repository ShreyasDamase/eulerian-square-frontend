// types/sudoku.types.ts

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface SudokuState {
  puzzleId: string;
  difficulty: Difficulty;
  board: number[];
  originalBoard: number[];
  solution: number[]; // ✅ Added - needed for hints
  notes: number[][];
  selectedCell: number | null;
  errors: number[];
  timeSpent: number;
  hintsLeft: number;
  isPaused: boolean;
}

export interface SudokuPuzzle {
  board: number[];
  solution: number[];
  difficulty: Difficulty;
}

export interface GameStats {
  totalGames: number;
  gamesWon: number;
  gamesLost: number;
  totalTime: number;
  bestTime: number;
  averageTime: number;
  currentStreak: number;
  bestStreak: number;
  easyCompleted: number;
  mediumCompleted: number;
  hardCompleted: number;
}
