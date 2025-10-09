import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { GameControlsProps } from '@/types/sudoku';
import { RotateCcw, Lightbulb, CircleCheck as CheckCircle, Plus } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';

export function GameControls({ 
  onNewGame, 
  onReset, 
  onHint, 
  onCheck, 
  hints, 
  disabled 
}: GameControlsProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.controlButton, 
          { backgroundColor: colors.primary, borderColor: colors.primary },
          disabled && styles.disabled
        ]}
        onPress={onNewGame}
        disabled={disabled}
      >
        <Plus size={20} color="#FFFFFF" />
        <Text style={[styles.buttonText, { color: '#FFFFFF' }]}>New Game</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.controlButton, 
          { backgroundColor: colors.surface, borderColor: colors.error + '40' },
          disabled && styles.disabled
        ]}
        onPress={onReset}
        disabled={disabled}
      >
        <RotateCcw size={20} color={colors.error} />
        <Text style={[styles.buttonText, { color: colors.error }]}>Reset</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.controlButton, 
          { backgroundColor: colors.surface, borderColor: colors.warning + '40' },
          (disabled || hints === 0) && styles.disabled
        ]}
        onPress={onHint}
        disabled={disabled || hints === 0}
      >
        <Lightbulb size={20} color={hints > 0 ? colors.warning : colors.textSecondary} />
        <Text style={[styles.buttonText, { color: hints > 0 ? colors.warning : colors.textSecondary }]}>
          Hint ({hints})
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.controlButton, 
          { backgroundColor: colors.surface, borderColor: colors.success + '40' },
          disabled && styles.disabled
        ]}
        onPress={onCheck}
        disabled={disabled}
      >
        <CheckCircle size={20} color={colors.success} />
        <Text style={[styles.buttonText, { color: colors.success }]}>Check</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 20,
    flexWrap: 'wrap',
    gap: 10,
  },
  controlButton: {
    flex: 1,
    minWidth: 80,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 2,
  },
  buttonText: {
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  disabled: {
    opacity: 0.5,
  },
});