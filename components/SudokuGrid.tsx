import { View, StyleSheet, Dimensions } from 'react-native';
import { SudokuCell } from './SudokuCell';
import { SudokuGridProps } from '@/types/sudoku';
import { useTheme } from '@/contexts/ThemeContext';

const { width } = Dimensions.get('window');
const gridSize = Math.min(width - 40, 400);
const cellSize = gridSize / 9;

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
      <View style={[styles.grid, { backgroundColor: colors.border }]}>
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
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 20,
  },
  grid: {
    width: gridSize,
    height: gridSize,
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderRadius: 8,
    padding: 2,
  },
});
