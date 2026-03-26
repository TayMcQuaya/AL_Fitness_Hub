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

export const SupportScreen = ({ onNavigate }) => {
  const { colors, isDark, toggleTheme } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const legalItems = [
    { n: 'Legal Disclaimer', i: 'gavel', screen: 'LEGAL_DISCLAIMER' },
    { n: 'Privacy Policy', i: 'policy', screen: 'PRIVACY_POLICY' },
    { n: 'Help & Support', i: 'help', screen: 'HELP_SUPPORT' },
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
        <Text style={styles.headerTitle}>Support</Text>
        <TouchableOpacity style={styles.backButton} onPress={toggleTheme}>
          <MaterialIcons name={isDark ? 'light-mode' : 'dark-mode'} size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.pageTitle}>Legal & Support</Text>
        <Text style={styles.pageSubtitle}>
          Find important information and get help when you need it.
        </Text>

        <View style={styles.legalCard}>
          {legalItems.map((item, i) => (
            <TouchableOpacity key={i} style={styles.legalRow} onPress={() => item.screen && onNavigate(item.screen)}>
              <View style={styles.legalLeft}>
                <View style={styles.legalIconContainer}>
                  <MaterialIcons name={item.i} size={20} color={colors.gray[400]} />
                </View>
                <Text style={styles.legalName}>{item.n}</Text>
              </View>
              <MaterialIcons
                name="arrow-forward-ios"
                size={16}
                color={colors.gray[500]}
              />
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.versionText}>Version 2.4.1 (Build 890)</Text>
      </ScrollView>

      <BottomNav currentScreen="SUPPORT" onNavigate={onNavigate} />
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
  pageTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  pageSubtitle: {
    fontSize: 14,
    color: colors.gray[500],
    marginBottom: 24,
  },
  legalCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.divider,
    overflow: 'hidden',
  },
  legalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  legalLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  legalIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.divider,
    alignItems: 'center',
    justifyContent: 'center',
  },
  legalName: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  versionText: {
    fontSize: 10,
    color: colors.gray[600],
    textAlign: 'center',
    marginTop: 16,
  },
});
