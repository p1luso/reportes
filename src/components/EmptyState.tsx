export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-zinc-800 py-24">
      <div className="text-5xl font-black text-zinc-800 tracking-tighter">NO SIGNAL</div>
      <p className="text-xs text-zinc-600 uppercase tracking-[0.2em]">Sin reportes registrados — intenta más tarde</p>
    </div>
  );
}
