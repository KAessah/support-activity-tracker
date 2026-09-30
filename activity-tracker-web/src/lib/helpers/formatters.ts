const TZ = "Africa/Accra";

export const initials = (name?: string | null) =>
  (name ?? "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");

export const time = (iso: string) =>
  new Date(iso).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: TZ });

export const dateTime = (iso: string) =>
  new Date(iso).toLocaleString("en-GB", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit", timeZone: TZ });

/** Formats a plain Y-m-d string without timezone drift. */
export const day = (ymd: string, opts: Intl.DateTimeFormatOptions = { weekday: "short", day: "2-digit", month: "short" }) =>
  new Date(`${ymd}T12:00:00`).toLocaleDateString("en-GB", opts);

export const longDay = (ymd: string) => day(ymd, { weekday: "long", day: "numeric", month: "long", year: "numeric" });

export const number = (n: number) => n.toLocaleString("en-GB");

export const relative = (iso: string | null) => {
  if (!iso) return "Never";
  const mins = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.round(hours / 24)}d ago`;
};

/** Today's date as Y-m-d in the team's timezone. */
export const todayYmd = () => new Date().toLocaleDateString("en-CA", { timeZone: TZ });

export const shiftYmd = (ymd: string, days: number) => {
  const d = new Date(`${ymd}T12:00:00`);
  d.setDate(d.getDate() + days);
  return d.toLocaleDateString("en-CA");
};
