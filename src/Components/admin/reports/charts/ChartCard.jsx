export default function ChartCard({
  title,
  subtitle,
  action,
  children,
}) {
  return (
    <section className="w-full rounded-[1.5rem] border border-gray-200 bg-white p-4 md:p-5">
      <div className="mb-5 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-gray-900">{title}</h2>
          {subtitle ? (
            <p className="mt-1 text-xs text-gray-500">{subtitle}</p>
          ) : null}
        </div>
        {action}
      </div>
      <div className="h-72 w-full">{children}</div>
    </section>
  );
}
