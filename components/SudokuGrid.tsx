// ============================================================================
// SudokuGrid.tsx - Optimized Professional Grid
// ============================================================================
import { View, StyleSheet, Dimensions } from 'react-native';
import { SudokuCell } from './SudokuCell';
import { SudokuGridProps } from '@/types/sudoku';
import { useTheme } from '@/contexts/ThemeContext';
import { S, R, getWidth } from '@/utils/responsive';

const { width } = Dimensions.get('window');
const gridSize = Math.min(width - getWidth(32), getWidth(400));

export function SudokuGrid({
  board,
  originalBoard,
  selectedCell,
  errors,
  isPaused,
  onCellPress,
}: SudokuGridProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.grid,
          {
            backgroundColor: colors.background,
            width: gridSize,
            height: gridSize,
            borderColor: colors.border,
          },
        ]}
      >
        {board.map((value, index) => (
          <SudokuCell
            key={index}
            value={value}
            index={index}
            isSelected={selectedCell === index}
            isOriginal={originalBoard[index] !== 0}
            hasError={errors.includes(index)}
            isPaused={isPaused}
            onPress={onCellPress}
            gridSize={gridSize}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: S.md,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderRadius: R.md,
    borderWidth: 3,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
});
