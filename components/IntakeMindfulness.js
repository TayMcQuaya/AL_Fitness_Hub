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

export const IntakeMindfulness = ({ onNext, onBack, initialData }) => {
  const { colors, isDark, toggleTheme } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const [outdoors, setOutdoors] = useState(initialData?.outdoors ?? 1);
  const [stress, setStress] = useState(initialData?.stress ?? 5);
  const [mindfulness, setMindfulness] = useState(initialData?.mindfulness ?? 0);

  const [unsureOutdoors, setUnsureOutdoors] = useState(initialData?.unsureOutdoors ?? false);
  const [unsureStress, setUnsureStress] = useState(initialData?.unsureStress ?? false);
  const [unsureMindfulness, setUnsureMindfulness] = useState(initialData?.unsureMindfulness ?? false);

  const calculateMindfulnessScore = () => {
    let score = 1;
    if (!unsureStress) {
      if (stress >= 9) score += 6;
      else if (stress >= 7) score += 5;
      else if (stress >= 5) score += 3;
      else if (stress >= 3) score += 2;
      else score += 1;
    } else { score += 3; }
    if (!unsureMindfulness) {
      if (mindfulness >= 3) score += 3;
      else if (mindfulness >= 2) score += 2;
      else score += 1;
    } else { score += 1; }
    return Math.max(1, Math.min(10, score));
  };

  const calculateEnvironmentScore = () => {
    if (unsureOutdoors) return 5;
    if (outdoors >= 3) return 9;
    if (outdoors >= 2) return 7;
    if (outdoors >= 1) return 4;
    return 1;
  };

  const outdoorOptions = [0, 1, 2, '3+'];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <MaterialIcons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.stepText}>Step 7 of 7</Text>
        <TouchableOpacity onPress={toggleTheme} style={styles.themeToggle}>
          <MaterialIcons name={isDark ? "light-mode" : "dark-mode"} size={20} color={colors.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressBg}>
          <View style={[styles.progressFill, { width: '87.5%' }]} />
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.titleSection}>
          <Text style={styles.title}>Mindset & Space.</Text>
          <Text style={styles.subtitle}>
            Pillars 6 & 7: Your internal and external environments.
          </Text>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionLabel}>Hours Spent outside per day</Text>
            <TouchableOpacity
              style={[styles.unsureToggle, unsureOutdoors && styles.unsureToggleActive]}
              onPress={() => setUnsureOutdoors(!unsureOutdoors)}
            >
              <Text style={[styles.unsureText, unsureOutdoors && styles.unsureTextActive]}>
                I don't know
              </Text>
            </TouchableOpacity>
          </View>
          <View style={[styles.optionsRow, unsureOutdoors && styles.dimmed]}>
            {outdoorOptions.map((h, i) => (
              <TouchableOpacity
                key={i}
                style={[
                  styles.optionButton,
                  !unsureOutdoors && outdoors === i && styles.optionButtonActive,
                ]}
                onPress={() => !unsureOutdoors && setOutdoors(i)}
                activeOpacity={unsureOutdoors ? 1 : 0.7}
              >
                <Text
                  style={[
                    styles.optionText,
                    !unsureOutdoors && outdoors === i && styles.optionTextActive,
                  ]}
                >
                  {h}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionLabel}>Current Stress Level</Text>
            <TouchableOpacity
              style={[styles.unsureToggle, unsureStress && styles.unsureToggleActive]}
              onPress={() => setUnsureStress(!unsureStress)}
            >
              <Text style={[styles.unsureText, unsureStress && styles.unsureTextActive]}>
                I don't know
              </Text>
            </TouchableOpacity>
          </View>
          <View style={[styles.sliderCard, unsureStress && styles.dimmed]}>
            <Text style={styles.sliderValue}>{unsureStress ? '—' : stress}</Text>
            <Slider
              style={styles.slider}
              minimumValue={1}
              maximumValue={10}
              step={1}
              value={stress}
              onValueChange={setStress}
              minimumTrackTintColor={unsureStress ? colors.gray[600] : colors.primary}
              maximumTrackTintColor={colors.gray[700]}
              thumbTintColor={unsureStress ? colors.gray[600] : colors.primary}
              disabled={unsureStress}
            />
            <View style={styles.sliderLabels}>
              <Text style={styles.sliderLabelText}>1 - very stressed</Text>
              <Text style={styles.sliderLabelText}>10 - very peaceful</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionLabel}>Days per week you practice mindfulness</Text>
            <TouchableOpacity
              style={[styles.unsureToggle, unsureMindfulness && styles.unsureToggleActive]}
              onPress={() => setUnsureMindfulness(!unsureMindfulness)}
            >
              <Text style={[styles.unsureText, unsureMindfulness && styles.unsureTextActive]}>
                I don't know
              </Text>
            </TouchableOpacity>
          </View>
          <View style={[styles.freqContainer, unsureMindfulness && styles.dimmed]}>
            {[0, 1, 2, 3, '4+'].map((n, i) => (
              <TouchableOpacity
                key={i}
                style={[
                  styles.freqButton,
                  !unsureMindfulness && mindfulness === i && styles.freqButtonActive,
                ]}
                onPress={() => !unsureMindfulness && setMindfulness(i)}
                activeOpacity={unsureMindfulness ? 1 : 0.7}
              >
                <Text
                  style={[
                    styles.freqValue,
                    !unsureMindfulness && mindfulness === i && styles.freqValueActive,
                  ]}
                >
                  {n}
                </Text>
                <Text
                  style={[
                    styles.freqLabel,
                    !unsureMindfulness && mindfulness === i && styles.freqLabelActive,
                  ]}
                >
                  Days
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            onNext(calculateMindfulnessScore(), calculateEnvironmentScore(), { outdoors, stress, mindfulness, unsureOutdoors, unsureStress, unsureMindfulness })
          }
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Continue</Text>
          <MaterialIcons name="arrow-forward" size={20} color={colors.textInverse} />
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
    marginBottom: 32,
    marginTop: 16,
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
    marginBottom: 40,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
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
    borderRadius: 16,
    backgroundColor: colors.surface,
  },
  unsureToggleActive: {
    backgroundColor: `${colors.primary}20`,
    borderWidth: 1,
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
    gap: 8,
  },
  optionButton: {
    flex: 1,
    height: 56,
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
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
    padding: 24,
    borderWidth: 1,
    borderColor: colors.divider,
    alignItems: 'center',
  },
  sliderValue: {
    fontSize: 40,
    fontWeight: '900',
    color: colors.primary,
  },
  slider: {
    width: '100%',
    height: 40,
    marginTop: 16,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 8,
  },
  sliderLabelText: {
    fontSize: 11,
    color: colors.gray[500],
  },
  freqContainer: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 8,
    borderWidth: 1,
    borderColor: colors.divider,
  },
  freqButton: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  freqButtonActive: {
    backgroundColor: colors.primary,
  },
  freqValue: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.gray[500],
  },
  freqValueActive: {
    color: colors.textInverse,
  },
  freqLabel: {
    fontSize: 8,
    fontWeight: '700',
    color: colors.gray[500],
    textTransform: 'uppercase',
  },
  freqLabelActive: {
    color: colors.textInverse,
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
  buttonText: {
    fontSize: 18,
    fontWeight: '900',
    color: colors.textInverse,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
});
