import React, { useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../styles/ThemeContext';
import { BottomNav } from './BottomNav';
import { calculateNutritionTargets } from '../lib/nutrition';

export const NutritionSummary = ({ onNavigate, weight, age, sex, goals, experience }) => {
  const { colors, isDark, toggleTheme } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const targets = useMemo(
    () => calculateNutritionTargets({ weight, age, sex, goals, experience }),
    [weight, age, sex, goals, experience],
  );

  const hasTargets = targets !== null;

  const stats = [
    {
      label: 'Daily Calories',
      val: hasTargets ? targets.calories.toLocaleString() : '--',
      unit: 'kcal target',
      icon: 'local-fire-department',
      prog: 0,
    },
    {
      label: 'Daily Protein',
      val: hasTargets ? `${targets.protein}g` : '--',
      unit: 'protein target',
      icon: 'fitness-center',
      prog: 0,
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => onNavigate('DASHBOARD')}
        >
          <MaterialIcons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Nutrition</Text>
        <TouchableOpacity style={styles.backButton} onPress={toggleTheme}>
          <MaterialIcons name={isDark ? 'light-mode' : 'dark-mode'} size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.goalBadge}>
          <MaterialIcons name="verified" size={14} color={colors.primary} />
          <Text style={styles.goalBadgeText}>
            Goal: {hasTargets ? targets.goalLabel : 'Not Set'}
          </Text>
        </View>
        <Text style={styles.pageTitle}>Your Daily Fuel</Text>
        <Text style={styles.pageSubtitle}>Here is your tailored plan for today.</Text>

        <View style={styles.statsGrid}>
          {stats.map((s, i) => (
            <View key={i} style={styles.statCard}>
              <View style={styles.statHeader}>
                <View style={styles.statIconContainer}>
                  <MaterialIcons name={s.icon} size={16} color={colors.primary} />
                </View>
                <Text style={styles.statLabel}>{s.label}</Text>
              </View>
              <Text style={styles.statValue}>{s.val}</Text>
              <Text style={styles.statUnit}>{s.unit}</Text>
              {/* Progress bar + hint commented out — meal logging not yet implemented
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${s.prog}%` }]} />
              </View>
              <Text style={styles.progressHint}>Log meals to track progress</Text>
              */}
            </View>
          ))}
        </View>

        <View style={styles.disclaimerBox}>
          <MaterialIcons name="info" size={20} color={colors.secondary} />
          <View style={{ flex: 1 }}>
            <Text style={styles.disclaimerTitle}>Estimates Only</Text>
            <Text style={styles.disclaimerText}>
              These numbers are general estimates based on your profile, not exact. For precise targets tailored to your body and goals, work with Coach Al one-on-one.
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionTitleRow}>
            <MaterialIcons name="psychology" size={20} color={colors.primary} />
            <Text style={styles.sectionTitle}>Coach Al's Pillars</Text>
          </View>

          <View style={styles.pillarCard}>
            <View style={styles.pillarIcon}>
              <MaterialIcons name="grass" size={24} color={colors.primary} />
            </View>
            <View style={styles.pillarContent}>
              <Text style={styles.pillarTitle}>Fiber Focus</Text>
              <Text style={styles.pillarDesc}>
                Aim for 14g of fiber per 1,000 calories to keep your gut happy and
                energy steady.
              </Text>
              <Text style={styles.pillarTarget}>
                Target: {hasTargets ? `${targets.fiber}g Today` : '--'}
              </Text>
            </View>
          </View>

          <View style={[styles.pillarCard, styles.pillarCardBlue]}>
            <View style={[styles.pillarIcon, styles.pillarIconBlue]}>
              <MaterialIcons name="water-drop" size={24} color="#3b82f6" />
            </View>
            <View style={styles.pillarContent}>
              <Text style={styles.pillarTitle}>Hydration</Text>
              <Text style={styles.pillarDesc}>
                Stay hydrated throughout the day. Drink water before meals to support
                digestion and energy.
              </Text>
              <Text style={[styles.pillarTarget, { color: '#3b82f6' }]}>
                Target: {hasTargets ? `${targets.waterCups} cups Today` : '--'}
              </Text>
            </View>
          </View>

          <View style={styles.pillarCard}>
            <View style={styles.pillarIcon}>
              <MaterialIcons name="palette" size={24} color={colors.primary} />
            </View>
            <View style={styles.pillarContent}>
              <Text style={styles.pillarTitle}>Eat the Rainbow</Text>
              <Text style={styles.pillarDesc}>
                Try adding a red or green vegetable to your next meal for varied
                micronutrients.
              </Text>
            </View>
          </View>
        </View>

      </ScrollView>

      <BottomNav currentScreen="NUTRITION_SUMMARY" onNavigate={onNavigate} />
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
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 100,
  },
  goalBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${colors.primary}15`,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    alignSelf: 'flex-start',
    gap: 8,
    marginBottom: 4,
  },
  goalBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  pageTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: colors.text,
  },
  pageSubtitle: {
    fontSize: 14,
    color: colors.gray[500],
    marginTop: 2,
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.divider,
    padding: 14,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  statIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: `${colors.primary}15`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.gray[500],
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '900',
    color: colors.text,
  },
  statUnit: {
    fontSize: 10,
    color: colors.gray[500],
    marginTop: 2,
  },
  progressBar: {
    height: 6,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 3,
    overflow: 'hidden',
    marginTop: 16,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 3,
  },
  progressHint: {
    fontSize: 9,
    color: colors.gray[500],
    marginTop: 6,
    fontStyle: 'italic',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  pillarCard: {
    flexDirection: 'row',
    backgroundColor: `${colors.secondary}08`,
    borderWidth: 1,
    borderColor: `${colors.secondary}15`,
    borderRadius: 12,
    padding: 16,
    gap: 16,
    marginBottom: 12,
  },
  pillarCardBlue: {
    backgroundColor: 'rgba(59,130,246,0.08)',
    borderColor: 'rgba(59,130,246,0.15)',
  },
  pillarIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.divider,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillarIconBlue: {},
  pillarContent: {
    flex: 1,
  },
  pillarTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  pillarDesc: {
    fontSize: 12,
    color: colors.gray[400],
    marginTop: 4,
    lineHeight: 18,
  },
  pillarTarget: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: 8,
  },
  disclaimerBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: `${colors.secondary}12`,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: `${colors.secondary}30`,
    marginBottom: 16,
  },
  disclaimerTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.secondary,
    marginBottom: 2,
  },
  disclaimerText: {
    fontSize: 13,
    color: colors.gray[400],
    lineHeight: 18,
  },
});
