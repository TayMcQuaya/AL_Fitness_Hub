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
import { PILLARS } from '../constants';

export const AssessmentResults = ({ userName, pillarScores, focusPillar, onContinue }) => {
  const { colors, isDark, toggleTheme } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const focusPillarName = PILLARS.find((p) => p.id === focusPillar)?.name || 'Wellness';

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={{ width: 40 }} />
        <Text style={styles.headerTitle}>Your Results</Text>
        <TouchableOpacity onPress={toggleTheme} style={styles.themeToggle}>
          <MaterialIcons
            name={isDark ? 'light-mode' : 'dark-mode'}
            size={20}
            color={colors.text}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.greetingSection}>
          <View style={styles.iconCircle}>
            <MaterialIcons name="emoji-events" size={32} color={colors.success} />
          </View>
          <Text style={styles.greeting}>
            Welcome{userName ? `, ${userName}` : ''}!
          </Text>
          <Text style={styles.greetingSub}>
            Here are your 7 Pillar scores from the assessment.
          </Text>
        </View>

        <View style={styles.scoresCard}>
          <Text style={styles.scoresTitle}>Your 7 Pillar Scores</Text>
          {PILLARS.map((pillar) => {
            const score = pillarScores?.[pillar.id] ?? 5;
            const isFocus = pillar.id === focusPillar;
            return (
              <View key={pillar.id} style={styles.scoreRow}>
                <View style={styles.scoreLabelRow}>
                  <MaterialIcons
                    name={pillar.icon}
                    size={16}
                    color={isFocus ? colors.secondary : colors.gray[400]}
                  />
                  <Text
                    style={[
                      styles.scoreLabel,
                      isFocus && { color: colors.secondary, fontWeight: '700' },
                    ]}
                  >
                    {pillar.name}
                    {isFocus ? ' (Focus)' : ''}
                  </Text>
                  <Text
                    style={[
                      styles.scoreValue,
                      isFocus && { color: colors.secondary },
                    ]}
                  >
                    {score}/10
                  </Text>
                </View>
                <View style={styles.scoreBarBg}>
                  <View
                    style={[
                      styles.scoreBarFill,
                      {
                        width: `${score * 10}%`,
                        backgroundColor: isFocus
                          ? colors.secondary
                          : colors.primary,
                      },
                    ]}
                  />
                </View>
              </View>
            );
          })}
          <View style={styles.focusCallout}>
            <MaterialIcons name="trending-up" size={16} color={colors.secondary} />
            <Text style={styles.focusCalloutText}>
              Your program starts with{' '}
              <Text style={{ fontWeight: '700', color: colors.secondary }}>
                {focusPillarName}
              </Text>
              {' '} — your biggest opportunity for growth
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.ctaButton}
          onPress={onContinue}
          activeOpacity={0.8}
        >
          <Text style={styles.ctaText}>Let's Go</Text>
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
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  themeToggle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 24,
    paddingBottom: 40,
  },
  greetingSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: `${colors.primary}15`,
    borderWidth: 2,
    borderColor: colors.success,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  greeting: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  greetingSub: {
    fontSize: 14,
    color: colors.gray[400],
    textAlign: 'center',
    lineHeight: 20,
  },
  scoresCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.divider,
    marginBottom: 20,
  },
  scoresTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 14,
  },
  scoreRow: {
    marginBottom: 10,
  },
  scoreLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  scoreLabel: {
    flex: 1,
    fontSize: 13,
    color: colors.gray[400],
  },
  scoreValue: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.gray[400],
  },
  scoreBarBg: {
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.overlayMedium || colors.overlay,
    overflow: 'hidden',
  },
  scoreBarFill: {
    height: 6,
    borderRadius: 3,
  },
  focusCallout: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  focusCalloutText: {
    fontSize: 13,
    color: colors.gray[400],
    flex: 1,
  },
  footer: {
    padding: 24,
    paddingBottom: 32,
  },
  ctaButton: {
    height: 64,
    backgroundColor: colors.primary,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  ctaText: {
    fontSize: 18,
    fontWeight: '900',
    color: colors.textInverse,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
});
