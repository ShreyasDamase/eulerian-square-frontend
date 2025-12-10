import { useWindowDimensions } from 'react-native';

export function useOrientation() {
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;
  const isPortrait = height >= width;

  return { isLandscape, isPortrait, width, height };
}
