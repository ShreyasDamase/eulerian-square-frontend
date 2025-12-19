// ============================================================================
// Sudoku Types - Complete Type Definitions
// ============================================================================

export type Difficulty = 'easy' | 'medium' | 'hard';

// API Response from Sudoku Generator
export interface SudokuApiResponse {
  puzzle: (number | null)[][];
  solution: number[][];
}

// Flattened Sudoku board after processing
export interface SudokuBoard {
  board: number[]; // Flattened 9x9 => 81 cells, 0 = empty
  solution: number[]; // Same length, all filled
}

// Core Sudoku State (used by Zustand store)
export interface SudokuState {
  puzzleId: string;
  difficulty: Difficulty;
  board: number[]; // Current game board (81 cells)
  originalBoard: number[]; // Read-only cells (initial puzzle)
  notes: number[][]; // Notes for each cell (81 arrays)
  selectedCell: number | null; // Index (0-80), null if none selected
  errors: number[]; // Indices of wrong entries
  timeSpent: number; // Seconds since game start
  hintsLeft: number; // Hints remaining
  isPaused: boolean;
}

// Legacy GameState interface (if needed for backwards compatibility)
export interface GameState {
  board: number[]; // Current game board
  originalBoard: number[]; // Read-only cells (initial puzzle)
  solution: number[]; // Correct answers
  selectedCell: number; // Index (0-80), -1 if none selected
  isCompleted: boolean;
  isPaused: boolean;
  errors: number[]; // Indices of wrong entries
  hints: number; // Hints left
  time: number; // Seconds since game start
}

// ============================================================================
// Component Props
// ============================================================================

export interface CellProps {
  value: number;
  index: number;
  isSelected: boolean;
  isOriginal: boolean;
  hasError: boolean;
  isPaused: boolean;
  onPress: (index: number) => void;
  cellSize?: number; // Optional for responsive design
  gridSize?: number; // Optional grid size for calculations
}

export interface NumberPadProps {
  onNumberPress: (num: number) => void;
  onClearPress: () => void;
  disabled: boolean;
  selectedValue?: number; // Current value of selected cell
}

export interface GameHeaderProps {
  time: number;
  difficulty: Difficulty; // Changed from string to Difficulty
  hints: number;
  isPaused: boolean;
  onPause: () => void;
  progress?: number; // Optional progress percentage
}

export interface GameControlsProps {
  onNewGame: () => void;
  onReset: () => void;
  onHint: () => void;
  onCheck: () => void;
  hints: number;
  disabled: boolean;
  canUseHint?: boolean; // Optional flag to enable/disable hint button
}

export interface SudokuGridProps {
  board: number[];
  originalBoard: number[];
  selectedCell: number; // Can be -1 for backwards compatibility with components
  errors: number[];
  isPaused: boolean;
  onCellPress: (index: number) => void;
}

// ============================================================================
// Theme Types
// ============================================================================

export interface ThemeColors {
  primary: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  error: string;
  success: string;
  warning: string;
  tint: string;
  tabIconDefault: string;
  tabIconSelected: string;
  tabBackground: string;
}

export interface Theme {
  dark: boolean;
  colors: ThemeColors;
}

// Theme configuration
export const themes = {
  light: {
    dark: false,
    colors: {
      primary: '#007AFF',
      background: '#F2F2F7',
      surface: '#FFFFFF',
      text: '#000000',
      textSecondary: '#8E8E93',
      border: '#C6C6C8',
      error: '#FF3B30',
      success: '#34C759',
      warning: '#FF9500',
      tint: '#007AFF',
      tabIconDefault: '#8E8E93',
      tabIconSelected: '#007AFF',
      tabBackground: '#FFFFFF',
    },
  },
  dark: {
    dark: true,
    colors: {
      primary: '#0A84FF',
      background: '#000000',
      surface: '#1C1C1E',
      text: '#FFFFFF',
      textSecondary: '#8E8E93',
      border: '#38383A',
      error: '#FF453A',
      success: '#32D74B',
      warning: '#FF9F0A',
      tint: '#0A84FF',
      tabIconDefault: '#8E8E93',
      tabIconSelected: '#0A84FF',
      tabBackground: '#1C1C1E',
    },
  },
} as const;

// ============================================================================
// Utility Types
// ============================================================================

export type SoundType = 'tap' | 'success' | 'error' | 'complete';
export type VibrationType = 'light' | 'medium' | 'heavy';

// Statistics
export interface GameStats {
  gamesPlayed: number;
  gamesWon: number;
  bestTime: number; // in seconds
  averageTime: number; // in seconds
  currentStreak: number;
  longestStreak: number;
}

// Settings
export interface GameSettings {
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  theme: 'light' | 'dark' | 'auto';
  autoCheckErrors: boolean;
  highlightSimilar: boolean;
  highlightAreas: boolean;
}

// Cell position helpers
export interface CellPosition {
  row: number; // 0-8
  col: number; // 0-8
  box: number; // 0-8 (which 3x3 box)
}

// For puzzle validation
export interface ValidationResult {
  isValid: boolean;
  errors: number[]; // Cell indices with errors
  completed: boolean;
}
