// utils/orientation.ts
import * as ScreenOrientation from 'expo-screen-orientation';

export type Orientation =
  | 'PORTRAIT'
  | 'PORTRAIT_UPSIDE_DOWN'
  | 'LANDSCAPE_LEFT'
  | 'LANDSCAPE_RIGHT';

export function mapOrientation(
  orientation: ScreenOrientation.Orientation
): Orientation {
  switch (orientation) {
    case ScreenOrientation.Orientation.PORTRAIT_UP:
      return 'PORTRAIT';
    case ScreenOrientation.Orientation.PORTRAIT_DOWN:
      return 'PORTRAIT_UPSIDE_DOWN';
    case ScreenOrientation.Orientation.LANDSCAPE_LEFT:
      return 'LANDSCAPE_LEFT';
    case ScreenOrientation.Orientation.LANDSCAPE_RIGHT:
      return 'LANDSCAPE_RIGHT';
    default:
      return 'PORTRAIT';
  }
}
