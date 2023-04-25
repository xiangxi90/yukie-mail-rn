import {KeyboardAvoidingView, Platform, StyleSheet} from 'react-native';

export type AvoidingViewProps = {
  children: React.ReactNode;
};

export const TextInputAvoidingView = ({children}: AvoidingViewProps) => {
  return Platform.OS === 'ios' ? (
    <KeyboardAvoidingView
      style={styles.wrapper}
      behavior="padding"
      keyboardVerticalOffset={80}>
      {children}
    </KeyboardAvoidingView>
  ) : (
    <>{children}</>
  );
};

const styles = StyleSheet.create({
  helpersWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  wrapper: {
    flex: 1,
  },
});
