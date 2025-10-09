import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ScrollView, Animated, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Play, Trophy, CircleHelp as HelpCircle, Clock, Target, TrendingUp, Award } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useSound } from '@/contexts/SoundContext';
import { useState, useEffect, useRef } from 'react';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

interface DifficultyLevel {
  level: string;
  title: string;
  subtitle: string;
  description: string;
  color: string;
  gradient: [string, string];
  estimatedTime: string;
  cellsFilled: string;
  icon: any;
}

interface GameStats {
  totalGames: number;
  gamesWon: number;
  bestTime: string;
  currentStreak: number;
}

export default function HomeScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { playSound } = useSound();
  const scrollY = useRef(new Animated.Value(0)).current;
  const [gameStats, setGameStats] = useState<GameStats>({
    totalGames: 0,
    gamesWon: 0,
    bestTime: '--:--',
    currentStreak: 0,
  });
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);

  const difficultyLevels: DifficultyLevel[] = [
    { 
      level: 'easy', 
      title: 'Easy', 
      subtitle: 'Perfect for beginners',
      description: 'More clues, gentle introduction to Sudoku',
      color: '#10B981',
      gradient: ['#10B981', '#059669'],
      estimatedTime: '10-15 min',
      cellsFilled: '40-45',
      icon: Target,
    },
    { 
      level: 'medium', 
      title: 'Medium', 
      subtitle: 'Moderate challenge',
      description: 'Balanced difficulty, good for regular players',
      color: '#F59E0B',
      gradient: ['#F59E0B', '#D97706'],
      estimatedTime: '15-25 min',
      cellsFilled: '30-35',
      icon: TrendingUp,
    },
    { 
      level: 'hard', 
      title: 'Hard', 
      subtitle: 'For experienced players',
      description: 'Minimal clues, requires advanced techniques',
      color: '#EF4444',
      gradient: ['#EF4444', '#DC2626'],
      estimatedTime: '25-45 min',
      cellsFilled: '25-30',
      icon: Award,
    },
  ];

  const howToPlaySteps = [
    {
      icon: HelpCircle,
      title: 'Fill the Grid',
      description: 'Complete the 9×9 grid with numbers 1-9',
    },
    {
      icon: Target,
      title: 'Follow the Rules',
      description: 'Each row, column, and 3×3 box must contain all numbers 1-9',
    },
    {
      icon: TrendingUp,
      title: 'Use Logic',
      description: 'No guessing needed - every puzzle has a unique solution',
    },
  ];

  useEffect(() => {
    // TODO: Load actual stats from AsyncStorage
    setGameStats({
      totalGames: 23,
      gamesWon: 18,
      bestTime: '08:42',
      currentStreak: 5,
    });
  }, []);

  const startGame = (difficulty: string) => {
    playSound('tap');
    setSelectedDifficulty(difficulty);
    
    setTimeout(() => {
      router.push(`/game?difficulty=${difficulty}`);
      setSelectedDifficulty(null);
    }, 150);
  };

  const showStats = () => {
    playSound('tap');
    router.push('/stats');
  };

  const showAchievements = () => {
    playSound('tap');
    router.push('/achievements');
  };

  // Header animation based on scroll
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0.8],
    extrapolate: 'clamp',
  });

  const headerScale = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0.95],
    extrapolate: 'clamp',
  });

  // Fixed scroll handler
  const onScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { useNativeDriver: false } // Changed to false to fix the error
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={colors.text === '#000000' ? 'dark-content' : 'light-content'} />
      
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContent}
        bounces={true}
        scrollEventThrottle={16}
        onScroll={onScroll}
      >
        {/* Animated Header */}
        <Animated.View 
          style={[
            styles.header,
            {
              opacity: headerOpacity,
              transform: [{ scale: headerScale }],
            }
          ]}
        >
          <Text style={[styles.title, { color: colors.text }]}>Sudoku</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Challenge Your Mind
          </Text>
        </Animated.View>

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <TouchableOpacity 
            style={[styles.statCard, { backgroundColor: colors.surface }]}
            onPress={showStats}
            activeOpacity={0.7}
          >
            <View style={styles.statHeader}>
              <Trophy size={20} color={colors.textSecondary} />
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Games Won</Text>
            </View>
            <Text style={[styles.statValue, { color: colors.text }]}>
              {gameStats.gamesWon}/{gameStats.totalGames}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.statCard, { backgroundColor: colors.surface }]}
            onPress={showStats}
            activeOpacity={0.7}
          >
            <View style={styles.statHeader}>
              <Clock size={20} color={colors.textSecondary} />
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Best Time</Text>
            </View>
            <Text style={[styles.statValue, { color: colors.text }]}>
              {gameStats.bestTime}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.statCard, { backgroundColor: colors.surface }]}
            onPress={showAchievements}
            activeOpacity={0.7}
          >
            <View style={styles.statHeader}>
              <Target size={20} color={colors.textSecondary} />
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Streak</Text>
            </View>
            <Text style={[styles.statValue, { color: colors.text }]}>
              {gameStats.currentStreak}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Difficulty Selection */}
        <View style={styles.difficultyContainer}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Choose Difficulty</Text>
          {difficultyLevels.map((item) => {
            const IconComponent = item.icon;
            const isSelected = selectedDifficulty === item.level;
            
            return (
              <TouchableOpacity
                key={item.level}
                style={[
                  styles.difficultyButton, 
                  { 
                    borderColor: item.color,
                    backgroundColor: colors.surface,
                    transform: [{ scale: isSelected ? 0.98 : 1 }],
                    opacity: isSelected ? 0.8 : 1,
                  }
                ]}
                onPress={() => startGame(item.level)}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={item.gradient}
                  style={styles.difficultyIcon}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <IconComponent size={24} color="#FFFFFF" />
                </LinearGradient>
                
                <View style={styles.difficultyText}>
                  <Text style={[styles.difficultyTitle, { color: colors.text }]}>
                    {item.title}
                  </Text>
                  <Text style={[styles.difficultySubtitle, { color: colors.textSecondary }]}>
                    {item.subtitle}
                  </Text>
                  <Text style={[styles.difficultyDescription, { color: colors.textSecondary }]}>
                    {item.description}
                  </Text>
                </View>
                
                <View style={styles.difficultyStats}>
                  <View style={styles.difficultyStatItem}>
                    <Clock size={14} color={colors.textSecondary} />
                    <Text style={[styles.difficultyStatText, { color: colors.textSecondary }]}>
                      {item.estimatedTime}
                    </Text>
                  </View>
                  <View style={styles.difficultyStatItem}>
                    <Target size={14} color={colors.textSecondary} />
                    <Text style={[styles.difficultyStatText, { color: colors.textSecondary }]}>
                      {item.cellsFilled} clues
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* How to Play */}
        <View style={styles.infoContainer}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>How to Play</Text>
          <View style={[styles.infoCard, { backgroundColor: colors.surface }]}>
            {howToPlaySteps.map((step, index) => {
              const IconComponent = step.icon;
              return (
                <View key={index} style={styles.infoRow}>
                  <View style={[styles.infoIconContainer, { backgroundColor: colors.background }]}>
                    <IconComponent size={20} color={colors.textSecondary} />
                  </View>
                  <View style={styles.infoTextContainer}>
                    <Text style={[styles.infoTitle, { color: colors.text }]}>
                      {step.title}
                    </Text>
                    <Text style={[styles.infoText, { color: colors.textSecondary }]}>
                      {step.description}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* Bottom spacing for tab bar */}
        <View style={styles.bottomSpacing} />
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
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '500',
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 30,
    gap: 12,
  },
  statCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 6,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  difficultyContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  difficultyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  difficultyIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  difficultyText: {
    flex: 1,
  },
  difficultyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  difficultySubtitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  difficultyDescription: {
    fontSize: 12,
    lineHeight: 16,
  },
  difficultyStats: {
    alignItems: 'flex-end',
  },
  difficultyStatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  difficultyStatText: {
    fontSize: 12,
    marginLeft: 4,
  },
  infoContainer: {
    paddingHorizontal: 20,
  },
  infoCard: {
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  infoIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
  },
  bottomSpacing: {
    height: 20,
  },
});