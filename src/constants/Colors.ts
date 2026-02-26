import { Colors as RootColors } from '../../constants/Colors';

type ExtendedColors = typeof RootColors & {
  antiqueGold: string;
  errorRed: string;
  muted: string;
};

export const Colors: ExtendedColors = new Proxy({} as ExtendedColors, {
  get: (_target, prop: string) => {
    if (prop === 'antiqueGold') return RootColors.accentGold;
    if (prop === 'errorRed') return '#FF6B6B';
    if (prop === 'muted') return RootColors.mutedBorder;
    return (RootColors as Record<string, string>)[prop];
  },
});

export default Colors;
