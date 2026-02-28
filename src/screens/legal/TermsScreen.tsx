import React from 'react';
import { LegalContentScreen } from '../../components/LegalContentScreen';
import { useI18n } from '../../i18n/I18nProvider';

const TermsScreen = ({ navigation, route }: any) => {
  const { t } = useI18n();

  const handleAccept = () => {
    if (route?.params?.nextScreen === 'ChurchSearch') {
      navigation.navigate('ChurchSearch');
      return;
    }

    navigation.goBack();
  };

  return (
    <LegalContentScreen
      navigation={navigation}
      headerLabel={t('legal.header')}
      title={t('legal.terms.title')}
      sections={[
        { title: t('legal.terms.s1.title'), content: t('legal.terms.s1.body') },
        { title: t('legal.terms.s2.title'), content: t('legal.terms.s2.body') },
        { title: t('legal.terms.s3.title'), content: t('legal.terms.s3.body') },
        { title: t('legal.terms.s4.title'), content: t('legal.terms.s4.body') },
      ]}
      buttonTitle={t('legal.terms.accept')}
      footerNote={t('legal.terms.quote')}
      onPress={handleAccept}
      showBackButton={!route?.params?.nextScreen}
    />
  );
};

export default TermsScreen;
