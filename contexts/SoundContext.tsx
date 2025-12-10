import React, { createContext, useContext, useState } from 'react';
import { Platform } from 'react-native';

// ✅ Import sound files
import tapSound from '../assets/sounds/tap.mp3';
import successSound from '../assets/sounds/success.mp3';
import errorSound from '../assets/sounds/error.mp3';

interface SoundContextType {
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  setVibrationEnabled: (enabled: boolean) => void;
  playSound: (type: 'tap' | 'success' | 'error') => void;
  vibrate: (type?: 'light' | 'medium' | 'heavy') => void;
}

const SoundContext = createContext<SoundContextType | undefined>(undefined);

export function SoundProvider({ children }: { children: React.ReactNode }) {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);

  const soundMap = {
    tap: tapSound,
    success: successSound,
    error: errorSound,
  };

  const playSound = async (type: 'tap' | 'success' | 'error') => {
    if (!soundEnabled) return;

    if (Platform.OS === 'web') {
      try {
        const audioContext = new (window.AudioContext ||
          (window as any).webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        const frequencies = {
          tap: 800,
          success: 1000,
          error: 400,
        };

        oscillator.frequency.setValueAtTime(
          frequencies[type],
          audioContext.currentTime
        );
        oscillator.type = 'sine';

        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(
          0.01,
          audioContext.currentTime + 0.1
        );

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
      } catch (error) {
        console.log('Web Audio not supported');
      }
    } else {
      try {
        const { Audio } = await import('expo-av');
        const { sound } = await Audio.Sound.createAsync(soundMap[type]);

        await sound.playAsync();

        sound.setOnPlaybackStatusUpdate((status) => {
          if ((status as any)?.didJustFinish) {
            sound.unloadAsync();
          }
        });
      } catch (error) {
        console.warn('Failed to play sound:', error);
      }
    }
  };

  const vibrate = (type: 'light' | 'medium' | 'heavy' = 'light') => {
    if (!vibrationEnabled || Platform.OS === 'web') return;

    // Later you can integrate `expo-haptics` here
    // e.g., Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
  };

  return (
    <SoundContext.Provider
      value={{
        soundEnabled,
        vibrationEnabled,
        setSoundEnabled,
        setVibrationEnabled,
        playSound,
        vibrate,
      }}
    >
      {children}
    </SoundContext.Provider>
  );
}

export function useSound() {
  const context = useContext(SoundContext);
  if (context === undefined) {
    throw new Error('useSound must be used within a SoundProvider');
  }
  return context;
}
