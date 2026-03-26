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

const LEGAL_SECTIONS = [
  {
    heading: 'Terms and Conditions',
    body: 'Alain Cummings Fitness (o/a Grow Your Muscle Studio)\nEffective Date: March 26, 2026',
    isTitle: true,
  },
  {
    heading: '1. Agreement to Terms',
    body: 'By accessing or using this application ("App"), you agree to be bound by these Terms and Conditions. If you do not agree, you must not use the App.\n\nThis agreement is entered into between you and Alain Cummings ("Company", "we", "us"), operating as Alain Cummings Fitness, a sole proprietorship in Ontario, Canada.',
  },
  {
    heading: '2. Eligibility',
    body: 'You must be at least 16 years of age to use this App.\n\nIf you are under the age of majority in your jurisdiction, you must have the consent of a parent or legal guardian to use the App.\n\nThere are no geographic restrictions on use of the App.',
  },
  {
    heading: '3. Health and Medical Disclaimer',
    body: 'The App provides fitness, wellness, mindfulness, and lifestyle guidance for informational and educational purposes only.\n\nBy using the App, you acknowledge and agree that:',
    bullets: [
      'The App does not provide medical advice.',
      'Alain Cummings is not a physician or medical doctor.',
      'You should consult a qualified healthcare professional before beginning any new exercise, nutrition, wellness, or lifestyle intervention, especially if you are seeking to address, manage, or heal from any disease state or medical condition.',
      'If you choose not to consult a healthcare professional before participating, you do so at your own risk.',
      'You are responsible for confirming that you are physically and mentally able to participate in physical activity, meditation, or any other practices recommended through the App.',
      'You further agree that if you experience pain, significant discomfort, dizziness, or any other adverse symptoms, it is your responsibility to immediately modify, reduce, or stop the activity and seek appropriate professional guidance if necessary.',
    ],
    afterBullets: 'Exercise and lifestyle practices are generally part of normal human activity, but your individual circumstances matter. You accept full responsibility for how you use the information and recommendations provided in the App.',
  },
  {
    heading: '4. App Services',
    body: 'The App is designed to help users build awareness of their habits and take action toward healthier lifestyle patterns.\n\nThe App may include:',
    bullets: [
      'Habit tracking and habit-awareness tools',
      'Lifestyle recommendations based on intake information',
      'Guidance related to seven health pillars identified through the intake process',
      'Access to meditations',
      'Access to written educational content, including Alain Cummings\' book',
      'Opportunities to request a call or conversation with Alain Cummings',
    ],
    afterBullets: 'The App does not guarantee any particular outcome, including but not limited to:',
    bullets2: [
      'Weight loss',
      'Muscle gain',
      'Improved energy',
      'Better health markers',
      'Emotional well-being',
      'Any other specific physical or mental result',
    ],
    afterBullets2: 'Results vary from person to person and depend on many factors, including consistency, effort, health status, lifestyle, and other variables outside the control of Alain Cummings Fitness.\n\nWe reserve the right to modify, remove, suspend, or update any feature, content, or functionality of the App at any time.',
  },
  {
    heading: '5. Coaching and Communication',
    body: 'Use of the App does not include guaranteed direct messaging access to Alain Cummings.\n\nUsers may have the opportunity to:',
    bullets: [
      'Request a scheduled call after successfully completing the challenge',
      'Request to book a call more urgently, outside the standard challenge flow',
    ],
    afterBullets: 'All communication access is:',
    bullets2: [
      'Subject to availability',
      'Not guaranteed',
      'Offered on a first-come, first-served basis',
      'Dependent on Alain Cummings\' scheduling capacity and other professional responsibilities, including in-person clients',
    ],
    afterBullets2: 'Typical response time for inquiries is within 72 hours, but this is not guaranteed.\n\nAlain Cummings reserves the right to refuse, restrict, or terminate communication with any user who is abusive, inappropriate, disrespectful, dishonest, or otherwise misuses the App or related communication channels.',
  },
  {
    heading: '6. Payment, Challenge, and Refund Policy',
    subsections: [
      {
        subheading: '6.1 One-Time Fee',
        body: 'Access to the App challenge requires a one-time payment of $50 CAD, unless otherwise stated in writing.',
      },
      {
        subheading: '6.2 Nature of the Challenge',
        body: 'The challenge is a short-term habit-based program lasting less than one month. The goal is for the user to consistently follow and track a habit identified as significant through the intake process.',
      },
      {
        subheading: '6.3 Completion Requirements',
        body: 'To be considered as having completed the challenge, the user must:',
        bullets: [
          'Consistently check off and track completion of their identified habit across the challenge period',
          'Participate honestly and transparently',
          'Complete a follow-up call with Alain Cummings at the end of the challenge period, where applicable',
        ],
      },
      {
        subheading: '6.4 Refund Eligibility',
        body: 'A user may qualify for a refund of the $50 CAD fee if:',
        bullets: [
          'They successfully complete the challenge as determined by Alain Cummings Fitness, and',
          'They complete the applicable follow-up call at the end of the challenge period',
        ],
        afterBullets: 'Refunds that are approved will be issued within 72 hours of confirmation of successful completion.',
      },
      {
        subheading: '6.5 Missed Days and Partial Completion',
        body: 'If a user:',
        bullets: [
          'Misses days,',
          'Fails to track consistently,',
          'Partially completes the challenge, or',
          'Stops using the App before the end of the challenge period,',
        ],
        afterBullets: 'they may lose eligibility for a refund and remain at risk of forfeiting the full $50 CAD payment.\n\nThe purpose of the challenge is accountability and consistency. Refund eligibility is directly tied to successful participation and completion.',
      },
      {
        subheading: '6.6 Early Call Option',
        body: 'If a user chooses to book a call with Alain Cummings before the challenge period is complete, the $50 CAD payment may, at Alain Cummings\' discretion, be applied as a credit toward future services instead of being refunded.',
      },
      {
        subheading: '6.7 Non-Transferability',
        body: 'All payments are non-transferable.',
      },
    ],
  },
  {
    heading: '7. Cancellation and Termination',
    body: 'Users may stop using the App at any time. However, if a user voluntarily stops using the App without completing the challenge, the $50 CAD payment may be forfeited.\n\nAlain Cummings reserves the right, at sole discretion, to suspend, restrict, or terminate a user\'s access to the App or related services if the user:',
    bullets: [
      'Violates these Terms and Conditions',
      'Harasses Alain Cummings or other users',
      'Shares login credentials',
      'Acts dishonestly',
      'Misuses the App or related services',
    ],
    afterBullets: 'In the event of a violation, Alain Cummings may decide, at sole discretion, whether to:',
    bullets2: [
      'Cancel access without refund',
      'Cancel access and issue a refund',
      'Allow continued use despite the misuse',
    ],
  },
  {
    heading: '8. Data and Privacy',
    body: 'By using the App, you acknowledge and agree that Alain Cummings Fitness may collect and retain information including:',
    bullets: [
      'Contact information',
      'Intake responses',
      'Demographic and lifestyle information',
      'App usage behavior',
      'Habit tracking data',
      'Engagement patterns related to the challenge',
    ],
    afterBullets: 'This information is used to:',
    bullets2: [
      'Improve service delivery',
      'Better understand user participation',
      'Refine App recommendations',
      'Match recommendations more effectively to lifestyle circumstances and identified opportunity areas',
      'Improve future versions of the App and its guidance systems',
    ],
    afterBullets2: 'Alain Cummings Fitness does not share this data with third-party services, apps, or unrelated outside parties.\n\nAll information submitted through the App becomes part of Alain Cummings Fitness\' internal records and business data.\n\nUsers do not have a right to access, retrieve, or request deletion of submitted data once it has been provided through the App.',
  },
  {
    heading: '9. Results Disclaimer',
    body: 'Every user is different. Results will vary from person to person.\n\nNo guarantees are made regarding any health, fitness, emotional, behavioral, or lifestyle outcomes. While higher compliance and consistency may, according to research and practical experience, improve the likelihood of positive outcomes, no specific result is promised.\n\nAny testimonials included in the App or related materials are factual testimonials from past clients who received one-on-one training and lifestyle guidance from Alain Cummings. These testimonials reflect individual experiences and are not guarantees of similar outcomes for other users.',
  },
  {
    heading: '10. Intellectual Property',
    body: 'All App content is owned exclusively by Alain Cummings Fitness, including but not limited to:',
    bullets: [
      'Written content',
      'Workouts',
      'Meditations',
      'Systems and frameworks',
      'Educational resources',
      'Habit structures',
      'Branding',
      'Program materials',
    ],
    afterBullets: 'Users may share their own experience using the App and may discuss their experience publicly or privately.\n\nHowever, users may not:',
    bullets2: [
      'Copy, reproduce, distribute, republish, sell, or exploit App content',
      'Present Alain Cummings Fitness content, programs, or materials as their own',
      'Redistribute program materials without written permission',
    ],
  },
  {
    heading: '11. Limitation of Liability',
    body: 'To the fullest extent permitted by applicable law, Alain Cummings Fitness and Alain Cummings shall not be liable for any injury, illness, health complication, loss, claim, damage, expense, or misuse arising from or related to:',
    bullets: [
      'Use of the App',
      'Use or misuse of App content',
      'Participation in any exercise, habit, meditation, or lifestyle recommendation',
      'Failure to consult a healthcare professional',
      'User decisions made based on App information',
    ],
    afterBullets: 'All use of the App is at the user\'s own risk.',
  },
  {
    heading: '12. Acceptable Use',
    body: 'Users agree not to:',
    bullets: [
      'Harass, abuse, threaten, or intimidate Alain Cummings or any other user',
      'Share login credentials or permit another person to use their access',
      'Misrepresent their participation',
      'Attempt to manipulate or game the challenge system',
      'Use the App for unlawful or inappropriate purposes',
    ],
    afterBullets: 'Any breach of these expectations may result in suspension or termination of access, and may also affect refund eligibility.',
  },
  {
    heading: '13. Governing Law',
    body: 'These Terms and Conditions are governed by the laws of Ontario, Canada, without regard to conflict of law principles.',
  },
  {
    heading: '14. Changes to Terms',
    body: 'Alain Cummings Fitness reserves the right to update or modify these Terms and Conditions at any time.\n\nUsers will be notified of material updates by email.\n\nContinued use of the App after updated Terms are communicated constitutes acceptance of the revised Terms.',
  },
  {
    heading: '15. Marketing and Communication Consent',
    body: 'By signing up for and using the App, you consent to receive emails from Alain Cummings Fitness related to:',
    bullets: [
      'App use',
      'Challenge progress',
      'Educational guidance',
      'Added value content',
      'Opportunities to improve lifestyle choices',
      'Relevant future services or offers',
    ],
    afterBullets: 'Users may unsubscribe from non-essential marketing emails where applicable, but certain service-related communications may still be sent as needed for App administration and challenge participation.',
  },
  {
    heading: '16. Accountability and Participation Integrity',
    body: 'Completion of the challenge depends on honest participation.\n\nUsers are expected to provide full transparency in tracking and reporting their challenge-related behavior. Participation is tracked through backend systems, including internal records and spreadsheet-based monitoring.\n\nUsers may not game, manipulate, or falsely represent their participation in order to obtain a refund, a call, or any other benefit.\n\nAny attempt to misrepresent participation may result in:',
    bullets: [
      'Disqualification from refund eligibility',
      'Termination of App access',
      'Restriction of future services',
    ],
  },
  {
    heading: '17. Contact Information',
    body: 'For support, legal notices, or other inquiries related to these Terms and Conditions, contact:\n\nAlain Cummings Fitness\nOperating as Grow Your Muscle Studio\nEmail: info@growyourmusclestudio.com',
  },
];

