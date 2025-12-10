const VARIANT = process.env.APP_VARIANT || 'preview';

const IS_DEV = VARIANT === 'development';
const IS_PREVIEW = VARIANT === 'preview';

const getAppName = () => {
  if (IS_DEV) return 'Sudoku Dev';
  if (IS_PREVIEW) return 'Sudoku Preview';
  return 'Sudoku';
};

const getScheme = () => {
  if (IS_DEV) return 'sudoku-dev';
  if (IS_PREVIEW) return 'sudoku-preview';
  return 'sudoku';
};

const getAndroidPackage = () => {
  if (IS_DEV) return 'com.shreyas.sudoku.dev';
  if (IS_PREVIEW) return 'com.shreyas.sudoku.preview';
  return 'com.shreyas.sudoku';
};

const getIosBundleId = () => {
  if (IS_DEV) return 'com.shreyas.sudoku.dev';
  if (IS_PREVIEW) return 'com.shreyas.sudoku.preview';
  return 'com.shreyas.sudoku';
};

module.exports = {
  expo: {
    name: getAppName(),
    slug: 'sudoku',
    version: '1.0.0',

    orientation: 'default',
    userInterfaceStyle: 'automatic',
    newArchEnabled: true,

    icon: './assets/images/icon.png',
    scheme: getScheme(),

    // ─── iOS ─────────────────────────────────
    ios: {
      supportsTablet: true,
      bundleIdentifier: getIosBundleId(),
      infoPlist: {
        NSUserNotificationUsageDescription:
          'We use notifications to remind you to play and track your progress.',
        ITSAppUsesNonExemptEncryption: false,
      },
    },

    // ─── ANDROID ─────────────────────────────
    android: {
      package: getAndroidPackage(),
      permissions: ['POST_NOTIFICATIONS', 'VIBRATE', 'RECEIVE_BOOT_COMPLETED'],
    },

    // ─── WEB ─────────────────────────────────
    web: {
      bundler: 'metro',
      output: 'single',
      favicon: './assets/images/favicon.png',
    },

    // ─── PLUGINS (MATCH BOOMM SDK LEVELS) ────
    plugins: [
      'expo-router',
      'expo-font',
      'expo-web-browser',

      [
        'expo-build-properties',
        {
          android: {
            compileSdkVersion: 35,
            targetSdkVersion: 35,
            buildToolsVersion: '35.0.0',
          },
          ios: {
            deploymentTarget: '15.1',
            useFrameworks: 'static',
          },
        },
      ],

      [
        'expo-notifications',
        {
          icon: './assets/images/icon.png',
          color: '#ffffff',
        },
      ],
    ],

    experiments: {
      typedRoutes: true,
    },

    extra: {
      router: {},
      eas: {
        projectId: '4b4368d8-0e2b-413e-adec-b3e18584f9a5',
      },
    },
  },
};
