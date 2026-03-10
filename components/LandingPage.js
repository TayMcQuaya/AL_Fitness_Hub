import React, { useRef, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
  useWindowDimensions,
  Linking,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { spacing, borderRadius, fontSize } from "../styles/theme";
import { useTheme } from "../styles/ThemeContext";

const PILLARS = [
  {
    id: "breathing",
    name: "Breathing",
    icon: "air",
    tagline: "Control stress in 60 seconds",
    color: "#60A5FA",
  },
  {
    id: "sleep",
    name: "Sleep",
    icon: "bedtime",
    tagline: "Wake refreshed, not drained",
    color: "#A78BFA",
  },
  {
    id: "hydration",
    name: "Hydration",
    icon: "water-drop",
    tagline: "Fuel every cell",
    color: "#22D3EE",
  },
  {
    id: "nutrition",
    name: "Nutrition",
    icon: "restaurant",
    tagline: "Eat for energy",
    color: "#F472B6",
  },
  {
    id: "movement",
    name: "Movement",
    icon: "directions-run",
    tagline: "Built to move",
    color: "#FB923C",
  },
  {
    id: "environment",
    name: "Environment",
    icon: "park",
    tagline: "Design your space",
    color: "#4ADE80",
  },
  {
    id: "mindfulness",
    name: "Mindfulness",
    icon: "psychology",
    tagline: "Master your mind",
    color: "#FBBF24",
  },
];

const PAIN_POINTS = [
  { icon: "battery-alert", text: "Exhausted, but sleep doesn't help" },
  { icon: "coffee", text: "More coffee, less energy" },
  { icon: "schedule", text: "No time for yourself" },
  { icon: "replay", text: "Tried everything, nothing sticks" },
  { icon: "sentiment-dissatisfied", text: "Guilt about neglecting health" },
];

const FEATURES = [
  {
    icon: "dashboard",
    title: "Smart Dashboard",
    desc: "Track all 7 pillars at a glance with personalized scores",
  },
  {
    icon: "emoji-events",
    title: "21-Day Challenges",
    desc: "Progressive habits that unlock as you advance through 4 phases",
  },
  {
    icon: "fitness-center",
    title: "Quick Workouts",
    desc: "10-20 minute routines designed for busy schedules",
  },
  {
    icon: "menu-book",
    title: "Built-in Book",
    desc: "Full access to 'Burnt Out and Ready to Feel Great'",
  },
  {
    icon: "trending-up",
    title: "Progress Tracking",
    desc: "Streaks, insights, and visual progress over time",
  },
  {
    icon: "restaurant-menu",
    title: "Nutrition Logging",
    desc: "Simple meal tracking with favorites and summaries",
  },
];

const TESTIMONIALS = [
  {
    quote:
      "I went from barely functioning to having energy for my kids after work. The 7 Pillars approach just makes sense.",
    name: "Sarah M.",
    role: "Marketing Director & Mom of 2",
    improvement: "Energy: 3/10 → 8/10",
  },
  {
    quote:
      "Finally sleeping through the night. The small daily habits compound faster than I expected.",
    name: "James K.",
    role: "Software Engineer",
    improvement: "Sleep Quality: 4/10 → 9/10",
  },
  {
    quote:
      "I've tried every wellness app. Coach Al is different because it addresses root causes, not symptoms.",
    name: "Michelle R.",
    role: "Healthcare Professional",
    improvement: "Stress: 8/10 → 3/10",
  },
];

const FAQ_ITEMS = [
  {
    q: "How much time does this take each day?",
    a: "5-15 minutes. Each pillar's daily habits are designed for busy professionals. No hour-long commitments required.",
  },
  {
    q: "What if I've tried other wellness apps?",
    a: "Coach Al focuses on fundamentals, not fads. The 7 Pillars approach addresses root causes of burnout, not just symptoms.",
  },
  {
    q: "Do I need any equipment?",
    a: "No. All workouts are bodyweight. All practices can be done anywhere - at home, office, or traveling.",
  },
  {
    q: "What if I fall off track?",
    a: "The app meets you where you are. Miss a day? Just pick up tomorrow. No guilt, no restart required.",
  },
];

export const LandingPage = ({ onGetStarted }) => {
  const scrollRef = useRef(null);
  const { colors, isDark, toggleTheme } = useTheme();
  const { width } = useWindowDimensions();
  const styles = useMemo(() => makeStyles(colors, width), [colors, width]);

  const scrollToSection = (y) => {
    scrollRef.current?.scrollTo({ y, animated: true });
  };

  return (
    <View style={styles.container}>
      {/* Fixed Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.logoContainer}>
            <MaterialIcons name="spa" size={20} color={colors.primary} />
          </View>
          <Text style={styles.logoText}>Coach Al</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity onPress={toggleTheme} style={styles.themeToggle}>
            <MaterialIcons name={isDark ? "light-mode" : "dark-mode"} size={20} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerCTA} onPress={onGetStarted}>
            <Text style={styles.headerCTAText}>Get Started</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        ref={scrollRef}
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.heroBadge}>
            <MaterialIcons name="bolt" size={14} color={colors.primary} />
            <Text style={styles.heroBadgeText}>7 Pillars Wellness System</Text>
          </View>

          <Text style={styles.heroTitle}>Stop Running{"\n"}on Empty</Text>

          <Text style={styles.heroSubtitle}>
            From burnout to breakthrough in 21 days. Master the 7 Pillars of
            Health with Coach Al's proven system for busy parents.
          </Text>

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={onGetStarted}
            activeOpacity={0.8}
          >
            <Text style={styles.primaryButtonText}>Start Free Assessment</Text>
            <MaterialIcons
              name="arrow-forward"
              size={20}
              color={colors.textInverse}
            />
          </TouchableOpacity>

          <View style={styles.socialProof}>
            <View style={styles.avatarStack}>
              {[1, 2, 3, 4].map((i) => (
                <Image
                  key={i}
                  source={{ uri: `https://picsum.photos/100?avatar=${i}` }}
                  style={[
                    styles.avatarImage,
                    { marginLeft: i > 1 ? -12 : 0, zIndex: 5 - i },
                  ]}
                />
              ))}
            </View>
            <Text style={styles.socialProofText}>
              Join <Text style={styles.highlight}>10,000+</Text> busy
              professionals
            </Text>
          </View>

          {/* App Preview */}
          <View style={styles.appPreview}>
            <View style={styles.phoneFrame}>
              <View style={styles.phoneNotch} />
              <View style={styles.phoneMockup}>
                <View style={styles.mockupHeader}>
                  <Text style={styles.mockupGreeting}>Good morning, Sarah</Text>
                  <Text style={styles.mockupSubtext}>
                    Your focus: Breathing
                  </Text>
                </View>
                <View style={styles.mockupPillars}>
                  {PILLARS.slice(0, 4).map((p) => (
                    <View key={p.id} style={styles.mockupPillar}>
                      <MaterialIcons name={p.icon} size={16} color={p.color} />
                      <View
                        style={[
                          styles.mockupBar,
                          { backgroundColor: p.color, width: `${60 + Math.random() * 30}%` },
                        ]}
                      />
                    </View>
                  ))}
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Problem Section */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>THE PROBLEM</Text>
          <Text style={styles.sectionTitle}>Sound Familiar?</Text>

          <View style={styles.painPointsGrid}>
            {PAIN_POINTS.map((point, i) => (
              <View key={i} style={styles.painPoint}>
                <View style={styles.painPointIcon}>
                  <MaterialIcons
                    name={point.icon}
                    size={24}
                    color={colors.error}
                  />
                </View>
                <Text style={styles.painPointText}>{point.text}</Text>
              </View>
            ))}
          </View>

          <View style={styles.transitionBox}>
            <MaterialIcons name="lightbulb" size={24} color={colors.primary} />
            <Text style={styles.transitionText}>
              Burnout isn't about working too hard.{"\n"}
              <Text style={styles.transitionHighlight}>
                It's about neglecting the fundamentals.
              </Text>
            </Text>
          </View>
        </View>

        {/* 7 Pillars Section */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>THE SOLUTION</Text>
          <Text style={styles.sectionTitle}>The 7 Pillars System</Text>
          <Text style={styles.sectionSubtitle}>
            Small daily actions that compound into remarkable transformation
          </Text>

          <View style={styles.pillarsGrid}>
            {PILLARS.map((pillar) => (
              <View key={pillar.id} style={styles.pillarCard}>
                <View
                  style={[
                    styles.pillarIconContainer,
                    { backgroundColor: `${pillar.color}20` },
                  ]}
                >
                  <MaterialIcons
                    name={pillar.icon}
                    size={24}
                    color={pillar.color}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.pillarName}>{pillar.name}</Text>
                  <Text style={styles.pillarTagline}>{pillar.tagline}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* How It Works Section */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>HOW IT WORKS</Text>
          <Text style={styles.sectionTitle}>Your Path to Transformation</Text>

          <View style={styles.stepsContainer}>
            <View style={styles.stepLine} />

            <View style={styles.step}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>1</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Take the Assessment</Text>
                <Text style={styles.stepDesc}>
                  5-minute questionnaire scores each pillar and identifies your
                  weakest link. We meet you where you are.
                </Text>
              </View>
            </View>

            <View style={styles.step}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>2</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Focus on Your Priority</Text>
                <Text style={styles.stepDesc}>
                  Start your personalized 21-day challenge. New habits unlock
                  each phase as you progress. Just 5-15 min/day.
                </Text>
              </View>
            </View>

            <View style={styles.step}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>3</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Stack Your Pillars</Text>
                <Text style={styles.stepDesc}>
                  Master one pillar, then add the next. Each reinforces the
                  others for exponential results.
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Features Section */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>FEATURES</Text>
          <Text style={styles.sectionTitle}>Everything You Need</Text>

          <View style={styles.featuresGrid}>
            {FEATURES.map((feature, i) => (
              <View key={i} style={styles.featureCard}>
                <View style={styles.featureIconContainer}>
                  <MaterialIcons
                    name={feature.icon}
                    size={24}
                    color={colors.primary}
                  />
                </View>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDesc}>{feature.desc}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Science Section */}
        <View style={styles.section}>
          <View style={styles.scienceBox}>
            <Text style={styles.scienceLabel}>BACKED BY SCIENCE</Text>
            <Text style={styles.scienceTitle}>
              Proven Results, Not Just Promises
            </Text>

            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>15-20%</Text>
                <Text style={styles.statLabel}>
                  Better oxygen absorption with nose breathing
                </Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>8 weeks</Text>
                <Text style={styles.statLabel}>
                  For gratitude practice to rewire the brain
                </Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>20 min</Text>
                <Text style={styles.statLabel}>
                  In nature to measurably reduce cortisol
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Testimonials Section */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>SUCCESS STORIES</Text>
          <Text style={styles.sectionTitle}>Real Transformations</Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.testimonialsScroll}
          >
            {TESTIMONIALS.map((testimonial, i) => (
              <View key={i} style={styles.testimonialCard}>
                <MaterialIcons
                  name="format-quote"
                  size={32}
                  color={colors.primary}
                  style={styles.quoteIcon}
                />
                <Text style={styles.testimonialQuote}>
                  "{testimonial.quote}"
                </Text>
                <View style={styles.testimonialFooter}>
                  <View>
                    <Text style={styles.testimonialName}>
                      {testimonial.name}
                    </Text>
                    <Text style={styles.testimonialRole}>
                      {testimonial.role}
                    </Text>
                  </View>
                  <View style={styles.improvementBadge}>
                    <MaterialIcons
                      name="trending-up"
                      size={14}
                      color={colors.success}
                    />
                    <Text style={styles.improvementText}>
                      {testimonial.improvement}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* About Coach Al Section */}
        <View style={styles.section}>
          <View style={styles.aboutBox}>
            <View style={styles.aboutImageContainer}>
              <Image
                source={require("../assets/al-coach.png")}
                style={styles.aboutImage}
              />
            </View>
            <View style={styles.aboutContent}>
              <Text style={styles.aboutLabel}>MEET YOUR COACH</Text>
              <Text style={styles.aboutName}>Al Cummings</Text>
              <Text style={styles.aboutBio}>
                Author of "Burnt Out and Ready to Feel Great" and wellness coach
                to thousands of busy professionals. After experiencing burnout
                firsthand, Al developed the 7 Pillars system that has helped
                people reclaim their energy and vitality.
              </Text>
              <View style={styles.aboutCredentials}>
                <View style={styles.credential}>
                  <MaterialIcons name="menu-book" size={16} color={colors.primary} />
                  <Text style={styles.credentialText}>Published Author</Text>
                </View>
                <View style={styles.credential}>
                  <MaterialIcons name="groups" size={16} color={colors.primary} />
                  <Text style={styles.credentialText}>10,000+ Coached</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Book Section */}
        <View style={styles.section}>
          <View style={styles.bookBox}>
            <View style={styles.bookCover}>
              <MaterialIcons name="auto-stories" size={48} color={colors.primary} />
              <Text style={styles.bookCoverTitle}>Burnt Out{"\n"}& Ready to{"\n"}Feel Great</Text>
            </View>
            <View style={styles.bookContent}>
              <Text style={styles.bookLabel}>INCLUDED FREE</Text>
              <Text style={styles.bookTitle}>Full Book Access</Text>
              <Text style={styles.bookDesc}>
                Read the complete guide right in the app. 9 chapters covering
                every pillar with science-backed strategies and practical daily
                actions.
              </Text>
              <View style={styles.bookChapters}>
                <Text style={styles.bookChapterText}>
                  Introduction + 7 Pillar Chapters + Conclusion
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* FAQ Section */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>FAQ</Text>
          <Text style={styles.sectionTitle}>Common Questions</Text>

          <View style={styles.faqList}>
            {FAQ_ITEMS.map((item, i) => (
              <View key={i} style={styles.faqItem}>
                <View style={styles.faqQuestion}>
                  <MaterialIcons
                    name="help-outline"
                    size={20}
                    color={colors.primary}
                  />
                  <Text style={styles.faqQuestionText}>{item.q}</Text>
                </View>
                <Text style={styles.faqAnswer}>{item.a}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Final CTA Section */}
        <View style={styles.finalCTA}>
          <View style={styles.ctaGlow} />
          <Text style={styles.ctaTitle}>Your Transformation{"\n"}Starts Today</Text>
          <Text style={styles.ctaSubtitle}>
            Take the free 5-minute assessment and discover your path to
            sustainable energy
          </Text>

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={onGetStarted}
            activeOpacity={0.8}
          >
            <Text style={styles.primaryButtonText}>Start Free Assessment</Text>
            <MaterialIcons
              name="arrow-forward"
              size={20}
              color={colors.textInverse}
            />
          </TouchableOpacity>

          <Text style={styles.ctaNote}>
            No credit card required. Free forever on basic plan.
          </Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.footerLogo}>
            <MaterialIcons name="spa" size={24} color={colors.primary} />
            <Text style={styles.footerLogoText}>Coach Al</Text>
          </View>
          <Text style={styles.footerTagline}>
            The 7 Pillars Wellness System
          </Text>
          <Text style={styles.footerCopyright}>
            © 2024 Coach Al. All rights reserved.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const makeStyles = (colors, width) => {
  // Responsive columns: 2 on small, 3 on medium, 4 on large
  const pillarColumns = width >= 768 ? 4 : width >= 500 ? 3 : 2;
  const pillarCardWidth =
    (width - spacing.lg * 2 - spacing.md * (pillarColumns - 1)) / pillarColumns;

  // Features: 1 column on small, 2 on medium+
  const featureColumns = width >= 600 ? 2 : 1;

  return StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[800],
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  logoContainer: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.md,
    backgroundColor: `${colors.primary}20`,
    alignItems: "center",
    justifyContent: "center",
  },
  logoText: {
    fontSize: fontSize.lg,
    fontWeight: "700",
    color: colors.text,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  themeToggle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.divider,
  },
  headerCTA: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
  },
  headerCTAText: {
    color: colors.textInverse,
    fontWeight: "700",
    fontSize: fontSize.sm,
  },
  content: {
    flex: 1,
  },

  // Hero Section
  heroSection: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xxxl,
    paddingBottom: spacing.xxl,
    alignItems: "center",
  },
  heroBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    backgroundColor: `${colors.primary}15`,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    marginBottom: spacing.lg,
  },
  heroBadgeText: {
    color: colors.primary,
    fontSize: fontSize.xs,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  heroTitle: {
    fontSize: 40,
    fontWeight: "800",
    color: colors.text,
    textAlign: "center",
    lineHeight: 48,
    marginBottom: spacing.lg,
  },
  heroSubtitle: {
    fontSize: fontSize.md,
    color: colors.gray[400],
    textAlign: "center",
    lineHeight: 24,
    marginBottom: spacing.xxl,
    maxWidth: 340,
  },
  primaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.lg,
    borderRadius: borderRadius.lg,
    width: "100%",
    maxWidth: 320,
  },
  primaryButtonText: {
    color: colors.textInverse,
    fontSize: fontSize.md,
    fontWeight: "700",
  },
  socialProof: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    marginTop: spacing.xxl,
  },
  avatarStack: {
    flexDirection: "row",
  },
  avatarImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: colors.background,
    backgroundColor: colors.gray[600],
  },
  socialProofText: {
    color: colors.gray[400],
    fontSize: fontSize.sm,
  },
  highlight: {
    color: colors.primary,
    fontWeight: "700",
  },

  // App Preview
  appPreview: {
    marginTop: spacing.xxxl,
    alignItems: "center",
  },
  phoneFrame: {
    width: 220,
    height: 380,
    backgroundColor: colors.gray[900],
    borderRadius: 32,
    padding: 8,
    borderWidth: 2,
    borderColor: colors.gray[700],
  },
  phoneNotch: {
    width: 80,
    height: 24,
    backgroundColor: colors.gray[900],
    borderRadius: 12,
    alignSelf: "center",
    marginBottom: spacing.sm,
  },
  phoneMockup: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: 24,
    padding: spacing.md,
  },
  mockupHeader: {
    marginBottom: spacing.lg,
  },
  mockupGreeting: {
    color: colors.text,
    fontSize: fontSize.md,
    fontWeight: "700",
  },
  mockupSubtext: {
    color: colors.primary,
    fontSize: fontSize.xs,
    marginTop: spacing.xs,
  },
  mockupPillars: {
    gap: spacing.sm,
  },
  mockupPillar: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  mockupBar: {
    height: 8,
    borderRadius: 4,
  },

  // Sections
  section: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xxxl,
  },
  sectionLabel: {
    color: colors.primary,
    fontSize: fontSize.xs,
    fontWeight: "700",
    letterSpacing: 2,
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: fontSize.xxl,
    fontWeight: "800",
    marginBottom: spacing.sm,
  },
  sectionSubtitle: {
    color: colors.gray[400],
    fontSize: fontSize.base,
    lineHeight: 22,
    marginBottom: spacing.xl,
  },

  // Pain Points
  painPointsGrid: {
    gap: spacing.md,
    marginBottom: spacing.xxl,
  },
  painPoint: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
  },
  painPointIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: `${colors.error}15`,
    alignItems: "center",
    justifyContent: "center",
  },
  painPointText: {
    color: colors.gray[300],
    fontSize: fontSize.base,
    flex: 1,
  },
  transitionBox: {
    flexDirection: "row",
    gap: spacing.md,
    backgroundColor: `${colors.primary}10`,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: `${colors.primary}30`,
  },
  transitionText: {
    color: colors.gray[300],
    fontSize: fontSize.base,
    flex: 1,
    lineHeight: 22,
  },
  transitionHighlight: {
    color: colors.primary,
    fontWeight: "700",
  },

  // Pillars Grid
  pillarsGrid: {
    gap: spacing.md,
  },
  pillarCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
  },
  pillarIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  pillarName: {
    color: colors.text,
    fontSize: fontSize.base,
    fontWeight: "700",
  },
  pillarTagline: {
    color: colors.gray[500],
    fontSize: fontSize.xs,
  },

  // Steps
  stepsContainer: {
    position: "relative",
    paddingLeft: spacing.xl,
  },
  stepLine: {
    position: "absolute",
    left: 19,
    top: 24,
    bottom: 24,
    width: 2,
    backgroundColor: colors.gray[700],
  },
  step: {
    flexDirection: "row",
    gap: spacing.lg,
    marginBottom: spacing.xxl,
  },
  stepNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },
  stepNumberText: {
    color: colors.textInverse,
    fontSize: fontSize.lg,
    fontWeight: "800",
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    color: colors.text,
    fontSize: fontSize.lg,
    fontWeight: "700",
    marginBottom: spacing.xs,
  },
  stepDesc: {
    color: colors.gray[400],
    fontSize: fontSize.base,
    lineHeight: 22,
  },

  // Features Grid
  featuresGrid: {
    flexDirection: featureColumns > 1 ? "row" : "column",
    flexWrap: "wrap",
    gap: spacing.md,
  },
  featureCard: {
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    width: featureColumns > 1 ? (width - spacing.lg * 2 - spacing.md) / 2 : "100%",
  },
  featureIconContainer: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    backgroundColor: `${colors.primary}15`,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.md,
  },
  featureTitle: {
    color: colors.text,
    fontSize: fontSize.md,
    fontWeight: "700",
    marginBottom: spacing.xs,
  },
  featureDesc: {
    color: colors.gray[400],
    fontSize: fontSize.sm,
    lineHeight: 20,
  },

  // Science Section
  scienceBox: {
    backgroundColor: colors.surface,
    padding: spacing.xxl,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: colors.gray[700],
  },
  scienceLabel: {
    color: colors.primary,
    fontSize: fontSize.xs,
    fontWeight: "700",
    letterSpacing: 2,
    marginBottom: spacing.sm,
  },
  scienceTitle: {
    color: colors.text,
    fontSize: fontSize.xl,
    fontWeight: "700",
    marginBottom: spacing.xl,
  },
  statsGrid: {
    gap: spacing.lg,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: spacing.md,
  },
  statNumber: {
    color: colors.primary,
    fontSize: fontSize.xxl,
    fontWeight: "800",
    minWidth: 90,
  },
  statLabel: {
    color: colors.gray[400],
    fontSize: fontSize.sm,
    flex: 1,
    lineHeight: 20,
  },

  // Testimonials
  testimonialsScroll: {
    marginHorizontal: -spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  testimonialCard: {
    width: 300,
    backgroundColor: colors.surface,
    padding: spacing.xl,
    borderRadius: borderRadius.xl,
    marginRight: spacing.md,
  },
  quoteIcon: {
    marginBottom: spacing.md,
    opacity: 0.5,
  },
  testimonialQuote: {
    color: colors.gray[300],
    fontSize: fontSize.base,
    lineHeight: 24,
    fontStyle: "italic",
    marginBottom: spacing.lg,
  },
  testimonialFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  testimonialName: {
    color: colors.text,
    fontSize: fontSize.base,
    fontWeight: "700",
  },
  testimonialRole: {
    color: colors.gray[500],
    fontSize: fontSize.xs,
    marginTop: spacing.xs,
  },
  improvementBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    backgroundColor: `${colors.success}15`,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  improvementText: {
    color: colors.success,
    fontSize: fontSize.xs,
    fontWeight: "600",
  },

  // About Section
  aboutBox: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    overflow: "hidden",
  },
  aboutImageContainer: {
    height: 320,
    backgroundColor: colors.gray[800],
    overflow: "hidden",
  },
  aboutImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  aboutContent: {
    padding: spacing.xl,
  },
  aboutLabel: {
    color: colors.primary,
    fontSize: fontSize.xs,
    fontWeight: "700",
    letterSpacing: 2,
    marginBottom: spacing.xs,
  },
  aboutName: {
    color: colors.text,
    fontSize: fontSize.xl,
    fontWeight: "800",
    marginBottom: spacing.md,
  },
  aboutBio: {
    color: colors.gray[400],
    fontSize: fontSize.base,
    lineHeight: 24,
    marginBottom: spacing.lg,
  },
  aboutCredentials: {
    flexDirection: "row",
    gap: spacing.lg,
  },
  credential: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  credentialText: {
    color: colors.gray[400],
    fontSize: fontSize.sm,
  },

  // Book Section
  bookBox: {
    flexDirection: width < 400 ? "column" : "row",
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    overflow: "hidden",
  },
  bookCover: {
    width: width < 400 ? "100%" : 120,
    backgroundColor: colors.gray[800],
    padding: spacing.md,
    alignItems: "center",
    justifyContent: "center",
  },
  bookCoverTitle: {
    color: colors.text,
    fontSize: fontSize.xs,
    fontWeight: "700",
    textAlign: "center",
    marginTop: spacing.sm,
    lineHeight: 14,
  },
  bookContent: {
    flex: 1,
    padding: spacing.lg,
  },
  bookLabel: {
    color: colors.primary,
    fontSize: fontSize.xs,
    fontWeight: "700",
    letterSpacing: 2,
    marginBottom: spacing.xs,
  },
  bookTitle: {
    color: colors.text,
    fontSize: fontSize.lg,
    fontWeight: "700",
    marginBottom: spacing.sm,
  },
  bookDesc: {
    color: colors.gray[400],
    fontSize: fontSize.sm,
    lineHeight: 20,
    marginBottom: spacing.md,
  },
  bookChapters: {
    backgroundColor: colors.gray[800],
    padding: spacing.sm,
    borderRadius: borderRadius.sm,
  },
  bookChapterText: {
    color: colors.gray[400],
    fontSize: fontSize.xs,
  },

  // FAQ Section
  faqList: {
    gap: spacing.md,
  },
  faqItem: {
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
  },
  faqQuestion: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  faqQuestionText: {
    color: colors.text,
    fontSize: fontSize.base,
    fontWeight: "600",
    flex: 1,
  },
  faqAnswer: {
    color: colors.gray[400],
    fontSize: fontSize.sm,
    lineHeight: 20,
    marginLeft: 28,
  },

  // Final CTA
  finalCTA: {
    padding: spacing.xxxl,
    alignItems: "center",
    position: "relative",
    overflow: "hidden",
  },
  ctaGlow: {
    position: "absolute",
    top: 0,
    left: "50%",
    width: 300,
    height: 300,
    marginLeft: -150,
    borderRadius: 150,
    backgroundColor: colors.primary,
    opacity: 0.1,
  },
  ctaTitle: {
    color: colors.text,
    fontSize: 32,
    fontWeight: "800",
    textAlign: "center",
    lineHeight: 40,
    marginBottom: spacing.md,
  },
  ctaSubtitle: {
    color: colors.gray[400],
    fontSize: fontSize.md,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: spacing.xxl,
    maxWidth: 320,
  },
  ctaNote: {
    color: colors.gray[500],
    fontSize: fontSize.sm,
    marginTop: spacing.lg,
  },

  // Footer
  footer: {
    alignItems: "center",
    paddingVertical: spacing.xxxl,
    paddingHorizontal: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.gray[800],
  },
  footerLogo: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  footerLogoText: {
    color: colors.text,
    fontSize: fontSize.lg,
    fontWeight: "700",
  },
  footerTagline: {
    color: colors.gray[500],
    fontSize: fontSize.sm,
    marginBottom: spacing.lg,
  },
  footerCopyright: {
    color: colors.gray[600],
    fontSize: fontSize.xs,
  },
});
};
