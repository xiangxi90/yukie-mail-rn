import {NativeModules} from 'react-native';
const {YukieMailBridge} = NativeModules;

export function invoke(command_id: number, payload: Uint8Array): Uint8Array {
  console.log('command:' + command_id + ',payload len:' + payload.length);
  return YukieMailBridge.invoke(command_id, payload);
}

export async function async_invoke(
  command_id: number,
  payload: Uint8Array,
): Promise<Uint8Array> {
  console.log(
    '[async invoke]command id:' + command_id + ',payload len:' + payload.length,
  );
  try {
    let resp = await YukieMailBridge.async_invoke(command_id, payload);
    console.log('[async invoke success]');
    return resp;
  } catch (e) {
    console.warn('[async invoke] invoke failed');
    return Promise.reject('[async invoke] invoke rust failed');
  }
}
