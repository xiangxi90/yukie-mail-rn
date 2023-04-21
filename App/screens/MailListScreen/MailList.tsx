import {StackNavigationProp} from '@react-navigation/stack';
import * as React from 'react';
import {NativeScrollEvent, NativeSyntheticEvent} from 'react-native';
import {Animated, FlatList, Platform, StyleSheet, View} from 'react-native';
import {Badge, FAB, TouchableRipple} from 'react-native-paper';
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
  const [visible, setVisible] = React.useState<boolean>(true);

  const [headerVisible, setHeaderVisible] = React.useState<boolean>(true);

  const [scrollPosition, setScrollPosition] = React.useState<number>(0);

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
        <TouchableRipple
          style={styles.ripple}
          onPress={() => {
            console.log('hello');
            navigation.push('EditorScreen');
          }}
          onLongPress={() => {
            setSelectedMessage(item);
            setVisible(true);
          }}
          rippleColor="rgba(0, 0, 0, .32)">
          <View style={styles.itemContainer}>
            <Avatar.Text
              style={[styles.avatar, {backgroundColor: item.bgColor}]}
              label={item.initials}
              color={isV3 ? MD3Colors.primary100 : MD2Colors.white}
              size={40}
            />
            <View style={styles.itemTextContentContainer}>
              <View style={styles.itemHeaderContainer}>
                <TextComponent
                  variant="labelLarge"
                  style={[styles.header, !item.read && styles.read]}
                  ellipsizeMode="tail"
                  numberOfLines={1}>
                  {item.sender}
                </TextComponent>
                <TextComponent
                  variant="labelLarge"
                  style={[styles.date, !item.read && styles.read]}>
                  {item.date}
                </TextComponent>
              </View>

              <View style={styles.itemMessageContainer}>
                <View style={styles.flex}>
                  <TextComponent
                    variant="labelLarge"
                    ellipsizeMode="tail"
                    numberOfLines={1}
                    style={!item.read && styles.read}>
                    {item.header}
                  </TextComponent>
                  <TextComponent
                    variant="labelLarge"
                    numberOfLines={1}
                    ellipsizeMode="tail">
                    {item.message}
                  </TextComponent>
                </View>

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
                    item.favorite = !item.favorite;
                  }}
                  style={styles.icon}
                />

                <Badge
                  visible={visible}
                  size={18}
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
              </View>
            </View>
          </View>
        </TouchableRipple>
      );
    },
    [visible, isV3],
  );

  const onScroll = ({nativeEvent}: NativeSyntheticEvent<NativeScrollEvent>) => {
    // 滑动时，使工具框消失
    setVisible(false);
    const currentScrollPosition =
      Math.floor(nativeEvent?.contentOffset?.y) ?? 0;

    if (
      currentScrollPosition - scrollPosition > 150 &&
      headerVisible === true
    ) {
      console.log(
        'close::now:' + currentScrollPosition + 'pre' + scrollPosition,
      );
      setHeaderVisible(false);
    } else if (
      currentScrollPosition - scrollPosition < -150 ||
      (currentScrollPosition <= 0 && headerVisible === false)
    ) {
      // console.log(
      //   'open::now:' + currentScrollPosition + 'pre' + scrollPosition,
      // );
      setHeaderVisible(true);
    }

    setScrollPosition(currentScrollPosition);

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
        <Appbar
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
        </Appbar>
      )}
      <Portal>
        <FAB.Group
          open={extended}
          icon={extended ? 'calendar-today' : 'plus'}
          actions={[
            {icon: 'plus', onPress: () => {}},
            {icon: 'star', label: 'Star', onPress: () => {}},
            {icon: 'email', label: 'Email', onPress: () => {}},
            {
              icon: 'bell',
              label: 'Remind',
              onPress: () => {},
              size: isV3 ? 'small' : 'medium',
            },
          ]}
          onStateChange={({open}: {open: boolean}) => setExtended(open)}
          onPress={() => {
            if (extended) {
              // do something if the speed dial is open
            }
          }}
          visible={visible}
        />
      </Portal>
    </>
  );
};

MailListScreen.title = 'Animated Floating Action Button';

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
    flexDirection: 'row',
  },
  itemTextContentContainer: {
    flexDirection: 'column',
    flex: 1,
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
    top: 4,
    right: 0,
  },
  ripple: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
MailListScreen.title = 'maillist';
export default MailListScreen;
