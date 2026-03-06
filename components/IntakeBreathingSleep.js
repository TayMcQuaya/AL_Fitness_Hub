import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { useTheme } from '../styles/ThemeContext';

export const IntakeBreathingSleep = ({ onNext, onBack, initialData }) => {
  const { colors, isDark, toggleTheme } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const [noseBreather, setNoseBreather] = useState(initialData?.noseBreather ?? null);
  const [sleepHours, setSleepHours] = useState(initialData?.sleepHours ?? 7);
  const [wakeEnergy, setWakeEnergy] = useState(initialData?.wakeEnergy ?? 5);

  const [unsureBreathing, setUnsureBreathing] = useState(initialData?.unsureBreathing ?? false);
  const [unsureSleep, setUnsureSleep] = useState(initialData?.unsureSleep ?? false);
  const [unsureEnergy, setUnsureEnergy] = useState(initialData?.unsureEnergy ?? false);

  const calculateBreathingScore = () => {
    if (unsureBreathing) return 5;
    let score = 0;
    if (noseBreather) score += 5;
    return Math.max(1, Math.min(10, score + 3));
  };

  const calculateSleepScore = () => {
    let hoursScore = 5;
    if (!unsureSleep) {
      if (sleepHours >= 8) hoursScore = 10;
      else if (sleepHours >= 7) hoursScore = 7.5;
      else if (sleepHours >= 6) hoursScore = 5;
      else if (sleepHours >= 5) hoursScore = 2.5;
      else hoursScore = 0;
    }
    let energyScore = 5;
    if (!unsureEnergy) {
      energyScore = wakeEnergy;
    }
    return Math.max(1, Math.min(10, Math.round((hoursScore + energyScore) / 2)));
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <MaterialIcons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.stepText}>Step 6 of 7</Text>
        <TouchableOpacity onPress={toggleTheme} style={styles.themeToggle}>
          <MaterialIcons name={isDark ? "light-mode" : "dark-mode"} size={20} color={colors.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressBg}>
          <View style={[styles.progressFill, { width: '75%' }]} />
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.titleSection}>
          <Text style={styles.title}>Breathing & Sleep.</Text>
          <Text style={styles.subtitle}>
            These pillars form the basis of your biological recovery.
          </Text>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionLabel}>
              Are you a nose breather during the day?
            </Text>
            <TouchableOpacity
              style={[styles.unsureToggle, unsureBreathing && styles.unsureToggleActive]}
              onPress={() => setUnsureBreathing(!unsureBreathing)}
            >
              <Text style={[styles.unsureText, unsureBreathing && styles.unsureTextActive]}>
                I don't know
              </Text>
            </TouchableOpacity>
          </View>
          <View style={[styles.optionsRow, unsureBreathing && styles.dimmed]}>
            <TouchableOpacity
              style={[
                styles.optionButton,
                !unsureBreathing && noseBreather === true && styles.optionButtonActive,
              ]}
              onPress={() => !unsureBreathing && setNoseBreather(true)}
              activeOpacity={unsureBreathing ? 1 : 0.7}
            >
              <Text
                style={[
                  styles.optionText,
                  !unsureBreathing && noseBreather === true && styles.optionTextActive,
                ]}
              >
                Yes
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.optionButton,
                !unsureBreathing && noseBreather === false && styles.optionButtonActive,
              ]}
              onPress={() => !unsureBreathing && setNoseBreather(false)}
              activeOpacity={unsureBreathing ? 1 : 0.7}
            >
              <Text
                style={[
                  styles.optionText,
                  !unsureBreathing && noseBreather === false && styles.optionTextActive,
                ]}
              >
                No
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionLabel}>Average Sleep (Hours)</Text>
            <TouchableOpacity
              style={[styles.unsureToggle, unsureSleep && styles.unsureToggleActive]}
              onPress={() => setUnsureSleep(!unsureSleep)}
            >
              <Text style={[styles.unsureText, unsureSleep && styles.unsureTextActive]}>
                I don't know
              </Text>
            </TouchableOpacity>
          </View>
          <View style={[styles.sliderCard, unsureSleep && styles.dimmed]}>
            <Text style={styles.sliderValue}>{unsureSleep ? '—' : sleepHours}</Text>
            <Slider
              style={styles.slider}
              minimumValue={4}
              maximumValue={10}
              step={1}
              value={sleepHours}
              onValueChange={setSleepHours}
              minimumTrackTintColor={unsureSleep ? colors.gray[600] : colors.primary}
              maximumTrackTintColor={colors.gray[700]}
              thumbTintColor={unsureSleep ? colors.gray[600] : colors.primary}
              disabled={unsureSleep}
            />
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionLabel}>How energetic do you feel when you wake up?</Text>
            <TouchableOpacity
              style={[styles.unsureToggle, unsureEnergy && styles.unsureToggleActive]}
              onPress={() => setUnsureEnergy(!unsureEnergy)}
            >
              <Text style={[styles.unsureText, unsureEnergy && styles.unsureTextActive]}>
                I don't know
              </Text>
            </TouchableOpacity>
          </View>
          <View style={[styles.sliderCard, unsureEnergy && styles.dimmed]}>
            <Text style={styles.sliderValue}>{unsureEnergy ? '—' : wakeEnergy}</Text>
            <Slider
              style={styles.slider}
              minimumValue={1}
              maximumValue={10}
              step={1}
              value={wakeEnergy}
              onValueChange={setWakeEnergy}
              minimumTrackTintColor={unsureEnergy ? colors.gray[600] : colors.primary}
              maximumTrackTintColor={colors.gray[700]}
              thumbTintColor={unsureEnergy ? colors.gray[600] : colors.primary}
              disabled={unsureEnergy}
            />
            <View style={styles.sliderLabels}>
              <Text style={styles.sliderLabelText}>No energy</Text>
              <Text style={styles.sliderLabelText}>Bouncing off walls</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.button, (!unsureBreathing && noseBreather === null) && styles.buttonDisabled]}
          onPress={() =>
            (unsureBreathing || noseBreather !== null) &&
            onNext(calculateBreathingScore(), calculateSleepScore(), { noseBreather, sleepHours, wakeEnergy, unsureBreathing, unsureSleep, unsureEnergy })
          }
          disabled={!unsureBreathing && noseBreather === null}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.buttonText,
              (!unsureBreathing && noseBreather === null) && styles.buttonTextDisabled,
            ]}
          >
            Continue
          </Text>
          <MaterialIcons
            name="arrow-forward"
            size={20}
            color={(unsureBreathing || noseBreather !== null) ? colors.textInverse : colors.gray[600]}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const makeStyles = (colors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  themeToggle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.gray[500],
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  progressContainer: {
    paddingHorizontal: 24,
    paddingVertical: 8,
  },
  progressBg: {
    height: 6,
    backgroundColor: colors.overlay,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 3,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  titleSection: {
    marginBottom: 20,
    marginTop: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: colors.text,
  },
  subtitle: {
    fontSize: 16,
    color: colors.gray[400],
    marginTop: 8,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.gray[500],
    textTransform: 'uppercase',
    letterSpacing: 1,
    flex: 1,
  },
  unsureToggle: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.gray[700],
    marginLeft: 8,
  },
  unsureToggleActive: {
    backgroundColor: `${colors.primary}20`,
    borderColor: colors.primary,
  },
  unsureText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.gray[500],
  },
  unsureTextActive: {
    color: colors.primary,
  },
  dimmed: {
    opacity: 0.4,
  },
  optionsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  optionButton: {
    flex: 1,
    paddingVertical: 16,
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
    alignItems: 'center',
  },
  optionButtonActive: {
    borderColor: colors.primary,
    backgroundColor: `${colors.primary}15`,
  },
  optionText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.gray[500],
  },
  optionTextActive: {
    color: colors.primary,
  },
  sliderCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.divider,
    alignItems: 'center',
  },
  sliderValue: {
    fontSize: 32,
    fontWeight: '900',
    color: colors.primary,
  },
  slider: {
    width: '100%',
    height: 40,
    marginTop: 8,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 8,
  },
  sliderLabelText: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.gray[500],
    textTransform: 'uppercase',
  },
  footer: {
    padding: 24,
    paddingBottom: 32,
  },
  button: {
    height: 64,
    backgroundColor: colors.primary,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '900',
    color: colors.textInverse,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  buttonTextDisabled: {
    color: colors.gray[600],
  },
});
