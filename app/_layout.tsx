import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { SoundProvider } from '@/contexts/SoundContext';
import { useSudokuStore } from '@/utils/useSudokuStore';

export default function RootLayout() {
  useFrameworkReady();
  useEffect(() => {
    useSudokuStore.getState().hydrate();
  }, []);
  return (
    <ThemeProvider>
      <SoundProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </SoundProvider>
    </ThemeProvider>
  );
}
