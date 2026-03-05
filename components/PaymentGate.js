import React, { useState, useMemo, useCallback, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Linking,
  StyleSheet,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useTheme } from "../styles/ThemeContext";
import { PILLARS, STAN_STORE_URL } from "../constants";

const MAX_ATTEMPTS = 5;
const COOLDOWN_SECONDS = 60;

export const PaymentGate = ({
  userName,
  pillarScores,
  focusPillar,
  userEmail,
  onCodeValidated,
  validateCode,
}) => {
  const { colors, isDark, toggleTheme } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  // Two phases: "gate" (purchase/code entry) and "results" (score reveal)
  const [phase, setPhase] = useState("gate");
  const [validatedCode, setValidatedCode] = useState(null);

  const [code, setCode] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [cooldownEnd, setCooldownEnd] = useState(null);
  const [cooldownLeft, setCooldownLeft] = useState(0);
  const cooldownTimer = useRef(null);

  // Cooldown countdown
  useEffect(() => {
    if (!cooldownEnd) return;

    const tick = () => {
      const remaining = Math.max(0, Math.ceil((cooldownEnd - Date.now()) / 1000));
      setCooldownLeft(remaining);
      if (remaining <= 0) {
        setCooldownEnd(null);
        setAttempts(0);
        clearInterval(cooldownTimer.current);
      }
    };

    tick();
    cooldownTimer.current = setInterval(tick, 1000);
    return () => clearInterval(cooldownTimer.current);
  }, [cooldownEnd]);

  const formatCode = useCallback((text) => {
    const cleaned = text.toUpperCase().replace(/[^A-Z0-9]/g, "");
    if (cleaned.length <= 4) return cleaned;
    return cleaned.slice(0, 4) + "-" + cleaned.slice(4, 8);
  }, []);

  const handleCodeChange = (text) => {
    setError(null);
    setCode(formatCode(text));
  };

  const handleActivate = async () => {
    if (cooldownEnd) return;
    if (!code.trim()) {
      setError("Please enter your access code.");
      return;
    }

    // Normalize: ensure WELL- prefix
    let normalizedCode = code.trim().toUpperCase();
    if (!normalizedCode.startsWith("WELL-")) {
      normalizedCode = "WELL-" + normalizedCode.replace(/^WELL-?/, "");
    }

    setLoading(true);
    setError(null);

    const result = await validateCode(normalizedCode);

    setLoading(false);

    if (result.success) {
      setValidatedCode(normalizedCode);
      setPhase("results");
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      setError(result.error);

      if (newAttempts >= MAX_ATTEMPTS) {
        setCooldownEnd(Date.now() + COOLDOWN_SECONDS * 1000);
      }
    }
  };

  const handleContinue = () => {
    onCodeValidated(validatedCode);
  };

  const handleOpenStore = () => {
    Linking.openURL(STAN_STORE_URL).catch(() => {
      setError("Could not open store link. Visit stan.store/Althetrainer in your browser.");
    });
  };

  const focusPillarName = PILLARS.find((p) => p.id === focusPillar)?.name || "Wellness";

  // ─── RESULTS PHASE ───
  if (phase === "results") {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={{ width: 40 }} />
          <Text style={styles.headerTitle}>Your Results</Text>
          <TouchableOpacity onPress={toggleTheme} style={styles.themeToggle}>
            <MaterialIcons
              name={isDark ? "light-mode" : "dark-mode"}
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
            <View style={[styles.iconCircle, { borderColor: colors.success }]}>
              <MaterialIcons name="emoji-events" size={32} color={colors.success} />
            </View>
            <Text style={styles.greeting}>
              Welcome{userName ? `, ${userName}` : ""}!
            </Text>
            <Text style={styles.greetingSub}>
              You're in. Here are your 7 Pillar scores from the assessment.
            </Text>
          </View>

          {/* Pillar score bars — the reward */}
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
                        isFocus && { color: colors.secondary, fontWeight: "700" },
                      ]}
                    >
                      {pillar.name}
                      {isFocus ? " (Focus)" : ""}
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
                Your program starts with{" "}
                <Text style={{ fontWeight: "700", color: colors.secondary }}>
                  {focusPillarName}
                </Text>
                {" "}— your biggest opportunity for growth
              </Text>
            </View>
          </View>

          <View style={{ height: 16 }} />
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.ctaButton}
            onPress={handleContinue}
            activeOpacity={0.8}
          >
            <Text style={styles.ctaText}>Let's Go</Text>
            <MaterialIcons name="arrow-forward" size={20} color={colors.textInverse} />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // ─── GATE PHASE (default) ───
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={{ width: 40 }} />
        <Text style={styles.headerTitle}>Unlock Full Access</Text>
        <TouchableOpacity onPress={toggleTheme} style={styles.themeToggle}>
          <MaterialIcons
            name={isDark ? "light-mode" : "dark-mode"}
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
        {/* Greeting — no scores shown */}
        <View style={styles.greetingSection}>
          <View style={styles.iconCircle}>
            <MaterialIcons name="lock" size={32} color={colors.primary} />
          </View>
          <Text style={styles.greeting}>
            You're almost there{userName ? `, ${userName}` : ""}!
          </Text>
          <Text style={styles.greetingSub}>
            Your assessment is complete. Unlock your personalized program to see
            your results and start your transformation.
          </Text>
        </View>

        {/* What's included */}
        <View style={styles.includesCard}>
          <Text style={styles.includesTitle}>What You'll Get</Text>
          {[
            { icon: "insights", text: "Your personalized 7 Pillar assessment results" },
            { icon: "emoji-events", text: "21-Day Challenges tailored to your weak spots" },
            { icon: "fitness-center", text: "Guided Workout Programs" },
            { icon: "self-improvement", text: "Meditation Library" },
            { icon: "restaurant", text: "Nutrition Targets & Guidance" },
            { icon: "menu-book", text: 'Full Book: "Burnt Out & Ready to Feel Great"' },
            { icon: "favorite", text: "Progress Tracking & Streaks" },
          ].map((item, i) => (
            <View key={i} style={styles.includeRow}>
              <MaterialIcons name="check-circle" size={18} color={colors.primary} />
              <Text style={styles.includeText}>{item.text}</Text>
            </View>
          ))}
        </View>

        {/* Stan Store CTA */}
        <TouchableOpacity
          style={styles.ctaButton}
          onPress={handleOpenStore}
          activeOpacity={0.8}
        >
          <MaterialIcons name="shopping-cart" size={22} color={colors.textInverse} />
          <Text style={styles.ctaText}>Get Full Access</Text>
          <MaterialIcons name="open-in-new" size={16} color={colors.textInverse} />
        </TouchableOpacity>
        <Text style={styles.ctaHint}>
          You'll be taken to Coach Al's store to complete your purchase
        </Text>

        {/* Divider */}
        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>Already purchased?</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Code entry */}
        <View style={styles.codeSection}>
          <Text style={styles.codeLabel}>Enter your access code</Text>
          <View style={styles.codeInputRow}>
            <Text style={styles.codePrefix}>WELL-</Text>
            <TextInput
              style={styles.codeInput}
              value={code}
              onChangeText={handleCodeChange}
              placeholder="XXXX"
              placeholderTextColor={colors.gray[600]}
              maxLength={9}
              autoCapitalize="characters"
              autoCorrect={false}
              editable={!loading}
            />
          </View>

          {error && (
            <View style={styles.errorRow}>
              <MaterialIcons name="error-outline" size={16} color={colors.error} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {cooldownEnd && cooldownLeft > 0 && (
            <View style={styles.cooldownRow}>
              <MaterialIcons name="hourglass-empty" size={16} color={colors.warning} />
              <Text style={styles.cooldownText}>
                Too many attempts. Try again in {cooldownLeft}s
              </Text>
            </View>
          )}

          <TouchableOpacity
            style={[
              styles.activateButton,
              (loading || (cooldownEnd && cooldownLeft > 0)) &&
                styles.activateButtonDisabled,
            ]}
            onPress={handleActivate}
            disabled={loading || (cooldownEnd && cooldownLeft > 0)}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator size="small" color={colors.textInverse} />
            ) : (
              <>
                <MaterialIcons name="vpn-key" size={18} color={colors.textInverse} />
                <Text style={styles.activateText}>Activate Code</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
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
      borderBottomWidth: 1,
      borderBottomColor: colors.divider,
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: colors.text,
    },
    themeToggle: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: "center",
      justifyContent: "center",
    },
    content: {
      flex: 1,
    },
    contentContainer: {
      padding: 24,
    },
    footer: {
      padding: 16,
      paddingBottom: 32,
      borderTopWidth: 1,
      borderTopColor: colors.divider,
    },

    // Greeting
    greetingSection: {
      alignItems: "center",
      marginBottom: 24,
    },
    iconCircle: {
      width: 72,
      height: 72,
      borderRadius: 36,
      backgroundColor: `${colors.primary}15`,
      borderWidth: 2,
      borderColor: colors.primary,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 16,
    },
    greeting: {
      fontSize: 22,
      fontWeight: "700",
      color: colors.text,
      marginBottom: 4,
    },
    greetingSub: {
      fontSize: 14,
      color: colors.gray[400],
      textAlign: "center",
      lineHeight: 20,
    },

    // Scores (results phase only)
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
      fontWeight: "700",
      color: colors.text,
      marginBottom: 14,
    },
    scoreRow: {
      marginBottom: 10,
    },
    scoreLabelRow: {
      flexDirection: "row",
      alignItems: "center",
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
      fontWeight: "600",
      color: colors.gray[400],
    },
    scoreBarBg: {
      height: 6,
      borderRadius: 3,
      backgroundColor: colors.overlayMedium,
      overflow: "hidden",
    },
    scoreBarFill: {
      height: 6,
      borderRadius: 3,
    },
    focusCallout: {
      flexDirection: "row",
      alignItems: "center",
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

    // Includes
    includesCard: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 16,
      borderWidth: 1,
      borderColor: colors.divider,
      marginBottom: 24,
    },
    includesTitle: {
      fontSize: 16,
      fontWeight: "700",
      color: colors.text,
      marginBottom: 12,
    },
    includeRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      marginBottom: 10,
    },
    includeText: {
      fontSize: 14,
      color: colors.text,
      flex: 1,
    },

    // CTA
    ctaButton: {
      height: 56,
      backgroundColor: colors.primary,
      borderRadius: 12,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 10,
    },
    ctaText: {
      fontSize: 16,
      fontWeight: "700",
      color: colors.textInverse,
    },
    ctaHint: {
      fontSize: 12,
      color: colors.gray[500],
      textAlign: "center",
      marginTop: 8,
      marginBottom: 24,
    },

    // Divider
    divider: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      marginBottom: 20,
    },
    dividerLine: {
      flex: 1,
      height: 1,
      backgroundColor: colors.divider,
    },
    dividerText: {
      fontSize: 13,
      color: colors.gray[500],
      fontWeight: "500",
    },

    // Code entry
    codeSection: {
      alignItems: "center",
    },
    codeLabel: {
      fontSize: 14,
      color: colors.gray[400],
      marginBottom: 12,
    },
    codeInputRow: {
      flexDirection: "row",
      alignItems: "center",
      width: "100%",
      backgroundColor: colors.surface,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.divider,
      paddingHorizontal: 16,
      height: 52,
    },
    codePrefix: {
      fontSize: 18,
      fontWeight: "700",
      color: colors.gray[500],
      letterSpacing: 2,
    },
    codeInput: {
      flex: 1,
      fontSize: 18,
      fontWeight: "700",
      color: colors.text,
      letterSpacing: 2,
      paddingVertical: 0,
    },
    errorRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      marginTop: 10,
    },
    errorText: {
      fontSize: 13,
      color: colors.error,
    },
    cooldownRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      marginTop: 8,
    },
    cooldownText: {
      fontSize: 13,
      color: colors.warning,
    },
    activateButton: {
      height: 48,
      width: "100%",
      backgroundColor: colors.secondary,
      borderRadius: 12,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      marginTop: 14,
    },
    activateButtonDisabled: {
      opacity: 0.5,
    },
    activateText: {
      fontSize: 14,
      fontWeight: "700",
      color: colors.textInverse,
    },
  });
