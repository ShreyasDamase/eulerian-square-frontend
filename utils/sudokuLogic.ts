import { SudokuBoard, Difficulty } from '@/types/sudoku';

const SIZE = 9;
const SUBGRID = 3;

// Difficulty configuration
const DIFFICULTY_EMPTY_CELLS = {
  easy: 35,
  medium: 45,
  hard: 55,
};

// ============================================================================
// CORE GENERATION LOGIC
// ============================================================================

function createEmptyGrid(): number[][] {
  return Array.from({ length: SIZE }, () => Array(SIZE).fill(0));
}

function isSafe(
  grid: number[][],
  row: number,
  col: number,
  num: number
): boolean {
  // Check row and column
  for (let i = 0; i < SIZE; i++) {
    if (grid[row][i] === num || grid[i][col] === num) return false;
  }

  // Check 3x3 subgrid
  const startRow = row - (row % SUBGRID);
  const startCol = col - (col % SUBGRID);

  for (let r = 0; r < SUBGRID; r++) {
    for (let c = 0; c < SUBGRID; c++) {
      if (grid[startRow + r][startCol + c] === num) return false;
    }
  }

  return true;
}

function shuffle<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function fillGrid(grid: number[][]): boolean {
  for (let row = 0; row < SIZE; row++) {
    for (let col = 0; col < SIZE; col++) {
      if (grid[row][col] === 0) {
        const nums = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);

        for (const num of nums) {
          if (isSafe(grid, row, col, num)) {
            grid[row][col] = num;
            if (fillGrid(grid)) return true;
            grid[row][col] = 0;
          }
        }
        return false;
      }
    }
  }
  return true;
}

function generateSudokuFlat(): number[] {
  const grid = createEmptyGrid();
  fillGrid(grid);
  return grid.flat();
}

// ============================================================================
// PUZZLE CREATION FROM SOLUTION
// ============================================================================

function createPuzzleFromSolution(
  solution: number[],
  difficulty: Difficulty
): { board: number[]; solution: number[] } {
  const emptyCount = DIFFICULTY_EMPTY_CELLS[difficulty];

  if (emptyCount == null) {
    throw new Error(`Invalid difficulty: ${difficulty}`);
  }

  const board = [...solution]; // Clone solution
  const indices = shuffle([...Array(81).keys()]);

  let removed = 0;
  for (const index of indices) {
    if (removed >= emptyCount) break;
    if (board[index] !== 0) {
      board[index] = 0;
      removed++;
    }
  }

  console.log(`Generated ${difficulty} puzzle with ${removed} empty cells`);

  return { board, solution };
}

// ============================================================================
// VALIDATION
// ============================================================================

function isValidSudokuBoard(flatGrid: number[]): boolean {
  if (!Array.isArray(flatGrid) || flatGrid.length !== 81) {
    return false;
  }

  // Convert 1D → 2D
  const grid: number[][] = [];
  for (let i = 0; i < SIZE; i++) {
    grid.push(flatGrid.slice(i * SIZE, i * SIZE + SIZE));
  }

  const isValidGroup = (nums: number[]): boolean => {
    const set = new Set(nums);
    return (
      set.size === 9 &&
      [...set].every((n) => Number.isInteger(n) && n >= 1 && n <= 9)
    );
  };

  // Validate rows
  for (let r = 0; r < SIZE; r++) {
    if (!isValidGroup(grid[r])) return false;
  }

  // Validate columns
  for (let c = 0; c < SIZE; c++) {
    const column: number[] = [];
    for (let r = 0; r < SIZE; r++) {
      column.push(grid[r][c]);
    }
    if (!isValidGroup(column)) return false;
  }

  // Validate 3x3 subgrids
  for (let row = 0; row < SIZE; row += 3) {
    for (let col = 0; col < SIZE; col += 3) {
      const box: number[] = [];
      for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
          box.push(grid[row + r][col + c]);
        }
      }
      if (!isValidGroup(box)) return false;
    }
  }

  return true;
}

// ============================================================================
// PUBLIC API
// ============================================================================

export function generateSudoku(difficulty: Difficulty): SudokuBoard {
  console.log(`Generating ${difficulty} Sudoku puzzle...`);

  const solution = generateSudokuFlat();

  if (!isValidSudokuBoard(solution)) {
    throw new Error('Generated solution is invalid');
  }

  const { board, solution: validatedSolution } = createPuzzleFromSolution(
    solution,
    difficulty
  );

  return { board, solution: validatedSolution };
}

// ============================================================================
// SOLVER (Backtracking with MRV Heuristic)
// ============================================================================

