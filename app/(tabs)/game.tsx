import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Alert,
  BackHandler,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { SudokuGrid } from '@/components/SudokuGrid';
import { NumberPad } from '@/components/NumberPad';
import { GameHeader } from '@/components/GameHeader';
import { GameControls } from '@/components/GameControls';
import {
  generateSudoku,
  validateSudoku,
  solveSudoku,
} from '@/utils/sudokuLogic';
import { SudokuBoard, GameState } from '@/types/sudoku';
import { useTheme } from '@/contexts/ThemeContext';
import { useSound } from '@/contexts/SoundContext';
import {
  Pause,
  Play,
  RotateCcw,
  Lightbulb,
  CircleCheck as CheckCircle,
} from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useOrientation } from '@/hooks/useWindowDimensions';

const { width } = Dimensions.get('window');

// Constants
const TIMER_INTERVAL = 1000;
const GAME_STORAGE_KEY = 'sudoku_game_state';
const INITIAL_HINTS = 3;

interface GameStats {
  gamesPlayed: number;
  gamesWon: number;
  bestTime: number;
  averageTime: number;
}

export default function GameScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const { isLandscape } = useOrientation();
  const { colors } = useTheme();
  const { playSound, vibrate } = useSound();
  const difficulty = (params.difficulty as string) || 'medium';
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const gameStartTimeRef = useRef<number>(0);
  const mountedRef = useRef<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);
  const [gameStats, setGameStats] = useState<GameStats>({
    gamesPlayed: 0,
    gamesWon: 0,
    bestTime: 0,
    averageTime: 0,
  });

  const [gameState, setGameState] = useState<GameState>({
    board: Array(81).fill(0),
    originalBoard: Array(81).fill(0),
    solution: Array(81).fill(0),
    selectedCell: -1,
    isCompleted: false,
    isPaused: false,
    errors: [],
    hints: INITIAL_HINTS,
    time: 0,
  });

  // Memoized computed values
  const isGameActive = useMemo(
    () => !gameState.isPaused && !gameState.isCompleted,
    [gameState.isPaused, gameState.isCompleted]
  );

  const canUseHint = useMemo(
    () =>
      gameState.hints > 0 &&
      gameState.selectedCell !== -1 &&
      !gameState.isPaused,
    [gameState.hints, gameState.selectedCell, gameState.isPaused]
  );

  const progressPercentage = useMemo(() => {
    const filledCells = gameState.board.filter((cell) => cell !== 0).length;
    const totalCells = 81;
    return (filledCells / totalCells) * 100;
  }, [gameState.board]);

  // Storage functions
  const saveGameState = useCallback(
    async (state: GameState) => {
      if (!mountedRef.current) return;
      try {
        await AsyncStorage.setItem(
          GAME_STORAGE_KEY,
          JSON.stringify({
            ...state,
            difficulty,
            savedAt: Date.now(),
          })
        );
      } catch (error) {
        console.warn('Failed to save game state:', error);
      }
    },
    [difficulty]
  );

  const loadGameState = useCallback(async () => {
    if (!mountedRef.current) return false;
    try {
      const savedState = await AsyncStorage.getItem(GAME_STORAGE_KEY);
      if (savedState) {
        const parsed = JSON.parse(savedState);
        if (parsed.difficulty === difficulty) {
          setGameState(parsed);
          return true;
        }
      }
    } catch (error) {
      console.warn('Failed to load game state:', error);
    }
    return false;
  }, [difficulty]);

  const clearSavedGame = useCallback(async () => {
    try {
      await AsyncStorage.removeItem(GAME_STORAGE_KEY);
    } catch (error) {
      console.warn('Failed to clear saved game:', error);
    }
  }, []);

  // Timer functions
  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (!isGameActive) return;

    gameStartTimeRef.current = Date.now() - gameState.time * 1000;
    const newTimer = setInterval(() => {
      setGameState((prev) => {
        if (prev.isPaused || prev.isCompleted) return prev;
        const newTime = Math.floor(
          (Date.now() - gameStartTimeRef.current) / 1000
        );
        return { ...prev, time: newTime };
      });
    }, TIMER_INTERVAL);
    timerRef.current = newTimer;
  }, [isGameActive, gameState.time]);

  const pauseTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // Game logic functions
  const startNewGame = useCallback(() => {
    if (!mountedRef.current) return;
    playSound('tap');
    setIsLoading(true);

    setTimeout(async () => {
      if (!mountedRef.current) return;

      try {
        console.log('🧪 Generating puzzle...');
        const puzzle = await generateSudoku(difficulty);
        console.log('✅ Puzzle generated:', puzzle);

        const newState: GameState = {
          board: [...puzzle.board],
          originalBoard: [...puzzle.board],
          solution: [...puzzle.solution],
          selectedCell: -1,
          isCompleted: false,
          isPaused: false,
          errors: [],
          hints: INITIAL_HINTS,
          time: 0,
        };
        console.log('🧱 New state prepared:', newState);

        console.log('🧹 Clearing saved game...');
        await clearSavedGame();
        console.log('✅ Saved game cleared.');

        if (!mountedRef.current) return;
        setGameState(newState);
        console.log('✅ Game state updated.');
      } catch (err) {
        console.error('❌ Error during startNewGame:', err);
        Alert.alert('Error', 'Something went wrong while starting a new game.');
      } finally {
        setIsLoading(false);
      }
    }, 100);
  }, [difficulty, playSound, clearSavedGame]);

  const togglePause = useCallback(() => {
    playSound('tap');
    setGameState((prev) => {
      const newState = { ...prev, isPaused: !prev.isPaused };
      if (newState.isPaused) {
        pauseTimer();
      } else {
        startTimer();
      }
      return newState;
    });
  }, [startTimer, pauseTimer, playSound]);

  const selectCell = useCallback(
    (index: number) => {
      if (gameState.originalBoard[index] === 0 && !gameState.isPaused) {
        playSound('tap');
        setGameState((prev) => ({ ...prev, selectedCell: index }));
      }
    },
    [gameState.originalBoard, gameState.isPaused, playSound]
  );

  const updateCell = useCallback(
    (value: number) => {
      if (
        gameState.selectedCell === -1 ||
        gameState.originalBoard[gameState.selectedCell] !== 0
      ) {
        return;
      }

      const newBoard = [...gameState.board];
      newBoard[gameState.selectedCell] = value;

      const errors = validateSudoku(newBoard);
      const isCompleted =
        newBoard.every((cell) => cell !== 0) && errors.length === 0;

      if (isCompleted) {
        playSound('success');
        vibrate('medium');
        pauseTimer();
        clearSavedGame();

        // Update stats
        setGameStats((prev) => ({
          ...prev,
          gamesPlayed: prev.gamesPlayed + 1,
          gamesWon: prev.gamesWon + 1,
          bestTime:
            prev.bestTime === 0
              ? gameState.time
              : Math.min(prev.bestTime, gameState.time),
          averageTime: Math.round(
            (prev.averageTime * prev.gamesWon + gameState.time) /
              (prev.gamesWon + 1)
          ),
        }));

        setTimeout(() => {
          if (!mountedRef.current) return;
          Alert.alert(
            'Congratulations!',
            `You solved the puzzle in ${Math.floor(gameState.time / 60)}:${(
              gameState.time % 60
            )
              .toString()
              .padStart(2, '0')}!`,
            [
              { text: 'New Game', onPress: startNewGame },
              { text: 'Home', onPress: () => router.push('/') },
            ]
          );
        }, 100);
      } else if (errors.length > 0) {
        playSound('error');
        vibrate('light');
      } else {
        playSound('tap');
      }

      const newState = {
        ...gameState,
        board: newBoard,
        errors,
        isCompleted,
        selectedCell: value === 0 ? gameState.selectedCell : -1,
      };

      setGameState(newState);
      if (!isCompleted) {
        saveGameState(newState);
      }
    },
    [
      gameState,
      pauseTimer,
      startNewGame,
      router,
      playSound,
      vibrate,
      clearSavedGame,
      saveGameState,
    ]
  );

  const clearCell = useCallback(() => {
    playSound('tap');
    updateCell(0);
  }, [updateCell, playSound]);

  const useHint = useCallback(() => {
    if (!canUseHint) return;

    const correctValue = gameState.solution[gameState.selectedCell];
    if (
      correctValue &&
      gameState.board[gameState.selectedCell] !== correctValue
    ) {
      playSound('tap');
      updateCell(correctValue);
      setGameState((prev) => ({ ...prev, hints: prev.hints - 1 }));
    }
  }, [
    canUseHint,
    gameState.selectedCell,
    gameState.solution,
    gameState.board,
    updateCell,
    playSound,
  ]);

  const resetGame = useCallback(() => {
    playSound('tap');
    Alert.alert('Reset Game', 'Are you sure you want to start over?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Reset', onPress: startNewGame },
    ]);
  }, [startNewGame, playSound]);

  const checkSolution = useCallback(() => {
    playSound('tap');
    const errors = validateSudoku(gameState.board);
    if (errors.length === 0) {
      playSound('success');
      Alert.alert('Great!', 'Your solution is correct so far!');
    } else {
      playSound('error');
      Alert.alert(
        'Oops!',
        `There are ${errors.length} error(s) in your solution.`
      );
    }
  }, [gameState.board, playSound]);

  // Handle back button
  const handleBackPress = useCallback(() => {
    if (isGameActive) {
      Alert.alert(
        'Exit Game',
        'Your progress will be saved. Are you sure you want to exit?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Exit', onPress: () => router.push('/') },
        ]
      );
      return true;
    }
    return false;
  }, [isGameActive, router]);

  // Auto-save game state periodically
  useEffect(() => {
    if (!gameState.isCompleted && !gameState.isPaused) {
      const autoSaveInterval = setInterval(() => {
        saveGameState(gameState);
      }, 30000); // Save every 30 seconds

      return () => clearInterval(autoSaveInterval);
    }
  }, [gameState, saveGameState]);

  // Initialize game
  useEffect(() => {
    mountedRef.current = true;
    const initializeGame = async () => {
      const hasLoadedGame = await loadGameState();
      if (!hasLoadedGame) {
        startNewGame();
      } else {
        if (!mountedRef.current) return;
        setIsLoading(false);
      }
    };

    initializeGame();

    return () => {
      mountedRef.current = false;
    };
  }, [loadGameState, startNewGame]);

  // Handle timer
  useEffect(() => {
    if (isGameActive) {
      startTimer();
    } else {
      pauseTimer();
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isGameActive, startTimer, pauseTimer]);

  // Handle back button
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      handleBackPress
    );
    return () => backHandler.remove();
  }, [handleBackPress]);

  // Auto-pause when app goes to background
  useEffect(() => {
    return () => {
      if (isGameActive) {
        setGameState((prev) => ({ ...prev, isPaused: true }));
      }
    };
  }, [isGameActive]);

  if (isLoading) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: colors.text }]}>
            Generating puzzle...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <GameHeader
        time={gameState.time}
        difficulty={difficulty}
        hints={gameState.hints}
        isPaused={gameState.isPaused}
        onPause={togglePause}
        progress={progressPercentage}
      />

      <View
        style={[
          styles.gameContainer,
          { flexDirection: isLandscape ? 'row' : 'column' },
        ]}
      >
        <SudokuGrid
          board={gameState.board}
          originalBoard={gameState.originalBoard}
          selectedCell={gameState.selectedCell}
          errors={gameState.errors}
          isPaused={gameState.isPaused}
          onCellPress={selectCell}
        />

        <NumberPad
          onNumberPress={updateCell}
          onClearPress={clearCell}
          disabled={gameState.isPaused}
          selectedValue={
            gameState.selectedCell !== -1
              ? gameState.board[gameState.selectedCell]
              : 0
          }
        />

        <GameControls
          onNewGame={startNewGame}
          onReset={resetGame}
          onHint={useHint}
          onCheck={checkSolution}
          hints={gameState.hints}
          disabled={gameState.isPaused}
          canUseHint={canUseHint}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gameContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    fontWeight: '600',
  },
});
