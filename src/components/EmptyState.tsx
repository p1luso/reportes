export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-stone-200 bg-white py-24">
      <div className="text-5xl font-black text-stone-200 tracking-tighter">NO SIGNAL</div>
      <p className="text-xs text-stone-400 uppercase tracking-[0.2em]">Sin reportes registrados — intenta más tarde</p>
    </div>
  );
}
