import { TouchableOpacity, Text, StyleSheet, Dimensions } from 'react-native';
import { CellProps } from '@/types/sudoku';
import { useTheme } from '@/contexts/ThemeContext';

const { width } = Dimensions.get('window');
const gridSize = Math.min(width - 40, 400);
const cellSize = (gridSize - 8) / 9; // Account for grid borders

export function SudokuCell({ 
  value, 
  index, 
  isSelected, 
  isOriginal, 
  hasError, 
  isPaused, 
  onPress 
}: CellProps) {
  const { colors } = useTheme();
  const row = Math.floor(index / 9);
  const col = index % 9;
  
  const getBorderStyle = () => {
    const borderStyle: any = {
      borderWidth: 1,
      borderColor: colors.border,
    };
    
    // Thicker borders for 3x3 boxes
    if (row % 3 === 0) borderStyle.borderTopWidth = 2;
    if (col % 3 === 0) borderStyle.borderLeftWidth = 2;
    if (row % 3 === 2) borderStyle.borderBottomWidth = 2;
    if (col % 3 === 2) borderStyle.borderRightWidth = 2;
    
    return borderStyle;
  };

  const getBackgroundColor = () => {
    if (isPaused) return colors.border;
    if (hasError) return colors.error + '20';
    if (isSelected) return colors.primary + '20';
    if (isOriginal) return colors.background;
    return colors.surface;
  };

  const getTextColor = () => {
    if (isPaused) return colors.textSecondary;
    if (hasError) return colors.error;
    if (isOriginal) return colors.text;
    return colors.primary;
  };

  return (
    <TouchableOpacity
      style={[
        styles.cell,
        getBorderStyle(),
        { backgroundColor: getBackgroundColor() },
        isSelected && { shadowColor: colors.primary },
      ]}
      onPress={() => onPress(index)}
      disabled={isPaused}
    >
      <Text style={[
        styles.cellText,
        { color: getTextColor() },
        isOriginal && styles.originalText,
      ]}>
        {isPaused ? '?' : (value || '')}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cell: {
    width: cellSize,
    height: cellSize,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cellText: {
    fontSize: cellSize * 0.5,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  originalText: {
    fontWeight: '900',
  },
});