import { Tabs } from 'expo-router';
import {
  Chrome as Home,
  Brain,
  Settings,
  Trophy,
  ChartBar as BarChart3,
  House,
} from 'lucide-react-native';
import {
  useColorScheme,
  Platform,
  Dimensions,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';
import { BlurView } from 'expo-blur';
import { useTheme } from '@/contexts/ThemeContext';
import { useSudokuStore } from '@/utils/useSudokuStore';

// Tab configuration with enhanced metadata
const tabConfig = [
  {
    name: 'index',
    title: 'Home',
    icon: House,
    description: 'Main menu and game selection',
  },
  {
    name: 'game',
    title: 'Game',
    icon: Brain,
    description: 'Active game session',
  },
  {
    name: 'stats',
    title: 'Stats',
    icon: BarChart3,
    description: 'Game statistics and progress',
  },
  {
    name: 'achievements',
    title: 'Awards',
    icon: Trophy,
    description: 'Achievements and milestones',
  },
  {
    name: 'settings',
    title: 'Settings',
    icon: Settings,
    description: 'App preferences and configuration',
  },
];

export default function TabLayout() {
  const { colors, isDarkMode } = useTheme();
  const insets = useSafeAreaInsets();
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));
  const hasActiveGame = useSudokuStore((state) => state.puzzleId !== '');

  // Handle orientation changes
  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions(window);
    });

    return () => subscription?.remove();
  }, []);

  // Dynamic tab bar height based on device and orientation
  const getTabBarHeight = () => {
    const baseHeight = 60;
    const bottomPadding = Math.max(insets.bottom, 10);
    const topPadding = 8;

    // Adjust for landscape mode
    if (dimensions.width > dimensions.height) {
      return baseHeight + bottomPadding + topPadding - 10;
    }

    return baseHeight + bottomPadding + topPadding;
  };

  // Dynamic font size based on screen size
  const getFontSize = () => {
    if (dimensions.width < 375) return 10; // Small screens
    if (dimensions.width > 414) return 13; // Large screens
    return 12; // Default
  };

  // Dynamic icon size based on screen size
  const getIconSize = () => {
    if (dimensions.width < 375) return 20; // Small screens
    if (dimensions.width > 414) return 26; // Large screens
    return 24; // Default
  };

  const tabBarHeight = getTabBarHeight();
  const fontSize = getFontSize();
  const iconSize = getIconSize();

  // Enhanced tab bar styling that responds to theme changes
  const tabBarStyle: ViewStyle = {
    backgroundColor: isDarkMode
      ? 'rgba(30, 30, 30, 0.95)'
      : 'rgba(255, 255, 255, 0.95)',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    height: tabBarHeight,
    paddingBottom: Math.max(insets.bottom, 10),
    paddingTop: 8,
    paddingHorizontal: 4,
    position: 'absolute' as const,
    bottom: 0,
    left: 0,
    right: 0,
    shadowColor: isDarkMode ? '#000' : '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: isDarkMode ? 0.3 : 0.1,
    shadowRadius: 8,
    elevation: 8,
    overflow: 'hidden',
  };

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarLabelStyle: {
          fontSize,
          fontWeight: '600',
          marginBottom: 2,
          marginTop: 2,
        },
        tabBarIconStyle: {
          marginTop: 2,
        },
        tabBarItemStyle: {
          paddingVertical: 4,
        },
        tabBarShowLabel: true,
        tabBarHideOnKeyboard: true,
        tabBarAllowFontScaling: false,
        tabBarAccessibilityLabel: 'Navigation tabs',
        tabBarBackground: () => (
          <BlurView
            intensity={80}
            tint={isDarkMode ? 'dark' : 'light'}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            }}
          />
        ),
      }}
      screenListeners={{
        tabPress: () => {
          if (Platform.OS === 'ios') {
            // Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }
        },
      }}
    >
      {tabConfig.map((tab) => {
        const isGameTab = tab.name === 'game';

        return (
          <Tabs.Screen
            key={tab.name}
            name={tab.name}
            options={{
              title: tab.title,

              // 🔒 Disable interaction when no game
              tabBarButton: (props) => {
                const { onPress, children, accessibilityState, style } = props;
                const disabled = isGameTab && !hasActiveGame;

                return (
                  <TouchableOpacity
                    onPress={disabled ? undefined : onPress}
                    accessibilityState={accessibilityState}
                    style={[style, disabled && { opacity: 0.4 }]}
                    disabled={disabled}
                    activeOpacity={0.7}
                  >
                    {children}
                  </TouchableOpacity>
                );
              },

              tabBarIcon: ({ color, focused }) => {
                const IconComponent = tab.icon;
                return (
                  <IconComponent
                    size={focused ? iconSize + 2 : iconSize}
                    color={
                      isGameTab && !hasActiveGame ? colors.textSecondary : color
                    }
                    strokeWidth={focused ? 2.5 : 2}
                  />
                );
              },
            }}
          />
        );
      })}
    </Tabs>
  );
}
