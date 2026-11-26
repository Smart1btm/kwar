import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '@/lib/db';
import { appStore } from '@/store/app-store';
import StatusBar from '@/components/StatusBar';
import type { LocalMember, LocalCashDrawer } from '@/types';

export default function WhoIsWatching() {
  const navigate = useNavigate();
  const state = appStore.get();
  const [members, setMembers] = useState<LocalMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const active = await db.members.toArray();
      setMembers(active.filter((m) => m.is_active));
      setLoading(false);
    })();
  }, []);

  const selectMember = async (member: LocalMember) => {
    let drawers: LocalCashDrawer[];
    if (member.drawer_access === 'shared_only') {
      drawers = await db.cashDrawers.where('drawer_type').equals('shared').toArray();
    } else if (member.drawer_access === 'individual_only') {
      drawers = await db.cashDrawers
        .where('assigned_member_id')
        .equals(member.id)
        .toArray();
    } else {
      drawers = await db.cashDrawers.toArray();
      drawers = drawers.filter(
        (d) => d.drawer_type !== 'reserve',
      );
    }

    if (drawers.length === 0) {
      return;
    }

    if (drawers.length === 1) {
      appStore.set({ deviceId: state.deviceId });
      navigate('/open-shift', {
        state: { memberId: member.id, drawerId: drawers[0].id, memberName: member.nickname, drawerName: drawers[0].drawer_name },
      });
    } else {
      navigate('/open-shift', {
        state: { memberId: member.id, drawers, memberName: member.nickname },
      });
    }
  };

  return (
    <div className="min-h-screen bg-kwar-bg-light">
      <StatusBar />
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-center mb-6">SIAPA YANG JAGA SEKARANG?</h1>
        {loading ? (
          <p className="text-center text-lg">Memuat...</p>
        ) : members.length === 0 ? (
          <p className="text-center text-lg text-kwar-text/70">
            Belum ada anggota. Hubungi Pemilik untuk menambah anggota.
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {members.map((m) => (
              <button
                key={m.id}
                onClick={() => selectMember(m)}
                className="bg-white rounded-2xl border-2 border-kwar-bg-light p-6 text-center hover:border-kwar-green transition-colors active:scale-[0.98]"
              >
                {m.photo_r2_path ? (
                  <img
                    src={m.photo_r2_path}
                    alt={m.nickname}
                    className="w-20 h-20 rounded-full mx-auto mb-3 object-cover"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full mx-auto mb-3 bg-kwar-bg-light flex items-center justify-center text-3xl font-bold text-kwar-text/50">
                    {m.nickname.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="text-xl font-bold">{m.nickname}</span>
              </button>
            ))}
          </div>
        )}
        <div className="mt-6 text-center">
          <button
            className="btn-outline"
            onClick={() => {
              appStore.set({ practiceMode: true });
              navigate('/cashier');
            }}
          >
            MODE LATIHAN
          </button>
        </div>
      </div>
    </div>
  );
}