const PRIVACY_SECTIONS = [
  {
    heading: 'Privacy Policy',
    body: 'Alain Cummings Fitness (o/a Grow Your Muscle Studio)\nEffective Date: March 26, 2026',
    isTitle: true,
  },
  {
    heading: '1. Introduction',
    body: 'This Privacy Policy explains how Alain Cummings Fitness ("Company", "we", "us"), operating as Grow Your Muscle Studio, collects, uses, stores, and protects your information when you use our application ("App").\n\nBy using the App, you consent to the collection and use of your information in accordance with this Privacy Policy.\n\nFor privacy-related inquiries, contact:\ninfo@growyourmusclestudio.com',
  },
  {
    heading: '2. Scope of This Policy',
    body: 'This Privacy Policy applies to all information collected through:',
    bullets: [
      'The App',
      'User intake forms',
      'Habit tracking features',
      'Any data voluntarily submitted by users through the platform',
    ],
  },
  {
    heading: '3. Information We Collect',
    subsections: [
      {
        subheading: '3.1 Personal Information',
        body: 'We may collect:',
        bullets: [
          'Name',
          'Email address',
          'Age or age-related eligibility information',
          'General demographic and lifestyle information',
        ],
      },
      {
        subheading: '3.2 Health and Lifestyle Information (User-Provided)',
        body: 'We collect information you voluntarily provide, including:',
        bullets: [
          'Exercise habits',
          'Sleep patterns',
          'Nutrition habits',
          'Stress and mindfulness inputs',
          'Lifestyle behaviors and routines',
        ],
        afterBullets: 'This information is:',
        bullets2: [
          'Self-reported',
          'Non-medical',
          'Not diagnostic',
          'Not part of a medical record',
        ],
      },
      {
        subheading: '3.3 App Usage Data',
        body: 'We collect data related to how you use the App, including:',
        bullets: [
          'Habit check-ins',
          'Login frequency and timing',
          'Time spent using the App',
          'Engagement with features and content',
        ],
      },
      {
        subheading: '3.4 Payment Information',
        body: 'All payment processing is handled by a third-party provider (Stan Store).\n\nWe do not collect, store, or have access to your payment details.',
      },
      {
        subheading: '3.5 Cookies and Tracking',
        body: 'The App may use cookies or similar technologies to:',
        bullets: [
          'Recognize returning users',
          'Maintain session continuity',
          'Track usage patterns and engagement frequency',
        ],
      },
    ],
  },
  {
    heading: '4. How We Use Your Information',
    body: 'We use your information to:',
    bullets: [
      'Deliver and personalize App experiences',
      'Provide habit-based recommendations aligned with your lifestyle',
      'Track participation and determine eligibility for challenge completion and refunds',
      'Improve the effectiveness of our services and guidance systems',
      'Better understand behavior patterns and habit formation trends',
      'Refine future versions of the App',
    ],
    afterBullets: 'As our user base grows, aggregated data may be used to improve the reliability and effectiveness of our habit-based recommendations.',
  },
  {
    heading: '5. Legal Basis for Collection',
    body: 'We collect and use your data based on:',
    bullets: [
      'Your consent when using the App',
      'The necessity of data to deliver the services you requested',
      'Legitimate business interests in improving and operating the App',
    ],
  },
  {
    heading: '6. Data Sharing',
    body: 'We do not sell, rent, or share your personal data with third parties.\n\nExceptions:',
    bullets: [
      'Payment processing is handled by Stan Store',
      'Data may be stored using secure cloud-based systems',
    ],
    afterBullets: 'All internal data is used solely by Alain Cummings Fitness to operate and improve services.',
  },
  {
    heading: '7. Data Storage and Security',
    bullets: [
      'Data is stored using cloud-based systems',
      'Data is accessible only to authorized individuals (primarily Alain Cummings)',
      'Systems are protected through password protection and encryption where applicable',
      'Devices used to access data are secured',
    ],
    afterBullets: 'While reasonable safeguards are in place, no system can guarantee complete security.',
  },
  {
    heading: '8. Data Retention',
    body: 'We may retain your data for as long as necessary to:',
    bullets: [
      'Deliver services',
      'Improve the App',
      'Maintain business records',
      'Support future service development',
    ],
    afterBullets: 'We may retain data for legitimate business purposes, even after your active use of the App has ended.',
  },
  {
    heading: '9. Your Rights',
    body: 'You may request to:',
    bullets: [
      'Access your data',
      'Withdraw your consent',
      'Request deletion of your data',
    ],
    afterBullets: 'Important:',
    bullets2: [
      'If you request deletion of your data, this will terminate your ability to continue using the App',
      'Deletion requests may only be processed after your active participation ends',
      'Some data may be retained where required for legitimate business purposes',
    ],
  },
  {
    heading: '10. Accuracy of Information',
    body: 'You are responsible for ensuring that the information you provide is accurate.\n\nYou may request access to your data, but ongoing correction or modification of submitted data during active participation may not be supported within the App.',
  },
  {
    heading: '11. Marketing and Communication',
    body: 'By using the App, you consent to receiving:',
    bullets: [
      'Service-related communications',
      'Educational content',
      'Lifestyle guidance',
      'Offers related to Alain Cummings Fitness services',
    ],
    afterBullets: 'You may opt out of non-essential communications at any time.',
  },
  {
    heading: '12. Minors and Parental Consent',
    body: 'The App is available to users aged 16 and older.',
    bullets: [
      'Users under the age of majority must have parental or guardian consent',
      'By allowing a minor to use the App, a parent or guardian consents to the collection and use of their data as outlined in this policy',
      'If consent is not granted, the minor may not use the App',
    ],
  },
  {
    heading: '13. Health Data Clarification',
    body: 'All health-related information:',
    bullets: [
      'Is provided voluntarily by the user',
      'Is not medical or clinical data',
      'Is not used for diagnosis or treatment',
      'Is used only to guide general lifestyle and habit recommendations',
    ],
  },
  {
    heading: '14. Refund and Participation Tracking',
    body: 'User data, including habit tracking and engagement, may be used to:',
    bullets: [
      'Assess participation',
      'Determine eligibility for challenge completion',
      'Determine eligibility for refunds',
    ],
    afterBullets: 'Accurate and honest participation is required.',
  },
  {
    heading: '15. Changes to This Privacy Policy',
    body: 'We may update this Privacy Policy from time to time.\n\nUsers will be notified of significant changes via email with at least one week\'s notice.\n\nContinued use of the App after updates constitutes acceptance of the revised policy.',
  },
  {
    heading: '16. Compliance',
    body: 'We aim to comply with applicable Canadian privacy laws, including PIPEDA (Personal Information Protection and Electronic Documents Act).',
  },
  {
    heading: '17. Contact Information',
    body: 'For questions, concerns, or requests related to this Privacy Policy, contact:\n\nAlain Cummings Fitness\nOperating as Grow Your Muscle Studio\nEmail: info@growyourmusclestudio.com',
  },
];

