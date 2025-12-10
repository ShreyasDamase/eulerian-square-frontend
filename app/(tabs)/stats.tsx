import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChartBar as BarChart3, Clock, Trophy, Target, TrendingUp, Calendar, Crown, Medal } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useState, useEffect } from 'react';
import { LegendList } from "@legendapp/list";

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

interface LeaderboardEntry {
  id: string;
  rank: number;
  playerName: string;
  score: number;
  gamesWon: number;
  averageTime: string;
  isCurrentUser?: boolean;
}

interface StatCardProps {
  icon: any;
  title: string;
  value: string | number;
  subtitle?: string;
  color: string;
}

interface LeaderboardItemProps {
  item: LeaderboardEntry;
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

function LeaderboardItem({ item }: LeaderboardItemProps) {
  const { colors } = useTheme();
  
  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown size={20} color="#FFD700" />;
    if (rank === 2) return <Medal size={20} color="#C0C0C0" />;
    if (rank === 3) return <Medal size={20} color="#CD7F32" />;
    return null;
  };

  const getRankColor = (rank: number) => {
    if (rank === 1) return '#FFD700';
    if (rank === 2) return '#C0C0C0';
    if (rank === 3) return '#CD7F32';
    return colors.textSecondary;
  };

  return (
    <View style={[
      styles.leaderboardItem, 
      { 
        backgroundColor: item.isCurrentUser ? colors.primary + '15' : colors.surface,
        borderColor: item.isCurrentUser ? colors.primary : colors.border
      }
    ]}>
      <View style={styles.leaderboardRank}>
        {getRankIcon(item.rank) || (
          <Text style={[styles.rankText, { color: getRankColor(item.rank) }]}>
            {item.rank}
          </Text>
        )}
      </View>
      
      <View style={styles.leaderboardPlayerInfo}>
        <Text style={[
          styles.playerName, 
          { color: colors.text },
          item.isCurrentUser && styles.currentUserText
        ]}>
          {item.playerName}
          {item.isCurrentUser && ' (You)'}
        </Text>
        <View style={styles.playerStats}>
          <Text style={[styles.playerStatText, { color: colors.textSecondary }]}>
            {item.gamesWon} wins
          </Text>
          <Text style={[styles.playerStatDivider, { color: colors.border }]}>•</Text>
          <Text style={[styles.playerStatText, { color: colors.textSecondary }]}>
            Avg: {item.averageTime}
          </Text>
        </View>
      </View>
      
      <View style={[styles.scoreContainer, { backgroundColor: colors.primary + '20' }]}>
        <Text style={[styles.scoreText, { color: colors.primary }]}>{item.score}</Text>
        <Text style={[styles.scoreLabel, { color: colors.textSecondary }]}>pts</Text>
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

  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);

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

    // TODO: Load actual leaderboard data from API
    setLeaderboardData([
      { id: '1', rank: 1, playerName: 'SudokuMaster', score: 9850, gamesWon: 156, averageTime: '03:45' },
      { id: '2', rank: 2, playerName: 'PuzzleWizard', score: 9620, gamesWon: 142, averageTime: '04:12' },
      { id: '3', rank: 3, playerName: 'GridNinja', score: 9380, gamesWon: 138, averageTime: '04:33' },
      { id: '4', rank: 4, playerName: 'NumberHero', score: 8950, gamesWon: 125, averageTime: '05:01' },
      { id: '5', rank: 5, playerName: 'You', score: 7840, gamesWon: 104, averageTime: '05:28', isCurrentUser: true },
      { id: '6', rank: 6, playerName: 'LogicKing', score: 7620, gamesWon: 98, averageTime: '05:45' },
      { id: '7', rank: 7, playerName: 'BrainTeaser', score: 7350, gamesWon: 92, averageTime: '06:12' },
      { id: '8', rank: 8, playerName: 'PuzzleExpert', score: 7120, gamesWon: 87, averageTime: '06:34' },
      { id: '9', rank: 9, playerName: 'GridSolver', score: 6890, gamesWon: 81, averageTime: '06:52' },
      { id: '10', rank: 10, playerName: 'SudokuFan', score: 6650, gamesWon: 76, averageTime: '07:15' },
      { id: '11', rank: 11, playerName: 'PuzzleExpert', score: 5120, gamesWon: 67, averageTime: '06:34' },
      { id: '12', rank: 12, playerName: 'GridSolver', score: 4890, gamesWon: 51, averageTime: '06:52' },
      { id: '13', rank: 13, playerName: 'SudokuFan', score: 3650, gamesWon: 46, averageTime: '07:15' },
    ]);
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

          {/* Leaderboard */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Trophy size={24} color={colors.primary} />
              <Text style={[styles.sectionTitle, { marginBottom: 0, marginLeft: 8 }]}>
                Global Leaderboard
              </Text>
            </View>
            <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
              Top players worldwide
            </Text>
            
            <View style={[styles.leaderboardContainer, { backgroundColor: colors.surface }]}>
              <LegendList
                data={leaderboardData}
                keyExtractor={(item) => item.id}
                renderItem={({ item }: { item: LeaderboardEntry }) => (
                  <LeaderboardItem item={item} />
                )}
                recycleItems
                estimatedItemSize={80}  nestedScrollEnabled={true}
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
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    marginLeft: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    marginLeft: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
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
  leaderboardContainer: {
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    height: 560,
  },
  leaderboardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  leaderboardRank: {
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  leaderboardPlayerInfo: {
    flex: 1,
    marginLeft: 12,
  },
  playerName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  currentUserText: {
    fontWeight: '700',
  },
  playerStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  playerStatText: {
    fontSize: 12,
    fontWeight: '400',
  },
  playerStatDivider: {
    marginHorizontal: 8,
    fontSize: 12,
  },
  scoreContainer: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignItems: 'center',
  },
  scoreText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  scoreLabel: {
    fontSize: 10,
    fontWeight: '500',
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