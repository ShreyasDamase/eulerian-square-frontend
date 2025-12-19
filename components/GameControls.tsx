// ============================================================================
// GameControls.tsx - Modern Control Bar
// ============================================================================
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { GameControlsProps } from '@/types/sudoku';
import { RotateCcw, Lightbulb, CheckCircle, Plus } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { S, R, getWidth } from '@/utils/responsive';

export function GameControls({
  onNewGame,
  onReset,
  onHint,
  onCheck,
  hints,
  disabled,
}: GameControlsProps) {
  const { colors } = useTheme();

  const controls = [
    {
      icon: Plus,
      label: 'New',
      onPress: onNewGame,
      color: colors.primary,
      bgColor: colors.primary,
      textColor: '#FFFFFF',
      disabled: disabled,
    },
    {
      icon: RotateCcw,
      label: 'Reset',
      onPress: onReset,
      color: '#DC2626',
      bgColor: colors.surface,
      textColor: '#DC2626',
      disabled: disabled,
    },
    {
      icon: Lightbulb,
      label: `Hint (${hints})`,
      onPress: onHint,
      color: '#F59E0B',
      bgColor: colors.surface,
      textColor: '#F59E0B',
      disabled: disabled || hints === 0,
    },
    {
      icon: CheckCircle,
      label: 'Check',
      onPress: onCheck,
      color: '#10B981',
      bgColor: colors.surface,
      textColor: '#10B981',
      disabled: disabled,
    },
  ];

  return (
    <View style={styles.container}>
      {controls.map((control, index) => {
        const Icon = control.icon;
        const isDisabled = control.disabled;

        return (
          <TouchableOpacity
            key={index}
            style={[
              styles.button,
              {
                backgroundColor: control.bgColor,
                borderColor: control.color + '30',
              },
              index === 0 && styles.primaryButton,
              isDisabled && styles.disabledButton,
            ]}
            onPress={control.onPress}
            disabled={isDisabled}
            activeOpacity={0.7}
          >
            <Icon
              size={getWidth(18)}
              color={
                isDisabled
                  ? colors.textSecondary
                  : index === 0
                  ? '#FFFFFF'
                  : control.color
              }
            />
            <Text
              style={[
                styles.buttonText,
                {
                  color: isDisabled
                    ? colors.textSecondary
                    : index === 0
                    ? '#FFFFFF'
                    : control.textColor,
                },
              ]}
            >
              {control.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: S.md,
    paddingVertical: S.md,
    gap: S.sm,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: S.smPlus,
    paddingHorizontal: S.xs,
    borderRadius: R.md,
    borderWidth: 1.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  primaryButton: {
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    fontSize: getWidth(12),
    fontWeight: '700',
    marginLeft: S.xs,
  },
  disabledButton: {
    opacity: 0.4,
  },
});
