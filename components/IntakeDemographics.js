import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../styles/ThemeContext';

export const IntakeDemographics = ({ onNext, onBack, initialData }) => {
  const { colors, isDark, toggleTheme } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const [sex, setSex] = useState(initialData?.sex ?? null);
  const [age, setAge] = useState(initialData?.age ?? '');
  const [weight, setWeight] = useState(initialData?.weight ?? '');
  const [goalWeight, setGoalWeight] = useState(initialData?.goalWeight ?? '');

  const sexOptions = ['Male', 'Female', 'Other'];

  const numericOnly = (text) => text.replace(/[^0-9]/g, '');
  const isComplete = age.trim() !== '' && sex !== null && weight.trim() !== '' && goalWeight.trim() !== '';

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <MaterialIcons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.stepText}>Step 2 of 7</Text>
        <TouchableOpacity onPress={toggleTheme} style={styles.themeToggle}>
          <MaterialIcons name={isDark ? "light-mode" : "dark-mode"} size={20} color={colors.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressBg}>
          <View style={[styles.progressFill, { width: '25%' }]} />
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.titleSection}>
          <Text style={styles.title}>Your Bio-Stats.</Text>
          <Text style={styles.subtitle}>
            These help us calculate your personalized nutrition targets.
          </Text>
        </View>

        <View style={styles.row}>
          <View style={styles.halfInput}>
            <Text style={styles.label}>Current Age</Text>
            <TextInput
              value={age}
              onChangeText={(t) => setAge(numericOnly(t))}
              placeholder="32"
              placeholderTextColor={colors.gray[600]}
              keyboardType="numeric"
              style={styles.input}
            />
          </View>
          <View style={styles.halfInput}>
            <Text style={styles.label}>Sex</Text>
            <View style={styles.selectContainer}>
              {sexOptions.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.selectOption,
                    sex === option && styles.selectOptionActive,
                  ]}
                  onPress={() => setSex(option)}
                >
                  <Text
                    style={[
                      styles.selectText,
                      sex === option && styles.selectTextActive,
                    ]}
                  >
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.halfInput}>
            <Text style={styles.label}>Current Weight (lbs)</Text>
            <TextInput
              value={weight}
              onChangeText={(t) => setWeight(numericOnly(t))}
              placeholder="185"
              placeholderTextColor={colors.gray[600]}
              keyboardType="numeric"
              style={styles.input}
            />
          </View>
          <View style={styles.halfInput}>
            <Text style={styles.label}>Goal Weight (lbs)</Text>
            <TextInput
              value={goalWeight}
              onChangeText={(t) => setGoalWeight(numericOnly(t))}
              placeholder="165"
              placeholderTextColor={colors.gray[600]}
              keyboardType="numeric"
              style={styles.input}
            />
          </View>
        </View>

        <View style={styles.tipContainer}>
          <MaterialIcons name="info" size={20} color={colors.primary} />
          <Text style={styles.tipText}>
            Coach Al: "Your goal weight helps me build the 'Roadmap to the New You'."
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.button, !isComplete && styles.buttonDisabled]}
          onPress={() => isComplete && onNext({ age: parseInt(age) || null, sex, weight: parseInt(weight) || null, goalWeight: parseInt(goalWeight) || null }, { age, sex, weight, goalWeight })}
          activeOpacity={isComplete ? 0.8 : 1}
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
  titleSection: {
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: colors.text,
    lineHeight: 38,
  },
  subtitle: {
    fontSize: 18,
    color: colors.gray[400],
    marginTop: 8,
    lineHeight: 26,
  },
  row: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  halfInput: {
    flex: 1,
    gap: 8,
  },
  label: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.gray[500],
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  input: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  selectContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  selectOption: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: colors.surface,
    borderRadius: 8,
    alignItems: 'center',
  },
  selectOptionActive: {
    backgroundColor: `${colors.primary}20`,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  selectText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.gray[500],
  },
  selectTextActive: {
    color: colors.primary,
  },
  tipContainer: {
    flexDirection: 'row',
    backgroundColor: `${colors.primary}10`,
    borderWidth: 1,
    borderColor: `${colors.primary}30`,
    padding: 16,
    borderRadius: 16,
    gap: 12,
    marginTop: 16,
  },
  tipText: {
    flex: 1,
    fontSize: 12,
    color: colors.gray[400],
    fontStyle: 'italic',
    lineHeight: 18,
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
    opacity: 0.4,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '900',
    color: colors.textInverse,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
});
