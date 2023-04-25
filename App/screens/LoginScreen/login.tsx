import * as React from 'react';
import ScreenWrapper from '../../ScreenWrapper';
import {Appbar, HelperText, List, Text, TextInput} from 'react-native-paper';
import {Platform, StyleSheet, View} from 'react-native';
import {TextInputAvoidingView} from '../../component/Keyboard';
import {Account} from '../../types';
import {StackNavigationProp} from '@react-navigation/stack';
type ReducerAction<T extends keyof Account> = {
  payload: Account[T];
  type: T;
};

export function inputReducer<T extends keyof Account>(
  state: Account,
  action: ReducerAction<T>,
) {
  switch (action.type) {
    case action.type:
      return {...state, [action.type]: action.payload};
    default:
      return state;
  }
}

const initialState: Account = {
  name: '',
  status: 'Empty',
  email_address: '',
  smtp_server: '',
  smtp_port: 993,
  smtp_password: '',
  imap_server: '',
  imap_port: 443,
  imap_password: '',
  imap_protocol: 'SSL/TLS',
  smtp_protocol: 'SSL/TLS',
  smtp_account: '',
  imap_account: '',
};

const MORE_ICON = Platform.OS === 'ios' ? 'dots-horizontal' : 'dots-vertical';

type Props = {
  navigation: StackNavigationProp<{[key: string]: undefined}>;
  title: string;
};

