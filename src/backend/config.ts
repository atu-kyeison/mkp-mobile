import { Platform } from 'react-native';

const LOCALHOST = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';

const appEnv = process.env.EXPO_PUBLIC_APP_ENV || 'local';

// Backend selection must be explicit so a local dev/TestFlight build does not
// accidentally point at staging just because it was launched in dev mode.
const useEmulators = process.env.EXPO_PUBLIC_USE_FIREBASE_EMULATORS === 'true';

const projectId =
  process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || 'mkp-mobile-dev';

const apiKey =
  process.env.EXPO_PUBLIC_FIREBASE_API_KEY || 'emulator-test-key';

const functionsBaseUrl = useEmulators
  ? `http://${LOCALHOST}:5001/${projectId}/us-central1`
  : process.env.EXPO_PUBLIC_FIREBASE_FUNCTIONS_BASE_URL ||
    `https://us-central1-${projectId}.cloudfunctions.net`;

const authBaseUrl = useEmulators
  ? `http://${LOCALHOST}:9099/identitytoolkit.googleapis.com/v1`
  : 'https://identitytoolkit.googleapis.com/v1';

const secureTokenBaseUrl = useEmulators
  ? `http://${LOCALHOST}:9099/securetoken.googleapis.com/v1`
  : 'https://securetoken.googleapis.com/v1';

export const backendConfig = {
  appEnv,
  apiKey,
  projectId,
  functionsBaseUrl,
  authBaseUrl,
  secureTokenBaseUrl,
  useEmulators,
};
