import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
// 由于部分图标系统无法直接获取，需要在这里提前设置好确认图标
export const settingIcon = Ionicons.getImageSourceSync(
  'md-settings',
  30,
  'white',
);
export const draftIcon = MaterialIcons.getImageSourceSync('drafts');
export const backIcon = Ionicons.getImageSourceSync('arrow-back', 30);
export const trashIcon = Ionicons.getImageSourceSync('trash', 30);
export const trash_outlineIcon = Ionicons.getImageSourceSync(
  'trash-outline',
  30,
);
export const archiveIcon = Ionicons.getImageSourceSync('archive', 30);
export const archive_outlineIcon = Ionicons.getImageSourceSync(
  'archive-outline',
  30,
);
export const move_to_inboxIcon =
  MaterialIcons.getImageSourceSync('move-to-inbox');
export const email_mark_as_unreadIcon =
  MaterialIcons.getImageSourceSync('mark-as-unread');
export const email_spamIcon = MaterialIcons.getImageSourceSync('report');
export const email_not_spamIcon =
  MaterialIcons.getImageSourceSync('report-off');
export const flag = Ionicons.getImageSourceSync('flag', 30);
export const flag_outline = Ionicons.getImageSourceSync('flag-outline', 30);
