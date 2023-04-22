import React from 'react';
import {Vditor as Editor} from '../../component/markdownEditor';
import {PreferencesContext} from '../../app';
import {StyleSheet, View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Appbar, TextInput} from 'react-native-paper';
import {StackNavigationProp} from '@react-navigation/stack';

type Props = {
  navigation: StackNavigationProp<{[key: string]: undefined}>;
};

export const Vditor = ({navigation}: Props) => {
  const preferences = React.useContext(PreferencesContext);
  const theme = preferences.theme.dark ? 'dark' : 'classic';
  const editor_content = 'fesgfew';
  // console.log('cditor theme:' + theme);
  const [subject, setSubject] = React.useState('');
  const [from, setFrom] = React.useState('');
  const [to, setTo] = React.useState('');

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
      <View>
        <TextInput
          label="标题"
          style={styles.textInput}
          //placeholder="请输入邮件标题"
          value={subject}
          //greerror={!from}
          onChangeText={nameNoPadding => setSubject(nameNoPadding)}
        />
      </View>
      <View>
        <TextInput
          label="发件人"
          style={styles.textInput}
          //placeholder="请输入邮件标题"
          value={from}
          //greerror={!from}
          onChangeText={nameNoPadding => setFrom(nameNoPadding)}
        />
      </View>
      <View>
        <TextInput
          label="收件人"
          style={styles.textInput}
          //placeholder="请输入邮件标题"
          value={to}
          //greerror={!from}
          onChangeText={nameNoPadding => setTo(nameNoPadding)}
        />
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
    height: 60,
  },
});
Vditor.title = 'vditor';
