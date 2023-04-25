import * as React from 'react';
import {Alert, Platform, StyleSheet, View} from 'react-native';

import type {StackNavigationProp} from '@react-navigation/stack';
import {
  Appbar,
  Button,
  List,
  Paragraph,
  Portal,
  RadioButton,
  Switch,
  Text,
} from 'react-native-paper';
// import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {PreferencesContext, useGlobalTheme} from '../../app';
import {yellowA200} from 'react-native-paper/src/styles/themes/v2/colors';
import ScreenWrapper from '../../ScreenWrapper';
import DialogWithLoadingIndicator from '../../component/Dialog/DialogWithLoadingIncicator';

type Props = {
  navigation: StackNavigationProp<{[key: string]: undefined}>;
};

type AppbarModes = 'small' | 'medium' | 'large' | 'center-aligned';

const MORE_ICON = Platform.OS === 'ios' ? 'dots-horizontal' : 'dots-vertical';

const SettingScreen = ({navigation}: Props) => {
  const preferences = React.useContext(PreferencesContext);

  const [showCustomColor, setShowCustomColor] = React.useState(false);
  const [showExactTheme, setShowExactTheme] = React.useState(false);
  const [appbarMode, setAppbarMode] = React.useState<AppbarModes>('small');
  const [showCalendarIcon, setShowCalendarIcon] = React.useState(false);
  const [showElevated, setShowElevated] = React.useState(false);
  const [darkMode, setDarkMode] = React.useState(preferences.theme.dark);
  const isCardMode = preferences.threadMode === 'card';
  const [cardMode, setCardMode] = React.useState(isCardMode);
  const [alertVisible, setAlertVisible] = React.useState(false);
  const theme = useGlobalTheme();

  const isCenterAlignedMode = appbarMode === 'center-aligned';

  React.useLayoutEffect(() => {
    const headerBar = () => (
      <Appbar.Header
        style={showCustomColor ? styles.customColor : null}
        mode={'center-aligned'}
        elevated={false}>
        <Appbar.BackAction
          onPress={() => {
            if (navigation.canGoBack()) {
              navigation.goBack();
            } else {
              navigation.navigate('MailListScreen');
            }
          }}
        />
        <Appbar.Content title="设置" />
        <Appbar.Action icon={MORE_ICON} onPress={() => {}} />
      </Appbar.Header>
    );
    navigation.setOptions({
      header: headerBar,
    });
  }, [navigation, showCustomColor]);

  const TextComponent = theme.isV3 ? Text : Paragraph;

  const renderDefaultOptions = () => (
    <>
      {theme.isV3 && (
        <View style={styles.row}>
          <TextComponent>Calendar icon</TextComponent>
          <Switch
            value={isCenterAlignedMode ? false : showCalendarIcon}
            disabled={isCenterAlignedMode}
            onValueChange={setShowCalendarIcon}
          />
        </View>
      )}
      <View style={styles.row}>
        <TextComponent>Custom Color</TextComponent>
        <Switch value={showCustomColor} onValueChange={setShowCustomColor} />
      </View>
      <View style={styles.row}>
        <TextComponent>Exact Dark Theme</TextComponent>
        <Switch value={showExactTheme} onValueChange={setShowExactTheme} />
      </View>
      {theme.isV3 && (
        <View style={styles.row}>
          <TextComponent>Elevated</TextComponent>
          <Switch value={showElevated} onValueChange={setShowElevated} />
        </View>
      )}
    </>
  );

  return (
    <>
      <ScreenWrapper
        style={styles.screenWrapper}
        contentContainerStyle={styles.contentContainer}>
        {theme.isV3 ? (
          <List.Section title="Default options">
            {renderDefaultOptions()}
          </List.Section>
        ) : (
          renderDefaultOptions()
        )}
        <Button onPress={() => navigation.navigate('LoginScreen')}>
          跳转登录
        </Button>
        {theme.isV3 && (
          <List.Section title="Appbar Modes">
            <RadioButton.Group
              value={appbarMode}
              onValueChange={(value: string) =>
                setAppbarMode(value as AppbarModes)
              }>
              <View style={styles.row}>
                <TextComponent>Small (default)</TextComponent>
                <RadioButton value="small" />
              </View>
              <View style={styles.row}>
                <TextComponent>Medium</TextComponent>
                <RadioButton value="medium" />
              </View>
              <View style={styles.row}>
                <TextComponent>Large</TextComponent>
                <RadioButton value="large" />
              </View>
              <View style={styles.row}>
                <TextComponent>Center-aligned</TextComponent>
                <RadioButton value="center-aligned" />
              </View>
            </RadioButton.Group>
          </List.Section>
        )}
        <View style={styles.row}>
          <TextComponent>DarkMode</TextComponent>
          <Switch
            value={darkMode}
            onValueChange={() => {
              setDarkMode(!darkMode);
              preferences.toggleTheme();
            }}
          />
        </View>
        <View style={styles.row}>
          <TextComponent>CardMode</TextComponent>
          <Switch
            value={cardMode}
            onValueChange={() => {
              setAlertVisible(true);
              preferences.toggleThreadMode();
              navigation.replace('MailListScreen');
            }}
          />
        </View>
        <DialogWithLoadingIndicator
          visible={alertVisible}
          close={() => setAlertVisible(false)}
        />
      </ScreenWrapper>
    </>
  );
};

SettingScreen.title = 'Settings';

const styles = StyleSheet.create({
  contentContainer: {
    paddingVertical: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  bottom: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  fab: {
    position: 'absolute',
    right: 16,
  },
  customColor: {
    backgroundColor: yellowA200,
  },
  screenWrapper: {
    marginBottom: 0,
  },
});

export default SettingScreen;
