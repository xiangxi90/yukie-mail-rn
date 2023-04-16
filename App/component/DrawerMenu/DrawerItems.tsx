import * as React from 'react';
import {StyleSheet} from 'react-native';

import {DrawerContentScrollView} from '@react-navigation/drawer';
import {Badge, Drawer, MD2Colors, MD3Colors, Text} from 'react-native-paper';

import {useGlobalTheme} from '../../app';
import {useNavigation} from '@react-navigation/native';

import {settingIcon, draftIcon} from '../icons/basicIcons';
// type Props = {
//   toggleTheme: () => void;
//   toggleRTL: () => void;
//   toggleThemeVersion: () => void;
//   toggleCollapsed: () => void;
//   toggleCustomFont: () => void;
//   customFontLoaded: boolean;
//   collapsed: boolean;
//   isRTL: boolean;
//   isDarkTheme: boolean;
// };

const DrawerItemsData = [
  {
    label: 'Inbox',
    icon: 'inbox',
    key: 0,
    right: () => <Text variant="labelLarge">44</Text>,
  },
  {
    label: 'Draft',
    icon: draftIcon,
    key: 5,
    right: () => <Text variant="labelLarge">44</Text>,
  },
  {
    label: 'Stared',
    icon: 'star',
    key: 1,
    right: ({color}: {color: string}) => (
      <Badge
        visible
        size={8}
        style={[styles.badge, {backgroundColor: color}]}
      />
    ),
  },
  {label: 'Sent mail', icon: 'send', key: 2},
  {label: 'Colored label', icon: 'palette', key: 3},
  {
    label: 'A very long title that will be truncated',
    icon: 'delete',
    key: 4,
    right: () => <Badge visible size={8} style={styles.badge} />,
  },
];

const DrawerItems = () => {
  const [drawerItemIndex, setDrawerItemIndex] = React.useState<number>(0);
  const [allMailOnClick, setAllMailOnClick] = React.useState<boolean>(false);
  // const preferences = React.useContext(PreferencesContext);

  const _setDrawerItem = (index: number) => setDrawerItemIndex(index);

  const {isV3, colors} = useGlobalTheme();

  const navigation = useNavigation();

  const coloredLabelTheme = {
    colors: isV3
      ? {
          secondaryContainer: MD3Colors.tertiary80,
          onSecondaryContainer: MD3Colors.tertiary20,
        }
      : {
          primary: MD2Colors.tealA200,
        },
  };

  const rightIcon = () => <Text variant="labelLarge">44</Text>;

  return (
    <DrawerContentScrollView
      alwaysBounceVertical={false}
      style={[
        styles.drawerContent,
        {
          backgroundColor: colors.surface,
        },
      ]}>
      <>
        <Drawer.Section>
          <Drawer.Item
            label="所有收件箱"
            icon="inbox"
            key={0}
            right={rightIcon}
            active={allMailOnClick}
            onPress={() => {
              setAllMailOnClick(true);
              _setDrawerItem(-1);
            }}
          />
        </Drawer.Section>
        <Drawer.Section title="文件夹">
          {DrawerItemsData.map((props, index) => (
            <Drawer.Item
              {...props}
              key={props.key}
              theme={props.key === 3 ? coloredLabelTheme : undefined}
              active={drawerItemIndex === index}
              onPress={() => {
                _setDrawerItem(index);
                setAllMailOnClick(false);
              }}
            />
          ))}
        </Drawer.Section>
        <Drawer.Item
          label="设置"
          icon={settingIcon}
          onPress={() => {
            navigation.navigate('SettingScreen');
          }}
        />
        <Text variant="bodySmall" style={styles.annotation}>
          Clip Version {require('../../../package.json').version}
        </Text>
      </>
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
  },
  preference: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  v3Preference: {
    height: 56,
    paddingHorizontal: 28,
  },
  badge: {
    alignSelf: 'center',
  },
  collapsedSection: {
    marginTop: 16,
  },
  annotation: {
    marginHorizontal: 24,
    marginVertical: 6,
  },
});

export default DrawerItems;
