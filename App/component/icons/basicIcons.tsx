import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
// 由于部分图标系统无法直接获取，需要在这里提前设置好确认图标
export const settingIcon = Ionicons.getImageSourceSync(
  'md-settings',
  30,
  'white',
);
export const draftIcon = MaterialIcons.getImageSourceSync('drafts');
