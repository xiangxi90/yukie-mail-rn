import React from 'react';
import {Vditor as Editor} from '../../component/markdownEditor';
import {PreferencesContext} from '../../app';
import {StyleSheet, View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Appbar, TextInput, HelperText} from 'react-native-paper';
import {StackNavigationProp} from '@react-navigation/stack';

type Props = {
  navigation: StackNavigationProp<{[key: string]: undefined}>;
};

export const Vditor = ({navigation}: Props) => {
  const preferences = React.useContext(PreferencesContext);
  const theme = preferences.theme.dark ? 'dark' : 'classic';
  const editor_content = '';
  // console.log('cditor theme:' + theme);
  const [subject, setSubject] = React.useState('');
  const [from, setFrom] = React.useState('');
  const [to, setTo] = React.useState('');

  const _isEmailValid = (email: string): boolean => {
    var reg = /^[a-zA-Z0-9_-]+@([a-zA-Z0-9]+\.)+(com|cn|net|org)$/;
    return reg.test(email);
  };
  React.useLayoutEffect(() => {
    const headerBar = () => {
      return (
        <Appbar.BackAction
          onPress={() => {
            if (navigation.canGoBack()) {
              navigation.goBack();
            } else {
              navigation.navigate('MailListScreen');
            }
          }}
        />
      );
    };
    navigation.setOptions({
      headerShown: true,
      header: headerBar,
    });
  }, [navigation]);

  return (
    <KeyboardAwareScrollView>
      <View style={styles.inputContainerStyle}>
        <TextInput
          label="subject"
          left={<TextInput.Affix text="标题：     " />}
          style={styles.textInput}
          placeholder="请输入邮件标题"
          value={subject}
          //greerror={!from}
          onChangeText={nameNoPadding => setSubject(nameNoPadding)}
        />
        <View style={styles.helpersWrapper}>
          <HelperText type="info" visible={false} style={styles.helper}>
            Error: Numbers and special characters are not allowed
          </HelperText>
        </View>
      </View>
      <View style={styles.inputContainerStyle}>
        <TextInput
          label="from"
          style={styles.textInput}
          left={<TextInput.Affix text="发件人：  " />}
          placeholder="请输入邮件发件人"
          error={!_isEmailValid}
          value={from}
          //greerror={!from}
          onChangeText={nameNoPadding => setFrom(nameNoPadding)}
        />
        <View style={styles.helpersWrapper}>
          <HelperText
            type="error"
            visible={!_isEmailValid(from)}
            style={styles.helper}>
            Error: 请输入正确的邮箱地址
          </HelperText>
        </View>
      </View>
      <View style={styles.inputContainerStyle}>
        <TextInput
          label="to"
          style={styles.textInput}
          left={<TextInput.Affix text="收件人：  " />}
          placeholder="请输入邮件收件人"
          error={!_isEmailValid}
          value={to}
          //greerror={!from}
          onChangeText={nameNoPadding => setTo(nameNoPadding)}
        />
        <View style={styles.helpersWrapper}>
          <HelperText
            type="error"
            visible={!_isEmailValid(to)}
            style={styles.helper}>
            Error: 请输入正确的邮箱地址
          </HelperText>
        </View>
      </View>
      <View style={styles.container}>
        <Editor init_text={editor_content} init_theme={theme} />
      </View>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 600,
  },
  textInput: {
    backgroundColor: 'transparent',
    //height: 60,
  },
  helpersWrapper: {
    flexDirection: 'row',
    //justifyContent: 'space-between',
  },
  helper: {
    flexShrink: 1,
  },
  inputContainerStyle: {
    margin: 2,
  },
});
Vditor.title = 'vditor';
