import PaperOnboarding, {
  PaperOnboardingItemType,
} from '@gorhom/paper-onboarding';

const data: PaperOnboardingItemType[] = [
  {
    title: 'Hotels',
    description: 'All hotels and hostels are sorted by hospitality rating',
    backgroundColor: '#698FB8',
    image: '../../../../assets/images/yukie.png',
    //icon: "inbox",
    //content: /* CUSTOM COMPONENT */,
  },
  {
    title: 'Banks',
    description: 'We carefully verify all banks before add them into the app',
    backgroundColor: '#6CB2B8',
    image: '../../../../assets/images/yukie.png',
    //icon: "outbox",
    //content: /* CUSTOM COMPONENT */,
  },
  {
    title: 'Stores',
    description: 'All local stores are categorized for your convenience',
    backgroundColor: '#9D8FBF',
    image: '../../../../assets/images/yukie.png',
    //icon: "send",
    //content: /* CUSTOM COMPONENT */,
  },
];

export const FirstUseOnboard = () => {
  const handleOnClosePress = () => console.log('navigate to other screen');
  return (
    <PaperOnboarding data={data} onCloseButtonPress={handleOnClosePress} />
  );
};
FirstUseOnboard.title = 'FirstUseOnboard';
