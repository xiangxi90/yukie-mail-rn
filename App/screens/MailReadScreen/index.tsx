import {StackNavigationProp} from '@react-navigation/stack';
import React from 'react';
import {Platform, StyleSheet, View} from 'react-native';
// import WebView, {WebViewMessageEvent} from 'react-native-webview';
import {useRoute} from '@react-navigation/native';
import type {RouteProp} from '@react-navigation/native';
import type {Message, Content} from '../../types';
import {mock_message_body} from './data';
import {useGlobalTheme} from '../../app';
// import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {
  Appbar,
  Avatar,
  Card,
  Divider,
  List,
  MD3Colors,
  Menu,
  Text,
  Tooltip,
} from 'react-native-paper';
import {
  archiveIcon,
  email_mark_as_unreadIcon,
  email_not_spamIcon,
  email_spamIcon,
  flag,
  flag_outline,
  move_to_inboxIcon,
  trashIcon,
} from '../../component/icons/basicIcons';
import {ScrollView} from 'react-native-gesture-handler';
import {MailReader} from './reader';
type StackParamList = {
  Home: undefined;
  MailReadScreen: {message_id: string};
  Feed: {sort: 'latest' | 'top'} | undefined;
};

type Props = {
  navigation: StackNavigationProp<StackParamList, 'MailReadScreen'>;
};
type ProfileScreenRouteProp = RouteProp<StackParamList, 'MailReadScreen'>;
type AppbarModes = 'small' | 'medium' | 'large' | 'center-aligned';

const MORE_ICON = Platform.OS === 'ios' ? 'dots-horizontal' : 'dots-vertical';

const default_message = {
  id: '',
  labels: [],
  subject: 'empty',
  from: 'empty',
  to: [],
  body: '',
};

