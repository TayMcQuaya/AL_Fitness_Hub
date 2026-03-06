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

export const IntakeMovement = ({ onNext, onBack, initialData }) => {
  const { colors, isDark, toggleTheme } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const [steps, setSteps] = useState(initialData?.steps ?? 6000);
  const [freq, setFreq] = useState(initialData?.freq ?? 1);
  const [cardioFreq, setCardioFreq] = useState(initialData?.cardioFreq ?? 1);
  const [level, setLevel] = useState(initialData?.level ?? 'Low');

  const [unsureSteps, setUnsureSteps] = useState(initialData?.unsureSteps ?? false);
  const [unsureFreq, setUnsureFreq] = useState(initialData?.unsureFreq ?? false);
  const [unsureCardio, setUnsureCardio] = useState(initialData?.unsureCardio ?? false);
  const [unsureLevel, setUnsureLevel] = useState(initialData?.unsureLevel ?? false);

  const calculateScore = () => {
    let score = 1;
    if (!unsureSteps) {
      if (steps >= 10000) score += 3;
      else if (steps >= 7000) score += 2;
      else if (steps >= 4000) score += 1;
    }
    if (!unsureFreq) {
      if (freq >= 3) score += 2;
      else if (freq >= 1) score += 1;
    }
    if (!unsureCardio) {
      if (cardioFreq >= 3) score += 2;
      else if (cardioFreq >= 1) score += 1;
    }
    if (!unsureLevel) {
      if (level === 'High') score += 2;
      else if (level === 'Medium') score += 1;
    }
    return Math.max(1, Math.min(10, score));
  };

  const getMovementData = () => ({
    steps: unsureSteps ? null : steps,
    freq: unsureFreq ? null : freq,
    cardioFreq: unsureCardio ? null : cardioFreq,
    level: unsureLevel ? null : level,
    unsure: { steps: unsureSteps, freq: unsureFreq, cardio: unsureCardio, level: unsureLevel },
  });

  const freqOptions = [0, 1, 2, 3, '4+'];
  const levelOptions = ['Low', 'Medium', 'High'];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <MaterialIcons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.stepText}>Step 4 of 7</Text>
        <TouchableOpacity onPress={toggleTheme} style={styles.themeToggle}>
          <MaterialIcons name={isDark ? "light-mode" : "dark-mode"} size={20} color={colors.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressBg}>
          <View style={[styles.progressFill, { width: '50%' }]} />
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Pillar 5: Movement.</Text>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionLabel}>Average Daily Steps</Text>
            <TouchableOpacity
              style={[styles.unsureToggle, unsureSteps && styles.unsureToggleActive]}
              onPress={() => setUnsureSteps(!unsureSteps)}
            >
              <Text style={[styles.unsureText, unsureSteps && styles.unsureTextActive]}>
                I'm not sure
              </Text>
            </TouchableOpacity>
          </View>
          <View style={[styles.sliderCard, unsureSteps && styles.dimmed]}>
            <Text style={styles.stepsValue}>
              {unsureSteps ? '—' : steps.toLocaleString()}
            </Text>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={15000}
              step={500}
              value={steps}
              onValueChange={setSteps}
              minimumTrackTintColor={unsureSteps ? colors.gray[600] : colors.primary}
              maximumTrackTintColor={colors.gray[700]}
              thumbTintColor={unsureSteps ? colors.gray[600] : colors.primary}
              disabled={unsureSteps}
            />
            <View style={styles.sliderLabels}>
              <Text style={styles.sliderLabel}>Sedentary</Text>
              <Text style={styles.sliderLabel}>Active</Text>
              <Text style={styles.sliderLabel}>Elite</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionLabel}>Weekly Resistance Training</Text>
            <TouchableOpacity
              style={[styles.unsureToggle, unsureFreq && styles.unsureToggleActive]}
              onPress={() => setUnsureFreq(!unsureFreq)}
            >
              <Text style={[styles.unsureText, unsureFreq && styles.unsureTextActive]}>
                I'm not sure
              </Text>
            </TouchableOpacity>
          </View>
          <View style={[styles.freqContainer, unsureFreq && styles.dimmed]}>
            {freqOptions.map((n, i) => (
              <TouchableOpacity
                key={i}
                style={[styles.freqButton, !unsureFreq && freq === i && styles.freqButtonActive]}
                onPress={() => !unsureFreq && setFreq(i)}
                activeOpacity={unsureFreq ? 1 : 0.7}
              >
                <Text style={[styles.freqValue, !unsureFreq && freq === i && styles.freqValueActive]}>
                  {n}
                </Text>
                <Text style={[styles.freqLabel, !unsureFreq && freq === i && styles.freqLabelActive]}>
                  Days
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionLabel}>Weekly Cardio Training</Text>
            <TouchableOpacity
              style={[styles.unsureToggle, unsureCardio && styles.unsureToggleActive]}
              onPress={() => setUnsureCardio(!unsureCardio)}
            >
              <Text style={[styles.unsureText, unsureCardio && styles.unsureTextActive]}>
                I'm not sure
              </Text>
            </TouchableOpacity>
          </View>
          <View style={[styles.freqContainer, unsureCardio && styles.dimmed]}>
            {freqOptions.map((n, i) => (
              <TouchableOpacity
                key={i}
                style={[styles.freqButton, !unsureCardio && cardioFreq === i && styles.freqButtonActive]}
                onPress={() => !unsureCardio && setCardioFreq(i)}
                activeOpacity={unsureCardio ? 1 : 0.7}
              >
                <Text style={[styles.freqValue, !unsureCardio && cardioFreq === i && styles.freqValueActive]}>
                  {n}
                </Text>
                <Text style={[styles.freqLabel, !unsureCardio && cardioFreq === i && styles.freqLabelActive]}>
                  Days
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionLabel}>Overall Activity Level</Text>
            <TouchableOpacity
              style={[styles.unsureToggle, unsureLevel && styles.unsureToggleActive]}
              onPress={() => setUnsureLevel(!unsureLevel)}
            >
              <Text style={[styles.unsureText, unsureLevel && styles.unsureTextActive]}>
                I'm not sure
              </Text>
            </TouchableOpacity>
          </View>
          <View style={[styles.levelContainer, unsureLevel && styles.dimmed]}>
            {levelOptions.map((l) => (
              <TouchableOpacity
                key={l}
                style={[styles.levelButton, !unsureLevel && level === l && styles.levelButtonActive]}
                onPress={() => !unsureLevel && setLevel(l)}
                activeOpacity={unsureLevel ? 1 : 0.7}
              >
                <Text style={[styles.levelText, !unsureLevel && level === l && styles.levelTextActive]}>
                  {l}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => onNext(calculateScore(), { steps, freq, cardioFreq, level, unsureSteps, unsureFreq, unsureCardio, unsureLevel })}
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
    paddingBottom: 16,
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
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: colors.text,
    marginBottom: 20,
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
  },
  unsureToggle: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.gray[700],
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
  sliderCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.divider,
    alignItems: 'center',
  },
  stepsValue: {
    fontSize: 36,
    fontWeight: '900',
    color: colors.primary,
    fontVariant: ['tabular-nums'],
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
  sliderLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.gray[500],
    textTransform: 'uppercase',
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
  levelContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  levelButton: {
    flex: 1,
    paddingVertical: 16,
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
    alignItems: 'center',
  },
  levelButtonActive: {
    borderColor: colors.primary,
    backgroundColor: `${colors.primary}15`,
  },
  levelText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.gray[500],
  },
  levelTextActive: {
    color: colors.primary,
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
