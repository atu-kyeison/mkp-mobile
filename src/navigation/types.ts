export type AuthStackParamList = {
  Welcome: undefined;
  ChurchSearch: { error?: boolean };
  ChurchSuccess: { churchName: string; isNewBeliever?: boolean };
  NewBelieverStart: { churchName: string };
  Signup: undefined;
  Signin: { error?: boolean };
  PasswordReset: undefined;
  PasswordEmailSent: { email: string };
  Terms: { nextScreen?: 'ChurchSearch' } | undefined;
  Privacy: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Journey: undefined;
  Church: undefined;
  Profile: undefined;
};

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  FAQ: undefined;
  Guidelines: undefined;
};
