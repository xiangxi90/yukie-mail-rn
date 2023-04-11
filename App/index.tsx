import MailApp from './app';
import {SafeAreaProvider} from 'react-native-safe-area-context';

const App = () => {
  return (
    <SafeAreaProvider>
      <MailApp />
    </SafeAreaProvider>
  );
};

export default App;
