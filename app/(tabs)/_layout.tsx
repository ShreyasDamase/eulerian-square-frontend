import { Tabs } from 'expo-router';
import { Dimensions } from 'react-native';
import { useEffect, useState } from 'react';
import * as ScreenOrientation from 'expo-screen-orientation';
import { mapOrientation, type Orientation } from '@/utils/orientation';
import { CustomTabBar } from '@/components/CustomTabBar';

export default function TabLayout() {
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));
  const [orientation, setOrientation] = useState<Orientation>('PORTRAIT');

  // Track orientation changes
  useEffect(() => {
    const getOrientation = async () => {
      const current = await ScreenOrientation.getOrientationAsync();
      setOrientation(mapOrientation(current));
    };

    getOrientation();

    const subscription = ScreenOrientation.addOrientationChangeListener(
      (evt) => {
        setOrientation(mapOrientation(evt.orientationInfo.orientation));
      }
    );

    return () => {
      ScreenOrientation.removeOrientationChangeListener(subscription);
    };
  }, []);

  // Handle dimension changes
  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions(window);
    });

    return () => subscription?.remove();
  }, []);

  const isLandscape =
    orientation === 'LANDSCAPE_LEFT' || orientation === 'LANDSCAPE_RIGHT';

  const getFontSize = () => {
    if (dimensions.width < 375) return 10;
    if (dimensions.width > 414) return 13;
    return 12;
  };

  const getIconSize = () => {
    if (dimensions.width < 375) return 20;
    if (dimensions.width > 414) return 26;
    return 24;
  };

  const fontSize = getFontSize();
  const iconSize = getIconSize();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
      }}
      tabBar={(props) => (
        <CustomTabBar
          {...props}
          isLandscape={isLandscape}
          iconSize={iconSize}
          fontSize={fontSize}
        />
      )}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="game" />
      <Tabs.Screen name="stats" />
      <Tabs.Screen name="achievements" />
      <Tabs.Screen name="settings" />
    </Tabs>
  );
}
