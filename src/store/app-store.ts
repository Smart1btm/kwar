import { create } from './tiny-store';

export interface AppState {
  deviceId: string | null;
  deviceCode: string | null;
  deviceRole: 'tablet_cashier' | 'hp_manager' | null;
  installId: string | null;
  jwt: string | null;
  practiceMode: boolean;
  fontSize: 'normal' | 'large' | 'xlarge';
  soundEnabled: boolean;
  vibrateEnabled: boolean;
  speakItemName: boolean;
}

export const appStore = create<AppState>({
  deviceId: null,
  deviceCode: null,
  deviceRole: null,
  installId: null,
  jwt: null,
  practiceMode: false,
  fontSize: 'normal',
  soundEnabled: true,
  vibrateEnabled: true,
  speakItemName: false,
});

const STORAGE_KEY = 'kwar_app_state';

export function saveAppState(state: AppState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function loadAppState(): Partial<AppState> | null {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function clearAppState(): void {
  localStorage.removeItem(STORAGE_KEY);
}