export function solveSudoku(board: number[]): number[] {
  console.log('Solving puzzle...');

  // First check if the input board is valid
  if (validateSudoku(board).length > 0) {
    console.log('Cannot solve - invalid initial board');
    return [];
  }

  const solution = [...board];
  let steps = 0;
  const MAX_STEPS = 50000;

  // Find empty cell with minimum possibilities (MRV heuristic)
  function findBestEmptyCell(): number {
    let bestCell = -1;
    let minPossibilities = 10;

    for (let i = 0; i < 81; i++) {
      if (solution[i] === 0) {
        let possibilities = 0;
        for (let num = 1; num <= 9; num++) {
          if (isValidMove(solution, i, num)) {
            possibilities++;
          }
        }
        if (possibilities < minPossibilities) {
          minPossibilities = possibilities;
          bestCell = i;
        }
        if (possibilities === 0) return i; // No possibilities, return early
      }
    }
    return bestCell;
  }

  function solve(): boolean {
    steps++;
    if (steps > MAX_STEPS) {
      console.log('Solver timeout');
      return false;
    }

    const emptyCell = findBestEmptyCell();
    if (emptyCell === -1) return true; // All cells filled

    for (let num = 1; num <= 9; num++) {
      if (isValidMove(solution, emptyCell, num)) {
        solution[emptyCell] = num;
        if (solve()) return true;
        solution[emptyCell] = 0;
      }
    }
    return false;
  }

  const success = solve();
  if (success) {
    console.log(`Puzzle solved in ${steps} steps`);
  } else {
    console.log('Could not solve puzzle');
    return [];
  }

  return solution;
}

// ============================================================================
// VALIDATION & UTILITY FUNCTIONS
// ============================================================================

export function validateSudoku(board: number[]): number[] {
  const errorSet = new Set<number>();

  for (let i = 0; i < 81; i++) {
    const num = board[i];
    if (num === 0) continue;

    if (num < 1 || num > 9) {
      errorSet.add(i);
      continue;
    }

    const row = Math.floor(i / 9);
    const col = i % 9;

    // Check row conflicts
    for (let j = 0; j < 9; j++) {
      const cellIndex = row * 9 + j;
      if (cellIndex !== i && board[cellIndex] === num) {
        errorSet.add(i);
        errorSet.add(cellIndex);
      }
    }

    // Check column conflicts
    for (let j = 0; j < 9; j++) {
      const cellIndex = j * 9 + col;
      if (cellIndex !== i && board[cellIndex] === num) {
        errorSet.add(i);
        errorSet.add(cellIndex);
      }
    }

    // Check 3x3 box conflicts
    const boxRow = Math.floor(row / 3) * 3;
    const boxCol = Math.floor(col / 3) * 3;
    for (let r = boxRow; r < boxRow + 3; r++) {
      for (let c = boxCol; c < boxCol + 3; c++) {
        const cellIndex = r * 9 + c;
        if (cellIndex !== i && board[cellIndex] === num) {
          errorSet.add(i);
          errorSet.add(cellIndex);
        }
      }
    }
  }

  return Array.from(errorSet);
}

export function isValidMove(
  board: number[],
  index: number,
  num: number
): boolean {
  if (num < 1 || num > 9) return false;
  if (index < 0 || index >= 81) return false;

  const row = Math.floor(index / 9);
  const col = index % 9;
  const value = board[index];

  if (value !== 0 && value !== null) {
    return false; // Cell is already filled
  }

  // Check row
  for (let i = 0; i < 9; i++) {
    if (board[row * 9 + i] === num) return false;
  }

  // Check column
  for (let i = 0; i < 9; i++) {
    if (board[i * 9 + col] === num) return false;
  }

  // Check 3x3 box
  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;
  for (let i = boxRow; i < boxRow + 3; i++) {
    for (let j = boxCol; j < boxCol + 3; j++) {
      if (board[i * 9 + j] === num) return false;
    }
  }

  return true;
}

export function analyzeDifficulty(board: number[]): {
  difficulty: Difficulty;
  emptyCount: number;
  constraintScore: number;
} {
  const emptyCount = board.filter((cell) => cell === 0).length;
  let constraintScore = 0;

  for (let i = 0; i < 81; i++) {
    if (board[i] === 0) {
      let possibilities = 0;
      for (let num = 1; num <= 9; num++) {
        if (isValidMove(board, i, num)) {
          possibilities++;
        }
      }
      constraintScore += possibilities;
    }
  }

  let difficulty: Difficulty = 'easy';
  if (emptyCount > 45 || constraintScore > 200) {
    difficulty = 'hard';
  } else if (emptyCount > 35 || constraintScore > 150) {
    difficulty = 'medium';
  }

  return { difficulty, emptyCount, constraintScore };
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

export function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds
    .toString()
    .padStart(2, '0')}`;
}

export function getRowCol(index: number): { row: number; col: number } {
  return {
    row: Math.floor(index / 9),
    col: index % 9,
  };
}

export function getBoxIndex(index: number): number {
  const row = Math.floor(index / 9);
  const col = index % 9;
  return Math.floor(row / 3) * 3 + Math.floor(col / 3);
}

export function isRelated(index1: number, index2: number): boolean {
  const { row: row1, col: col1 } = getRowCol(index1);
  const { row: row2, col: col2 } = getRowCol(index2);

  if (row1 === row2 || col1 === col2) return true;
  return getBoxIndex(index1) === getBoxIndex(index2);
}
