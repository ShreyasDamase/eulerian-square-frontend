// ============================================================================
// SudokuCell.tsx - Enhanced Cell Component
// ============================================================================
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import { CellProps } from '@/types/sudoku';
import { useTheme } from '@/contexts/ThemeContext';
import { getWidth } from '@/utils/responsive';

interface EnhancedCellProps extends CellProps {
  gridSize: number;
}

export function SudokuCell({
  value,
  index,
  isSelected,
  isOriginal,
  hasError,
  isPaused,
  onPress,
  gridSize,
}: EnhancedCellProps) {
  const { colors } = useTheme();
  const row = Math.floor(index / 9);
  const col = index % 9;
  const cellSize = (gridSize - 6) / 9; // Account for border

  const getBorderStyle = (): ViewStyle => {
    const borderStyle: ViewStyle = {
      borderWidth: 0.5,
      borderColor: colors.border + '40',
    };

    // Bold borders for 3x3 boxes
    if (row % 3 === 0 && row !== 0) borderStyle.borderTopWidth = 2;
    if (col % 3 === 0 && col !== 0) borderStyle.borderLeftWidth = 2;

    return borderStyle;
  };

  const getBackgroundColor = () => {
    if (isPaused) return colors.surface;
    if (hasError) return '#FEE2E2'; // Light red
    if (isSelected) return colors.primary + '15';

    // Subtle alternating box pattern (LinkedIn style)
    const boxRow = Math.floor(row / 3);
    const boxCol = Math.floor(col / 3);
    const isAlternate = (boxRow + boxCol) % 2 === 0;

    if (isOriginal) {
      return isAlternate ? colors.background : colors.surface + '30';
    }
    return isAlternate ? colors.surface + '50' : colors.background;
  };

  const getTextColor = () => {
    if (isPaused) return colors.textSecondary;
    if (hasError) return '#DC2626'; // Red-600
    if (isOriginal) return colors.text;
    return colors.primary;
  };

  return (
    <TouchableOpacity
      style={[
        styles.cell,
        {
          width: cellSize,
          height: cellSize,
          backgroundColor: getBackgroundColor(),
        },
        getBorderStyle(),
        isSelected && {
          backgroundColor: colors.primary + '20',
          borderWidth: 2,
          borderColor: colors.primary,
        },
      ]}
      onPress={() => onPress(index)}
      disabled={isPaused || isOriginal}
      activeOpacity={0.6}
    >
      <Text
        style={[
          styles.cellText,
          {
            color: getTextColor(),
            fontSize: cellSize * 0.55,
          },
          isOriginal && styles.originalText,
        ]}
      >
        {isPaused ? '' : value || ''}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cell: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  cellText: {
    fontWeight: '600',
    textAlign: 'center',
  },
  originalText: {
    fontWeight: '800',
  },
});
