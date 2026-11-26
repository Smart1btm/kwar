import { useEffect, useState } from 'react';
import { useAppStore } from '@/hooks/useAppStore';
import { db } from '@/lib/db';

interface StatusBarProps {
  memberName?: string;
  drawerName?: string;
  activeCart?: number;
  totalCarts?: number;
}

export default function StatusBar({ memberName, drawerName, activeCart, totalCarts }: StatusBarProps) {
  const state = useAppStore();
  const [syncStatus, setSyncStatus] = useState<'connected' | 'offline' | 'problem'>('offline');
  const [pendingCount, setPendingCount] = useState(0);
  const [rejectedCount, setRejectedCount] = useState(0);
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);
  const [batteryCharging, setBatteryCharging] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    const updateCounts = async () => {
      const pending = await db.outboxQueue.where('status').equals('pending').count();
      const rejected = await db.outboxQueue.where('status').equals('rejected').count();
      setPendingCount(pending);
      setRejectedCount(rejected);
      if (rejected > 0) {
        setSyncStatus('problem');
      } else if (navigator.onLine && pending === 0) {
        setSyncStatus('connected');
      } else {
        setSyncStatus('offline');
      }
    };
    updateCounts();
    const interval = setInterval(updateCounts, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!('getBattery' in navigator)) return;
    let battery: any;
    const handleBattery = (b: any) => {
      battery = b;
      setBatteryLevel(Math.round(b.level * 100));
      setBatteryCharging(b.charging);
      b.addEventListener('levelchange', () => setBatteryLevel(Math.round(b.level * 100)));
      b.addEventListener('chargingchange', () => setBatteryCharging(b.charging));
    };
    (navigator as any).getBattery?.().then(handleBattery);
    return () => {
      if (battery) {
        battery.onlevelchange = null;
        battery.onchargingchange = null;
      }
    };
  }, []);

  const syncText =
    syncStatus === 'connected'
      ? 'TERSAMBUNG - SEMUA TERKIRIM'
      : syncStatus === 'problem'
        ? `${rejectedCount} NOTA BERMASALAH - hubungi Pemilik`
        : `TANPA INTERNET - ${pendingCount} nota menunggu`;

  const syncColor =
    syncStatus === 'connected'
      ? 'text-kwar-green'
      : syncStatus === 'problem'
        ? 'text-kwar-red'
        : 'text-kwar-yellow-dark';

  return (
    <>
      <div className="flex items-center justify-between bg-white border-b-2 border-kwar-bg-light px-3 py-2 flex-wrap gap-2">
        <div className="flex items-center gap-3 min-w-0">
          {memberName && (
            <span className="font-bold text-kwar-text text-sm whitespace-nowrap">{memberName}</span>
          )}
          {drawerName && (
            <span className="text-sm text-kwar-text/70 whitespace-nowrap">| {drawerName}</span>
          )}
          {activeCart !== undefined && totalCarts !== undefined && (
            <div className="flex gap-1">
              {Array.from({ length: totalCarts }, (_, i) => (
                <span
                  key={i}
                  className={`text-xs px-2 py-1 rounded font-bold ${
                    i + 1 === activeCart
                      ? 'bg-kwar-green text-white'
                      : 'bg-kwar-bg-light text-kwar-text'
                  }`}
                >
                  {i + 1}
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="flex items-center gap-3">
          <span className={`status-bar ${syncColor}`}>{syncText}</span>
          {batteryLevel !== null && (
            <span
              className={`text-sm font-bold whitespace-nowrap ${
                batteryLevel <= 20 && !batteryCharging ? 'text-kwar-red' : 'text-kwar-text'
              }`}
            >
              BATERAI {batteryLevel}%
            </span>
          )}
          <button
            className="btn-outline px-3 py-1 text-sm"
            onClick={() => setShowHelp(true)}
          >
            ? BANTUAN
          </button>
        </div>
      </div>
      {batteryLevel !== null && batteryLevel <= 20 && !batteryCharging && (
        <div className="bg-kwar-yellow-dark text-white text-center py-1 font-bold text-sm">
          COLOK PENGISI DAYA
        </div>
      )}
      {showHelp && <HelpModal onClose={() => setShowHelp(false)} helpPhone={null} deviceCode={state.deviceCode} />}
    </>
  );
}

function HelpModal({ onClose, helpPhone, deviceCode }: { onClose: () => void; helpPhone: string | null; deviceCode: string | null }) {
  const [showGuide, setShowGuide] = useState<'menu' | 'sell' | 'pay' | 'finish'>('menu');

  if (showGuide !== 'menu') {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-6 max-w-md w-full">
          <h2 className="text-2xl font-bold mb-4">
            {showGuide === 'sell' ? 'CARA MENJUAL' : showGuide === 'pay' ? 'CARA MEMBAYAR' : 'CARA SELESAI JAGA'}
          </h2>
          <div className="space-y-3 text-lg">
            {showGuide === 'sell' && (
              <>
                <p>1. Sentuh kartu barang atau pindai barcode</p>
                <p>2. Untuk barang curah, pilih takaran (1/4, 1/2, 1, 2 kg)</p>
                <p>3. Barang belum terdaftar? Tekan BARANG LAIN</p>
              </>
            )}
            {showGuide === 'pay' && (
              <>
                <p>1. Tekan tombol hijau BAYAR</p>
                <p>2. Pilih TUNAI</p>
                <p>3. Masukkan uang diterima, tekan SELESAI & SIMPAN</p>
              </>
            )}
            {showGuide === 'finish' && (
              <>
                <p>1. Hitung uang di laci</p>
                <p>2. Isi jumlah lembar tiap pecahan</p>
                <p>3. Tekan SELESAI JAGA & KUNCI</p>
              </>
            )}
          </div>
          <button className="btn-outline w-full mt-4" onClick={() => setShowGuide('menu')}>
            KEMBALI
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">BANTUAN</h2>
        {helpPhone && (
          <a
            href={`https://wa.me/${helpPhone}?text=Mohon%20bantuan%20di%20kasir%20K_War%20(Tablet%20${deviceCode ?? ''})`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-green w-full mb-3 block text-center"
          >
            HUBUNGI PEMILIK LEWAT WHATSAPP
          </a>
        )}
        <div className="grid grid-cols-2 gap-3">
          <button className="btn-outline" onClick={() => setShowGuide('sell')}>CARA MENJUAL</button>
          <button className="btn-outline" onClick={() => setShowGuide('pay')}>CARA MEMBAYAR</button>
          <button className="btn-outline" onClick={() => setShowGuide('finish')}>CARA SELESAI JAGA</button>
        </div>
        <button className="btn-outline w-full mt-3" onClick={onClose}>KEMBALI</button>
      </div>
    </div>
  );
}
