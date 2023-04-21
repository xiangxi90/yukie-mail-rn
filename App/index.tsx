import MailApp from './app';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {Provider} from 'react-redux';
import store from './storage';
// import Reactotron from 'reactotron-react-native';

// Reactotron.configure() // controls connection & communication settings
//   .useReactNative() // add all built-in react native plugins
//   .connect(); // let's connect!

const App = () => {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <MailApp />
      </SafeAreaProvider>
    </Provider>
  );
};

export default App;
