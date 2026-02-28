import React from 'react';
import { LegalContentScreen } from '../../components/LegalContentScreen';

const UseGuidelinesScreen = ({ navigation }: any) => (
  <LegalContentScreen
    navigation={navigation}
    title="Use Guidelines"
    sections={[
      {
        title: 'Personal Formation',
        content:
          'MKP is designed for prayerful reflection, spiritual formation, and quiet daily rhythm. Use the app as a personal space to pause, listen, and respond to God with honesty.',
      },
      {
        title: 'Private by Default',
        content:
          'Your journal entries and mood notes are intended to remain private on your device. Care requests are shared only when you choose to send them for church follow-up.',
      },
      {
        title: 'Respectful Use',
        content:
          'If you submit a prayer, gratitude, or support request, share truthfully and respectfully. Do not use the app to harass, threaten, impersonate others, or submit unlawful or harmful content.',
      },
      {
        title: 'Safety and Support',
        content:
          'MKP is not emergency response, therapy, or crisis intervention. If someone is in immediate danger, contact local emergency services right away.',
      },
    ]}
    buttonTitle="I UNDERSTAND"
    onPress={() => navigation.goBack()}
  />
);

export default UseGuidelinesScreen;
