import React from 'react';
import { LegalContentScreen } from '../../components/LegalContentScreen';

const PrivacyPolicyScreen = ({ navigation }: any) => (
  <LegalContentScreen
    navigation={navigation}
    title="Privacy Policy"
    sections={[
      {
        title: 'What Stays on Your Device',
        content:
          'Journal entries and mood notes are intended to stay on your device. MKP is designed so your private reflections are local-first and not stored on MKP infrastructure.',
      },
      {
        title: 'Church Support Requests',
        content:
          'If you choose to send a prayer, support, or gratitude request through Care, that information may be shared with your connected church team for ministry follow-up. Those requests are not posted publicly.',
      },
      {
        title: 'Backups and Email',
        content:
          'Your device platform may include your local app data in an encrypted device backup, such as iCloud Backup or Android device backup. If your church uses account email for follow-up, that communication may occur outside the app.',
      },
      {
        title: 'Your Choices',
        content:
          'You control what you write, what you submit to Care, and what remains private. If you stop using the app, locally stored content remains subject to your device settings and any backups you manage.',
      },
    ]}
    buttonTitle="I UNDERSTAND"
    onPress={() => navigation.goBack()}
  />
);

export default PrivacyPolicyScreen;
