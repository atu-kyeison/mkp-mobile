import React from 'react';
import { LegalContentScreen } from '../../components/LegalContentScreen';
import { useI18n } from '../../i18n/I18nProvider';

const UseGuidelinesScreen = ({ navigation }: any) => {
  const { t } = useI18n();

  return (
    <LegalContentScreen
      navigation={navigation}
      title={t('legal.guidelines.title')}
      sections={[
        {
          title: t('legal.guidelines.s1.title'),
          content: t('legal.guidelines.s1.body'),
        },
        {
          title: t('legal.guidelines.s2.title'),
          content: t('legal.guidelines.s2.body'),
        },
        {
          title: t('legal.guidelines.s3.title'),
          content: t('legal.guidelines.s3.body'),
        },
        {
          title: t('legal.guidelines.s4.title'),
          content: t('legal.guidelines.s4.body'),
        },
      ]}
      buttonTitle={t('legal.acknowledge')}
      onPress={() => navigation.goBack()}
    />
  );
};

export default UseGuidelinesScreen;
