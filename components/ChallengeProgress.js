import React, { useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useTheme } from "../styles/ThemeContext";
import { TWENTY_ONE_DAY_CHALLENGES, getPhaseFromDay } from "../constants";
import { BottomNav } from "./BottomNav";

export const ChallengeProgress = ({
  challengeStates,
  focusPillar,
  onSelectChallenge,
  onNavigate,
}) => {
  const { colors, isDark, toggleTheme } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const pillars = Object.keys(TWENTY_ONE_DAY_CHALLENGES).sort((a, b) => {
    if (a === focusPillar) return -1;
    if (b === focusPillar) return 1;
    return 0;
  });
  const todayKey = new Date().toISOString().split("T")[0];

  // Calculate overall stats
  const totalChallenges = pillars.length;
  const activeChallenges = pillars.filter(
    (id) => challengeStates[id]?.currentDay > 0,
  ).length;
  const completedChallenges = pillars.filter(
    (id) => challengeStates[id]?.currentDay >= 21,
  ).length;

  // Calculate total streak
  const totalStreak = pillars.reduce(
    (sum, id) => sum + (challengeStates[id]?.streakDays || 0),
    0,
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => onNavigate("DASHBOARD")}
        >
          <MaterialIcons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>21-Day Challenges</Text>
        <TouchableOpacity style={styles.backButton} onPress={toggleTheme}>
          <MaterialIcons name={isDark ? "light-mode" : "dark-mode"} size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.pageTitle}>Your Challenge Journey</Text>
        <Text style={styles.pageSubtitle}>
          Master each pillar with progressive 21-day challenges
        </Text>

        {/* Overall Progress Card */}
        <View style={styles.overallCard}>
          <View style={styles.overallHeader}>
            <View style={styles.overallIconContainer}>
              <MaterialIcons
                name="emoji-events"
                size={28}
                color={colors.warning}
              />
            </View>
            <View style={styles.overallInfo}>
              <Text style={styles.overallTitle}>Overall Progress</Text>
              <Text style={styles.overallSubtitle}>
                {activeChallenges} active, {completedChallenges} completed
              </Text>
            </View>
          </View>

          <View style={styles.overallStats}>
            <View style={styles.overallStatItem}>
              <Text style={styles.overallStatValue}>{activeChallenges}</Text>
              <Text style={styles.overallStatLabel}>Active</Text>
            </View>
            <View style={styles.overallStatDivider} />
            <View style={styles.overallStatItem}>
              <Text style={styles.overallStatValue}>{totalStreak}</Text>
              <Text style={styles.overallStatLabel}>Total Streak</Text>
            </View>
            <View style={styles.overallStatDivider} />
            <View style={styles.overallStatItem}>
              <Text style={styles.overallStatValue}>{completedChallenges}</Text>
              <Text style={styles.overallStatLabel}>Mastered</Text>
            </View>
          </View>
        </View>

        {/* Challenge Cards */}
        <Text style={styles.sectionTitle}>All Challenges</Text>
        <View style={styles.challengesList}>
          {pillars.map((pillarId) => {
            const challenge = TWENTY_ONE_DAY_CHALLENGES[pillarId];
            const state = challengeStates[pillarId] || {
              currentDay: 1,
              completedTasks: {},
              streakDays: 0,
            };
            const { currentDay, completedTasks, streakDays } = state;
            const currentPhase = getPhaseFromDay(currentDay);
            const progressPercent = Math.min(100, Math.round((currentDay / 21) * 100));
            const isCompleted = currentDay >= 21;
            const isLocked = focusPillar && pillarId !== focusPillar && !isCompleted;

            // Get today's completion status
            const todayTasks = completedTasks[todayKey] || [];
            const availableTasks = challenge.tasks.filter(
              (t) => t.unlockedDay <= currentDay,
            );
            const todayComplete =
              availableTasks.length > 0 &&
              availableTasks.every((t) => todayTasks.includes(t.id));

            const phaseLabel = isCompleted
              ? "Challenge Complete!"
              : isLocked
                ? "Complete your focus pillar first"
                : currentPhase === 5
                  ? "Day 21 — Celebration!"
                  : `Phase ${currentPhase} — Day ${currentDay}`;

            return (
              <TouchableOpacity
                key={pillarId}
                style={[
                  styles.challengeCard,
                  isCompleted && styles.challengeCardCompleted,
                  todayComplete && !isLocked && styles.challengeCardTodayComplete,
                  isLocked && styles.challengeCardLocked,
                ]}
                onPress={() => !isLocked && onSelectChallenge(pillarId)}
                activeOpacity={isLocked ? 1 : 0.7}
              >
                <View style={styles.challengeHeader}>
                  <View
                    style={[
                      styles.challengeIcon,
                      isCompleted && styles.challengeIconCompleted,
                      todayComplete && !isLocked && styles.challengeIconTodayComplete,
                      isLocked && styles.challengeIconLocked,
                    ]}
                  >
                    <MaterialIcons
                      name={isLocked ? "lock" : challenge.icon}
                      size={24}
                      color={
                        isLocked
                          ? colors.gray[500]
                          : isCompleted || todayComplete
                            ? colors.textInverse
                            : colors.primary
                      }
                    />
                  </View>
                  <View style={styles.challengeInfo}>
                    <Text style={[styles.challengeName, isLocked && styles.lockedText]}>
                      {challenge.name}
                    </Text>
                    <Text style={[styles.challengeWeek, isLocked && styles.lockedSubtext]}>
                      {phaseLabel}
                    </Text>
                  </View>
                  <View style={styles.challengeRight}>
                    {todayComplete && !isCompleted && !isLocked && (
                      <View style={styles.todayBadge}>
                        <MaterialIcons
                          name="check"
                          size={12}
                          color={colors.primary}
                        />
                      </View>
                    )}
                    {isCompleted && (
                      <View style={styles.completeBadge}>
                        <MaterialIcons
                          name="star"
                          size={14}
                          color={colors.warning}
                        />
                      </View>
                    )}
                    {isLocked ? (
                      <MaterialIcons
                        name="lock-outline"
                        size={20}
                        color={colors.gray[600]}
                      />
                    ) : (
                      <MaterialIcons
                        name="chevron-right"
                        size={24}
                        color={colors.gray[500]}
                      />
                    )}
                  </View>
                </View>

                {/* Progress Bar */}
                <View style={styles.challengeProgress}>
                  <View style={[styles.progressBarBg, isLocked && { opacity: 0.4 }]}>
                    <View
                      style={[
                        styles.progressBarFill,
                        { width: `${isLocked ? 0 : progressPercent}%` },
                        isCompleted && styles.progressBarFillComplete,
                      ]}
                    />
                  </View>
                  <Text style={[styles.progressText, isLocked && styles.lockedSubtext]}>
                    {isLocked ? "—" : `${progressPercent}%`}
                  </Text>
                </View>

                {/* Stats Row */}
                {!isLocked && (
                  <View style={styles.challengeStats}>
                    <View style={styles.challengeStat}>
                      <MaterialIcons
                        name="local-fire-department"
                        size={14}
                        color={colors.secondary}
                      />
                      <Text style={styles.challengeStatText}>
                        {streakDays} day streak
                      </Text>
                    </View>
                    <View style={styles.challengeStat}>
                      <MaterialIcons
                        name="assignment"
                        size={14}
                        color={colors.gray[500]}
                      />
                      <Text style={styles.challengeStatText}>
                        {availableTasks.length} task{availableTasks.length !== 1 ? "s" : ""} active
                      </Text>
                    </View>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Info Section */}
        <View style={styles.infoCard}>
          <MaterialIcons name="info-outline" size={20} color={colors.primary} />
          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>How Challenges Work</Text>
            <Text style={styles.infoText}>
              Your weakest pillar is unlocked first. Complete its 21-day
              challenge to unlock the next pillar. Each challenge has 4
              progressive phases. Complete Day 21 to unlock a free call and
              training session with Coach Al!
            </Text>
          </View>
        </View>
      </ScrollView>

      <BottomNav currentScreen="CHALLENGE_PROGRESS" onNavigate={onNavigate} />
    </View>
  );
};

const makeStyles = (colors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 100,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.text,
  },
  pageSubtitle: {
    fontSize: 14,
    color: colors.gray[500],
    marginTop: 4,
    marginBottom: 24,
  },
  overallCard: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: 24,
    borderWidth: 2,
    borderColor: `${colors.warning}30`,
    marginBottom: 32,
  },
  overallHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  overallIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: `${colors.warning}20`,
    alignItems: "center",
    justifyContent: "center",
  },
  overallInfo: {
    marginLeft: 16,
  },
  overallTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text,
  },
  overallSubtitle: {
    fontSize: 12,
    color: colors.gray[500],
    marginTop: 2,
  },
  overallStats: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  overallStatItem: {
    alignItems: "center",
    flex: 1,
  },
  overallStatValue: {
    fontSize: 28,
    fontWeight: "700",
    color: colors.text,
  },
  overallStatLabel: {
    fontSize: 10,
    color: colors.gray[500],
    textTransform: "uppercase",
    letterSpacing: 1,
    marginTop: 4,
  },
  overallStatDivider: {
    width: 1,
    height: 40,
    backgroundColor: colors.overlay,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 16,
  },
  challengesList: {
    gap: 16,
    marginBottom: 24,
  },
  challengeCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.divider,
  },
  challengeCardCompleted: {
    borderColor: `${colors.warning}40`,
    backgroundColor: `${colors.warning}10`,
  },
  challengeCardTodayComplete: {
    borderColor: `${colors.primary}40`,
  },
  challengeCardLocked: {
    opacity: 0.55,
    borderColor: colors.gray[700],
  },
  challengeHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  challengeIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: `${colors.primary}15`,
    alignItems: "center",
    justifyContent: "center",
  },
  challengeIconCompleted: {
    backgroundColor: colors.warning,
  },
  challengeIconTodayComplete: {
    backgroundColor: colors.primary,
  },
  challengeIconLocked: {
    backgroundColor: colors.gray[700],
  },
  lockedText: {
    color: colors.gray[500],
  },
  lockedSubtext: {
    color: colors.gray[600],
  },
  challengeInfo: {
    flex: 1,
    marginLeft: 12,
  },
  challengeName: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text,
  },
  challengeWeek: {
    fontSize: 12,
    color: colors.gray[500],
    marginTop: 2,
  },
  challengeRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  todayBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: `${colors.primary}20`,
    alignItems: "center",
    justifyContent: "center",
  },
  completeBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: `${colors.warning}20`,
    alignItems: "center",
    justifyContent: "center",
  },
  challengeProgress: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  progressBarBg: {
    flex: 1,
    height: 6,
    backgroundColor: colors.overlay,
    borderRadius: 3,
    overflow: "hidden",
    marginRight: 12,
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: colors.primary,
    borderRadius: 3,
  },
  progressBarFillComplete: {
    backgroundColor: colors.warning,
  },
  progressText: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.gray[400],
    width: 35,
    textAlign: "right",
  },
  challengeStats: {
    flexDirection: "row",
    gap: 16,
  },
  challengeStat: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  challengeStatText: {
    fontSize: 12,
    color: colors.gray[500],
  },
  infoCard: {
    flexDirection: "row",
    backgroundColor: `${colors.primary}10`,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: `${colors.primary}20`,
  },
  infoContent: {
    flex: 1,
    marginLeft: 12,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.primary,
    marginBottom: 4,
  },
  infoText: {
    fontSize: 12,
    color: colors.gray[400],
    lineHeight: 18,
  },
});
