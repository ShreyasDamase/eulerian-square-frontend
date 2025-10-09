// export interface SudokuBoard {
//   board: number[];
//   solution: number[];
// }

// export interface GameState {
//   board: number[];
//   originalBoard: number[];
//   solution: number[];
//   selectedCell: number;
//   isCompleted: boolean;
//   isPaused: boolean;
//   errors: number[];
//   hints: number;
//   time: number;
// }

// export type Difficulty = 'easy' | 'medium' | 'hard';

// export interface CellProps {
//   value: number;
//   index: number;
//   isSelected: boolean;
//   isOriginal: boolean;
//   hasError: boolean;
//   isPaused: boolean;
//   onPress: (index: number) => void;
//   cellSize?: number; // Made optional for backward compatibility
// }

// export interface NumberPadProps {
//   onNumberPress: (number: number) => void;
//   onClearPress: () => void;
//   disabled: boolean;
// }

// export interface GameHeaderProps {
//   time: number;
//   difficulty: string;
//   hints: number;
//   isPaused: boolean;
//   onPause: () => void;
// }

// export interface GameControlsProps {
//   onNewGame: () => void;
//   onReset: () => void;
//   onHint: () => void;
//   onCheck: () => void;
//   hints: number;
//   disabled: boolean;
// }

// export interface SudokuGridProps {
//   board: number[];
//   originalBoard: number[];
//   selectedCell: number;
//   errors: number[];
//   isPaused: boolean;
//   onCellPress: (index: number) => void;
// }

// // Theme colors interface for better type safety
// export interface ThemeColors {
//   primary: string;
//   background: string;
//   surface: string;
//   text: string;
//   textSecondary: string;
//   border: string;
//   error: string;
//   tint: string;
//   tabIconDefault: string;
//   tabBackground: string;
// }

// export default {
//   light: {
//     tint: '#007AFF',
//     tabIconDefault: '#8E8E93',
//     tabBackground: '#FFFFFF',
//   },
//   dark: {
//     tint: '#0A84FF',
//     tabIconDefault: '#8E8E93',
//     tabBackground: '#1C1C1E',
//   },
// };
// Types for API response validation
export interface SudokuApiResponse {
  puzzle: (number | null)[][];
  solution: number[][];
}

// Flattened Sudoku board after processing
export interface SudokuBoard {
  board: number[]; // Flattened 9x9 => 81 cells, 0 = empty
  solution: number[]; // Same length, all filled
}

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

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface CellProps {
  value: number;
  index: number;
  isSelected: boolean;
  isOriginal: boolean;
  hasError: boolean;
  isPaused: boolean;
  onPress: (index: number) => void;
  cellSize?: number; // Optional for responsive design
}

export interface NumberPadProps {
  onNumberPress: (num: number) => void;
  onClearPress: () => void;
  disabled: boolean;
}

export interface GameHeaderProps {
  time: number;
  difficulty: string;
  hints: number;
  isPaused: boolean;
  onPause: () => void;
}

export interface GameControlsProps {
  onNewGame: () => void;
  onReset: () => void;
  onHint: () => void;
  onCheck: () => void;
  hints: number;
  disabled: boolean;
}

export interface SudokuGridProps {
  board: number[];
  originalBoard: number[];
  selectedCell: number;
  errors: number[];
  isPaused: boolean;
  onCellPress: (index: number) => void;
}

export interface ThemeColors {
  primary: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  error: string;
  tint: string;
  tabIconDefault: string;
  tabBackground: string;
}

// You can move this to theme.ts or similar
export default {
  light: {
    tint: '#007AFF',
    tabIconDefault: '#8E8E93',
    tabBackground: '#FFFFFF',
  },
  dark: {
    tint: '#0A84FF',
    tabIconDefault: '#8E8E93',
    tabBackground: '#1C1C1E',
  },
};
