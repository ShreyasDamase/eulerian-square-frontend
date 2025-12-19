// ============================================================================
// GameHeader.tsx - Professional Header
// ============================================================================
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { GameHeaderProps } from '@/types/sudoku';
import { formatTime } from '@/utils/sudokuLogic';
import { Pause, Play, Clock, Lightbulb } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { S, R, getWidth } from '@/utils/responsive';

export function GameHeader({
  time,
  difficulty,
  hints,
  isPaused,
  onPause,
}: GameHeaderProps) {
  const { colors } = useTheme();

  const getDifficultyColor = () => {
    switch (difficulty) {
      case 'easy':
        return '#10B981';
      case 'medium':
        return '#F59E0B';
      case 'hard':
        return '#EF4444';
      default:
        return '#6B7280';
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.surface,
          borderBottomColor: colors.border,
        },
      ]}
    >
      <View style={styles.leftSection}>
        <View style={styles.statItem}>
          <Clock size={getWidth(18)} color={colors.textSecondary} />
          <Text style={[styles.statText, { color: colors.text }]}>
            {formatTime(time)}
          </Text>
        </View>

        <View style={[styles.badge, { backgroundColor: getDifficultyColor() }]}>
          <Text style={styles.badgeText}>{difficulty.toUpperCase()}</Text>
        </View>
      </View>

      <View style={styles.rightSection}>
        <View style={styles.statItem}>
          <Lightbulb size={getWidth(18)} color="#F59E0B" />
          <Text style={[styles.statText, { color: '#F59E0B' }]}>{hints}</Text>
        </View>

        <TouchableOpacity
          style={[styles.pauseButton, { backgroundColor: colors.primary }]}
          onPress={onPause}
          activeOpacity={0.8}
        >
          {isPaused ? (
            <Play size={getWidth(20)} color="#FFFFFF" fill="#FFFFFF" />
          ) : (
            <Pause size={getWidth(20)} color="#FFFFFF" fill="#FFFFFF" />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: S.md,
    paddingVertical: S.md,
    borderBottomWidth: 1,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: S.smPlus,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: S.smPlus,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: S.xs,
  },
  statText: {
    fontSize: getWidth(16),
    fontWeight: '700',
  },
  badge: {
    paddingHorizontal: S.smPlus,
    paddingVertical: S.xs,
    borderRadius: R.full,
  },
  badgeText: {
    fontSize: getWidth(11),
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  pauseButton: {
    width: getWidth(40),
    height: getWidth(40),
    borderRadius: R.full,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
});
