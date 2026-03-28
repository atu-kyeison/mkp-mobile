import { Alert, Linking } from 'react-native';

export const LEGAL_URLS = {
  privacy: 'https://mykingdompal.com/privacy',
  terms: 'https://mykingdompal.com/terms',
  contact: 'https://mykingdompal.com/contact',
} as const;

async function openUrl(url: string, label: string) {
  try {
    const supported = await Linking.canOpenURL(url);
    if (!supported) {
      Alert.alert('Link unavailable', `Unable to open ${label} right now.`);
      return;
    }
    await Linking.openURL(url);
  } catch {
    Alert.alert('Link unavailable', `Unable to open ${label} right now.`);
  }
}

export function openPrivacyUrl() {
  return openUrl(LEGAL_URLS.privacy, 'the privacy policy');
}

export function openTermsUrl() {
  return openUrl(LEGAL_URLS.terms, 'the terms of use');
}

export function openContactUrl() {
  return openUrl(LEGAL_URLS.contact, 'the contact page');
}
