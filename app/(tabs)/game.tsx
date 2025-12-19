import {
  View,
  Text,
  StyleSheet,
  Dimensions,
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
import { generateSudoku, validateSudoku } from '@/utils/sudokuLogic';
import { useTheme } from '@/contexts/ThemeContext';
import { useSound } from '@/contexts/SoundContext';
import { useOrientation } from '@/hooks/useWindowDimensions';
import { useSudokuStore } from '@/utils/useSudokuStore';

const TIMER_INTERVAL = 1000;

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
  const difficulty = useSudokuStore((state) => state.difficulty);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const gameStartTimeRef = useRef<number>(0);
  const mountedRef = useRef<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);
  const [gameStats, setGameStats] = useState<GameStats>({
    gamesPlayed: 0,
    gamesWon: 0,
    bestTime: 0,
    averageTime: 0,
  });

  // Zustand store
  const {
    board,
    originalBoard,
    selectedCell,
    errors,
    timeSpent,
    hintsLeft,
    isPaused,
    puzzleId,
    hydrate,
    persist,
    setCell,
    clearCell,
    pause,
    resume,
    reset,
    initialize,
    selectCell: storeSelectCell,
    useHint: storeUseHint,
    updateErrors,
    setTime,
  } = useSudokuStore();

  // Computed values
  const isCompleted = useMemo(
    () => board.every((cell) => cell !== 0) && errors.length === 0,
    [board, errors]
  );

  const isGameActive = useMemo(
    () => !isPaused && !isCompleted,
    [isPaused, isCompleted]
  );

  const canUseHint = useMemo(
    () => hintsLeft > 0 && selectedCell !== null && !isPaused,
    [hintsLeft, selectedCell, isPaused]
  );

  const progressPercentage = useMemo(() => {
    const filledCells = board.filter((cell) => cell !== 0).length;
    return (filledCells / 81) * 100;
  }, [board]);

  // Timer functions
  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (!isGameActive) return;

    gameStartTimeRef.current = Date.now() - timeSpent * 1000;
    const newTimer = setInterval(() => {
      if (!mountedRef.current) return;
      const newTime = Math.floor(
        (Date.now() - gameStartTimeRef.current) / 1000
      );
      setTime(newTime);
    }, TIMER_INTERVAL);

    timerRef.current = newTimer;
  }, [isGameActive, timeSpent, setTime]);

  const pauseTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // Game logic functions
  const startNewGame = useCallback(async () => {
    if (!mountedRef.current) return;
    playSound('tap');
    setIsLoading(true);

    try {
      console.log('🧪 Generating puzzle...');
      const puzzle = await generateSudoku(difficulty);
      console.log('✅ Puzzle generated');

      if (!mountedRef.current) return;

      // Initialize store with new puzzle
      initialize(puzzle, difficulty);
      console.log('✅ Game initialized');
    } catch (err) {
      console.error('❌ Error during startNewGame:', err);
      Alert.alert('Error', 'Something went wrong while starting a new game.');
    } finally {
      setIsLoading(false);
    }
  }, [difficulty, playSound, initialize]);

  const togglePause = useCallback(() => {
    playSound('tap');
    if (isPaused) {
      resume();
      startTimer();
    } else {
      pause();
      pauseTimer();
    }
  }, [isPaused, pause, resume, startTimer, pauseTimer, playSound]);

  const selectCell = useCallback(
    (index: number) => {
      if (originalBoard[index] === 0 && !isPaused) {
        playSound('tap');
        storeSelectCell(index);
      }
    },
    [originalBoard, isPaused, playSound, storeSelectCell]
  );

  const updateCell = useCallback(
    (value: number) => {
      if (selectedCell === null || originalBoard[selectedCell] !== 0) {
        return;
      }

      const newBoard = [...board];
      newBoard[selectedCell] = value;

      const newErrors = validateSudoku(newBoard);
      const completed =
        newBoard.every((cell) => cell !== 0) && newErrors.length === 0;

      // Update cell in store
      setCell(selectedCell, value);
      updateErrors(newErrors);

      if (completed) {
        playSound('success');
        vibrate('medium');
        pauseTimer();

        // Update stats
        setGameStats((prev) => ({
          ...prev,
          gamesPlayed: prev.gamesPlayed + 1,
          gamesWon: prev.gamesWon + 1,
          bestTime:
            prev.bestTime === 0
              ? timeSpent
              : Math.min(prev.bestTime, timeSpent),
          averageTime: Math.round(
            (prev.averageTime * prev.gamesWon + timeSpent) / (prev.gamesWon + 1)
          ),
        }));

        setTimeout(() => {
          if (!mountedRef.current) return;
          Alert.alert(
            'Congratulations!',
            `You solved the puzzle in ${Math.floor(timeSpent / 60)}:${(
              timeSpent % 60
            )
              .toString()
              .padStart(2, '0')}!`,
            [
              { text: 'New Game', onPress: startNewGame },
              { text: 'Home', onPress: () => router.push('/') },
            ]
          );
        }, 100);
      } else if (newErrors.length > 0) {
        playSound('error');
        vibrate('light');
      } else {
        playSound('tap');
      }
    },
    [
      selectedCell,
      originalBoard,
      board,
      timeSpent,
      pauseTimer,
      startNewGame,
      router,
      playSound,
      vibrate,
      setCell,
      updateErrors,
    ]
  );

  const handleClearCell = useCallback(() => {
    playSound('tap');
    if (selectedCell !== null) {
      clearCell(selectedCell);
      updateErrors(
        validateSudoku([...board].map((v, i) => (i === selectedCell ? 0 : v)))
      );
    }
  }, [selectedCell, clearCell, board, updateErrors, playSound]);

  const useHint = useCallback(() => {
    if (!canUseHint || selectedCell === null) return;

    const hintUsed = storeUseHint();

    if (hintUsed) {
      playSound('success');
      vibrate('light');

      // Recalculate errors after hint
      const newErrors = validateSudoku(useSudokuStore.getState().board);
      updateErrors(newErrors);
    } else {
      playSound('error');
      Alert.alert('Hint', 'Cannot use hint on this cell');
    }
  }, [
    canUseHint,
    selectedCell,
    storeUseHint,
    playSound,
    vibrate,
    updateErrors,
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
    const currentErrors = validateSudoku(board);
    updateErrors(currentErrors);

    if (currentErrors.length === 0) {
      playSound('success');
      Alert.alert('Great!', 'Your solution is correct so far!');
    } else {
      playSound('error');
      Alert.alert(
        'Oops!',
        `There are ${currentErrors.length} error(s) in your solution.`
      );
    }
  }, [board, playSound, updateErrors]);

  // Handle back button
  const handleBackPress = useCallback(() => {
    if (isGameActive) {
      Alert.alert(
        'Exit Game',
        'Your progress will be saved. Are you sure you want to exit?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Exit',
            onPress: () => {
              persist();
              router.push('/');
            },
          },
        ]
      );
      return true;
    }
    return false;
  }, [isGameActive, router, persist]);

  // Auto-save periodically
  useEffect(() => {
    if (!isCompleted && !isPaused && puzzleId) {
      const autoSaveInterval = setInterval(() => {
        persist();
      }, 30000); // Save every 30 seconds

      return () => clearInterval(autoSaveInterval);
    }
  }, [isCompleted, isPaused, puzzleId, persist]);

  // Initialize game
  useEffect(() => {
    mountedRef.current = true;

    const initializeGame = async () => {
      // Try to hydrate saved state
      hydrate();

      // Check if we have a valid saved game for this difficulty
      const store = useSudokuStore.getState();
      if (
        store.puzzleId &&
        store.difficulty === difficulty &&
        store.board.some((v) => v !== 0)
      ) {
        console.log('✅ Loaded saved game');
        setIsLoading(false);
      } else {
        console.log('🆕 Starting new game');
        await startNewGame();
      }
    };

    initializeGame();

    return () => {
      mountedRef.current = false;
    };
  }, [difficulty, hydrate, startNewGame]);

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
        pause();
        persist();
      }
    };
  }, [isGameActive, pause, persist]);

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
        time={timeSpent}
        difficulty={difficulty}
        hints={hintsLeft}
        isPaused={isPaused}
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
          board={board}
          originalBoard={originalBoard}
          selectedCell={selectedCell ?? -1}
          errors={errors}
          isPaused={isPaused}
          onCellPress={selectCell}
        />

        <NumberPad
          onNumberPress={updateCell}
          onClearPress={handleClearCell}
          disabled={isPaused}
          selectedValue={selectedCell !== null ? board[selectedCell] : 0}
        />

        <GameControls
          onNewGame={startNewGame}
          onReset={resetGame}
          onHint={useHint}
          onCheck={checkSolution}
          hints={hintsLeft}
          disabled={isPaused}
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
