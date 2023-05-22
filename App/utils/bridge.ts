import {NativeModules} from 'react-native';
const {YukieMailBridge} = NativeModules;

export function invoke(command_id: number, payload: Uint8Array): Uint8Array {
  console.log('command:' + command_id + 'payload len:' + payload.length);
  return YukieMailBridge.invoke(command_id, payload);
}
