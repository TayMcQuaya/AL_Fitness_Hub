import React, { useMemo, useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
  Linking,
  Modal,
  Animated,
  Dimensions,
} from "react-native";
import * as Clipboard from "expo-clipboard";
import { MaterialIcons } from "@expo/vector-icons";
import { useTheme } from "../styles/ThemeContext";
import {
  WORKOUTS,
  PILLARS,
  TWENTY_ONE_DAY_CHALLENGES,
  getPhaseFromDay,
  DAY_21_CHALLENGES,
  DAY_21_REWARDS,
  PHASE_ENCOURAGEMENT,
} from "../constants";
import { getMissedDays } from "../lib/storage";
import { BottomNav } from "./BottomNav";

const DEV_MODE = true;
const CONFETTI_COLORS = ["#13ec13", "#ec7f13", "#FFD700", "#FF6B6B", "#4ECDC4", "#A78BFA"];
const CONFETTI_COUNT = 24;
const SCREEN_WIDTH = Dimensions.get("window").width;

const ConfettiOverlay = ({ trigger }) => {
  const pieces = useRef(
    Array.from({ length: CONFETTI_COUNT }, () => ({
      animY: new Animated.Value(0),
      animX: new Animated.Value(0),
      animOpacity: new Animated.Value(1),
      animRotate: new Animated.Value(0),
      startX: Math.random() * SCREEN_WIDTH,
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      size: 5 + Math.random() * 7,
      isSquare: Math.random() > 0.5,
    })),
  ).current;

  useEffect(() => {
    if (!trigger) return;
    pieces.forEach((p) => {
      p.animY.setValue(0);
      p.animX.setValue(0);
      p.animOpacity.setValue(1);
      p.animRotate.setValue(0);
    });
    const anims = pieces.map((p, i) =>
      Animated.parallel([
        Animated.timing(p.animY, {
          toValue: 500 + Math.random() * 300,
          duration: 2200 + Math.random() * 1200,
          delay: i * 40,
          useNativeDriver: false,
        }),
        Animated.timing(p.animX, {
          toValue: (Math.random() - 0.5) * 140,
          duration: 2200 + Math.random() * 1200,
          delay: i * 40,
          useNativeDriver: false,
        }),
        Animated.timing(p.animOpacity, {
          toValue: 0,
          duration: 2200 + Math.random() * 1200,
          delay: i * 40,
          useNativeDriver: false,
        }),
        Animated.timing(p.animRotate, {
          toValue: 3 + Math.random() * 5,
          duration: 2200 + Math.random() * 1200,
          delay: i * 40,
          useNativeDriver: false,
        }),
      ]),
    );
    Animated.parallel(anims).start();
  }, [trigger]);

  if (!trigger) return null;

  return (
    <View
      style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, zIndex: 999 }}
      pointerEvents="none"
    >
      {pieces.map((p, i) => {
        const spin = p.animRotate.interpolate({
          inputRange: [0, 10],
          outputRange: ["0deg", "3600deg"],
        });
        return (
          <Animated.View
            key={i}
            style={{
              position: "absolute",
              left: p.startX,
              top: -10,
              width: p.size,
              height: p.isSquare ? p.size : p.size * 0.5,
              backgroundColor: p.color,
              borderRadius: p.isSquare ? 2 : p.size,
              opacity: p.animOpacity,
              transform: [
                { translateY: p.animY },
                { translateX: p.animX },
                { rotate: spin },
              ],
            }}
          />
        );
      })}
    </View>
  );
};

