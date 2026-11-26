import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { appStore } from '@/store/app-store';

export default function ProvisioningScreen() {
  const navigate = useNavigate();
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleProvision = async () => {
    if (!token.trim()) {
      setError('Masukkan token pairing');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const installId = crypto.randomUUID();
      const { data, error: rpcError } = await supabase.rpc('provision_device', {
        pairing_token: token.trim(),
        install_id: installId,
      });
      if (rpcError) throw new Error(rpcError.message);
      if (!data || data.error) throw new Error(data?.error || 'Provisioning gagal');

      appStore.set({
        deviceId: data.device_id,
        deviceCode: data.device_code,
        deviceRole: data.device_role,
        installId,
        jwt: data.jwt,
      });
      if (data.device_role === 'hp_manager') {
        navigate('/manager-login');
      } else {
        navigate('/who');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-kwar-bg-light p-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-2">K_War</h1>
        <p className="text-center text-kwar-text/70 mb-6">Daftarkan perangkat ini</p>
        <div className="space-y-4">
          <div>
            <label className="block text-lg font-bold mb-2">Token Pairing</label>
            <input
              type="text"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Masukkan token dari Pemilik"
              className="w-full text-lg border-2 border-kwar-bg-light rounded-xl px-4 py-3 focus:border-kwar-green outline-none"
              disabled={loading}
            />
          </div>
          {error && (
            <div className="bg-kwar-red/10 text-kwar-red rounded-xl p-3 font-bold text-center">
              {error}
            </div>
          )}
          <button
            className="btn-green w-full"
            onClick={handleProvision}
            disabled={loading}
          >
            {loading ? 'MENDAFTARKAN...' : 'DAFTARKAN PERANGKAT'}
          </button>
        </div>
      </div>
    </div>
  );
}
