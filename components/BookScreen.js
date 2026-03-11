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
import { BOOK_CHAPTERS } from "../constants";
import { BottomNav } from "./BottomNav";

export const BookScreen = ({
  onNavigate,
  onSelectChapter,
  readChapters = {},
}) => {
  const { colors, isDark, toggleTheme } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const totalReadTime = BOOK_CHAPTERS.reduce((sum, ch) => sum + ch.readTime, 0);
  const chaptersRead = Object.keys(readChapters).filter(
    (id) => readChapters[id],
  ).length;
  const progressPercent = Math.round(
    (chaptersRead / BOOK_CHAPTERS.length) * 100,
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
        <Text style={styles.headerTitle}>The Book</Text>
        <TouchableOpacity style={styles.backButton} onPress={toggleTheme}>
          <MaterialIcons name={isDark ? "light-mode" : "dark-mode"} size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Book Header */}
        <View style={styles.bookHeader}>
          <View style={styles.bookCover}>
            <MaterialIcons
              name="auto-stories"
              size={48}
              color={colors.primary}
            />
          </View>
          <View style={styles.bookInfo}>
            <Text style={styles.bookTitle}>
              Burnt Out and Ready to Feel Great
            </Text>
            <Text style={styles.bookAuthor}>by Al Cummings</Text>
            <View style={styles.bookStats}>
              <View style={styles.statItem}>
                <MaterialIcons
                  name="menu-book"
                  size={14}
                  color={colors.gray[400]}
                />
                <Text style={styles.statText}>
                  {BOOK_CHAPTERS.length} Chapters
                </Text>
              </View>
              <View style={styles.statItem}>
                <MaterialIcons
                  name="schedule"
                  size={14}
                  color={colors.gray[400]}
                />
                <Text style={styles.statText}>{totalReadTime} min read</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Progress Card */}
        <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressTitle}>Your Progress</Text>
            <Text style={styles.progressPercent}>{progressPercent}%</Text>
          </View>
          <View style={styles.progressBar}>
            <View
              style={[styles.progressFill, { width: `${progressPercent}%` }]}
            />
          </View>
          <Text style={styles.progressText}>
            {chaptersRead} of {BOOK_CHAPTERS.length} chapters completed
          </Text>
        </View>

        {/* Chapters List */}
        <Text style={styles.sectionTitle}>Chapters</Text>
        {BOOK_CHAPTERS.map((chapter, index) => {
          const isRead = readChapters[chapter.id];
          return (
            <TouchableOpacity
              key={chapter.id}
              style={[styles.chapterCard, isRead && styles.chapterCardRead]}
              onPress={() => onSelectChapter(chapter.id)}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.chapterNumber,
                  isRead && styles.chapterNumberRead,
                ]}
              >
                {isRead ? (
                  <MaterialIcons name="check" size={18} color={colors.textInverse} />
                ) : chapter.id === "intro" ? (
                  <MaterialIcons name="menu-book" size={18} color={colors.primary} />
                ) : chapter.id === "conclusion" ? (
                  <MaterialIcons name="emoji-events" size={18} color={colors.primary} />
                ) : (
                  <Text style={styles.chapterNumberText}>{index}</Text>
                )}
              </View>
              <View style={styles.chapterInfo}>
                <Text style={styles.chapterTitle}>{chapter.title}</Text>
                <Text style={styles.chapterSubtitle}>{chapter.subtitle}</Text>
                <View style={styles.chapterMeta}>
                  <MaterialIcons
                    name={chapter.icon}
                    size={12}
                    color={colors.gray[500]}
                  />
                  <Text style={styles.chapterMetaText}>
                    {chapter.readTime} min read
                  </Text>
                  <Text style={styles.chapterMetaDot}>•</Text>
                  <Text style={styles.chapterMetaText}>
                    {chapter.sections.length} sections
                  </Text>
                </View>
              </View>
              <MaterialIcons
                name="chevron-right"
                size={24}
                color={colors.gray[600]}
              />
            </TouchableOpacity>
          );
        })}

        {/* CTA */}
        <View style={styles.ctaCard}>
          <MaterialIcons name="emoji-events" size={32} color={colors.warning} />
          <Text style={styles.ctaTitle}>Put Knowledge Into Action</Text>
          <Text style={styles.ctaText}>
            Start the 21-Day Challenges to practice what you learn.
          </Text>
          <TouchableOpacity
            style={styles.ctaButton}
            onPress={() => onNavigate("CHALLENGE_PROGRESS")}
          >
            <Text style={styles.ctaButtonText}>View Challenges</Text>
            <MaterialIcons
              name="arrow-forward"
              size={16}
              color={colors.textInverse}
            />
          </TouchableOpacity>
        </View>
      </ScrollView>

      <BottomNav currentScreen="BOOK" onNavigate={onNavigate} />
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
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text,
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 100,
  },
  bookHeader: {
    flexDirection: "row",
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    gap: 16,
  },
  bookCover: {
    width: 80,
    height: 110,
    backgroundColor: `${colors.primary}15`,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: `${colors.primary}30`,
  },
  bookInfo: {
    flex: 1,
    justifyContent: "center",
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.text,
    lineHeight: 22,
  },
  bookAuthor: {
    fontSize: 13,
    color: colors.gray[400],
    marginTop: 4,
  },
  bookStats: {
    flexDirection: "row",
    gap: 16,
    marginTop: 12,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  statText: {
    fontSize: 11,
    color: colors.gray[400],
  },
  progressCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  progressTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
  },
  progressPercent: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.primary,
  },
  progressBar: {
    height: 6,
    backgroundColor: colors.gray[700],
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: colors.primary,
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: colors.gray[500],
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 12,
  },
  chapterCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    gap: 12,
  },
  chapterCardRead: {
    borderWidth: 1,
    borderColor: `${colors.primary}40`,
  },
  chapterNumber: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: `${colors.primary}20`,
    alignItems: "center",
    justifyContent: "center",
  },
  chapterNumberRead: {
    backgroundColor: colors.primary,
  },
  chapterNumberText: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.primary,
  },
  chapterInfo: {
    flex: 1,
  },
  chapterTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.text,
  },
  chapterSubtitle: {
    fontSize: 12,
    color: colors.gray[400],
    marginTop: 2,
  },
  chapterMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 6,
  },
  chapterMetaText: {
    fontSize: 10,
    color: colors.gray[500],
  },
  chapterMetaDot: {
    fontSize: 10,
    color: colors.gray[600],
  },
  ctaCard: {
    backgroundColor: `${colors.warning}15`,
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    marginTop: 16,
    borderWidth: 1,
    borderColor: `${colors.warning}30`,
  },
  ctaTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text,
    marginTop: 12,
  },
  ctaText: {
    fontSize: 13,
    color: colors.gray[400],
    textAlign: "center",
    marginTop: 6,
    lineHeight: 18,
  },
  ctaButton: {
    backgroundColor: colors.warning,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 16,
  },
  ctaButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.textInverse,
  },
});
