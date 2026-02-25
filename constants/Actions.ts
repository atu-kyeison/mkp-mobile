import { Alert, Linking } from 'react-native';

export const CHURCH_MESSAGE_URL =
  process.env.EXPO_PUBLIC_CHURCH_MESSAGE_URL || 'https://www.youtube.com/';

export async function openChurchMessage() {
  try {
    await Linking.openURL(CHURCH_MESSAGE_URL);
  } catch {
    Alert.alert('Link unavailable', 'Unable to open this week’s message right now.');
  }
}

export async function openScriptureReference(reference: string) {
  const encoded = encodeURIComponent(reference);
  const appUrl = `youversion://search/${encoded}`;
  const webUrl = `https://www.bible.com/search/bible?q=${encoded}`;

  try {
    const canOpenApp = await Linking.canOpenURL(appUrl);
    if (canOpenApp) {
      await Linking.openURL(appUrl);
      return;
    }
    await Linking.openURL(webUrl);
  } catch {
    Alert.alert('Bible link unavailable', 'Unable to open this scripture right now.');
  }
}

export async function speakWithTTS(text: string) {
  if (!text?.trim()) return;

  // Hook point for Deepgram/Gemini voice flow:
  // 1) Optional Gemini rewrite/summary service.
  // 2) Deepgram TTS service returns playable audio URL.
  // 3) Open URL or stream in-app player.
  const ttsProxyUrl = process.env.EXPO_PUBLIC_TTS_PROXY_URL;
  if (ttsProxyUrl) {
    try {
      const response = await fetch(ttsProxyUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      if (response.ok) {
        const data = await response.json();
        if (data?.audioUrl) {
          await Linking.openURL(data.audioUrl);
          return;
        }
      }
    } catch {
      // Fall through to placeholder alert.
    }
  }

  Alert.alert(
    'Audio not configured',
    'Deepgram voice playback will work once the TTS proxy endpoint is connected.'
  );
}