export const LoginScreen = ({navigation}: Props) => {
  const [state, dispatch] = React.useReducer(inputReducer, initialState);
  const [imapSecureEntry, setImapSecureEntry] = React.useState(true);
  const [smtpSecureEntry, setSmtpSecureEntry] = React.useState(true);
  const [isComplete, setIsComplete] = React.useState(false);

  const inputActionHandler = (type: keyof Account, payload: string) =>
    dispatch({
      type: type,
      payload: payload,
    });

  React.useEffect(() => {
    // fdfsfdsfconsole.log(state);
    if (
      state.name.length !== 0 &&
      state.email_address.length !== 0 &&
      state.smtp_server.length !== 0 &&
      state.smtp_password.length !== 0 &&
      state.imap_server.length !== 0 &&
      state.imap_password.length !== 0 &&
      state.smtp_account.length !== 0 &&
      state.imap_account.length !== 0
    ) {
      setIsComplete(true);
      console.log('can press');
    } else {
      setIsComplete(false);
    }
  }, [state]);

  React.useLayoutEffect(() => {
    const headerBar = () => (
      <Appbar.Header style={null} mode={'center-aligned'} elevated={false}>
        <Appbar.BackAction
          onPress={() => {
            if (navigation.canGoBack()) {
              navigation.goBack();
            } else {
              navigation.replace('MailListScreen');
            }
          }}
        />
        <Appbar.Content title="连接邮箱服务器" />
        <Appbar.Action icon={MORE_ICON} onPress={() => {}} />
        <Appbar.Action
          icon="check"
          onPress={() => {
            console.log('complete');
          }}
          disabled={!isComplete}
        />
      </Appbar.Header>
    );
    navigation.setOptions({
      header: headerBar,
    });
  }, [isComplete, navigation]);

  return (
    <TextInputAvoidingView>
      <ScreenWrapper>
        <List.Section title="基础信息">
          <TextInput
            label={<Text> 电子邮件地址 </Text>}
            keyboardType="email-address"
            style={styles.noPaddingInput}
            placeholder="邮件地址(示例: abc@domin.com)"
            value={state.email_address}
            onChangeText={nameRequired =>
              inputActionHandler('email_address', nameRequired)
            }
          />
          <TextInput
            label={<Text> 显示名称(示例: Kuze Hibiki) </Text>}
            style={styles.noPaddingInput}
            placeholder="显示名称(示例: Kuze Hibiki)"
            value={state.name}
            onChangeText={nameRequired =>
              inputActionHandler('name', nameRequired)
            }
          />
        </List.Section>
        <List.Section title="IMAP 接收服务器">
          <View style={styles.serverInputWrapper}>
            <View style={styles.serverAddressInput}>
              <TextInput
                label={<Text> IMAP 主机名(例如 imap.domain.com) </Text>}
                style={styles.noPaddingInput}
                placeholder="IMAP 主机名(例如 imap.domain.com)"
                value={state.imap_server}
                onChangeText={nameRequired =>
                  inputActionHandler('imap_server', nameRequired)
                }
              />
            </View>
            <View style={styles.serverPortInput}>
              <TextInput
                label={<Text> 端口 </Text>}
                style={styles.noPaddingInput}
                keyboardType="numeric"
                placeholder="端口(例如443)"
                value={String(state.imap_port)}
                onChangeText={nameRequired => {
                  inputActionHandler('imap_port', nameRequired);
                }}
              />
            </View>
          </View>
          <TextInput
            label={<Text> IMAP 用户名(示例: Kuze.roft) </Text>}
            style={styles.noPaddingInput}
            placeholder="IMAP 用户名(示例: Kuze.roft)"
            value={state.imap_account}
            onChangeText={nameRequired =>
              inputActionHandler('imap_account', nameRequired)
            }
          />
          <TextInput
            style={styles.noPaddingInput}
            label={<Text> IMAP 密码 </Text>}
            placeholder="IMAP 密码"
            value={state.imap_password}
            onChangeText={flatTextPassword =>
              inputActionHandler('imap_password', flatTextPassword)
            }
            secureTextEntry={imapSecureEntry}
            right={
              <TextInput.Icon
                icon={imapSecureEntry ? 'eye-off' : 'eye'}
                onPress={() => setImapSecureEntry(!imapSecureEntry)}
                forceTextInputFocus={false}
              />
            }
          />
        </List.Section>
        <List.Section title="SMTP 接收服务器">
          <View style={styles.serverInputWrapper}>
            <View style={styles.serverAddressInput}>
              <TextInput
                label={<Text> SMTP 主机名(例如 smtp.domain.com) </Text>}
                style={styles.noPaddingInput}
                placeholder="SMTP 主机名(例如 smtp.domain.com)"
                value={state.smtp_server}
                onChangeText={nameRequired =>
                  inputActionHandler('smtp_server', nameRequired)
                }
              />
            </View>
            <View style={styles.serverPortInput}>
              <TextInput
                label={<Text> 端口 </Text>}
                style={styles.noPaddingInput}
                keyboardType="numeric"
                placeholder="端口(例如993)"
                value={String(state.smtp_port)}
                onChangeText={nameRequired => {
                  inputActionHandler('smtp_port', nameRequired);
                }}
              />
            </View>
          </View>
          <TextInput
            label={<Text> SMTP 用户名(示例: Kuze.roft) </Text>}
            style={styles.noPaddingInput}
            placeholder="SMTP 用户名(示例: Kuze.roft)"
            value={state.smtp_account}
            onChangeText={nameRequired =>
              inputActionHandler('smtp_account', nameRequired)
            }
          />
          <TextInput
            style={styles.noPaddingInput}
            label={<Text> SMTP 密码 </Text>}
            placeholder="SMTP 密码"
            value={state.smtp_password}
            onChangeText={flatTextPassword =>
              inputActionHandler('smtp_password', flatTextPassword)
            }
            secureTextEntry={smtpSecureEntry}
            right={
              <TextInput.Icon
                icon={smtpSecureEntry ? 'eye-off' : 'eye'}
                onPress={() => setSmtpSecureEntry(!smtpSecureEntry)}
                forceTextInputFocus={false}
              />
            }
          />
        </List.Section>
      </ScreenWrapper>
    </TextInputAvoidingView>
  );
};
LoginScreen.title = 'LoginScreen';

const styles = StyleSheet.create({
  helpersWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  noPaddingInput: {
    backgroundColor: 'transparent',
    paddingHorizontal: 0,
    margin: 8,
  },
  inputContainerStyle: {
    margin: 8,
  },
  serverInputWrapper: {
    flexDirection: 'row',
  },
  serverAddressInput: {
    flex: 3,
  },
  serverPortInput: {
    flex: 1,
  },
  fontSize: {
    fontSize: 32,
  },
});
