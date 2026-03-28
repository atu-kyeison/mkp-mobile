import * as SecureStore from 'expo-secure-store';

const KNOWN_KEYS = [
  'mkp.backend.session',
  'mkp.connectedChurchName',
  'mkp.connectedChurchLogoUri',
  'mkp.locale',
  'mkp.locale.override',
  'mkp.theme',
  'mkp.journal.entries',
  'mkp.journey.favoriteIds',
  'mkp.church.messages',
  'mkp.care.threads',
  'mkp.pref.reminders',
  'mkp.pref.churchMessages',
  'mkp.pref.encouragement',
  'mkp.formation.weeklyPackage',
  'mkp.brand.companyLogoUri',
  'mkp.brand.activeLogoUri',
  'mkp.brand.tierLogoUri',
  'mkp.brand.church.GRACE2024.logoUri',
  'mkp.brand.church.GRACE-24.logoUri',
  'mkp.brand.church.GRACE-STAGE-2026.logoUri',
  'mkp.brand.church.RIVER2024.logoUri',
  'mkp.brand.church.RIVER-STAGE-2026.logoUri',
  'mkp.brand.church.KINGDOM-24.logoUri',
] as const;

const cache = new Map<string, unknown>();
let hydrationPromise: Promise<void> | null = null;
let hydrated = false;
const SECURE_STORE_CHUNK_SIZE = 1800;
const CHUNK_PREFIX = '__chunked__:';

const decodeValue = (raw: string): unknown => {
  try {
    return JSON.parse(raw);
  } catch {
    return raw;
  }
};

const encodeValue = (value: unknown): string => JSON.stringify(value);

const getChunkCountKey = (key: string) => `${key}.__chunks`;

const splitIntoChunks = (value: string): string[] => {
  const chunks: string[] = [];
  for (let index = 0; index < value.length; index += SECURE_STORE_CHUNK_SIZE) {
    chunks.push(value.slice(index, index + SECURE_STORE_CHUNK_SIZE));
  }
  return chunks;
};

const writeSecureValue = async (key: string, value: string) => {
  const existingChunkCount = Number(await SecureStore.getItemAsync(getChunkCountKey(key)) || '0');
  if (value.length <= SECURE_STORE_CHUNK_SIZE) {
    await SecureStore.setItemAsync(key, value);
    await SecureStore.deleteItemAsync(getChunkCountKey(key));
    await Promise.all(
      Array.from({ length: existingChunkCount }, (_, index) =>
        SecureStore.deleteItemAsync(`${key}.__chunk.${index}`)
      )
    );
    return;
  }

  const chunks = splitIntoChunks(value);
  await SecureStore.setItemAsync(key, `${CHUNK_PREFIX}${chunks.length}`);
  await SecureStore.setItemAsync(getChunkCountKey(key), String(chunks.length));
  await Promise.all(
    chunks.map((chunk, index) => SecureStore.setItemAsync(`${key}.__chunk.${index}`, chunk))
  );
  if (existingChunkCount > chunks.length) {
    await Promise.all(
      Array.from({ length: existingChunkCount - chunks.length }, (_, index) =>
        SecureStore.deleteItemAsync(`${key}.__chunk.${chunks.length + index}`)
      )
    );
  }
};

const readSecureValue = async (key: string): Promise<string | null> => {
  const rawValue = await SecureStore.getItemAsync(key);
  if (!rawValue) {
    return null;
  }
  if (!rawValue.startsWith(CHUNK_PREFIX)) {
    return rawValue;
  }

  const chunkCount = Number(rawValue.slice(CHUNK_PREFIX.length));
  if (!Number.isFinite(chunkCount) || chunkCount <= 0) {
    return null;
  }

  const chunks = await Promise.all(
    Array.from({ length: chunkCount }, (_, index) => SecureStore.getItemAsync(`${key}.__chunk.${index}`))
  );
  if (chunks.some((chunk) => typeof chunk !== 'string')) {
    return null;
  }
  return chunks.join('');
};

export const hydrateDeviceSettings = async () => {
  if (hydrated) return;
  if (hydrationPromise) return hydrationPromise;

  hydrationPromise = (async () => {
    try {
      const entries = await Promise.all(
        KNOWN_KEYS.map(async (key) => [key, await readSecureValue(key)] as const)
      );
      entries.forEach(([key, rawValue]) => {
        if (rawValue !== null) {
          cache.set(key, decodeValue(rawValue));
        }
      });
      hydrated = true;
    } catch (error) {
      console.warn('AsyncStorage getMany failed; continuing with empty cache', error);
      hydrated = true;
    }
  })();

  return hydrationPromise;
};

export const Settings = {
  get(key: string): unknown {
    return cache.get(key);
  },

  set(values: Record<string, unknown>) {
    const serializedEntries = Object.entries(values).map(([key, value]) => {
      cache.set(key, value);
      return [key, encodeValue(value)] as const;
    });
    void Promise.all(
      serializedEntries.map(([key, value]) => writeSecureValue(key, value))
    );
  },
};

export const persistSetting = async (key: string, value: unknown) => {
  cache.set(key, value);
  await writeSecureValue(key, encodeValue(value));
};
