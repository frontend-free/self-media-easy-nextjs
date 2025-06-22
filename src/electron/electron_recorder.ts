import { EnumRecorderStatus } from '@/generated/enums';
import { ElectronApiResult, getElectron } from './helper';

enum EnumRoomStatus {
  Living = 0,
  Ended = 2,
}
interface GetRoomInfoResult {
  roomId: string;
  isLiving: boolean;
  room_status: EnumRoomStatus;
  owner: string;
  title?: string;
  stream?: string;
}
type CheckAndRecordResult = {
  roomId: string;
  outputDir: string;
  fileName?: string;
  output: string;
  roomInfo: GetRoomInfoResult;
};

interface RecorderInfo {
  status: EnumRecorderStatus;
  recorder?: CheckAndRecordResult;
}

const electronApiOfRecorder = {
  autoCheckAndRecord: async (params: {
    roomId: string;
    outputDir: string;
    fileName?: string;
  }): Promise<ElectronApiResult<RecorderInfo>> => {
    return await getElectron().ipcRenderer.invoke('autoCheckAndRecord', params);
  },
  stopRecord: async (params: { roomId: string }): Promise<ElectronApiResult<void>> => {
    return await getElectron().ipcRenderer.invoke('stopRecord', params);
  },
  getRecorders: async (): Promise<ElectronApiResult<Record<string, RecorderInfo>>> => {
    return await getElectron().ipcRenderer.invoke('getRecorders');
  },
};

export { electronApiOfRecorder };
export type { RecorderInfo };
