import React from 'react';
import {Vditor as Editor} from '../../component/markdownEditor';
import {PreferencesContext} from '../../app';
import {StyleSheet, View} from 'react-native';
export const Vditor = () => {
  const preferences = React.useContext(PreferencesContext);
  const theme = preferences.theme.dark ? 'dark' : 'classic';
  const editor_content = 'fesgfew';
  console.log('cditor theme:' + theme);
  return (
    <View style={styles.container}>
      <Editor init_text={editor_content} init_theme={theme} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    height: 360,
  },
});
Vditor.title = 'vditor';
