import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAppStore } from '@/hooks/useAppStore';
import { appStore, loadAppState, saveAppState } from '@/store/app-store';
import { db } from '@/lib/db';
import { purgeOldSyncedTransactions } from '@/lib/purge';
import ProvisioningScreen from '@/screens/ProvisioningScreen';
import WhoIsWatching from '@/screens/WhoIsWatching';
import OpenShiftScreen from '@/screens/OpenShiftScreen';
import CashierScreen from '@/screens/CashierScreen';
import CloseShiftScreen from '@/screens/CloseShiftScreen';
import ManagerLoginScreen from '@/screens/ManagerLoginScreen';
import ManagerHomeScreen from '@/screens/ManagerHomeScreen';
import ManagerProductsScreen from '@/screens/ManagerProductsScreen';
import ManagerShiftReportScreen from '@/screens/ManagerShiftReportScreen';

export default function App() {
  const state = useAppStore();

  useEffect(() => {
    const saved = loadAppState();
    if (saved) {
      appStore.set(saved);
    }
    (async () => {
      if ('storage' in navigator && 'persist' in navigator.storage) {
        try {
          await navigator.storage.persist();
        } catch {
          // ignore
        }
      }
      await purgeOldSyncedTransactions();
    })();
  }, []);

  useEffect(() => {
    saveAppState(state);
  }, [state]);

  const fontSizeClass =
    state.fontSize === 'large'
      ? 'text-lg'
      : state.fontSize === 'xlarge'
        ? 'text-xl'
        : '';

  return (
    <div className={fontSizeClass}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<RootRoute />} />
          <Route path="/provision" element={<ProvisioningScreen />} />
          <Route path="/manager-login" element={<ManagerLoginScreen />} />
          <Route path="/manager" element={<ManagerHomeScreen />} />
          <Route path="/manager/products" element={<ManagerProductsScreen />} />
          <Route path="/manager/shift-report" element={<ManagerShiftReportScreen />} />
          <Route path="/who" element={<WhoIsWatching />} />
          <Route path="/open-shift" element={<OpenShiftScreen />} />
          <Route path="/cashier" element={<CashierScreen />} />
          <Route path="/close-shift" element={<CloseShiftScreen />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

function RootRoute() {
  const state = useAppStore();
  if (!state.deviceId) {
    return <Navigate to="/provision" replace />;
  }
  if (state.deviceRole === 'hp_manager') {
    return <Navigate to="/manager-login" replace />;
  }
  return <Navigate to="/who" replace />;
}
