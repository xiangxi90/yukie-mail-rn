import * as React from 'react';
import {StyleSheet} from 'react-native';

import {DrawerContentScrollView} from '@react-navigation/drawer';
import {Badge, Drawer, MD2Colors, MD3Colors, Text} from 'react-native-paper';

import {useGlobalTheme} from '../../app';
import {useNavigation} from '@react-navigation/native';

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
    label: 'Starred',
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

// const DrawerCollapsedItemsData = [
//   {
//     label: 'Inbox',
//     focusedIcon: 'inbox',
//     unfocusedIcon: 'inbox-outline',
//     key: 0,
//     badge: 44,
//   },
//   {
//     label: 'Starred',
//     focusedIcon: 'star',
//     unfocusedIcon: 'star-outline',
//     key: 1,
//   },
//   {
//     label: 'Sent mail',
//     focusedIcon: 'send',
//     unfocusedIcon: 'send-outline',
//     key: 2,
//   },
//   {
//     label: 'A very long title that will be truncated',
//     focusedIcon: 'delete',
//     unfocusedIcon: 'delete-outline',
//     key: 3,
//   },
//   {
//     label: 'Full width',
//     focusedIcon: 'arrow-all',
//     key: 4,
//   },
//   {
//     focusedIcon: 'bell',
//     unfocusedIcon: 'bell-outline',
//     key: 5,
//     badge: true,
//   },
// ];

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
          <Text> ceshi</Text>
        </Drawer.Section>
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
        <Drawer.Section title="邮箱标签">
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
          icon="close"
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
