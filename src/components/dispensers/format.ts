//src/components/dispensers/format.ts
export const fmtPrice = (s?: string) =>
  s ? `₱${Number(s).toLocaleString("en-PH",{minimumFractionDigits:2,maximumFractionDigits:2})}/L` : "₱0.00/L";

export const fmtLiters = (s?: string) =>
  s ? `${Number(s).toLocaleString("en-PH",{maximumFractionDigits:2})} L` : "0 L";

export const fmtDatePH = (iso?: string) => {
  if (!iso) return "";
  try {
    return new Intl.DateTimeFormat("en-PH",{timeZone:"Asia/Manila",year:"numeric",month:"2-digit",day:"2-digit"}).format(new Date(iso));
  } catch { return ""; }
};

export type LatestInventory = {
  price?: string;
  ending_inventory?: string;
  date?: string;
  pump_name?: string;
  product?: string;
};

export type Pump = { id: number; name: string; latest_inventory?: LatestInventory };
export type Dispenser = { id: string; name: string; location: string; pumps: Pump[] };
