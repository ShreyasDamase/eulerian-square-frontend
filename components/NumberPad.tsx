import { View, TouchableOpacity, Text, StyleSheet, Dimensions } from 'react-native';
import { NumberPadProps } from '@/types/sudoku';
import { Trash2 } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useSound } from '@/contexts/SoundContext';

const { width } = Dimensions.get('window');
const buttonSize = (width - 80) / 5;

export function NumberPad({ onNumberPress, onClearPress, disabled }: NumberPadProps) {
  const { colors } = useTheme();
  const { playSound } = useSound();
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  const handleNumberPress = (number: number) => {
    playSound('tap');
    onNumberPress(number);
  };

  const handleClearPress = () => {
    playSound('tap');
    onClearPress();
  };

  return (
    <View style={styles.container}>
      <View style={styles.numbersRow}>
        {numbers.slice(0, 5).map((number) => (
          <TouchableOpacity
            key={number}
            style={[
              styles.numberButton, 
              { backgroundColor: colors.surface, borderColor: colors.border },
              disabled && styles.disabled
            ]}
            onPress={() => handleNumberPress(number)}
            disabled={disabled}
          >
            <Text style={[
              styles.numberText, 
              { color: colors.text },
              disabled && { color: colors.textSecondary }
            ]}>
              {number}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      
      <View style={styles.numbersRow}>
        {numbers.slice(5).map((number) => (
          <TouchableOpacity
            key={number}
            style={[
              styles.numberButton, 
              { backgroundColor: colors.surface, borderColor: colors.border },
              disabled && styles.disabled
            ]}
            onPress={() => handleNumberPress(number)}
            disabled={disabled}
          >
            <Text style={[
              styles.numberText, 
              { color: colors.text },
              disabled && { color: colors.textSecondary }
            ]}>
              {number}
            </Text>
          </TouchableOpacity>
        ))}
        
        <TouchableOpacity
          style={[
            styles.clearButton, 
            { backgroundColor: colors.surface, borderColor: colors.error + '40' },
            disabled && styles.disabled
          ]}
          onPress={handleClearPress}
          disabled={disabled}
        >
          <Trash2 size={24} color={disabled ? colors.textSecondary : colors.error} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  numbersRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
  },
  numberButton: {
    width: buttonSize,
    height: buttonSize,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 2,
  },
  numberText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  clearButton: {
    width: buttonSize,
    height: buttonSize,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 2,
  },
  disabled: {
    opacity: 0.5,
  },
});