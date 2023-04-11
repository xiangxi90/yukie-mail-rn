import * as React from 'react';
import {Platform} from 'react-native';

import type {DrawerNavigationProp} from '@react-navigation/drawer';
import {getHeaderTitle} from '@react-navigation/elements';
import {
  CardStyleInterpolators,
  createStackNavigator,
} from '@react-navigation/stack';
import {Appbar} from 'react-native-paper';

import ScreenList, {examples} from './ScreenList';

const Stack = createStackNavigator();

const Root = () => {
  const cardStyleInterpolator =
    Platform.OS === 'android'
      ? CardStyleInterpolators.forFadeFromBottomAndroid
      : CardStyleInterpolators.forHorizontalIOS;
  return (
    <Stack.Navigator
      screenOptions={({navigation}) => {
        return {
          detachPreviousScreen: !navigation.isFocused(),
          cardStyleInterpolator,
          // eslint-disable-next-line react/no-unstable-nested-components
          header: ({navigation: navigator, route, options, back}) => {
            const title = getHeaderTitle(options, route.name);
            return (
              <Appbar.Header elevated>
                {back ? (
                  <Appbar.BackAction
                    onPress={() => {
                      if (navigator.canGoBack()) {
                        navigator.goBack();
                      } else {
                        navigator.navigate('Home');
                      }
                    }}
                  />
                ) : (navigator as any).openDrawer ? (
                  <Appbar.Action
                    icon="menu"
                    isLeading
                    onPress={() =>
                      (
                        navigator as any as DrawerNavigationProp<{}>
                      ).openDrawer()
                    }
                  />
                ) : null}
                <Appbar.Content title={title} />
              </Appbar.Header>
            );
          },
        };
      }}>
      <Stack.Screen
        name="ScreenList"
        component={ScreenList}
        options={{
          title: 'Example',
          cardShadowEnabled: false,
          headerMode: 'screen',
        }}
      />
      {(Object.keys(examples) as Array<keyof typeof examples>).map(id => {
        return (
          <Stack.Screen
            key={id}
            name={id}
            component={examples[id]}
            options={{
              title: examples[id].title,
              headerShown: id !== 'themingWithReactNavigation',
            }}
          />
        );
      })}
    </Stack.Navigator>
  );
};
export default Root;
