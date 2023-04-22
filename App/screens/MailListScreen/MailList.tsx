/* eslint-disable react/no-unstable-nested-components */
import {StackNavigationProp} from '@react-navigation/stack';
import * as React from 'react';
import {NativeScrollEvent, NativeSyntheticEvent} from 'react-native';
import {Animated, FlatList, Platform, StyleSheet, View} from 'react-native';
import {Badge, Card, FAB} from 'react-native-paper';
import {
  Appbar,
  Avatar,
  MD2Colors,
  MD3Colors,
  Paragraph,
  Portal,
  Text,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import {useGlobalTheme} from '../../app';
import {animatedFABExampleData} from '../../utils';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {settingIcon} from '../../component/icons/basicIcons';

type Item = {
  id: string;
  sender: string;
  header: string;
  message: string;
  initials: string;
  date: string;
  read: boolean;
  favorite: boolean;
  bgColor: string;
};

type Props = {
  navigation: StackNavigationProp<{[key: string]: undefined}>;
  title: string;
};

const MailListScreen = ({navigation}: Props) => {
  const {colors, isV3} = useGlobalTheme();

  const height = isV3 ? 80 : 56;
  const {bottom, left, right} = useSafeAreaInsets();

  const isIOS = Platform.OS === 'ios';

  const [extended, setExtended] = React.useState<boolean>(false);
  const [visible, setVisible] = React.useState<boolean>(false);

  const [_threadModalVisible, setThreadModalVisible] =
    React.useState<boolean>(false);

  const [_scrollPosition, setScrollPosition] = React.useState<number>(0);

  const {current: velocity} = React.useRef<Animated.Value>(
    new Animated.Value(0),
  );

  const [selectedMessage, setSelectedMessage] = React.useState<Item>();

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const renderItem = React.useCallback(
    ({item}: {item: Item}) => {
      const TextComponent = isV3 ? Text : Paragraph;

      return (
        <>
          <Card
            style={styles.card}
            mode="elevated"
            onPress={() => {
              console.log('hello');
              navigation.push('EditorScreen');
            }}
            onLongPress={() => {
              setSelectedMessage(item);
              setVisible(true);
            }}>
            <Card.Title
              title={item.sender}
              style={styles.header}
              subtitle={item.header}
              left={(_props: any) => (
                <Avatar.Text
                  style={[styles.avatar, {backgroundColor: item.bgColor}]}
                  label={item.initials}
                  color={isV3 ? MD3Colors.primary100 : MD2Colors.white}
                  size={40}
                />
              )}
              right={(_props: any) => (
                <Badge
                  visible={true}
                  size={16}
                  style={[
                    styles.badge,
                    {
                      backgroundColor: isV3
                        ? MD3Colors.neutral60
                        : MD2Colors.blue500,
                    },
                  ]}>
                  99+
                </Badge>
              )}
            />
            <Card.Content>
              <View style={styles.itemContainer}>
                <TextComponent
                  variant="labelLarge"
                  numberOfLines={2}
                  ellipsizeMode="tail">
                  {item.message}
                </TextComponent>
                <View style={styles.itemTextContentContainer}>
                  <TextComponent
                    variant="labelLarge"
                    numberOfLines={1}
                    ellipsizeMode="tail">
                    {item.date}
                  </TextComponent>
                </View>
                <View style={styles.itemTextContentContainer}>
                  <Icon
                    name={item.favorite ? 'star' : 'star-outline'}
                    color={
                      item.favorite
                        ? isV3
                          ? MD3Colors.error70
                          : MD2Colors.orange500
                        : isV3
                        ? MD3Colors.neutralVariant70
                        : MD2Colors.grey500
                    }
                    size={20}
                    onPress={() => {
                      console.log('favorite status change');
                      item.favorite = !item.favorite;
                    }}
                    style={styles.icon}
                  />
                  <Icon
                    name={'dots-vertical'}
                    color={
                      isV3 ? MD3Colors.neutralVariant70 : MD2Colors.grey500
                    }
                    size={20}
                    onPress={() => {
                      console.log('ccc');
                      setThreadModalVisible(true);
                    }}
                    style={styles.icon}
                  />
                </View>
              </View>
            </Card.Content>
          </Card>
        </>
      );
    },
    [isV3, navigation],
  );

  const onScroll = ({nativeEvent}: NativeSyntheticEvent<NativeScrollEvent>) => {
    const currentScrollPosition =
      Math.floor(nativeEvent?.contentOffset?.y) ?? 0;
    setScrollPosition(currentScrollPosition);
    setVisible(false);
    if (!isIOS) {
      return velocity.setValue(currentScrollPosition);
    }

    setExtended(currentScrollPosition <= 0);
  };

  const _keyExtractor = React.useCallback((item: {id: string}) => item.id, []);

  return (
    <>
      <FlatList
        data={animatedFABExampleData}
        renderItem={renderItem}
        keyExtractor={_keyExtractor}
        onEndReachedThreshold={0}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        style={[
          styles.flex,
          {
            backgroundColor: colors?.background,
          },
        ]}
        contentContainerStyle={styles.container}
        onScroll={onScroll}
      />
      {visible && (
        <Appbar.Header
          elevated={true}
          style={[
            styles.bottom,
            {
              height: height + bottom,
              backgroundColor: isV3 ? colors.elevation.level2 : colors.primary,
            },
          ]}
          safeAreaInsets={{bottom, left, right}}
          theme={{mode: 'adaptive'}}>
          <Appbar.Action
            icon="archive"
            onPress={() => {
              console.log(selectedMessage);
            }}
          />
          <Appbar.Action icon="email" onPress={() => {}} />
          <Appbar.Action icon="label" onPress={() => {}} />
          <Appbar.Action icon="delete" onPress={() => {}} />
        </Appbar.Header>
      )}
      <Portal>
        <FAB.Group
          open={extended}
          icon={extended ? 'star' : 'star-outline'}
          actions={[
            {
              icon: 'star',
              label: 'Search',
              onPress: () => {
                console.log('search');
              },
            },
            {
              icon: 'pen',
              label: 'New Mail',
              onPress: () => {
                navigation.navigate('EditorScreen');
              },
            },
            {
              icon: settingIcon,
              label: 'Setting',
              onPress: () => {
                navigation.navigate('SettingScreen');
              },
            },
            {
              icon: 'calendar-today',
              label: 'Calendar',
              onPress: () => {
                navigation.navigate('CalendarScreen');
              },
              size: isV3 ? 'small' : 'medium',
            },
          ]}
          onStateChange={({open}: {open: boolean}) => setExtended(open)}
          onPress={() => {
            if (extended) {
              // do something if the speed dial is open
            }
          }}
          visible={true}
        />
      </Portal>
    </>
  );
};

MailListScreen.title = 'Mail List Screen';

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 60,
  },
  avatar: {
    marginRight: 16,
    marginTop: 8,
  },
  flex: {
    flex: 1,
  },
  itemContainer: {
    marginBottom: 16,
    flexDirection: 'column',
  },
  itemTextContentContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    //flex: 1,
  },
  itemHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  itemMessageContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexGrow: 1,
  },
  read: {
    fontWeight: 'bold',
  },
  icon: {
    marginLeft: 16,
    alignSelf: 'flex-end',
  },
  date: {
    fontSize: 12,
  },
  header: {
    fontSize: 14,
    marginRight: 8,
    flex: 1,
  },
  searchbar: {
    justifyContent: 'center',
    alignItems: 'center',
    // width: 300,
    height: '100%',
    width: '80%',
    borderRadius: 15,
  },
  shape: {
    marginTop: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    // backgroundColor: 'white',
    position: 'absolute',
    width: '100%',
    zIndex: 9999,
  },
  bottom: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  badge: {
    position: 'absolute',
    bottom: 5,
  },
  ripple: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    margin: 4,
    marginLeft: 0,
    marginRight: 0,
  },
});
MailListScreen.title = 'maillist';
export default MailListScreen;
