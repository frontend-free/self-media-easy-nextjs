interface ElectronApiResult<T> {
  success: boolean;
  data?: T;
  message?: string;
}

function getElectron(): any {
  // @ts-expect-error 先忽略
  if (typeof window !== 'undefined' && window.electron) {
    // @ts-expect-error 先忽略
    return window.electron;
  }

  throw new Error('需要在桌面端使用');
}

export { getElectron };
export type { ElectronApiResult };
