export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-neutral-300 py-20 dark:border-neutral-700">
      <svg className="h-10 w-10 text-neutral-300 dark:text-neutral-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M9 12h6m-3-3v6M4.5 19.5l15-15M19.5 4.5l-15 15" />
      </svg>
      <p className="text-sm text-neutral-500 dark:text-neutral-500">No hay reportes registrados aún.</p>
    </div>
  );
}
