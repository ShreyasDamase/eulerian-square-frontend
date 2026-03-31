import { create } from 'zustand';
import { SudokuState } from '@/types/sudoku.types';
import { mmkv } from './mmkv';
import { Difficulty } from '@/types/sudoku';
import { generateSudoku } from './sudokuLogic';

const STORAGE_KEY = 'active_sudoku';

type SudokuStore = SudokuState & {
  isHydrated: boolean;
  solution: number[];
  startNewGame: (difficulty: Difficulty) => Promise<void>;

  hydrate: () => void;
  persist: () => void;
  setCell: (index: number, value: number) => void;
  clearCell: (index: number) => void;
  pause: () => void;
  resume: () => void;
  reset: () => void;
  initialize: (
    puzzle: { board: number[]; solution: number[] },
    difficulty: Difficulty
  ) => void;
  selectCell: (index: number | null) => void;
  useHint: () => boolean;
  updateErrors: (errors: number[]) => void;
  decrementTime: () => void;
  setTime: (time: number) => void;
};

// Extended persistable state to include solution
const getPersistableState = (state: SudokuStore) => ({
  puzzleId: state.puzzleId,
  difficulty: state.difficulty,
  board: state.board,
  originalBoard: state.originalBoard,
  solution: state.solution,
  notes: state.notes,
  selectedCell: state.selectedCell,
  errors: state.errors,
  timeSpent: state.timeSpent,
  hintsLeft: state.hintsLeft,
  isPaused: state.isPaused,
});

export const useSudokuStore = create<SudokuStore>((set, get) => ({
  isHydrated: false,

  puzzleId: '',
  difficulty: 'easy',
  board: Array(81).fill(0),
  originalBoard: Array(81).fill(0),
  solution: Array(81).fill(0),
  notes: Array(81).fill([]),
  selectedCell: null,
  errors: [],
  timeSpent: 0,
  hintsLeft: 3,
  isPaused: false,
  startNewGame: async (difficulty: Difficulty) => {
    try {
      console.log(`🎮 Starting new ${difficulty} game...`);

      // 🔥 CRITICAL: Clear previous game completely
      mmkv.delete(STORAGE_KEY);

      // Generate fresh puzzle
      const puzzle = await generateSudoku(difficulty);

      // Create completely fresh state
      const freshState: SudokuState = {
        puzzleId: `${difficulty}-${Date.now()}`,
        difficulty,
        board: [...puzzle.board],
        originalBoard: [...puzzle.board],
        solution: [...puzzle.solution],
        notes: Array(81)
          .fill([])
          .map(() => []),
        selectedCell: null,
        errors: [],
        timeSpent: 0,
        hintsLeft: 3,
        isPaused: false,
      };

      // Persist immediately
      mmkv.set(STORAGE_KEY, JSON.stringify(freshState));

      // Update store
      set(freshState);

      console.log('✅ New game initialized:', freshState.puzzleId);
    } catch (error) {
      console.error('❌ Failed to start new game:', error);
      throw error;
    }
  },

  hydrate() {
    const saved = mmkv.getString(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        set(parsed);
        console.log('✅ Hydrated game state from storage');
      } catch (e) {
        console.error('❌ Failed to hydrate:', e);
      }
    }

    set({ isHydrated: true });
  },

  persist() {
    try {
      mmkv.set(STORAGE_KEY, JSON.stringify(getPersistableState(get())));
    } catch (error) {
      console.error('❌ Failed to persist state:', error);
    }
  },

  initialize(puzzle, difficulty) {
    set({
      puzzleId: `${difficulty}-${Date.now()}`,
      difficulty: difficulty as any,
      board: [...puzzle.board],
      originalBoard: [...puzzle.board],
      solution: [...puzzle.solution],
      notes: Array(81).fill([]),
      selectedCell: null,
      errors: [],
      timeSpent: 0,
      hintsLeft: 3,
      isPaused: false,
    });

    get().persist();
    console.log('✅ Initialized new game');
  },

  selectCell(index) {
    const state = get();
    // Only allow selection of non-original cells
    if (index !== null && state.originalBoard[index] !== 0) {
      return;
    }

    set({ selectedCell: index });
  },

  setCell(index, value) {
    set((state) => {
      if (state.originalBoard[index] !== 0) return state;

      const board = [...state.board];
      board[index] = value;
      const next = {
        ...state,
        board,
        selectedCell: value === 0 ? index : null,
      };

      mmkv.set(
        STORAGE_KEY,
        JSON.stringify(getPersistableState(next as SudokuStore))
      );

      return next;
    });
  },

  clearCell(index) {
    set((state) => {
      if (state.originalBoard[index] !== 0) return state;

      const board = [...state.board];
      board[index] = 0;
      const next = { ...state, board };

      mmkv.set(
        STORAGE_KEY,
        JSON.stringify(getPersistableState(next as SudokuStore))
      );

      return next;
    });
  },

  useHint() {
    const state = get();

    // Check if hint can be used
    if (state.hintsLeft <= 0 || state.selectedCell === null || state.isPaused) {
      return false;
    }

    const selectedCell = state.selectedCell;
    const correctValue = state.solution[selectedCell];

    // Check if cell already has correct value
    if (state.board[selectedCell] === correctValue) {
      return false;
    }

    // Apply hint
    const board = [...state.board];
    board[selectedCell] = correctValue;

    const next = {
      ...state,
      board,
      hintsLeft: state.hintsLeft - 1,
      selectedCell: null,
    };

    set(next);
    mmkv.set(
      STORAGE_KEY,
      JSON.stringify(getPersistableState(next as SudokuStore))
    );

    return true;
  },

  updateErrors(errors) {
    set({ errors });
    get().persist();
  },

  setTime(time) {
    set({ timeSpent: time });
  },

  decrementTime() {
    set((state) => ({ timeSpent: state.timeSpent + 1 }));
  },

  pause() {
    set((state) => {
      const next = { ...state, isPaused: true };
      mmkv.set(
        STORAGE_KEY,
        JSON.stringify(getPersistableState(next as SudokuStore))
      );
      return next;
    });
  },

  resume() {
    set((state) => {
      const next = { ...state, isPaused: false };
      mmkv.set(
        STORAGE_KEY,
        JSON.stringify(getPersistableState(next as SudokuStore))
      );
      return next;
    });
  },

  reset() {
    mmkv.delete(STORAGE_KEY);
    set({
      puzzleId: '',
      difficulty: 'easy',
      board: Array(81).fill(0),
      originalBoard: Array(81).fill(0),
      solution: Array(81).fill(0),
      notes: Array(81).fill([]),
      selectedCell: null,
      errors: [],
      timeSpent: 0,
      hintsLeft: 3,
      isPaused: false,
    });
    console.log('✅ Game reset');
  },
}));
