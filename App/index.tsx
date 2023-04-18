import MailApp from './app';
import {SafeAreaProvider} from 'react-native-safe-area-context';
// import Reactotron from 'reactotron-react-native';

// Reactotron.configure() // controls connection & communication settings
//   .useReactNative() // add all built-in react native plugins
//   .connect(); // let's connect!

const App = () => {
  return (
    <SafeAreaProvider>
      <MailApp />
    </SafeAreaProvider>
  );
};

export default App;