const HELP_SECTIONS = [
  {
    heading: 'Help & Support',
    body: 'Alain Cummings Fitness (o/a Grow Your Muscle Studio)',
    isTitle: true,
  },
  {
    heading: 'Need Help?',
    body: 'If you have questions about the App, your challenge, your account, or anything related to your experience, we\'re here to help.\n\nPlease reach out and we\'ll do our best to respond within 72 hours.',
    emailBanner: 'info@growyourmusclestudio.com',
  },
  {
    heading: 'When Reaching Out',
    body: 'Please include:',
    bullets: [
      'Your name and the email address associated with your account',
      'A brief description of your question or issue',
      'Any relevant details that may help us assist you more effectively',
    ],
  },
  {
    heading: 'Common Questions',
    subsections: [
      {
        subheading: 'How does the 21-day challenge work?',
        body: 'After completing your intake assessment, the App identifies your weakest health pillar and assigns a daily habit-based challenge. Track your progress each day by checking off your habit. Consistency is key.',
      },
      {
        subheading: 'Can I change my focus pillar?',
        body: 'Your focus pillar is determined by your intake assessment results. To update it, you would need to complete a new assessment.',
      },
      {
        subheading: 'How do I qualify for a refund?',
        body: 'Successfully complete your 21-day challenge with consistent daily tracking and complete a follow-up call with Coach Al. Full details are available in the Legal Disclaimer section.',
      },
      {
        subheading: 'I\'m having a technical issue with the App.',
        body: 'Please email us at info@growyourmusclestudio.com with a description of the issue, including what you were trying to do and what happened. Screenshots are always helpful.',
      },
    ],
  },
  {
    heading: 'Office Hours',
    body: 'Support inquiries are handled during regular business hours. While we aim to respond within 72 hours, response times may vary based on volume and availability.\n\nThank you for being part of the Wellness Studio community.',
  },
];

