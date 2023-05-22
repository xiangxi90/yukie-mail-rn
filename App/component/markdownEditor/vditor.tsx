import React from 'react';
import {Platform, StyleSheet} from 'react-native';
import WebView, {WebViewMessageEvent} from 'react-native-webview';

type Props = {
  init_text: string; // 草稿初始markdown
  init_theme: 'dark' | 'classic';
};
export const Vditor = ({init_text, init_theme}: Props) => {
  const INJECTED_JAVASCRIPT =
    'set_init_editor("' + init_text + '","' + init_theme + '");';

  const _webViewRef = React.useRef(null);

  const _onMessage = (event: WebViewMessageEvent) => {
    console.log(event);
    const {data} = event.nativeEvent;
    const {markdown, html} = JSON.parse(data);
    if (markdown) {
      console.log('markdown:');
      console.log(markdown);
    }
    if (html) {
      console.log(html);
    }
  };

  return (
    <WebView
      ref={_webViewRef}
      style={styles.container}
      source={
        Platform.OS === 'ios'
          ? require('../../../assets/html/editor.html')
          : {uri: 'file:///android_asset/editor.html'}
      }
      useWebKit={true}
      keyboardDisplayRequiresUserAction={false}
      injectedJavaScript={INJECTED_JAVASCRIPT}
      javaScriptEnabled={true}
      originWhitelist={['*']}
      onMessage={_onMessage}
      scrollEnabled={false}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
