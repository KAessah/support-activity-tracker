export function Logo() {
  return (
    <div className="flex items-center gap-2.5">
      <span className="grid size-9 place-items-center rounded-xl bg-brand-600 text-sm font-semibold text-white">AS</span>
      <span className="leading-tight">
        <span className="block text-[15px] font-semibold tracking-tight text-brand-900">Support Tracker</span>
        <span className="block text-[11px] text-tertiary">Applications Support</span>
      </span>
    </div>
  );
}
