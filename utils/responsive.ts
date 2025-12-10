// utils/responsive.ts
import { Dimensions } from 'react-native';

const BASE_WIDTH = 375;
const BASE_HEIGHT = 812;

let { width, height } = Dimensions.get('window');

Dimensions.addEventListener('change', ({ window }) => {
  width = window.width;
  height = window.height;
});

export const getWidth = (value: number) => (width / BASE_WIDTH) * value;
export const getHeight = (value: number) => (height / BASE_HEIGHT) * value;

export const S = {
  xs: getWidth(4),
  sm: getWidth(8),
  smPlus: getWidth(12),
  md: getWidth(16),
  lg: getWidth(20),
  xl: getWidth(28),
  xxl: getWidth(36),
  xxxl: getWidth(48),
};

export const V = {
  xs: getHeight(4),
  sm: getHeight(8),
  smPlus: getHeight(12),
  md: getHeight(16),
  lg: getHeight(20),
  xl: getHeight(28),
  xxl: getHeight(36),
  xxxl: getHeight(48),
};

export const R = {
  xs: getWidth(4),
  sm: getWidth(8),
  md: getWidth(12),
  lg: getWidth(16),
  xl: getWidth(20),
  full: 9999,
};

export const H = {
  xs: getHeight(20),
  sm: getHeight(40),
  md: getHeight(60),
  lg: getHeight(80),
  xl: getHeight(120),
  xxl: getHeight(160),
};
