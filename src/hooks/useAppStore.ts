import { useEffect, useState } from 'react';
import { appStore, type AppState } from '@/store/app-store';

export function useAppStore(): AppState {
  const [state, setState] = useState(appStore.get());
  useEffect(() => {
    return appStore.subscribe(setState);
  }, []);
  return state;
}