export const Dashboard = ({
  userName,
  focusPillarId,
  challengeState,
  onToggleLog,
  onNavigate,
  onSelectWorkout,
  streak,
  totalDaysLogged,
  onSetDay,
  onDevSimulate,
  onReset,
}) => {
  const { colors, isDark, toggleTheme } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const focusPillar = PILLARS.find((p) => p.id === focusPillarId) || PILLARS[0];
  const [codeCopied, setCodeCopied] = useState(false);
  const [confettiKey, setConfettiKey] = useState(0);
  const [showMilestoneModal, setShowMilestoneModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);

  // Derive challenge data
  const challenge = TWENTY_ONE_DAY_CHALLENGES[focusPillarId];
  const { currentDay, completedTasks, streakDays, acknowledgedMilestones } = challengeState || {};
  const ackMilestones = acknowledgedMilestones || [];
  const todayKey = new Date().toISOString().split("T")[0];
  const todayCompletedTasks = (completedTasks && completedTasks[todayKey]) || [];
  const availableTasks = challenge
    ? challenge.tasks.filter((t) => t.unlockedDay <= (currentDay || 1))
    : [];
  const isLoggedToday =
    availableTasks.length > 0 &&
    availableTasks.every((t) => todayCompletedTasks.includes(t.id));
  const isCompleted = (currentDay || 1) >= 21;
  const currentPhase = getPhaseFromDay(currentDay || 1);
  const completedDays = (challengeState && challengeState.completedDays) || 0;
  const missedDays = getMissedDays(challengeState);
  const encouragement = PHASE_ENCOURAGEMENT[focusPillarId];
  const day21Challenge = DAY_21_CHALLENGES[focusPillarId];
  const hasTrigger = (currentDay || 1) >= 5;

  // Build list of active (unacknowledged) milestone triggers
  const activeMilestones = [];
  if (!isCompleted && (currentDay || 1) >= 5 && !ackMilestones.includes(5) && encouragement) {
    activeMilestones.push({ icon: "emoji-emotions", iconColor: colors.primary, label: "You're Building Momentum!", text: encouragement });
  }
  if (!isCompleted && (currentDay || 1) >= 10 && !ackMilestones.includes(10)) {
    activeMilestones.push({ icon: "play-circle-filled", iconColor: colors.secondary, label: "Mid-Challenge Video", text: `Watch Coach Al's motivation and tips for your ${focusPillar.name.toLowerCase()} journey.` });
  }
  if (!isCompleted && (currentDay || 1) >= 15 && !ackMilestones.includes(15)) {
    activeMilestones.push({ icon: "local-offer", iconColor: colors.warning, label: "15% Off Coaching!", text: null, isDiscount: true });
  }

  // Auto-show modal when milestones appear
  const prevDayRef = useRef(currentDay);
  useEffect(() => {
    if ((currentDay || 1) >= 5 && prevDayRef.current !== currentDay) {
      const milestones = [5, 10, 15, 21];
      if (milestones.includes(currentDay)) {
        setConfettiKey((k) => k + 1);
        if (activeMilestones.length > 0) setShowMilestoneModal(true);
      }
    }
    prevDayRef.current = currentDay;
  }, [currentDay]);

  return (
    <View style={styles.container}>
      <ConfettiOverlay trigger={confettiKey || null} />
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Image
            source={{ uri: "https://picsum.photos/100?user" }}
            style={styles.avatar}
          />
          <View>
            <Text style={styles.welcomeLabel}>Welcome back</Text>
            <Text style={styles.userName}>{userName}</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.notifButton}
          onPress={toggleTheme}
        >
          <MaterialIcons
            name={isDark ? "light-mode" : "dark-mode"}
            size={24}
            color={colors.text}
          />
        </TouchableOpacity>
      </View>

      {DEV_MODE && onSetDay && (
        <View style={styles.devPanel}>
          <Text style={styles.devPanelLabel}>DEV: Jump to Phase</Text>
          <View style={styles.devButtonRow}>
            {[
              { phase: 1, day: 1 },
              { phase: 2, day: 6 },
              { phase: 3, day: 11 },
              { phase: 4, day: 16 },
            ].map(({ phase, day }) => (
              <TouchableOpacity
                key={phase}
                style={[
                  styles.devWeekButton,
                  currentPhase === phase && styles.devWeekButtonActive,
                ]}
                onPress={() => onSetDay(focusPillarId, day)}
              >
                <Text
                  style={[
                    styles.devWeekButtonText,
                    currentPhase === phase && styles.devWeekButtonTextActive,
                  ]}
                >
                  P{phase}
                </Text>
                <Text style={styles.devWeekButtonSub}>Day {day}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={[styles.devWeekButton, styles.devCompleteButton]}
              onPress={() => onSetDay(focusPillarId, 21)}
            >
              <Text style={styles.devWeekButtonText}>D21</Text>
              <Text style={styles.devWeekButtonSub}>Done</Text>
            </TouchableOpacity>
          </View>
          {onDevSimulate && (
            <>
              <Text style={[styles.devPanelLabel, { marginTop: 10 }]}>
                DEV: Time Simulation
              </Text>
              <View style={styles.devButtonRow}>
                <TouchableOpacity
                  style={styles.devWeekButton}
                  onPress={() => onDevSimulate(focusPillarId, "back1")}
                >
                  <Text style={styles.devWeekButtonText}>-1 Day</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.devWeekButton}
                  onPress={() => onDevSimulate(focusPillarId, "forward1")}
                >
                  <Text style={styles.devWeekButtonText}>+1 Day</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.devWeekButton}
                  onPress={() => onDevSimulate(focusPillarId, "reset")}
                >
                  <Text style={styles.devWeekButtonText}>Reset</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.devInfoText}>
                Start: {challengeState?.startDate || "none"} | Day: {currentDay || 1}/21 | Done: {completedDays} | Missed: {missedDays}
              </Text>
              <Text style={styles.devInfoText}>
                Streak: {streak || 0} | Total Logged: {totalDaysLogged || 0}
              </Text>
            </>
          )}
        </View>
      )}

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.titleSection}>
          <Text style={styles.heroTitle}>
            It's time to fix your{"\n"}
            <Text style={styles.heroAccent}>{focusPillar.name}</Text>.
          </Text>
          <View style={styles.focusBadge}>
            <MaterialIcons name="bolt" size={16} color={colors.primary} />
            <Text style={styles.focusBadgeText}>Active Focus Pillar</Text>
          </View>
        </View>

        <View
          style={[
            styles.checkinCard,
            isLoggedToday && styles.checkinCardLogged,
          ]}
        >
          <View style={styles.checkinHeader}>
            <View style={styles.checkinLeft}>
              <View
                style={[
                  styles.checkinIcon,
                  isLoggedToday && styles.checkinIconLogged,
                ]}
              >
                <MaterialIcons
                  name={challenge ? challenge.icon : "air"}
                  size={28}
                  color={isLoggedToday ? colors.textInverse : colors.primary}
                />
              </View>
              <View>
                <Text style={styles.checkinTitle}>
                  {focusPillar.name} Check-in
                </Text>
                <Text style={styles.checkinSubtitle}>
                  {isCompleted
                    ? "Challenge Complete!"
                    : isLoggedToday
                      ? "Completed for today!"
                      : "Today's Focus Tasks"}
                </Text>
              </View>
            </View>
            <View style={styles.checkinStreak}>
              <Text
                style={[
                  styles.streakValue,
                  isLoggedToday && styles.streakValueActive,
                ]}
              >
                {currentDay || 1}/21
              </Text>
              <Text style={styles.streakLabel}>Challenge Day</Text>
            </View>
          </View>

          <View style={styles.progressRow}>
            <View style={styles.progressBarBg}>
              <View
                style={[
                  styles.progressBarFill,
                  { width: `${Math.min(100, Math.round(((currentDay || 1) / 21) * 100))}%` },
                ]}
              />
            </View>
            <Text style={styles.progressLabel}>
              {completedDays} day{completedDays !== 1 ? "s" : ""} logged
              {missedDays > 0 ? `  •  ${missedDays} missed` : ""}
            </Text>
          </View>

          {missedDays > 0 && !isLoggedToday && (
            <View style={styles.missedBanner}>
              <MaterialIcons name="warning-amber" size={18} color={colors.warning} />
              <Text style={styles.missedBannerText}>
                You missed {missedDays} day{missedDays !== 1 ? "s" : ""}.{!isCompleted ? "\nNo worries — check in today to keep going!" : ""}
              </Text>
            </View>
          )}

          {isCompleted ? (
            <View style={styles.completionBanner}>
              <MaterialIcons name="emoji-events" size={32} color={colors.warning} />
              <Text style={styles.completionText}>
                You've completed the 21-day {focusPillar.name} challenge!
              </Text>
            </View>
          ) : (
            <>
            <Text style={styles.dailyTasksHeading}>DAILY TASK{availableTasks.length !== 1 ? 'S' : ''}</Text>
            <View style={styles.tasksList}>
              {availableTasks.map((task) => {
                const done = todayCompletedTasks.includes(task.id);
                return (
                  <View
                    key={task.id}
                    style={[styles.taskCard, done && styles.taskCardDone]}
                  >
                    <View
                      style={[
                        styles.taskCheckbox,
                        done && styles.taskCheckboxDone,
                      ]}
                    >
                      <MaterialIcons
                        name={done ? "check" : "radio-button-unchecked"}
                        size={done ? 16 : 20}
                        color={done ? colors.textInverse : colors.gray[500]}
                      />
                    </View>
                    <View style={styles.taskContent}>
                      <Text style={[styles.taskName, done && styles.taskNameDone]}>
                        {task.name}
                      </Text>
                      <Text style={styles.taskDesc}>{task.description}</Text>
                    </View>
                  </View>
                );
              })}
            </View>
            </>
          )}

          {!isCompleted && (
            <TouchableOpacity
              style={[styles.logButton, isLoggedToday && styles.logButtonLogged]}
              onPress={() => {
                onToggleLog();
                setConfettiKey((k) => k + 1);
              }}
              activeOpacity={0.8}
              disabled={isLoggedToday}
            >
              <MaterialIcons
                name={isLoggedToday ? "done-all" : "check-circle"}
                size={24}
                color={isLoggedToday ? colors.primary : colors.textInverse}
              />
              <Text
                style={[
                  styles.logButtonText,
                  isLoggedToday && styles.logButtonTextLogged,
                ]}
              >
                {isLoggedToday
                  ? "Daily Tasks Complete!"
                  : "Tap to Complete Daily Tasks"}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Milestone indicator — tap to reopen modal */}
        {!isCompleted && activeMilestones.length > 0 && (
          <TouchableOpacity
            style={styles.milestoneIndicator}
            onPress={() => setShowMilestoneModal(true)}
            activeOpacity={0.7}
          >
            <MaterialIcons name="stars" size={22} color={colors.warning} />
            <Text style={styles.milestoneIndicatorText}>
              {activeMilestones.length} Milestone{activeMilestones.length > 1 ? "s" : ""} Unlocked
            </Text>
            <MaterialIcons name="chevron-right" size={20} color={colors.warning} />
          </TouchableOpacity>
        )}

        {/* Milestone Modal */}
        <Modal
          visible={showMilestoneModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowMilestoneModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <View style={styles.modalHeader}>
                <MaterialIcons name="stars" size={32} color={colors.warning} />
                <Text style={styles.modalTitle}>Milestone{activeMilestones.length > 1 ? "s" : ""} Unlocked!</Text>
              </View>
              <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
                {activeMilestones.map((m, idx) => (
                  <View key={idx} style={styles.modalMilestone}>
                    <MaterialIcons name={m.icon} size={28} color={m.iconColor} />
                    <View style={styles.modalMilestoneContent}>
                      <Text style={styles.modalMilestoneLabel}>{m.label}</Text>
                      {m.isDiscount ? (
                        <>
                          <Text style={styles.modalMilestoneText}>
                            Use code{" "}
                            <Text style={{ fontWeight: "800", color: colors.text }}>PILLAR15</Text>
                            {" "}for 15% off coaching packages. You've earned it!
                          </Text>
                          <TouchableOpacity
                            style={[styles.copyButton, codeCopied && styles.copyButtonCopied]}
                            onPress={async () => {
                              await Clipboard.setStringAsync("PILLAR15");
                              setCodeCopied(true);
                              setTimeout(() => setCodeCopied(false), 2000);
                            }}
                            activeOpacity={0.7}
                          >
                            <MaterialIcons
                              name={codeCopied ? "check" : "content-copy"}
                              size={14}
                              color={codeCopied ? colors.primary : colors.text}
                            />
                            <Text style={[styles.copyButtonText, codeCopied && { color: colors.primary }]}>
                              {codeCopied ? "Copied!" : "Copy Code"}
                            </Text>
                          </TouchableOpacity>
                        </>
                      ) : (
                        <Text style={styles.modalMilestoneText}>{m.text}</Text>
                      )}
                    </View>
                  </View>
                ))}
              </ScrollView>
              <TouchableOpacity
                style={styles.modalDismiss}
                onPress={() => setShowMilestoneModal(false)}
                activeOpacity={0.8}
              >
                <Text style={styles.modalDismissText}>Got It!</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {isCompleted && day21Challenge && (
          <View style={styles.celebrationCard}>
            <View style={styles.celebrationHeader}>
              <MaterialIcons name="celebration" size={28} color={colors.warning} />
              <Text style={styles.celebrationTitle}>Day 21 — Cherry on Top!</Text>
            </View>
            <View style={styles.cherryOnTopCard}>
              <MaterialIcons name={day21Challenge.icon} size={24} color={colors.primary} />
              <View style={styles.cherryOnTopContent}>
                <Text style={styles.cherryOnTopName}>{day21Challenge.name}</Text>
                <Text style={styles.cherryOnTopDesc}>{day21Challenge.description}</Text>
              </View>
            </View>
            <View style={styles.rewardsSection}>
              <Text style={styles.rewardsTitle}>Your Rewards</Text>
              {DAY_21_REWARDS.map((reward, idx) => (
                <View key={idx} style={styles.rewardItem}>
                  <MaterialIcons name="card-giftcard" size={18} color={colors.primary} />
                  <Text style={styles.rewardText}>{reward}</Text>
                </View>
              ))}
            </View>
            <TouchableOpacity
              style={styles.scheduleButton}
              onPress={() => Linking.openURL("https://calendly.com")}
              activeOpacity={0.7}
            >
              <MaterialIcons name="event" size={20} color={colors.textInverse} />
              <Text style={styles.scheduleButtonText}>Schedule Your Free Session</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Day 21 Recap — always show below celebration card */}
        {isCompleted && (
          <>
            <View style={styles.triggerCard}>
              <MaterialIcons name="emoji-emotions" size={24} color={colors.primary} />
              <View style={styles.triggerContent}>
                <Text style={styles.triggerLabel}>Look How Far You've Come!</Text>
                <Text style={styles.triggerText}>
                  21 days of showing up for yourself — that takes real commitment. You've built habits that can last a lifetime. Coach Al is proud of you!
                </Text>
              </View>
            </View>

            <View style={styles.triggerCard}>
              <MaterialIcons name="play-circle-filled" size={24} color={colors.secondary} />
              <View style={styles.triggerContent}>
                <Text style={styles.triggerLabel}>Watch Your Motivation Video</Text>
                <Text style={styles.triggerText}>
                  You made it all 21 days! Watch Coach Al's message and tips for continuing your {focusPillar.name.toLowerCase()} journey beyond the challenge.
                </Text>
              </View>
            </View>

            <View style={styles.triggerCard}>
              <MaterialIcons name="local-offer" size={24} color={colors.warning} />
              <View style={styles.triggerContent}>
                <Text style={styles.triggerLabel}>Your Coaching Discount</Text>
                <Text style={styles.triggerText}>
                  Use code{" "}
                  <Text style={{ fontWeight: "800", color: colors.text }}>PILLAR15</Text>
                  {" "}for 15% off coaching packages. You've earned it!
                </Text>
                <TouchableOpacity
                  style={[styles.copyButton, codeCopied && styles.copyButtonCopied]}
                  onPress={async () => {
                    await Clipboard.setStringAsync("PILLAR15");
                    setCodeCopied(true);
                    setTimeout(() => setCodeCopied(false), 2000);
                  }}
                  activeOpacity={0.7}
                >
                  <MaterialIcons
                    name={codeCopied ? "check" : "content-copy"}
                    size={14}
                    color={codeCopied ? colors.primary : colors.text}
                  />
                  <Text style={[styles.copyButtonText, codeCopied && { color: colors.primary }]}>
                    {codeCopied ? "Copied!" : "Copy Code"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            <TouchableOpacity
              style={styles.quickActionCard}
              onPress={() => onNavigate("MEDITATION_LIST")}
            >
              <View style={styles.quickActionIcon}>
                <MaterialIcons
                  name="self-improvement"
                  size={24}
                  color={colors.secondary}
                />
              </View>
              <Text style={styles.quickActionTitle}>Start Meditation</Text>
              <Text style={styles.quickActionSub}>Guided Sessions</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.quickActionCard}
              onPress={() => onNavigate("BOOK")}
            >
              <View style={styles.quickActionIcon}>
                <MaterialIcons
                  name="auto-stories"
                  size={24}
                  color={colors.primary}
                />
              </View>
              <Text style={styles.quickActionTitle}>Read the Book</Text>
              <Text style={styles.quickActionSub}>"Burnt Out & Ready"</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 21-Day Challenges - Big Prominent Card */}
        <View style={styles.challengeCard}>
          <View style={styles.challengeHeader}>
            <View style={styles.challengeIconBig}>
              <MaterialIcons
                name="emoji-events"
                size={40}
                color={colors.warning}
              />
            </View>
            <View style={styles.challengeBadge}>
              <Text style={styles.challengeBadgeText}>NEW</Text>
            </View>
          </View>
          <Text style={styles.challengeTitleBig}>21-Day Challenges</Text>
          <Text style={styles.challengeDesc}>
            Master each pillar with progressive daily tasks. Start with 1 task,
            build up to 4 by Phase 4. Complete Day 21 to unlock rewards!
          </Text>
          <View style={styles.challengeFeatures}>
            <View style={styles.challengeFeature}>
              <MaterialIcons
                name="check-circle"
                size={16}
                color={colors.primary}
              />
              <Text style={styles.challengeFeatureText}>7 Pillars</Text>
            </View>
            <View style={styles.challengeFeature}>
              <MaterialIcons
                name="local-fire-department"
                size={16}
                color={colors.secondary}
              />
              <Text style={styles.challengeFeatureText}>Streaks</Text>
            </View>
            <View style={styles.challengeFeature}>
              <MaterialIcons name="star" size={16} color={colors.warning} />
              <Text style={styles.challengeFeatureText}>Badges</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.challengeButton}
            onPress={() => onNavigate("CHALLENGE_PROGRESS")}
            activeOpacity={0.8}
          >
            <Text style={styles.challengeButtonText}>View All Challenges</Text>
            <MaterialIcons
              name="arrow-forward"
              size={20}
              color={colors.textInverse}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Other Pillars</Text>
          <View style={styles.pillarsGrid}>
            {PILLARS.filter((p) => p.id !== focusPillarId).map((p, i) => (
              <View key={i} style={styles.lockedPillar}>
                <MaterialIcons
                  name={p.icon}
                  size={24}
                  color={colors.gray[400]}
                />
                <Text style={styles.lockedPillarName}>{p.name}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.ctaCard}>
          <Text style={styles.ctaTitle}>
            Struggling with {focusPillar.name}?
          </Text>
          <Text style={styles.ctaDesc}>
            Book a free call with Coach Al and let's fix all 7 pillars together.
          </Text>
          <TouchableOpacity
            style={styles.ctaButton}
            onPress={() => Linking.openURL("https://calendly.com")}
          >
            <Text style={styles.ctaButtonText}>Book a Free Call</Text>
            <MaterialIcons
              name="calendar-today"
              size={16}
              color={colors.textInverse}
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.resetButton}
          onPress={() => setShowResetModal(true)}
        >
          <MaterialIcons name="delete-outline" size={18} color={colors.error || "#FF6B6B"} />
          <Text style={[styles.resetButtonText, { color: colors.error || "#FF6B6B" }]}>Reset All Progress</Text>
        </TouchableOpacity>

        {/* Reset Confirmation Modal */}
        <Modal
          visible={showResetModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowResetModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <View style={styles.modalHeader}>
                <MaterialIcons name="warning" size={32} color={colors.error} />
                <Text style={styles.modalTitle}>Reset All Progress?</Text>
              </View>
              <Text style={styles.resetModalText}>
                This will erase everything — scores, streaks, challenges, and cloud data. You'll start from scratch.{"\n\n"}This cannot be undone.
              </Text>
              <TouchableOpacity
                style={styles.resetModalConfirm}
                onPress={() => {
                  setShowResetModal(false);
                  onReset();
                }}
                activeOpacity={0.8}
              >
                <Text style={styles.resetModalConfirmText}>Reset Everything</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.resetModalCancel}
                onPress={() => setShowResetModal(false)}
                activeOpacity={0.8}
              >
                <Text style={styles.resetModalCancelText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>

      <BottomNav currentScreen="DASHBOARD" onNavigate={onNavigate} />
    </View>
  );
};

const makeStyles = (colors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: 16,
    },
    userInfo: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },
    avatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      borderWidth: 2,
      borderColor: `${colors.primary}50`,
    },
    welcomeLabel: {
      fontSize: 12,
      fontWeight: "600",
      color: colors.textMuted,
    },
    userName: {
      fontSize: 14,
      fontWeight: "700",
      color: colors.text,
    },
    notifButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.surface,
      alignItems: "center",
      justifyContent: "center",
    },
    content: {
      flex: 1,
    },
    contentContainer: {
      padding: 16,
      paddingBottom: 70,
    },
    titleSection: {
      marginBottom: 32,
    },
    heroTitle: {
      fontSize: 28,
      fontWeight: "800",
      color: colors.text,
      lineHeight: 34,
    },
    heroAccent: {
      color: colors.primary,
    },
    focusBadge: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: `${colors.primary}15`,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 20,
      alignSelf: "flex-start",
      marginTop: 12,
      gap: 6,
    },
    focusBadgeText: {
      fontSize: 12,
      fontWeight: "700",
      color: colors.primary,
    },
    checkinCard: {
      backgroundColor: colors.surface,
      borderRadius: 24,
      padding: 24,
      borderWidth: 2,
      borderColor: `${colors.primary}30`,
      marginBottom: 32,
    },
    checkinCardLogged: {
      backgroundColor: `${colors.primary}20`,
      borderColor: colors.primary,
    },
    checkinHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: 24,
    },
    checkinLeft: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },
    checkinIcon: {
      width: 48,
      height: 48,
      borderRadius: 16,
      backgroundColor: `${colors.primary}15`,
      alignItems: "center",
      justifyContent: "center",
    },
    checkinIconLogged: {
      backgroundColor: colors.primary,
    },
    checkinTitle: {
      fontSize: 20,
      fontWeight: "900",
      color: colors.text,
    },
    checkinSubtitle: {
      fontSize: 12,
      color: colors.textMuted,
    },
    checkinStreak: {
      alignItems: "flex-end",
    },
    streakValue: {
      fontSize: 24,
      fontWeight: "900",
      color: colors.text,
    },
    streakValueActive: {
      color: colors.primary,
    },
    streakLabel: {
      fontSize: 8,
      fontWeight: "700",
      color: colors.textMuted,
      textTransform: "uppercase",
      letterSpacing: 1,
    },
    dailyTasksHeading: {
      fontSize: 26,
      fontWeight: "900",
      color: colors.text,
      letterSpacing: 2,
      marginBottom: 14,
      textAlign: "center",
    },
    tasksList: {
      gap: 12,
      marginBottom: 20,
    },
    taskCard: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.overlayLight,
      borderRadius: 12,
      padding: 16,
      borderWidth: 1,
      borderColor: colors.divider,
    },
    taskCardDone: {
      backgroundColor: `${colors.primary}10`,
      borderColor: `${colors.primary}25`,
    },
    taskCheckbox: {
      width: 32,
      height: 32,
      borderRadius: 16,
      borderWidth: 2,
      borderColor: colors.gray[600],
      alignItems: "center",
      justifyContent: "center",
      marginRight: 14,
    },
    taskCheckboxDone: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    taskContent: {
      flex: 1,
    },
    taskName: {
      fontSize: 20,
      fontWeight: "800",
      color: colors.text,
      marginBottom: 4,
    },
    taskNameDone: {
      color: colors.primary,
    },
    taskDesc: {
      fontSize: 18,
      fontWeight: "500",
      color: colors.text,
      lineHeight: 26,
    },
    completionBanner: {
      alignItems: "center",
      paddingVertical: 20,
      gap: 12,
    },
    completionText: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.text,
      textAlign: "center",
      lineHeight: 20,
    },
    logButton: {
      height: 56,
      backgroundColor: colors.primary,
      borderRadius: 12,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
    },
    logButtonLogged: {
      backgroundColor: `${colors.primary}15`,
      borderWidth: 1,
      borderColor: `${colors.primary}30`,
    },
    logButtonText: {
      fontSize: 14,
      fontWeight: "900",
      color: colors.textInverse,
    },
    logButtonTextLogged: {
      color: colors.primary,
    },
    section: {
      marginBottom: 32,
    },
    sectionHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 16,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: colors.text,
      marginBottom: 16,
    },
    upgradeLink: {
      fontSize: 12,
      fontWeight: "700",
      color: colors.primary,
    },
    quickActionsGrid: {
      flexDirection: "row",
      gap: 16,
    },
    quickActionCard: {
      flex: 1,
      height: 176,
      backgroundColor: colors.surface,
      borderRadius: 24,
      borderWidth: 1,
      borderColor: colors.divider,
      padding: 20,
      justifyContent: "space-between",
    },
    quickActionIcon: {
      width: 44,
      height: 44,
      borderRadius: 16,
      backgroundColor: colors.overlayLight,
      alignItems: "center",
      justifyContent: "center",
    },
    quickActionTitle: {
      fontSize: 14,
      fontWeight: "700",
      color: colors.text,
    },
    quickActionSub: {
      fontSize: 10,
      color: colors.textMuted,
    },
    pillarsGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 12,
    },
    lockedPillar: {
      width: "31%",
      aspectRatio: 1,
      backgroundColor: colors.surface,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.divider,
      alignItems: "center",
      justifyContent: "center",
      opacity: 0.75,
      gap: 8,
      position: "relative",
    },
    lockIcon: {
      position: "absolute",
      top: 4,
      right: 4,
    },
    lockedPillarName: {
      fontSize: 9,
      fontWeight: "700",
      color: colors.textMuted,
      textTransform: "uppercase",
      letterSpacing: 1,
    },
    ctaCard: {
      backgroundColor: colors.secondary,
      borderRadius: 24,
      padding: 24,
      marginBottom: 16,
    },
    ctaTitle: {
      fontSize: 20,
      fontWeight: "900",
      color: '#ffffff',
    },
    ctaDesc: {
      fontSize: 14,
      color: "rgba(255,255,255,0.8)",
      marginTop: 8,
      lineHeight: 22,
      fontWeight: "500",
    },
    ctaButton: {
      height: 48,
      backgroundColor: '#ffffff',
      borderRadius: 12,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      marginTop: 24,
    },
    ctaButtonText: {
      fontSize: 12,
      fontWeight: "900",
      color: '#000000',
      textTransform: "uppercase",
      letterSpacing: 1,
    },
    resetButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      paddingVertical: 16,
      marginTop: 8,
    },
    resetButtonText: {
      fontSize: 12,
      color: colors.gray[400],
    },
    challengeCard: {
      backgroundColor: colors.surface,
      borderRadius: 24,
      padding: 24,
      marginBottom: 32,
      borderWidth: 2,
      borderColor: colors.warning,
    },
    challengeHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: 16,
    },
    challengeIconBig: {
      width: 64,
      height: 64,
      borderRadius: 20,
      backgroundColor: `${colors.warning}25`,
      alignItems: "center",
      justifyContent: "center",
    },
    challengeBadge: {
      backgroundColor: colors.warning,
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 8,
    },
    challengeBadgeText: {
      fontSize: 10,
      fontWeight: "800",
      color: colors.textInverse,
      letterSpacing: 1,
    },
    challengeTitleBig: {
      fontSize: 22,
      fontWeight: "800",
      color: colors.text,
      marginBottom: 8,
    },
    challengeDesc: {
      fontSize: 14,
      color: colors.textSecondary,
      lineHeight: 20,
      marginBottom: 16,
    },
    challengeFeatures: {
      flexDirection: "row",
      gap: 16,
      marginBottom: 20,
    },
    challengeFeature: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
    },
    challengeFeatureText: {
      fontSize: 12,
      color: colors.gray[300],
      fontWeight: "600",
    },
    challengeButton: {
      backgroundColor: colors.warning,
      height: 52,
      borderRadius: 14,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
    },
    challengeButtonText: {
      fontSize: 16,
      fontWeight: "700",
      color: colors.textInverse,
    },
    progressRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 16,
      gap: 10,
    },
    progressBarBg: {
      flex: 1,
      height: 6,
      backgroundColor: colors.overlay,
      borderRadius: 3,
      overflow: "hidden",
    },
    progressBarFill: {
      height: "100%",
      backgroundColor: colors.primary,
      borderRadius: 3,
    },
    progressLabel: {
      fontSize: 11,
      fontWeight: "600",
      color: colors.textMuted,
      minWidth: 70,
      textAlign: "right",
    },
    missedBanner: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      backgroundColor: `${colors.warning}15`,
      borderRadius: 10,
      padding: 12,
      marginTop: 4,
    },
    missedBannerText: {
      flex: 1,
      fontSize: 12,
      color: colors.warning,
      lineHeight: 18,
    },
    devPanel: {
      backgroundColor: "rgba(239, 68, 68, 0.1)",
      borderBottomWidth: 1,
      borderBottomColor: "rgba(239, 68, 68, 0.3)",
      padding: 12,
    },
    devPanelLabel: {
      fontSize: 10,
      fontWeight: "700",
      color: "#ef4444",
      textTransform: "uppercase",
      letterSpacing: 1,
      marginBottom: 8,
      textAlign: "center",
    },
    devButtonRow: {
      flexDirection: "row",
      justifyContent: "center",
      gap: 8,
    },
    devWeekButton: {
      backgroundColor: colors.overlay,
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 8,
      alignItems: "center",
      borderWidth: 1,
      borderColor: colors.overlay,
    },
    devWeekButtonActive: {
      backgroundColor: `${colors.primary}30`,
      borderColor: colors.primary,
    },
    devWeekButtonText: {
      fontSize: 12,
      fontWeight: "700",
      color: colors.gray[400],
    },
    devWeekButtonTextActive: {
      color: colors.primary,
    },
    devWeekButtonSub: {
      fontSize: 9,
      color: colors.gray[600],
      marginTop: 2,
    },
    devCompleteButton: {
      backgroundColor: `${colors.warning}20`,
      borderColor: `${colors.warning}40`,
    },
    devInfoText: {
      fontSize: 10,
      fontFamily: "monospace",
      color: "#ef4444",
      textAlign: "center",
      marginTop: 8,
    },
    milestoneIndicator: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: `${colors.warning}15`,
      borderRadius: 14,
      padding: 14,
      marginBottom: 20,
      gap: 8,
      borderWidth: 1,
      borderColor: `${colors.warning}30`,
    },
    milestoneIndicatorText: {
      fontSize: 14,
      fontWeight: "700",
      color: colors.warning,
      flex: 1,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.7)",
      justifyContent: "center",
      alignItems: "center",
      padding: 24,
    },
    modalCard: {
      backgroundColor: colors.surface,
      borderRadius: 24,
      padding: 28,
      width: "100%",
      maxHeight: "95%",
      borderWidth: 2,
      borderColor: `${colors.warning}40`,
    },
    modalHeader: {
      alignItems: "center",
      gap: 10,
      marginBottom: 24,
    },
    modalTitle: {
      fontSize: 24,
      fontWeight: "900",
      color: colors.text,
      textAlign: "center",
    },
    modalScroll: {
      flexGrow: 0,
    },
    modalMilestone: {
      flexDirection: "row",
      backgroundColor: `${colors.primary}10`,
      borderRadius: 16,
      padding: 18,
      borderWidth: 1,
      borderColor: `${colors.primary}25`,
      marginBottom: 14,
      gap: 14,
    },
    modalMilestoneContent: {
      flex: 1,
    },
    modalMilestoneLabel: {
      fontSize: 17,
      fontWeight: "800",
      color: colors.text,
      marginBottom: 6,
    },
    modalMilestoneText: {
      fontSize: 15,
      color: colors.gray[300],
      lineHeight: 22,
    },
    modalDismiss: {
      backgroundColor: colors.primary,
      borderRadius: 14,
      paddingVertical: 16,
      alignItems: "center",
      marginTop: 10,
    },
    modalDismissText: {
      fontSize: 18,
      fontWeight: "800",
      color: colors.textInverse,
    },
    resetModalText: {
      fontSize: 15,
      color: colors.gray[400],
      lineHeight: 22,
      marginBottom: 24,
    },
    resetModalConfirm: {
      backgroundColor: colors.error,
      borderRadius: 14,
      paddingVertical: 16,
      alignItems: "center",
      marginBottom: 12,
    },
    resetModalConfirmText: {
      fontSize: 18,
      fontWeight: "800",
      color: "#ffffff",
    },
    resetModalCancel: {
      borderRadius: 14,
      paddingVertical: 14,
      alignItems: "center",
    },
    resetModalCancelText: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.gray[400],
    },
    triggerCard: {
      flexDirection: "row",
      backgroundColor: `${colors.primary}10`,
      borderRadius: 16,
      padding: 16,
      borderWidth: 1,
      borderColor: `${colors.primary}25`,
      marginBottom: 20,
      gap: 12,
    },
    triggerContent: {
      flex: 1,
    },
    triggerLabel: {
      fontSize: 14,
      fontWeight: "700",
      color: colors.primary,
      marginBottom: 4,
    },
    triggerText: {
      fontSize: 13,
      color: colors.gray[400],
      lineHeight: 18,
    },
    copyButton: {
      flexDirection: "row",
      alignItems: "center",
      alignSelf: "flex-start",
      gap: 6,
      marginTop: 10,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.divider,
      backgroundColor: colors.surface,
    },
    copyButtonCopied: {
      borderColor: `${colors.primary}40`,
      backgroundColor: `${colors.primary}10`,
    },
    copyButtonText: {
      fontSize: 12,
      fontWeight: "700",
      color: colors.text,
    },
    celebrationCard: {
      backgroundColor: `${colors.warning}10`,
      borderRadius: 24,
      padding: 24,
      borderWidth: 2,
      borderColor: `${colors.warning}40`,
      marginBottom: 24,
    },
    celebrationHeader: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      marginBottom: 16,
    },
    celebrationTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: colors.warning,
    },
    cherryOnTopCard: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.divider,
      borderRadius: 16,
      padding: 16,
      gap: 12,
      marginBottom: 16,
    },
    cherryOnTopContent: {
      flex: 1,
    },
    cherryOnTopName: {
      fontSize: 16,
      fontWeight: "700",
      color: colors.text,
      marginBottom: 4,
    },
    cherryOnTopDesc: {
      fontSize: 13,
      color: colors.gray[400],
      lineHeight: 18,
    },
    rewardsSection: {
      marginBottom: 16,
    },
    rewardsTitle: {
      fontSize: 14,
      fontWeight: "700",
      color: colors.text,
      marginBottom: 10,
    },
    rewardItem: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      marginBottom: 8,
    },
    rewardText: {
      fontSize: 14,
      color: colors.gray[300],
      flex: 1,
    },
    scheduleButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.primary,
      borderRadius: 14,
      paddingVertical: 14,
      gap: 8,
    },
    scheduleButtonText: {
      fontSize: 16,
      fontWeight: "700",
      color: colors.textInverse,
    },
  });
