import React, { useRef, useMemo } from "react";
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

export const ChapterView = ({ chapterId, onNavigate, onMarkRead, isRead }) => {
  const { colors, isDark, toggleTheme } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const scrollRef = useRef(null);
  const chapter = BOOK_CHAPTERS.find((ch) => ch.id === chapterId);
  const chapterIndex = BOOK_CHAPTERS.findIndex((ch) => ch.id === chapterId);
  const prevChapter = chapterIndex > 0 ? BOOK_CHAPTERS[chapterIndex - 1] : null;
  const nextChapter =
    chapterIndex < BOOK_CHAPTERS.length - 1
      ? BOOK_CHAPTERS[chapterIndex + 1]
      : null;

  if (!chapter) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => onNavigate("BOOK")}
          >
            <MaterialIcons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Error</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.errorContainer}>
          <MaterialIcons
            name="error-outline"
            size={64}
            color={colors.gray[600]}
          />
          <Text style={styles.errorText}>Chapter not found</Text>
          <TouchableOpacity
            style={styles.errorButton}
            onPress={() => onNavigate("BOOK")}
          >
            <Text style={styles.errorButtonText}>Back to Book</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.errorButtonSecondary}
            onPress={() => onNavigate("DASHBOARD")}
          >
            <Text style={styles.errorButtonSecondaryText}>Go to Dashboard</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const handleNavigateChapter = (id) => {
    scrollRef.current?.scrollTo({ y: 0, animated: false });
    onNavigate("CHAPTER_VIEW", id);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => onNavigate("BOOK")}
          >
            <MaterialIcons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.headerCenter}>
          <Text style={styles.headerChapter}>{chapter.title}</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <TouchableOpacity style={styles.bookmarkButton} onPress={toggleTheme}>
            <MaterialIcons name={isDark ? "light-mode" : "dark-mode"} size={22} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.bookmarkButton, isRead && styles.bookmarkButtonActive]}
            onPress={() => onMarkRead(chapterId, !isRead)}
          >
            <MaterialIcons
              name={isRead ? "check-circle" : "check-circle-outline"}
              size={24}
              color={isRead ? colors.primary : colors.gray[500]}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Content */}
      <ScrollView
        ref={scrollRef}
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Chapter Header */}
        <View style={styles.chapterHeader}>
          <View style={styles.chapterIcon}>
            <MaterialIcons
              name={chapter.icon}
              size={32}
              color={colors.primary}
            />
          </View>
          <Text style={styles.chapterTitle}>{chapter.title}</Text>
          <Text style={styles.chapterSubtitle}>{chapter.subtitle}</Text>
          <View style={styles.chapterMeta}>
            <MaterialIcons name="schedule" size={14} color={colors.gray[500]} />
            <Text style={styles.chapterMetaText}>
              {chapter.readTime} min read
            </Text>
            <Text style={styles.chapterMetaDot}>•</Text>
            <Text style={styles.chapterMetaText}>
              {chapter.sections.length} sections
            </Text>
          </View>
        </View>

        {/* Sections */}
        {chapter.sections.map((section, index) => (
          <View key={index} style={styles.section}>
            <Text style={styles.sectionHeading}>{section.heading}</Text>
            <Text style={styles.sectionContent}>{section.content}</Text>
          </View>
        ))}

        {/* Mark as Read */}
        {!isRead && (
          <TouchableOpacity
            style={styles.markReadButton}
            onPress={() => onMarkRead(chapterId, true)}
            activeOpacity={0.8}
          >
            <MaterialIcons name="check-circle" size={24} color={colors.textInverse} />
            <Text style={styles.markReadText}>Mark Chapter as Read</Text>
          </TouchableOpacity>
        )}

        {isRead && (
          <View style={styles.completedBadge}>
            <MaterialIcons
              name="check-circle"
              size={20}
              color={colors.primary}
            />
            <Text style={styles.completedText}>Chapter Completed</Text>
          </View>
        )}

        {/* Navigation */}
        <View style={styles.navigation}>
          {prevChapter ? (
            <TouchableOpacity
              style={styles.navButton}
              onPress={() => handleNavigateChapter(prevChapter.id)}
            >
              <MaterialIcons
                name="chevron-left"
                size={20}
                color={colors.primary}
              />
              <View style={styles.navButtonText}>
                <Text style={styles.navLabel}>Previous</Text>
                <Text style={styles.navTitle} numberOfLines={1}>
                  {prevChapter.title}
                </Text>
              </View>
            </TouchableOpacity>
          ) : (
            <View style={styles.navPlaceholder} />
          )}

          {nextChapter ? (
            <TouchableOpacity
              style={[styles.navButton, styles.navButtonNext]}
              onPress={() => handleNavigateChapter(nextChapter.id)}
            >
              <View style={[styles.navButtonText, styles.navButtonTextNext]}>
                <Text style={styles.navLabel}>Next</Text>
                <Text style={styles.navTitle} numberOfLines={1}>
                  {nextChapter.title}
                </Text>
              </View>
              <MaterialIcons
                name="chevron-right"
                size={20}
                color={colors.primary}
              />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[
                styles.navButton,
                styles.navButtonNext,
                styles.navButtonFinish,
              ]}
              onPress={() => onNavigate("BOOK")}
            >
              <Text style={styles.navFinishText}>Back to Book</Text>
              <MaterialIcons
                name="menu-book"
                size={20}
                color={colors.primary}
              />
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
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
    borderBottomColor: colors.surface,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  headerCenter: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 12,
  },
  headerChapter: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.primary,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
    marginTop: 2,
  },
  bookmarkButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  bookmarkButtonActive: {
    backgroundColor: `${colors.primary}20`,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  chapterHeader: {
    alignItems: "center",
    marginBottom: 32,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: colors.surface,
  },
  chapterIcon: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: `${colors.primary}15`,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  chapterTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: colors.text,
    textAlign: "center",
  },
  chapterSubtitle: {
    fontSize: 16,
    color: colors.gray[400],
    marginTop: 8,
    textAlign: "center",
  },
  chapterMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 16,
  },
  chapterMetaText: {
    fontSize: 12,
    color: colors.gray[500],
  },
  chapterMetaDot: {
    fontSize: 12,
    color: colors.gray[600],
  },
  section: {
    marginBottom: 28,
  },
  sectionHeading: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 12,
  },
  sectionContent: {
    fontSize: 16,
    color: colors.gray[300],
    lineHeight: 26,
  },
  markReadButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 14,
    gap: 10,
    marginTop: 16,
    marginBottom: 24,
  },
  markReadText: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.textInverse,
  },
  completedBadge: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: `${colors.primary}15`,
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
    marginTop: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: `${colors.primary}30`,
  },
  completedText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.primary,
  },
  navigation: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginTop: 8,
  },
  navButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    padding: 14,
    borderRadius: 12,
    gap: 8,
  },
  navButtonNext: {
    justifyContent: "flex-end",
  },
  navButtonFinish: {
    justifyContent: "center",
  },
  navButtonText: {
    flex: 1,
  },
  navButtonTextNext: {
    alignItems: "flex-end",
  },
  navLabel: {
    fontSize: 10,
    fontWeight: "600",
    color: colors.gray[500],
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  navTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.text,
    marginTop: 2,
  },
  navFinishText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.primary,
  },
  navPlaceholder: {
    flex: 1,
  },
  errorContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  errorText: {
    color: colors.gray[400],
    fontSize: 18,
    textAlign: "center",
    marginTop: 16,
    marginBottom: 24,
  },
  errorButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 12,
  },
  errorButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.textInverse,
  },
  errorButtonSecondary: {
    paddingHorizontal: 24,
    paddingVertical: 14,
  },
  errorButtonSecondaryText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.gray[400],
  },
});
