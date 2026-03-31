const VARIANT =
  process.env.EAS_BUILD_PROFILE ||
  process.env.EAS_SUBMIT_PROFILE ||
  process.env.APP_VARIANT ||
  'production';

const VALID_VARIANTS = ['development', 'preview', 'production'];

if (!VALID_VARIANTS.includes(VARIANT)) {
  throw new Error(
    `❌ Invalid APP_VARIANT: ${VARIANT}. Must be development | preview | production`,
  );
}

const IS_DEV = VARIANT === 'development';
const IS_PREVIEW = VARIANT === 'preview';

const isEasBuild = !!process.env.EAS_BUILD_PROFILE;

// 🔍 Debug visibility
console.log('CONFIG LOAD →', {
  VARIANT,
  isEasBuild,
  EAS_BUILD_PROFILE: process.env.EAS_BUILD_PROFILE,
  APP_VARIANT: process.env.APP_VARIANT,
});

// ─────────────────────────────────────────────
// APP METADATA
// ─────────────────────────────────────────────

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

// ─────────────────────────────────────────────
// ENV-DRIVEN API CONFIG (important)
// ─────────────────────────────────────────────

const getApiUrl = () => {
  if (IS_DEV) return 'http://localhost:3000';
  if (IS_PREVIEW) return 'https://preview-api.yourapp.com';
  return 'https://api.yourapp.com';
};

// ─────────────────────────────────────────────
// EXPORT CONFIG
// ─────────────────────────────────────────────

module.exports = {
  expo: {
    name: getAppName(),
    slug: 'sudoku',
    version: '1.0.0',

    orientation: 'default',
    userInterfaceStyle: 'automatic',

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
      softwareKeyboardLayoutMode: 'pan',

      permissions: ['POST_NOTIFICATIONS', 'VIBRATE', 'RECEIVE_BOOT_COMPLETED'],
    },

    // ─── WEB ─────────────────────────────────
    web: {
      bundler: 'metro',
      output: 'single',
      favicon: './assets/images/favicon.png',
    },

    // ─── PLUGINS ─────────────────────────────
    plugins: [
      'expo-router',
      'expo-font',
      'expo-web-browser',

      [
        'expo-build-properties',
        {
          android: {
            compileSdkVersion: 36,
            targetSdkVersion: 36,
            buildToolsVersion: '36.0.0',
            reactNativeBuildFromSource: true,
            buildReactNativeFromSource: true,
            useHermesV1: true,
          },
          ios: {
            deploymentTarget: '15.1',
            useFrameworks: 'static',
            customBuildFlags: [
              '-DSQLITE_ENABLE_DBSTAT_VTAB=1 -DSQLITE_ENABLE_SNAPSHOT=1',
            ],
            reactNativeBuildFromSource: true,
            buildReactNativeFromSource: true,
            useHermesV1: true,
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
      'react-native-edge-to-edge',
      'expo-font',
      'expo-web-browser',
      'expo-secure-store',
    ],

    experiments: {
      tsconfigPaths: true,
      reactCompiler: true,
    },

    extra: {
      router: {},
      appVariant: VARIANT,
      apiUrl: getApiUrl(), // ✅ IMPORTANT
      eas: {
        projectId: '6aadea5a-b328-4ae6-a9ca-6903362161c9',
      },
    },
  },
};
