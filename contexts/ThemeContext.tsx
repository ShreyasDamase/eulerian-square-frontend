import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';

interface ThemeContextType {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  colors: {
    background: string;
    surface: string;
    primary: string;
    secondary: string;
    text: string;
    textSecondary: string;
    border: string;
    error: string;
    success: string;
    warning: string;
  };
}

export const lightColors = {
  // ─── Core surfaces ─────────────────
  background: '#F9FAFB', // App background
  surface: '#FFFFFF', // Cards, sheets
  surfaceSecondary: '#F3F4F6', // Sub-cards, containers
  surfaceDisabled: '#E5E7EB',

  // ─── Brand ────────────────────────
  primary: '#2563EB',
  primarySoft: '#DBEAFE',
  secondary: '#7C3AED',
  secondarySoft: '#EDE9FE',

  // ─── Text ─────────────────────────
  text: '#1F2937',
  textSecondary: '#6B7280',
  textMuted: '#9CA3AF',
  textOnPrimary: '#FFFFFF',
  textDisabled: '#9CA3AF',

  // ─── Borders & dividers ───────────
  border: '#E5E7EB',
  borderStrong: '#D1D5DB',
  divider: '#F3F4F6',

  // ─── Status / Feedback ────────────
  success: '#10B981',
  successSoft: '#D1FAE5',
  error: '#EF4444',
  errorSoft: '#FEE2E2',
  warning: '#F59E0B',
  warningSoft: '#FEF3C7',
  info: '#0EA5E9',
  infoSoft: '#E0F2FE',

  // ─── UI States ────────────────────
  disabled: '#E5E7EB',
  overlay: 'rgba(0,0,0,0.4)',
  shadow: 'rgba(0,0,0,0.1)',

  // ─── Game-specific (Sudoku) ───────
  cellBackground: '#FFFFFF',
  cellSelected: '#DBEAFE',
  cellHighlighted: '#E0F2FE',
  cellError: '#FEE2E2',
  cellSuccess: '#D1FAE5',
};

export const darkColors = {
  // ─── Core surfaces ─────────────────
  background: '#111827',
  surface: '#1F2937',
  surfaceSecondary: '#111827',
  surfaceDisabled: '#374151',

  // ─── Brand ────────────────────────
  primary: '#3B82F6',
  primarySoft: '#1E3A8A',
  secondary: '#8B5CF6',
  secondarySoft: '#312E81',

  // ─── Text ─────────────────────────
  text: '#F9FAFB',
  textSecondary: '#D1D5DB',
  textMuted: '#9CA3AF',
  textOnPrimary: '#FFFFFF',
  textDisabled: '#6B7280',

  // ─── Borders & dividers ───────────
  border: '#374151',
  borderStrong: '#4B5563',
  divider: '#1F2937',

  // ─── Status / Feedback ────────────
  success: '#34D399',
  successSoft: '#064E3B',
  error: '#F87171',
  errorSoft: '#7F1D1D',
  warning: '#FBBF24',
  warningSoft: '#78350F',
  info: '#38BDF8',
  infoSoft: '#075985',

  // ─── UI States ────────────────────
  disabled: '#374151',
  overlay: 'rgba(0,0,0,0.6)',
  shadow: 'rgba(0,0,0,0.6)',

  // ─── Game-specific (Sudoku) ───────
  cellBackground: '#1F2937',
  cellSelected: '#1E3A8A',
  cellHighlighted: '#075985',
  cellError: '#7F1D1D',
  cellSuccess: '#064E3B',
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemColorScheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(systemColorScheme === 'dark');

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  const colors = isDarkMode ? darkColors : lightColors;

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode, colors }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
