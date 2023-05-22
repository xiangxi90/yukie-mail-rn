import {StyleSheet} from 'react-native';
import WebView, {WebViewMessageEvent} from 'react-native-webview';
import {Message} from '../../types';
import React from 'react';

type Props = {
  message: Message;
};
export const MailReader = ({message}: Props) => {
  const INJECTEDJAVASCRIPT = `
    (function () {
        var height = null;
        function changeHeight() {
          if (document.body.scrollHeight != height) {
            height = document.body.scrollHeight;
            if (ReactNativeWebView.postMessage) {
                ReactNativeWebView.postMessage(JSON.stringify({
                type: 'setHeight',
                height: height,
              }))
            }
          }
        }
        setTimeout(changeHeight, 100);
    } ())
    `;

  const [height, setHeight] = React.useState(1000);

  const _onMessage = (event: WebViewMessageEvent) => {
    console.log(event);
    try {
      const action = JSON.parse(event.nativeEvent.data);
      if (action.type === 'setHeight' && action.height > 0) {
        setHeight(action.height);
      }
    } catch (error) {}
  };

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const _webViewRef = React.useRef(null);

  return (
    <WebView
      ref={_webViewRef}
      style={{...styles.container, height: height}}
      source={{html: message.body}}
      useWebKit={true}
      keyboardDisplayRequiresUserAction={false}
      injectedJavaScript={INJECTEDJAVASCRIPT}
      javaScriptEnabled={true}
      originWhitelist={['*']}
      onMessage={_onMessage}
      scrollEnabled={true}
      overScrollMode="never"
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
});
