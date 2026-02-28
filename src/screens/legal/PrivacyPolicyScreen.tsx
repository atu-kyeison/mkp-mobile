import React from 'react';
import { LegalContentScreen } from '../../components/LegalContentScreen';
import { useI18n } from '../../i18n/I18nProvider';

const PrivacyPolicyScreen = ({ navigation }: any) => {
  const { t } = useI18n();

  return (
    <LegalContentScreen
      navigation={navigation}
      title={t('legal.privacy.title')}
      sections={[
        {
          title: t('legal.privacy.s1.title'),
          content: t('legal.privacy.s1.body'),
        },
        {
          title: t('legal.privacy.s2.title'),
          content: t('legal.privacy.s2.body'),
        },
        {
          title: t('legal.privacy.s3.title'),
          content: t('legal.privacy.s3.body'),
        },
        {
          title: t('legal.privacy.s4.title'),
          content: t('legal.privacy.s4.body'),
        },
      ]}
      buttonTitle={t('legal.acknowledge')}
      onPress={() => navigation.goBack()}
    />
  );
};

export default PrivacyPolicyScreen;
