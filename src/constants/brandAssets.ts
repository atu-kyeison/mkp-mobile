import { Settings } from 'react-native';

type ChurchBranding = {
  name: string;
  logoUri?: string;
};

export type ChurchBrandingResult = ChurchBranding & { found: boolean; code: string };

const DEFAULT_CHURCHS: Record<string, ChurchBranding> = {
  'GRACE-24': { name: 'Grace Community Church' },
  'KINGDOM-24': { name: 'Kingdom Fellowship Church' },
};

const getStringSetting = (key: string): string | undefined => {
  const value = Settings.get(key);
  return typeof value === 'string' && value.trim() ? value.trim() : undefined;
};

export const getCompanyLogoUri = (): string | undefined =>
  getStringSetting('mkp.brand.companyLogoUri');

export const getPrimaryBrandLogoUri = (): string | undefined =>
  getStringSetting('mkp.brand.activeLogoUri') ||
  getStringSetting('mkp.brand.tierLogoUri') ||
  getCompanyLogoUri();

export const getChurchBrandingByCode = (codeInput: string): ChurchBranding => {
  const code = codeInput.trim().toUpperCase();
  const found = DEFAULT_CHURCHS[code];
  if (found) {
    const customLogo = getStringSetting(`mkp.brand.church.${code}.logoUri`);
    return { ...found, logoUri: customLogo || found.logoUri };
  }

  return {
    name: 'Grace Community Church',
    logoUri: getStringSetting(`mkp.brand.church.${code}.logoUri`),
  };
};

export const resolveChurchBrandingByCode = (codeInput: string): ChurchBrandingResult => {
  const code = codeInput.trim().toUpperCase();
  const preset = DEFAULT_CHURCHS[code];
  if (preset) {
    const customLogo = getStringSetting(`mkp.brand.church.${code}.logoUri`);
    return { found: true, code, name: preset.name, logoUri: customLogo || preset.logoUri };
  }

  return {
    found: false,
    code,
    name: '',
    logoUri: getStringSetting(`mkp.brand.church.${code}.logoUri`),
  };
};
