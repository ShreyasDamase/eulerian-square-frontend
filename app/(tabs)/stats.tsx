import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChartBar as BarChart3, Clock, Trophy, Target, TrendingUp, Calendar } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useState, useEffect } from 'react';

const { width } = Dimensions.get('window');

interface GameStats {
  totalGames: number;
  gamesWon: number;
  bestTime: string;
  averageTime: string;
  currentStreak: number;
  longestStreak: number;
  easyWins: number;
  mediumWins: number;
  hardWins: number;
  totalPlayTime: string;
}

interface StatCardProps {
  icon: any;
  title: string;
  value: string | number;
  subtitle?: string;
  color: string;
}

function StatCard({ icon: IconComponent, title, value, subtitle, color }: StatCardProps) {
  const { colors } = useTheme();
  
  return (
    <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
      <View style={[styles.statIconContainer, { backgroundColor: color + '20' }]}>
        <IconComponent size={24} color={color} />
      </View>
      <View style={styles.statContent}>
        <Text style={[styles.statTitle, { color: colors.textSecondary }]}>{title}</Text>
        <Text style={[styles.statValue, { color: colors.text }]}>{value}</Text>
        {subtitle && (
          <Text style={[styles.statSubtitle, { color: colors.textSecondary }]}>{subtitle}</Text>
        )}
      </View>
    </View>
  );
}

export default function StatsScreen() {
  const { colors } = useTheme();
  const [stats, setStats] = useState<GameStats>({
    totalGames: 0,
    gamesWon: 0,
    bestTime: '--:--',
    averageTime: '--:--',
    currentStreak: 0,
    longestStreak: 0,
    easyWins: 0,
    mediumWins: 0,
    hardWins: 0,
    totalPlayTime: '0h 0m',
  });

  useEffect(() => {
    // TODO: Load actual stats from AsyncStorage
    setStats({
      totalGames: 47,
      gamesWon: 32,
      bestTime: '04:23',
      averageTime: '08:45',
      currentStreak: 5,
      longestStreak: 12,
      easyWins: 18,
      mediumWins: 11,
      hardWins: 3,
      totalPlayTime: '6h 23m',
    });
  }, []);

  const winRate = stats.totalGames > 0 ? Math.round((stats.gamesWon / stats.totalGames) * 100) : 0;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContent}
        bounces={true}
      >
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <Text style={[styles.title, { color: colors.text }]}>Statistics</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Track your Sudoku progress
          </Text>
        </View>

        <View style={styles.content}>
          {/* Overview Stats */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Overview</Text>
            
            <View style={styles.statsGrid}>
              <StatCard
                icon={Trophy}
                title="Games Won"
                value={`${stats.gamesWon}/${stats.totalGames}`}
                subtitle={`${winRate}% win rate`}
                color={colors.success}
              />
              
              <StatCard
                icon={Clock}
                title="Best Time"
                value={stats.bestTime}
                color={colors.primary}
              />
              
              <StatCard
                icon={TrendingUp}
                title="Average Time"
                value={stats.averageTime}
                color={colors.secondary}
              />
              
              <StatCard
                icon={Target}
                title="Current Streak"
                value={stats.currentStreak}
                subtitle={`Best: ${stats.longestStreak}`}
                color={colors.warning}
              />
            </View>
          </View>

          {/* Difficulty Breakdown */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Difficulty Breakdown</Text>
            
            <View style={styles.difficultyContainer}>
              <View style={[styles.difficultyCard, { backgroundColor: colors.surface }]}>
                <View style={styles.difficultyHeader}>
                  <View style={[styles.difficultyDot, { backgroundColor: '#10B981' }]} />
                  <Text style={[styles.difficultyTitle, { color: colors.text }]}>Easy</Text>
                </View>
                <Text style={[styles.difficultyValue, { color: colors.text }]}>{stats.easyWins} wins</Text>
              </View>
              
              <View style={[styles.difficultyCard, { backgroundColor: colors.surface }]}>
                <View style={styles.difficultyHeader}>
                  <View style={[styles.difficultyDot, { backgroundColor: '#F59E0B' }]} />
                  <Text style={[styles.difficultyTitle, { color: colors.text }]}>Medium</Text>
                </View>
                <Text style={[styles.difficultyValue, { color: colors.text }]}>{stats.mediumWins} wins</Text>
              </View>
              
              <View style={[styles.difficultyCard, { backgroundColor: colors.surface }]}>
                <View style={styles.difficultyHeader}>
                  <View style={[styles.difficultyDot, { backgroundColor: '#EF4444' }]} />
                  <Text style={[styles.difficultyTitle, { color: colors.text }]}>Hard</Text>
                </View>
                <Text style={[styles.difficultyValue, { color: colors.text }]}>{stats.hardWins} wins</Text>
              </View>
            </View>
          </View>

          {/* Additional Stats */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Additional Stats</Text>
            
            <View style={[styles.additionalStatsCard, { backgroundColor: colors.surface }]}>
              <View style={styles.additionalStatRow}>
                <Calendar size={20} color={colors.textSecondary} />
                <Text style={[styles.additionalStatLabel, { color: colors.textSecondary }]}>
                  Total Play Time
                </Text>
                <Text style={[styles.additionalStatValue, { color: colors.text }]}>
                  {stats.totalPlayTime}
                </Text>
              </View>
              
              <View style={styles.additionalStatRow}>
                <BarChart3 size={20} color={colors.textSecondary} />
                <Text style={[styles.additionalStatLabel, { color: colors.textSecondary }]}>
                  Completion Rate
                </Text>
                <Text style={[styles.additionalStatValue, { color: colors.text }]}>
                  {winRate}%
                </Text>
              </View>
            </View>
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
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    marginLeft: 8,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    width: (width - 60) / 2,
    padding: 16,
    borderRadius: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statContent: {
    flex: 1,
  },
  statTitle: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  statSubtitle: {
    fontSize: 11,
    fontWeight: '400',
  },
  difficultyContainer: {
    gap: 12,
  },
  difficultyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  difficultyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  difficultyDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  difficultyTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  difficultyValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  additionalStatsCard: {
    padding: 20,
    borderRadius: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  additionalStatRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  additionalStatLabel: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 12,
  },
  additionalStatValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});