// components/CustomTabBar.tsx
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Platform,
} from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/contexts/ThemeContext';
import { useSudokuStore } from '@/utils/useSudokuStore';
import { House, Brain, BarChart3, Trophy, Settings } from 'lucide-react-native';
const testIdMap: Record<string, string> = {
  index: 'tab-home',
  game: 'tab-game',
  stats: 'tab-stats',
  achievements: 'tab-achievements',
  settings: 'tab-settings',
};

// Icon mapping
const iconMap = {
  index: House,
  game: Brain,
  stats: BarChart3,
  achievements: Trophy,
  settings: Settings,
};

interface CustomTabBarProps extends BottomTabBarProps {
  isLandscape: boolean;
  iconSize: number;
  fontSize: number;
}

export function CustomTabBar({
  state,
  descriptors,
  navigation,
  isLandscape,
  iconSize,
  fontSize,
}: CustomTabBarProps) {
  const { colors, isDarkMode } = useTheme();
  const insets = useSafeAreaInsets();
  const hasActiveGame = useSudokuStore((state) => state.puzzleId !== '');

  const containerStyle = isLandscape
    ? styles.landscapeContainer
    : styles.portraitContainer;

  const wrapperStyle = isLandscape
    ? {
        ...styles.landscapeWrapper,
        paddingLeft: Math.max(insets.left, 8),
        paddingRight: 1,
        paddingVertical: 20,
        borderRightWidth: 1,
        borderRightColor: colors.border,
      }
    : {
        ...styles.portraitWrapper,
        paddingBottom: Math.max(insets.bottom, 10),
        paddingTop: 8,
        paddingHorizontal: 4,
        borderTopWidth: 1,
        borderTopColor: colors.border,
      };

  return (
    <View style={[containerStyle, wrapperStyle]}>
      <BlurView
        intensity={80}
        tint={isDarkMode ? 'dark' : 'light'}
        style={styles.blurView}
      />

      <View
        style={[
          styles.itemsContainer,
          isLandscape ? styles.landscapeItems : styles.portraitItems,
        ]}
      >
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label =
            typeof options.tabBarLabel === 'string'
              ? options.tabBarLabel
              : typeof options.title === 'string'
              ? options.title
              : route.name;

          const isFocused = state.index === index;
          const isGameTab = route.name === 'game';
          const isDisabled = isGameTab && !hasActiveGame;

          const IconComponent = iconMap[route.name as keyof typeof iconMap];

          const onPress = () => {
            if (isDisabled) return;

            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          const iconColor = isDisabled
            ? colors.textSecondary
            : isFocused
            ? colors.primary
            : colors.textSecondary;

          const labelColor = isDisabled
            ? colors.textSecondary
            : isFocused
            ? colors.primary
            : colors.textSecondary;

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={testIdMap[route.name]}
              onPress={onPress}
              onLongPress={onLongPress}
              disabled={isDisabled}
              activeOpacity={0.7}
              style={[
                styles.tabItem,
                isLandscape ? styles.landscapeTabItem : styles.portraitTabItem,
                isDisabled && styles.disabledTab,
              ]}
            >
              {IconComponent && (
                <IconComponent
                  size={isFocused ? iconSize + 2 : iconSize}
                  color={iconColor}
                  strokeWidth={isFocused ? 2.5 : 2}
                />
              )}
              <Text
                style={[
                  styles.label,
                  {
                    fontSize: isLandscape ? 10 : fontSize,
                    color: labelColor,
                    marginTop: isLandscape ? 4 : 2,
                  },
                ]}
              >
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // Container styles
  landscapeContainer: {
    backgroundColor: 'red',
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: 100,
    overflow: 'hidden',
  },
  portraitContainer: {
    backgroundColor: 'red',

    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 120, // Will be adjusted with safe area
    overflow: 'hidden',
  },

  // Wrapper styles
  landscapeWrapper: {
    flex: 1,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  portraitWrapper: {
    flex: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },

  // Blur view
  blurView: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },

  // Items container
  itemsContainer: {
    flex: 1,
  },
  landscapeItems: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
  },
  portraitItems: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },

  // Tab item
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  landscapeTabItem: {
    paddingVertical: 12,
    paddingHorizontal: 4,
    height: 80,
    width: '100%',
  },
  portraitTabItem: {
    flex: 1,
    paddingVertical: 4,
    paddingHorizontal: 1,
  },
  disabledTab: {
    opacity: 0.4,
  },

  // Label
  label: {
    fontWeight: '600',
    textAlign: 'center',
  },
});