const CONTENT = {
  LEGAL_DISCLAIMER: {
    title: 'Legal Disclaimer',
    sections: LEGAL_SECTIONS,
  },
  PRIVACY_POLICY: {
    title: 'Privacy Policy',
    sections: PRIVACY_SECTIONS,
  },
  HELP_SUPPORT: {
    title: 'Help & Support',
    sections: HELP_SECTIONS,
  },
};

const renderBullets = (bullets, styles) =>
  bullets.map((b, i) => (
    <View key={i} style={styles.bulletRow}>
      <Text style={styles.bulletDot}>{'\u2022'}</Text>
      <Text style={styles.bulletText}>{b}</Text>
    </View>
  ));

const renderSubsection = (sub, i, styles) => (
  <View key={i} style={styles.subsection}>
    <Text style={styles.subheading}>{sub.subheading}</Text>
    {sub.body ? <Text style={styles.bodyText}>{sub.body}</Text> : null}
    {sub.bullets ? renderBullets(sub.bullets, styles) : null}
    {sub.afterBullets ? <Text style={styles.bodyText}>{sub.afterBullets}</Text> : null}
    {sub.bullets2 ? renderBullets(sub.bullets2, styles) : null}
    {sub.afterBullets2 ? <Text style={styles.bodyText}>{sub.afterBullets2}</Text> : null}
  </View>
);

