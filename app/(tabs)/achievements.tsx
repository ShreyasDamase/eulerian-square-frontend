import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Trophy, Star, Target, Clock, Zap, Award, Lock } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useState, useEffect } from 'react';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: any;
  color: string;
  unlocked: boolean;
  progress?: number;
  maxProgress?: number;
  unlockedAt?: string;
}

interface AchievementCardProps {
  achievement: Achievement;
  onPress: () => void;
}

function AchievementCard({ achievement, onPress }: AchievementCardProps) {
  const { colors } = useTheme();
  const IconComponent = achievement.unlocked ? achievement.icon : Lock;
  const progressPercentage = achievement.maxProgress 
    ? (achievement.progress || 0) / achievement.maxProgress * 100 
    : 100;

  return (
    <TouchableOpacity
      style={[
        styles.achievementCard,
        { 
          backgroundColor: colors.surface,
          opacity: achievement.unlocked ? 1 : 0.6,
        }
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[
        styles.achievementIcon,
        { 
          backgroundColor: achievement.unlocked 
            ? achievement.color + '20' 
            : colors.textSecondary + '20'
        }
      ]}>
        <IconComponent 
          size={28} 
          color={achievement.unlocked ? achievement.color : colors.textSecondary} 
        />
      </View>
      
      <View style={styles.achievementContent}>
        <Text style={[
          styles.achievementTitle,
          { color: achievement.unlocked ? colors.text : colors.textSecondary }
        ]}>
          {achievement.title}
        </Text>
        <Text style={[styles.achievementDescription, { color: colors.textSecondary }]}>
          {achievement.description}
        </Text>
        
        {achievement.maxProgress && !achievement.unlocked && (
          <View style={styles.progressContainer}>
            <View style={[styles.progressBar, { backgroundColor: colors.border }]}>
              <View 
                style={[
                  styles.progressFill,
                  { 
                    backgroundColor: achievement.color,
                    width: `${progressPercentage}%`
                  }
                ]}
              />
            </View>
            <Text style={[styles.progressText, { color: colors.textSecondary }]}>
              {achievement.progress}/{achievement.maxProgress}
            </Text>
          </View>
        )}
        
        {achievement.unlocked && achievement.unlockedAt && (
          <Text style={[styles.unlockedText, { color: colors.success }]}>
            Unlocked {achievement.unlockedAt}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

export default function AchievementsScreen() {
  const { colors } = useTheme();
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  useEffect(() => {
    // TODO: Load actual achievements from AsyncStorage
    setAchievements([
      {
        id: 'first_win',
        title: 'First Victory',
        description: 'Complete your first Sudoku puzzle',
        icon: Trophy,
        color: '#10B981',
        unlocked: true,
        unlockedAt: '2 days ago',
      },
      {
        id: 'speed_demon',
        title: 'Speed Demon',
        description: 'Complete an easy puzzle in under 5 minutes',
        icon: Zap,
        color: '#F59E0B',
        unlocked: true,
        unlockedAt: '1 day ago',
      },
      {
        id: 'perfectionist',
        title: 'Perfectionist',
        description: 'Complete a puzzle without any mistakes',
        icon: Star,
        color: '#8B5CF6',
        unlocked: false,
        progress: 2,
        maxProgress: 3,
      },
      {
        id: 'streak_master',
        title: 'Streak Master',
        description: 'Win 10 games in a row',
        icon: Target,
        color: '#EF4444',
        unlocked: false,
        progress: 5,
        maxProgress: 10,
      },
      {
        id: 'time_master',
        title: 'Time Master',
        description: 'Complete 50 puzzles',
        icon: Clock,
        color: '#06B6D4',
        unlocked: false,
        progress: 23,
        maxProgress: 50,
      },
      {
        id: 'hard_mode',
        title: 'Hard Mode Hero',
        description: 'Complete 5 hard difficulty puzzles',
        icon: Award,
        color: '#DC2626',
        unlocked: false,
        progress: 1,
        maxProgress: 5,
      },
    ]);
  }, []);

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalCount = achievements.length;

  const handleAchievementPress = (achievement: Achievement) => {
    // TODO: Show achievement details modal
    console.log('Achievement pressed:', achievement.title);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContent}
        bounces={true}
      >
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <Text style={[styles.title, { color: colors.text }]}>Achievements</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            {unlockedCount} of {totalCount} unlocked
          </Text>
        </View>

        <View style={styles.content}>
          {/* Progress Overview */}
          <View style={[styles.overviewCard, { backgroundColor: colors.surface }]}>
            <View style={styles.overviewHeader}>
              <Trophy size={24} color={colors.primary} />
              <Text style={[styles.overviewTitle, { color: colors.text }]}>
                Your Progress
              </Text>
            </View>
            <View style={styles.overviewStats}>
              <View style={styles.overviewStat}>
                <Text style={[styles.overviewStatValue, { color: colors.text }]}>
                  {unlockedCount}
                </Text>
                <Text style={[styles.overviewStatLabel, { color: colors.textSecondary }]}>
                  Unlocked
                </Text>
              </View>
              <View style={styles.overviewStat}>
                <Text style={[styles.overviewStatValue, { color: colors.text }]}>
                  {Math.round((unlockedCount / totalCount) * 100)}%
                </Text>
                <Text style={[styles.overviewStatLabel, { color: colors.textSecondary }]}>
                  Complete
                </Text>
              </View>
            </View>
          </View>

          {/* Achievements List */}
          <View style={styles.achievementsList}>
            {achievements.map((achievement) => (
              <AchievementCard
                key={achievement.id}
                achievement={achievement}
                onPress={() => handleAchievementPress(achievement)}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 24,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  overviewCard: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  overviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  overviewTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 12,
  },
  overviewStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  overviewStat: {
    alignItems: 'center',
  },
  overviewStatValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  overviewStatLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  achievementsList: {
    gap: 16,
  },
  achievementCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  achievementIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  achievementContent: {
    flex: 1,
    justifyContent: 'center',
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  achievementDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  progressBar: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    marginRight: 12,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '500',
    minWidth: 40,
  },
  unlockedText: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 4,
  },
});