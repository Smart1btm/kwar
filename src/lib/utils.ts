export function formatRupiah(amount: number): string {
  return 'Rp' + Math.round(amount).toLocaleString('id-ID');
}

export function formatDate(date: Date | string, format: 'ddMMyyyy' | 'ddMM' | 'time' = 'ddMMyyyy'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  if (format === 'ddMMyyyy') return `${dd}${mm}${yyyy}`;
  if (format === 'ddMM') return `${dd}/${mm}`;
  const hh = String(d.getHours()).padStart(2, '0');
  const min = String(d.getMinutes()).padStart(2, '0');
  return `${hh}:${min}`;
}

export function formatRupiahSpoken(amount: number): string {
  const rounded = Math.round(amount);
  if (rounded === 0) return 'Nol rupiah';
  const ribu = Math.floor(rounded / 1000);
  const sisa = rounded % 1000;
  let text = '';
  if (ribu > 0) {
    text += `${ribu} ribu`;
  }
  if (sisa > 0) {
    if (text) text += ' ';
    text += `${sisa} rupiah`;
  }
  return text || 'Nol rupiah';
}

export function speakText(text: string): void {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'id-ID';
  utterance.rate = 0.9;
  window.speechSynthesis.speak(utterance);
}

export function vibrate(pattern: number | number[] = 50): void {
  if ('vibrate' in navigator) {
    navigator.vibrate(pattern);
  }
}

export function calcSubtotal(
  qty: number,
  sellingPrice: number,
  bundleQty: number | null,
  bundlePrice: number | null,
): number {
  if (bundleQty && bundlePrice && bundleQty > 0) {
    const bundleCount = Math.floor(qty / bundleQty);
    const remainder = qty % bundleQty;
    return bundleCount * bundlePrice + remainder * sellingPrice;
  }
  return qty * sellingPrice;
}

export function calcRounding(total: number, roundingUnit: number): number {
  if (roundingUnit === 0) return 0;
  const rounded = Math.ceil(total / roundingUnit) * roundingUnit;
  return rounded - total;
}

export function getStockStatus(
  stock: number,
  minAlert: number,
  criticalAlert: number,
): 'HABIS' | 'KRITIS' | 'MENIPIS' | 'AMAN' {
  if (stock <= 0) return 'HABIS';
  if (stock <= criticalAlert) return 'KRITIS';
  if (stock <= minAlert) return 'MENIPIS';
  return 'AMAN';
}
