import { View, Text, StyleSheet, TouchableOpacity, Switch, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Volume2, VolumeX, Palette, Info } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useSound } from '@/contexts/SoundContext';

export default function SettingsScreen() {
  const { isDarkMode, toggleDarkMode, colors } = useTheme();
  const { soundEnabled, vibrationEnabled, setSoundEnabled, setVibrationEnabled, playSound } = useSound();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 30 }]}
        bounces={true}
        scrollEventThrottle={16}
      >
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <Text style={[styles.title, { color: colors.text }]}>Settings</Text>
        </View>

        <View style={styles.content}>
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Game Settings</Text>
            
            <View style={[styles.settingItem, { backgroundColor: colors.surface }]}>
              <View style={styles.settingInfo}>
                <Volume2 size={24} color={colors.textSecondary} />
                <Text style={[styles.settingLabel, { color: colors.text }]}>Sound Effects</Text>
              </View>
              <Switch
                value={soundEnabled}
                onValueChange={(value) => {
                  setSoundEnabled(value);
                  if (value) playSound('tap');
                }}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={soundEnabled ? colors.primary : colors.textSecondary}
              />
            </View>

            <View style={[styles.settingItem, { backgroundColor: colors.surface }]}>
              <View style={styles.settingInfo}>
                <Palette size={24} color={colors.textSecondary} />
                <Text style={[styles.settingLabel, { color: colors.text }]}>Dark Mode</Text>
              </View>
              <Switch
                value={isDarkMode}
                onValueChange={() => {
                  toggleDarkMode();
                  playSound('tap');
                }}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={isDarkMode ? colors.primary : colors.textSecondary}
              />
            </View>

            <View style={[styles.settingItem, { backgroundColor: colors.surface }]}>
              <View style={styles.settingInfo}>
                <VolumeX size={24} color={colors.textSecondary} />
                <Text style={[styles.settingLabel, { color: colors.text }]}>Vibration</Text>
              </View>
              <Switch
                value={vibrationEnabled}
                onValueChange={(value) => {
                  setVibrationEnabled(value);
                  playSound('tap');
                }}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={vibrationEnabled ? colors.primary : colors.textSecondary}
              />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>About</Text>
            
            <TouchableOpacity 
              style={[styles.settingItem, { backgroundColor: colors.surface }]}
              onPress={() => playSound('tap')}
              activeOpacity={0.7}
            >
              <View style={styles.settingInfo}>
                <Info size={24} color={colors.textSecondary} />
                <Text style={[styles.settingLabel, { color: colors.text }]}>About Sudoku</Text>
              </View>
            </TouchableOpacity>
          </View>

          <View style={[styles.infoCard, { backgroundColor: colors.surface }]}>
            <Text style={[styles.infoTitle, { color: colors.text }]}>Sudoku Game v1.0</Text>
            <Text style={[styles.infoText, { color: colors.textSecondary }]}>
              A beautiful and challenging logic puzzle game. Test your skills with multiple difficulty levels and enjoy hours of brain training fun!
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 24,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    marginLeft: 8,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 14,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    marginLeft: 16,
    fontWeight: '500',
  },
  infoCard: {
    padding: 20,
    borderRadius: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    marginTop: 8,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 22,
  },
});