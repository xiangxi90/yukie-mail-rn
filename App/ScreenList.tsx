import * as React from 'react';
import {FlatList} from 'react-native';

import type {StackNavigationProp} from '@react-navigation/stack';
import {Divider, List} from 'react-native-paper';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import SettingScreen from './screens/SettingScreen';
import {FirstUseOnboard} from './screens/OnboardScreen';
import {useGlobalTheme} from './app';
import {Editor} from './screens/EditScreen';
import {MailListScreen} from './screens/MailListScreen';
// 在这里注册界面
export const mainScreens: Record<
  string,
  React.ComponentType<any> & {title: string}
> = {
  SettingScreen: SettingScreen,
  FirstUseOnboard: FirstUseOnboard,
  EditorScreen: Editor,
  MailListScreen: MailListScreen,
};

export const nestedScreens: Record<
  string,
  React.ComponentType<any> & {title: string}
> = {};

export const screens: Record<
  string,
  React.ComponentType<any> & {title: string}
> = {
  ...mainScreens,
  // ...nestedExamples,
};

type Props = {
  navigation: StackNavigationProp<{[key: string]: undefined}>;
};

type Item = {
  id: string;
  data: (typeof mainScreens)[string];
};

const data = Object.keys(mainScreens).map(
  (id): Item => ({id, data: mainScreens[id]}),
);

export default function ScreenList({navigation}: Props) {
  const keyExtractor = (item: {id: string}) => item.id;

  const {colors} = useGlobalTheme();
  const safeArea = useSafeAreaInsets();

  const renderItem = ({item}: {item: Item}) => {
    const {data: item_data, id} = item;

    return (
      <List.Item
        title={item_data.title}
        onPress={() => navigation.navigate(id)}
      />
    );
  };

  return (
    <FlatList
      contentContainerStyle={{
        backgroundColor: colors.background,
        paddingBottom: safeArea.bottom,
        paddingLeft: safeArea.left,
        paddingRight: safeArea.right,
      }}
      style={{
        backgroundColor: colors.background,
      }}
      showsVerticalScrollIndicator={false}
      ItemSeparatorComponent={Divider}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      data={data}
    />
  );
}
