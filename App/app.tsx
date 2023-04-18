import * as React from 'react';
import {I18nManager, Platform, StatusBar} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {createDrawerNavigator} from '@react-navigation/drawer';

import {
  InitialState,
  NavigationContainer,
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
} from '@react-navigation/native';

import {
  Provider as PaperProvider,
  MD3DarkTheme,
  MD3LightTheme,
  MD2DarkTheme,
  MD2LightTheme,
  MD2Theme,
  MD3Theme,
  useTheme,
  adaptNavigationTheme,
  configureFonts,
} from 'react-native-paper';
import {SafeAreaInsetsContext} from 'react-native-safe-area-context';

///-----------------------------------///
import {isWeb} from './utils';
// import DrawerItems from './DrawerItems';
import DrawerItems from './component/DrawerMenu';
import Root from './RootNavigation';
///-----------------------------------///

const PERSISTENCE_KEY = 'NAVIGATION_STATE';
const PREFERENCES_KEY = 'APP_PREFERENCES';

///----------------------------------///
export const PreferencesContext = React.createContext<any>(null);
export const useGlobalTheme = () => useTheme<MD2Theme | MD3Theme>();
///----------------------------------///

const DrawerContent = () => {
  return (
    <PreferencesContext.Consumer>
      {() => <DrawerItems />}
    </PreferencesContext.Consumer>
  );
};

const Drawer = createDrawerNavigator<{Home: undefined}>();
///----------------------------------///
const fontConfig = configureFonts({
  config: {
    fontFamily: Platform.select({
      web: 'HarmonyOS_Sans_Regular',
      ios: 'System',
      android:
        'HarmonyOS_Sans_Regular,HarmonyOS_Sans_Bold,HarmonyOS_Sans_Light,HarmonyOS_Sans_Thin',
      default: 'sans-serif',
    }),
  },
});
///----------------------------------///
const MailApp = () => {
  // hooks
  const [isReady, setIsReady] = React.useState(false);
  const [initialState, setInitialState] = React.useState<
    InitialState | undefined
  >();

  const [isDarkMode, setIsDarkMode] = React.useState(false);
  const [themeVersion, setThemeVersion] = React.useState<2 | 3>(3);
  const [rtl, setRtl] = React.useState<boolean>(
    I18nManager.getConstants().isRTL,
  );
  const [collapsed, setCollapsed] = React.useState(false);
  const [customFontLoaded, setCustomFont] = React.useState(false);

  const themeMode = isDarkMode ? 'dark' : 'light';

  const theme = {
    2: {
      light: MD2LightTheme,
      dark: MD2DarkTheme,
    },
    3: {
      light: MD3LightTheme,
      dark: MD3DarkTheme,
    },
  }[themeVersion][themeMode];
  theme.fonts = fontConfig;

  React.useEffect(() => {
    const restoreState = async () => {
      try {
        const savedStateString = await AsyncStorage.getItem(PERSISTENCE_KEY);
        const state = JSON.parse(savedStateString || '');

        setInitialState(state);
      } catch (e) {
        // ignore error
      } finally {
        setIsReady(true);
      }
    };

    if (!isReady) {
      restoreState();
    }
  }, [isReady]);

  React.useEffect(() => {
    const restorePrefs = async () => {
      try {
        const prefString = await AsyncStorage.getItem(PREFERENCES_KEY);
        const preferences = JSON.parse(prefString || '');

        if (preferences) {
          setIsDarkMode(preferences.theme === 'dark');

          if (typeof preferences.rtl === 'boolean') {
            setRtl(preferences.rtl);
          }
        }
      } catch (e) {
        // ignore error
      }
    };

    restorePrefs();
  }, []);

  React.useEffect(() => {
    const savePrefs = async () => {
      try {
        await AsyncStorage.setItem(
          PREFERENCES_KEY,
          JSON.stringify({
            theme: themeMode,
            rtl,
          }),
        );
      } catch (e) {
        // ignore error
      }

      if (I18nManager.getConstants().isRTL !== rtl) {
        I18nManager.forceRTL(rtl);
      }
    };

    savePrefs();
  }, [rtl, themeMode]);

  const preferences = React.useMemo(
    () => ({
      toggleTheme: () => setIsDarkMode(oldValue => !oldValue),
      toggleRtl: () => setRtl(tl => !tl),
      toggleCollapsed: () => setCollapsed(!collapsed),
      toggleCustomFont: () => setCustomFont(!customFontLoaded),
      toggleThemeVersion: () => {
        setCustomFont(false);
        setCollapsed(false);
        setThemeVersion(oldThemeVersion => (oldThemeVersion === 2 ? 3 : 2));
      },
      customFontLoaded,
      collapsed,
      rtl,
      theme,
    }),
    [rtl, theme, collapsed, customFontLoaded],
  );

  if (!isReady) {
    return null;
  }

  const {LightTheme, DarkTheme} = adaptNavigationTheme({
    reactNavigationLight: NavigationDefaultTheme,
    reactNavigationDark: NavigationDarkTheme,
  });

  const CombinedDefaultTheme = {
    ...MD3LightTheme,
    ...LightTheme,
    colors: {
      ...MD3LightTheme.colors,
      ...LightTheme.colors,
    },
  };

  const CombinedDarkTheme = {
    ...MD3DarkTheme,
    ...DarkTheme,
    colors: {
      ...MD3DarkTheme.colors,
      ...DarkTheme.colors,
    },
  };

  const combinedTheme = isDarkMode ? CombinedDarkTheme : CombinedDefaultTheme;

  return (
    <PaperProvider theme={theme}>
      <PreferencesContext.Provider value={preferences}>
        <React.Fragment>
          <NavigationContainer
            theme={combinedTheme}
            initialState={initialState}
            onStateChange={state =>
              AsyncStorage.setItem(PERSISTENCE_KEY, JSON.stringify(state))
            }>
            {isWeb ? (
              <Root />
            ) : (
              <SafeAreaInsetsContext.Consumer>
                {insets => {
                  const {left, right} = insets || {left: 0, right: 0};
                  const collapsedDrawerWidth = 90 + Math.max(left, right);
                  return (
                    <Drawer.Navigator
                      screenOptions={{
                        drawerStyle: collapsed && {
                          width: collapsedDrawerWidth,
                        },
                      }}
                      drawerContent={DrawerContent}>
                      <Drawer.Screen
                        name="Home"
                        component={Root}
                        options={{headerShown: false}}
                      />
                    </Drawer.Navigator>
                  );
                }}
              </SafeAreaInsetsContext.Consumer>
            )}
            <StatusBar
              barStyle={
                !theme.isV3 || theme.dark ? 'dark-content' : 'light-content'
              }
            />
          </NavigationContainer>
        </React.Fragment>
      </PreferencesContext.Provider>
    </PaperProvider>
  );
};
export default MailApp;