const MailScreenReader = ({navigation}: Props) => {
  const [message, setMessage] = React.useState<Message>(default_message);
  const [appbarMode, _setAppbarMode] = React.useState<AppbarModes>('small');
  const [showElevated, _setShowElevated] = React.useState(false);
  const [showMenu, setShowMenu] = React.useState(false);

  const theme = useGlobalTheme();
  // const {bottom, left, right} = useSafeAreaInsets();
  // const height = theme.isV3 ? 80 : 56;

  React.useLayoutEffect(() => {
    const headerBar = () => (
      <Appbar.Header
        theme={{mode: 'adaptive'}}
        mode={appbarMode}
        elevated={showElevated}>
        <Appbar.BackAction
          onPress={() => {
            if (navigation.canGoBack()) {
              navigation.goBack();
            } else {
              navigation.popToTop();
            }
          }}
        />
        <Appbar.Content title="" onPress={() => {}} />
        <Tooltip title="删除">
          <Appbar.Action icon={trashIcon} onPress={() => {}} />
        </Tooltip>
        <Tooltip title="归档">
          <Appbar.Action icon={archiveIcon} onPress={() => {}} />
        </Tooltip>
        <View style={styles.alignCenter}>
          <Menu
            visible={showMenu}
            onDismiss={() => setShowMenu(false)}
            anchor={
              <Appbar.Action
                icon={MORE_ICON}
                onPress={() => setShowMenu(true)}
                {...(!theme.isV3 && {color: 'white'})}
              />
            }>
            <Menu.Item
              onPress={() => {}}
              title="移动到文件夹"
              leadingIcon={move_to_inboxIcon}
            />
            <Menu.Item
              onPress={() => {}}
              title={
                message.labels.includes('SPAM')
                  ? '报告正常邮件'
                  : '报告垃圾邮件'
              }
              leadingIcon={
                message.labels.includes('SPAM')
                  ? email_not_spamIcon
                  : email_spamIcon
              }
            />
            <Menu.Item
              onPress={() => {}}
              title="标记为未读"
              leadingIcon={email_mark_as_unreadIcon}
            />
            <Menu.Item
              onPress={() => {}}
              title={message.flaged ? '取消标记' : '标记'}
              leadingIcon={message.flaged ? flag : flag_outline}
            />
            <Divider style={theme.isV3 && styles.md3Divider} />
            <Menu.Item
              onPress={() => {}}
              title="分享邮件"
              leadingIcon="share-variant"
            />
          </Menu>
        </View>
      </Appbar.Header>
    );
    navigation.setOptions({
      header: headerBar,
    });
  }, [
    appbarMode,
    message.flaged,
    message.labels,
    navigation,
    showElevated,
    showMenu,
    theme.isV3,
  ]);

  const route = useRoute<ProfileScreenRouteProp>();

  React.useEffect(() => {
    let e_message = get_message_by_message_id(route.params?.message_id);
    setMessage(e_message);
  }, [route.params?.message_id]);

  return (
    <ScrollView overScrollMode="never">
      <View style={styles.baseContainer}>
        <Card style={styles.card} mode={'outlined'} theme={{mode: 'adaptive'}}>
          <Card.Content>
            <Text variant="headlineMedium">{message.subject}</Text>
          </Card.Content>
          {/* <Card.Title
            title={message.subject}
            subtitle={message.from}
            left={props => <Avatar.Icon {...props} icon="format-paint" />}
          /> */}
          <List.Accordion
            title={message.from}
            description={message.to.join('、')}
            left={_props => (
              <Avatar.Text
                style={[styles.avatar]}
                label={message.from.charAt(0)}
                color={MD3Colors.primary100}
                size={40}
              />
            )}>
            <View style={styles.rowContainer}>
              <Text style={styles.boaderText}>{'发件人'}</Text>
              <Text>{'  '}</Text>
              <Text>{message.from}</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={styles.boaderText}>{'收件人'}</Text>
              <Text>{'  '}</Text>
              <Text>{message.to.join('、')}</Text>
            </View>
            {message.cc && message.cc.length > 0 && (
              <View style={styles.rowContainer}>
                <Text style={styles.boaderText}>{'抄送'}</Text>
                <Text>{'  '}</Text>
                <Text>{message.cc?.join('、')}</Text>
              </View>
            )}
            {message.bcc && message.bcc.length > 0 && (
              <View style={styles.rowContainer}>
                <Text style={styles.boaderText}>{'密送'}</Text>
                <Text>{'  '}</Text>
                <Text>{message.bcc?.join('、')}</Text>
              </View>
            )}
            <View style={styles.rowContainer}>
              <Text style={styles.boaderText}>{'   日期'}</Text>
              <Text>{'  '}</Text>
              <Text>
                {new Date(message.time ? message.time : 0).toLocaleDateString()}
              </Text>
            </View>
          </List.Accordion>
        </Card>
      </View>
      <MailReader message={message} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  md3Divider: {
    marginVertical: 8,
  },
  alignCenter: {
    alignItems: 'center',
  },
  baseContainer: {
    flexDirection: 'column',
  },
  text: {
    marginVertical: 4,
  },
  card: {
    borderRadius: 0,
  },
  webviewContainer: {
    flex: 1,
    height: '100%',
  },
  avatar: {
    marginRight: 16,
    marginTop: 8,
  },
  boaderText: {
    textAlign: 'right',
    width: '20%',
  },
  rowContainer: {
    flexDirection: 'row',
  },
});
function get_message_by_message_id(message_id: string): Message {
  const content: Content = {
    type: 'file',
    path: 'fdsfds/fdsfd',
    name: 'test.pdf',
  };
  const message = {
    id: message_id,
    labels: ['INBOX', 'FLAGED'],
    subject: '[推广]新天气应用',
    from: 'chenjialu2001@outlook.com',
    to: ['2651171386@qq.com'],
    cc: ['sadsadsa@ewr.com', 'fdsfdsf@fdsfd.com'],
    body: mock_message_body(),
    content: [content],
    flaged: false,
    time: new Date().getTime(),
  };
  // console.log(message);
  return message;
}
MailScreenReader.title = 'hello';
export default MailScreenReader;
