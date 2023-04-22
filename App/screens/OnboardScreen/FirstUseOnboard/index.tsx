import {Image} from 'react-native';
import React from 'react';

import Onboarding from 'react-native-onboarding-swiper';
import type {StackNavigationProp} from '@react-navigation/stack';

type Props = {
  navigation: StackNavigationProp<{[key: string]: undefined}>;
};

export const FirstUseOnboard = ({navigation}: Props) => {
  return (
    <Onboarding
      onDone={() => {
        console.log('done');
        navigation.navigate('MailListScreen');
      }}
      onSkip={() => {
        if (navigation.canGoBack()) {
          navigation.goBack();
        } else {
          navigation.navigate('MailListScreen');
        }
      }}
      pages={[
        {
          backgroundColor: '#fff',
          image: (
            <Image source={require('../../../../assets/images/song-1.jpg')} />
          ),
          title: 'Onboarding',
          subtitle: 'Done with React Native Onboarding Swiper',
        },
        {
          backgroundColor: '#fe6e58',
          image: (
            <Image source={require('../../../../assets/images/song-1.jpg')} />
          ),
          title: 'The Title',
          subtitle: 'This is the subtitle that sumplements the title.',
        },
        {
          backgroundColor: '#999',
          image: (
            <Image source={require('../../../../assets/images/song-1.jpg')} />
          ),
          title: 'Triangle',
          subtitle: "Beautiful, isn't it?",
        },
      ]}
    />
  );
};
FirstUseOnboard.title = 'FirstUseOnboard';