export const LegalScreen = ({ type, onNavigate }) => {
  const { colors, isDark, toggleTheme } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const content = CONTENT[type];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => onNavigate('SUPPORT')}
        >
          <MaterialIcons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{content.title}</Text>
        <TouchableOpacity style={styles.backButton} onPress={toggleTheme}>
          <MaterialIcons name={isDark ? 'light-mode' : 'dark-mode'} size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {content.sections.map((section, idx) => (
          <View key={idx} style={styles.section}>
            <Text style={section.isTitle ? styles.docTitle : styles.sectionHeading}>
              {section.heading}
            </Text>
            {section.body ? <Text style={styles.bodyText}>{section.body}</Text> : null}
            {section.emailBanner ? (
              <View style={styles.emailBanner}>
                <MaterialIcons name="email" size={22} color={colors.background} />
                <Text style={styles.emailBannerText}>{section.emailBanner}</Text>
              </View>
            ) : null}
            {section.bullets ? renderBullets(section.bullets, styles) : null}
            {section.afterBullets ? <Text style={styles.bodyText}>{section.afterBullets}</Text> : null}
            {section.bullets2 ? renderBullets(section.bullets2, styles) : null}
            {section.afterBullets2 ? <Text style={styles.bodyText}>{section.afterBullets2}</Text> : null}
            {section.subsections ? section.subsections.map((sub, i) => renderSubsection(sub, i, styles)) : null}
          </View>
        ))}
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
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 60,
  },
  section: {
    marginBottom: 24,
  },
  docTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.primary,
    marginBottom: 4,
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  subsection: {
    marginTop: 16,
    marginLeft: 4,
  },
  subheading: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 6,
  },
  bodyText: {
    fontSize: 14,
    lineHeight: 22,
    color: colors.gray[400],
    marginBottom: 8,
  },
  bulletRow: {
    flexDirection: 'row',
    paddingLeft: 12,
    marginBottom: 4,
  },
  bulletDot: {
    fontSize: 14,
    lineHeight: 22,
    color: colors.primary,
    marginRight: 8,
    fontWeight: '700',
  },
  bulletText: {
    fontSize: 14,
    lineHeight: 22,
    color: colors.gray[400],
    flex: 1,
  },
  emailBanner: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginTop: 12,
    marginBottom: 8,
  },
  emailBannerText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.background,
    letterSpacing: 0.3,
  },
});
