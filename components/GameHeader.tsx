import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { GameHeaderProps } from '@/types/sudoku';
import { formatTime } from '@/utils/sudokuLogic';
import { Pause, Play, Clock, Lightbulb } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';

export function GameHeader({ time, difficulty, hints, isPaused, onPause }: GameHeaderProps) {
  const { colors } = useTheme();

  const getDifficultyColor = () => {
    switch (difficulty) {
      case 'easy': return '#10B981';
      case 'medium': return '#F59E0B';
      case 'hard': return '#EF4444';
      default: return '#6B7280';
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
      <View style={styles.leftSection}>
        <View style={styles.timeContainer}>
          <Clock size={20} color={colors.textSecondary} />
          <Text style={[styles.timeText, { color: colors.text }]}>{formatTime(time)}</Text>
        </View>
        <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor() }]}>
          <Text style={styles.difficultyText}>
            {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
          </Text>
        </View>
      </View>

      <View style={styles.rightSection}>
        <View style={styles.hintsContainer}>
          <Lightbulb size={20} color={colors.warning} />
          <Text style={[styles.hintsText, { color: colors.warning }]}>{hints}</Text>
        </View>
        <TouchableOpacity style={[styles.pauseButton, { backgroundColor: colors.primary }]} onPress={onPause}>
          {isPaused ? (
            <Play size={24} color="#FFFFFF" />
          ) : (
            <Pause size={24} color="#FFFFFF" />
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
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  timeText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  difficultyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  hintsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  hintsText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  pauseButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
});