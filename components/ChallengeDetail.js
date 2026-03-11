import React, { useMemo, useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Modal,
  Linking,
} from "react-native";
import * as Clipboard from "expo-clipboard";
import { MaterialIcons } from "@expo/vector-icons";
import { useTheme } from "../styles/ThemeContext";
import {
  TWENTY_ONE_DAY_CHALLENGES,
  getPhaseFromDay,
  CHALLENGE_PHASES,
  DAY_21_CHALLENGES,
  DAY_21_REWARDS,
  CHALLENGE_TRIGGERS,
  PHASE_ENCOURAGEMENT,
  PILLAR_VIDEOS,
} from "../constants";
import { getMissedDays } from "../lib/storage";
import { BottomNav } from "./BottomNav";
import { VideoPlayerModal } from "./VideoPlayerModal";

// DEV_MODE: Set to false to hide dev controls
const DEV_MODE = false;

export const ChallengeDetail = ({
  pillarId,
  challengeState,
  onToggleTask,
  onNavigate,
  onSetDay,
  onDevSimulate,
}) => {
  const { colors, isDark, toggleTheme } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const [codeCopied, setCodeCopied] = useState(false);
  const [showVideoPlayer, setShowVideoPlayer] = useState(false);

  const challenge = TWENTY_ONE_DAY_CHALLENGES[pillarId];
  if (!challenge) return null;

  const { currentDay, completedTasks, streakDays, acknowledgedMilestones } = challengeState;
  const ackMilestones = acknowledgedMilestones || [];
  const currentPhase = getPhaseFromDay(currentDay);
  const todayKey = new Date().toISOString().split("T")[0];
  const todayCompletedTasks = completedTasks[todayKey] || [];

  // Calculate progress
  const totalDays = 21;
  const progressPercent = Math.min(100, Math.round((currentDay / totalDays) * 100));
  const isCompleted = currentDay >= 21;
  const isDay21 = currentDay === 21;
  const completedDays = (challengeState && challengeState.completedDays) || 0;
  const missedDays = getMissedDays(challengeState);

  // Get tasks for current phase
  const availableTasks = challenge.tasks.filter(
    (task) => task.unlockedDay <= currentDay,
  );
  const isTaskCompleted = (taskId) => todayCompletedTasks.includes(taskId);
  const allTasksCompleted =
    availableTasks.length > 0 &&
    availableTasks.every((task) => isTaskCompleted(task.id));

  // Determine which triggers have been reached
  const day21Challenge = DAY_21_CHALLENGES[pillarId];
  const encouragement = PHASE_ENCOURAGEMENT[pillarId];
  const [showMilestoneModal, setShowMilestoneModal] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);

  // Build active milestones for modal (only unacknowledged ones)
  const activeMilestones = [];
  if (!isCompleted && currentDay >= 5 && !ackMilestones.includes(5) && encouragement) {
    activeMilestones.push({ icon: "emoji-emotions", iconColor: colors.primary, label: "Phase 1 Complete!", text: encouragement });
  }
  if (!isCompleted && currentDay >= 10 && !ackMilestones.includes(10)) {
    activeMilestones.push({ icon: "play-circle-filled", iconColor: colors.secondary, label: "Mid-Challenge Video", text: `Watch Coach Al's motivation and tips for your ${challenge.name.toLowerCase()} journey.`, isVideo: true, videoSource: PILLAR_VIDEOS[pillarId] });
  }
  if (!isCompleted && currentDay >= 15 && !ackMilestones.includes(15)) {
    activeMilestones.push({ icon: "local-offer", iconColor: colors.warning, label: "15% Off Coaching!", text: null, isDiscount: true });
  }

  // Auto-show modal when milestones appear
  const prevDayRef = useRef(currentDay);
  useEffect(() => {
    if (currentDay >= 5 && prevDayRef.current !== currentDay) {
      const milestones = [5, 10, 15, 21];
      if (milestones.includes(currentDay)) {
        if (currentDay >= 21) {
          setShowCompletionModal(true);
        } else if (activeMilestones.length > 0) {
          setShowMilestoneModal(true);
        }
      }
    }
    prevDayRef.current = currentDay;
  }, [currentDay]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => onNavigate("CHALLENGE_PROGRESS")}
        >
          <MaterialIcons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{challenge.name} Challenge</Text>
        <TouchableOpacity style={styles.backButton} onPress={toggleTheme}>
          <MaterialIcons name={isDark ? "light-mode" : "dark-mode"} size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      {/* Dev Mode Controls */}
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
                onPress={() => onSetDay(pillarId, day)}
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
              onPress={() => onSetDay(pillarId, 21)}
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
                  onPress={() => onDevSimulate(pillarId, "back1")}
                >
                  <Text style={styles.devWeekButtonText}>-1 Day</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.devWeekButton}
                  onPress={() => onDevSimulate(pillarId, "forward1")}
                >
                  <Text style={styles.devWeekButtonText}>+1 Day</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.devWeekButton}
                  onPress={() => onDevSimulate(pillarId, "reset")}
                >
                  <Text style={styles.devWeekButtonText}>Reset</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.devInfoText}>
                Start: {challengeState?.startDate || "none"} | Day: {currentDay}/21 | Done: {completedDays} | Missed: {missedDays}
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
        {/* Progress Card */}
        <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <View style={styles.progressIcon}>
              <MaterialIcons
                name={challenge.icon}
                size={32}
                color={colors.primary}
              />
            </View>
            <View style={styles.progressInfo}>
              <Text style={styles.progressTitle}>21-Day Challenge</Text>
              <Text style={styles.progressWeek}>
                {isCompleted
                  ? "Challenge Complete!"
                  : isDay21
                    ? "Day 21 — Celebration!"
                    : `Phase ${currentPhase} of 4`}
              </Text>
            </View>
            <View style={styles.dayBadge}>
              <Text style={styles.dayBadgeText}>Day {currentDay}</Text>
            </View>
          </View>

          <View style={styles.progressBarContainer}>
            <View style={styles.progressBarBg}>
              <View
                style={[
                  styles.progressBarFill,
                  { width: `${progressPercent}%` },
                ]}
              />
            </View>
            <Text style={styles.progressPercent}>{progressPercent}%</Text>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <MaterialIcons
                name="local-fire-department"
                size={20}
                color={colors.secondary}
              />
              <Text style={styles.statValue}>{streakDays}</Text>
              <Text style={styles.statLabel}>Day Streak</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <MaterialIcons
                name="check-circle"
                size={20}
                color={colors.success}
              />
              <Text style={styles.statValue}>
                {todayCompletedTasks.length}/{availableTasks.length}
              </Text>
              <Text style={styles.statLabel}>Today</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <MaterialIcons
                name="emoji-events"
                size={20}
                color={colors.warning}
              />
              <Text style={styles.statValue}>{availableTasks.length}</Text>
              <Text style={styles.statLabel}>Tasks Active</Text>
            </View>
          </View>
        </View>

        {/* Day 21 Celebration */}
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
            <TouchableOpacity style={styles.scheduleButton} activeOpacity={0.7}>
              <MaterialIcons name="event" size={20} color={colors.textInverse} />
              <Text style={styles.scheduleButtonText}>Schedule Your Free Session</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Today's Status */}
        {allTasksCompleted && !isCompleted && (
          <View style={styles.completedBanner}>
            <MaterialIcons
              name="celebration"
              size={24}
              color={colors.primary}
            />
            <Text style={styles.completedBannerText}>
              All tasks completed for today!
            </Text>
          </View>
        )}

        {/* Milestone indicator — tap to open modal */}
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

        {/* Today's Tasks */}
        {!isCompleted && (
          <>
            <Text style={styles.dailyTasksHeading}>DAILY TASK{availableTasks.length !== 1 ? 'S' : ''}</Text>
            <View style={styles.tasksList}>
              {availableTasks.map((task) => {
                const completed = isTaskCompleted(task.id);
                return (
                  <TouchableOpacity
                    key={task.id}
                    style={[styles.taskCard, completed && styles.taskCardCompleted]}
                    onPress={() => !completed && onToggleTask(pillarId, task.id)}
                    activeOpacity={completed ? 1 : 0.7}
                  >
                    <View
                      style={[
                        styles.taskCheckbox,
                        completed && styles.taskCheckboxCompleted,
                      ]}
                    >
                      {completed && (
                        <MaterialIcons
                          name="check"
                          size={16}
                          color={colors.textInverse}
                        />
                      )}
                    </View>
                    <View style={styles.taskContent}>
                      <View style={styles.taskHeader}>
                        <Text
                          style={[
                            styles.taskName,
                            completed && styles.taskNameCompleted,
                          ]}
                        >
                          {task.name}
                        </Text>
                        {task.phase > 1 && (
                          <View style={styles.weekBadge}>
                            <Text style={styles.weekBadgeText}>
                              Phase {task.phase}
                            </Text>
                          </View>
                        )}
                      </View>
                      <Text
                        style={[
                          styles.taskDescription,
                          completed && styles.taskDescriptionCompleted,
                        ]}
                      >
                        {task.description}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </>
        )}



        {/* Phase Progression */}
        <Text style={styles.sectionTitle}>Phase Progression</Text>
        <View style={styles.weeklyBreakdown}>
          {CHALLENGE_PHASES.map(({ phase, taskCount, focus }) => {
            const isCurrentPhase = phase === currentPhase && !isCompleted;
            const isPastPhase = currentPhase > phase || isCompleted;
            return (
              <View
                key={phase}
                style={[
                  styles.weekItem,
                  isCurrentPhase && styles.weekItemCurrent,
                  isPastPhase && styles.weekItemPast,
                ]}
              >
                <View
                  style={[
                    styles.weekNumber,
                    isCurrentPhase && styles.weekNumberCurrent,
                    isPastPhase && styles.weekNumberPast,
                  ]}
                >
                  {isPastPhase ? (
                    <MaterialIcons
                      name="check"
                      size={14}
                      color={colors.textInverse}
                    />
                  ) : (
                    <Text
                      style={[
                        styles.weekNumberText,
                        isCurrentPhase && styles.weekNumberTextCurrent,
                      ]}
                    >
                      {phase}
                    </Text>
                  )}
                </View>
                <Text
                  style={[
                    styles.weekLabel,
                    isCurrentPhase && styles.weekLabelCurrent,
                  ]}
                >
                  {focus}
                </Text>
                <Text style={styles.weekTasks}>
                  {taskCount} task{taskCount > 1 ? "s" : ""}
                </Text>
              </View>
            );
          })}
        </View>

        {/* Milestone Timeline */}
        <Text style={styles.sectionTitle}>Milestones</Text>
        <View style={styles.milestoneList}>
          {[
            { day: 5, icon: "emoji-emotions", label: "Encouragement", reached: currentDay >= 5 },
            { day: 10, icon: "play-circle-filled", label: "Coach Al Video", reached: currentDay >= 10, hasVideo: !!PILLAR_VIDEOS[pillarId] },
            { day: 15, icon: "local-offer", label: "15% Discount", reached: currentDay >= 15 },
            { day: 21, icon: "card-giftcard", label: "Free Session Reward", reached: currentDay >= 21 },
          ].map((milestone, idx) => {
            const Wrapper = milestone.hasVideo && milestone.reached ? TouchableOpacity : View;
            const wrapperProps = milestone.hasVideo && milestone.reached ? { onPress: () => setShowVideoPlayer(true), activeOpacity: 0.7 } : {};
            return (
              <Wrapper key={idx} style={[styles.milestoneItem, milestone.reached && styles.milestoneReached]} {...wrapperProps}>
                <View style={[styles.milestoneIcon, milestone.reached && styles.milestoneIconReached]}>
                  <MaterialIcons
                    name={milestone.icon}
                    size={16}
                    color={milestone.reached ? colors.textInverse : colors.gray[600]}
                  />
                </View>
                <View style={styles.milestoneContent}>
                  <Text style={[styles.milestoneLabel, milestone.reached && styles.milestoneLabelReached]}>
                    Day {milestone.day}
                  </Text>
                  <Text style={styles.milestoneDesc}>
                    {milestone.label}{milestone.hasVideo && milestone.reached ? " — Tap to watch" : ""}
                  </Text>
                </View>
                {milestone.hasVideo && milestone.reached ? (
                  <MaterialIcons name="play-arrow" size={18} color={colors.primary} />
                ) : milestone.reached ? (
                  <MaterialIcons name="check-circle" size={16} color={colors.primary} />
                ) : null}
              </Wrapper>
            );
          })}
        </View>
      </ScrollView>

      {/* Completion Modal */}
      <Modal
        visible={showCompletionModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowCompletionModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { borderColor: `${colors.primary}40` }]}>
            <View style={styles.modalHeader}>
              <MaterialIcons name="emoji-events" size={48} color={colors.warning} />
              <Text style={styles.modalTitle}>Congratulations!</Text>
            </View>
            <Text style={styles.completionModalText}>
              You crushed the 21-Day {challenge.name} Challenge! That takes real discipline and commitment — Coach Al is proud of you.
            </Text>
            <Text style={styles.completionModalText}>
              You've earned a free coaching call. Book your session with Al and let's map out your next level.
            </Text>
            <TouchableOpacity
              style={styles.completionModalCta}
              onPress={() => {
                setShowCompletionModal(false);
                Linking.openURL("https://calendly.com/growyourmusclesstudio-info/30min");
              }}
              activeOpacity={0.8}
            >
              <MaterialIcons name="event" size={22} color={colors.textInverse} />
              <Text style={styles.completionModalCtaText}>Book Your Free Call with Al</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setShowCompletionModal(false)}
              activeOpacity={0.7}
              style={styles.completionModalDismiss}
            >
              <Text style={styles.completionModalDismissText}>Maybe Later</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

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
                    ) : m.isVideo && m.videoSource ? (
                      <>
                        <Text style={styles.modalMilestoneText}>{m.text}</Text>
                        <TouchableOpacity
                          style={styles.watchVideoButton}
                          onPress={() => {
                            setShowMilestoneModal(false);
                            setTimeout(() => setShowVideoPlayer(true), 300);
                          }}
                          activeOpacity={0.7}
                        >
                          <MaterialIcons name="play-circle-filled" size={18} color="#111" />
                          <Text style={styles.watchVideoButtonText}>Watch Video</Text>
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

      {/* Video Player Modal */}
      <VideoPlayerModal
        visible={showVideoPlayer}
        videoSource={PILLAR_VIDEOS[pillarId]}
        pillarName={challenge.name}
        onClose={() => setShowVideoPlayer(false)}
      />

      <BottomNav currentScreen="CHALLENGE_DETAIL" onNavigate={onNavigate} />
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
  progressCard: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: 24,
    borderWidth: 2,
    borderColor: `${colors.primary}30`,
    marginBottom: 24,
  },
  progressHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  progressIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: `${colors.primary}15`,
    alignItems: "center",
    justifyContent: "center",
  },
  progressInfo: {
    flex: 1,
    marginLeft: 16,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text,
  },
  progressWeek: {
    fontSize: 14,
    color: colors.gray[500],
    marginTop: 2,
  },
  dayBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  dayBadgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.textInverse,
  },
  progressBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  progressBarBg: {
    flex: 1,
    height: 8,
    backgroundColor: colors.overlay,
    borderRadius: 4,
    overflow: "hidden",
    marginRight: 12,
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  progressPercent: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.primary,
    width: 40,
    textAlign: "right",
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.text,
    marginTop: 4,
  },
  statLabel: {
    fontSize: 10,
    color: colors.gray[500],
    textTransform: "uppercase",
    letterSpacing: 1,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: colors.overlay,
  },
  // Day 21 celebration
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
  // Milestone indicator + modal
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
  completionModalText: {
    fontSize: 16,
    color: colors.gray[300],
    lineHeight: 24,
    textAlign: "center",
    marginBottom: 16,
  },
  completionModalCta: {
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginTop: 8,
  },
  completionModalCtaText: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.textInverse,
  },
  completionModalDismiss: {
    alignItems: "center",
    paddingVertical: 14,
  },
  completionModalDismissText: {
    fontSize: 14,
    color: colors.textMuted,
    fontWeight: "600",
  },
  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
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
    fontWeight: '700',
    color: colors.text,
  },
  watchVideoButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 8,
    marginTop: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: colors.primary,
  },
  watchVideoButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111",
  },
  completedBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: `${colors.primary}20`,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    gap: 8,
    borderWidth: 1,
    borderColor: `${colors.primary}30`,
  },
  completedBannerText: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.primary,
  },
  dailyTasksHeading: {
    fontSize: 26,
    fontWeight: "900",
    color: colors.text,
    letterSpacing: 2,
    marginBottom: 16,
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 16,
  },
  tasksList: {
    gap: 14,
    marginBottom: 24,
  },
  taskCard: {
    flexDirection: "row",
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.divider,
  },
  taskCardCompleted: {
    backgroundColor: `${colors.primary}15`,
    borderColor: `${colors.primary}30`,
  },
  taskCheckbox: {
    width: 32,
    height: 32,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.gray[600],
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  taskCheckboxCompleted: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  taskContent: {
    flex: 1,
  },
  taskHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  taskName: {
    fontSize: 20,
    fontWeight: "800",
    color: colors.text,
    flex: 1,
  },
  taskNameCompleted: {
    color: colors.primary,
  },
  weekBadge: {
    backgroundColor: colors.overlay,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginLeft: 8,
  },
  weekBadgeText: {
    fontSize: 10,
    fontWeight: "600",
    color: colors.gray[400],
  },
  taskDescription: {
    fontSize: 18,
    fontWeight: "500",
    color: colors.text,
    lineHeight: 26,
  },
  taskDescriptionCompleted: {
    color: colors.gray[500],
  },
  lockedTaskCard: {
    flexDirection: "row",
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.divider,
    opacity: 0.5,
  },
  lockedTaskCheckbox: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: colors.divider,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  lockedTaskName: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.gray[500],
    flex: 1,
  },
  lockedTaskDescription: {
    fontSize: 13,
    color: colors.gray[600],
    lineHeight: 18,
  },
  unlockBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.divider,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginLeft: 8,
    gap: 4,
  },
  unlockBadgeText: {
    fontSize: 10,
    fontWeight: "600",
    color: colors.gray[500],
  },
  weeklyBreakdown: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },
  weekItem: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.divider,
  },
  weekItemCurrent: {
    borderColor: colors.primary,
    backgroundColor: `${colors.primary}10`,
  },
  weekItemPast: {
    borderColor: `${colors.primary}30`,
  },
  weekNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.overlay,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  weekNumberCurrent: {
    backgroundColor: `${colors.primary}30`,
  },
  weekNumberPast: {
    backgroundColor: colors.primary,
  },
  weekNumberText: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.gray[500],
  },
  weekNumberTextCurrent: {
    color: colors.primary,
  },
  weekLabel: {
    fontSize: 10,
    fontWeight: "600",
    color: colors.gray[500],
    textAlign: "center",
  },
  weekLabelCurrent: {
    color: colors.text,
  },
  weekTasks: {
    fontSize: 9,
    color: colors.gray[600],
    marginTop: 3,
  },
  // Milestone timeline
  milestoneList: {
    gap: 10,
    marginBottom: 24,
  },
  milestoneItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.divider,
    gap: 12,
  },
  milestoneReached: {
    borderColor: `${colors.primary}30`,
    backgroundColor: `${colors.primary}08`,
  },
  milestoneIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: colors.overlay,
    alignItems: "center",
    justifyContent: "center",
  },
  milestoneIconReached: {
    backgroundColor: colors.primary,
  },
  milestoneContent: {
    flex: 1,
  },
  milestoneLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.gray[500],
  },
  milestoneLabelReached: {
    color: colors.text,
  },
  milestoneDesc: {
    fontSize: 11,
    color: colors.gray[600],
    marginTop: 1,
  },
  // Dev mode styles
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
    marginTop: 6,
  },
});
