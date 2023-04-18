import React from 'react';
import {
  Animated,
  Platform,
  StyleProp,
  StyleSheet,
  ViewStyle,
} from 'react-native';

import {AnimatedFAB} from 'react-native-paper';

import {useGlobalTheme} from '../../app';

type CustomFABProps = {
  animatedValue: Animated.Value;
  visible: boolean;
  extended: boolean;
  label: string;
  animateFrom: 'left' | 'right';
  iconMode?: 'static' | 'dynamic';
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
};

const CustomFAB = ({
  animatedValue,
  visible,
  extended,
  label,
  animateFrom,
  style,
  iconMode,
  onPress,
}: CustomFABProps) => {
  const [isExtended, setIsExtended] = React.useState(true);
  const {isV3} = useGlobalTheme();

  const isIOS = Platform.OS === 'ios';

  React.useEffect(() => {
    if (!isIOS) {
      animatedValue.addListener(({value}: {value: number}) => {
        setIsExtended(value <= 0);
      });
    } else {
      setIsExtended(extended);
    }
  }, [animatedValue, extended, isIOS]);

  const fabStyle = {[animateFrom]: 16};

  return (
    <AnimatedFAB
      icon={'pen'}
      label={label}
      extended={isExtended}
      uppercase={!isV3}
      onPress={onPress}
      visible={visible}
      animateFrom={animateFrom}
      iconMode={iconMode}
      style={[styles.fabStyle, style, fabStyle]}
    />
  );
};

export default CustomFAB;

const styles = StyleSheet.create({
  fabStyle: {
    bottom: 16,
    position: 'absolute',
  },
});
