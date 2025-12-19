// components/AdaptiveContent.tsx
// Wrapper component that adjusts content padding based on tab bar position

import React, { ReactNode, useEffect, useState } from 'react';
import { View, Dimensions, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as ScreenOrientation from 'expo-screen-orientation';
import { mapOrientation, type Orientation } from '@/utils/orientation';

interface AdaptiveContentProps {
  children: ReactNode;
  style?: ViewStyle;
}

export function AdaptiveContent({ children, style }: AdaptiveContentProps) {
  const insets = useSafeAreaInsets();
  const [orientation, setOrientation] = useState<Orientation>('PORTRAIT');
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));

  // Track orientation
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

  // Track dimensions
  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions(window);
    });

    return () => subscription?.remove();
  }, []);

  const isLandscape =
    orientation === 'LANDSCAPE_LEFT' || orientation === 'LANDSCAPE_RIGHT';

  // Calculate padding based on orientation
  const contentStyle: ViewStyle = {
    flex: 1,
    ...(isLandscape
      ? {
          // Landscape: Add left padding for vertical tab bar
          paddingLeft: 80 + Math.max(insets.left, 8),
        }
      : {
          // Portrait: Add bottom padding for horizontal tab bar
          paddingBottom: 60 + Math.max(insets.bottom, 10) + 8,
        }),
    ...style,
  };

  return <View style={contentStyle}>{children}</View>;
}

// Alternative: Hook version for more flexibility
export function useAdaptivePadding() {
  const insets = useSafeAreaInsets();
  const [orientation, setOrientation] = useState<Orientation>('PORTRAIT');

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

  const isLandscape =
    orientation === 'LANDSCAPE_LEFT' || orientation === 'LANDSCAPE_RIGHT';

  return {
    isLandscape,
    orientation,
    paddingLeft: isLandscape ? 80 + Math.max(insets.left, 8) : 0,
    paddingBottom: isLandscape ? 0 : 60 + Math.max(insets.bottom, 10) + 8,
    tabBarWidth: isLandscape ? 80 : 0,
    tabBarHeight: isLandscape ? 0 : 60 + Math.max(insets.bottom, 10) + 8,
  };
}
