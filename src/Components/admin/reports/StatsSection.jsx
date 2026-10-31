import StatsCardGrid from "./StatsCardGrid";

export default function StatsSection({
  title,
  subtitle,
  icon,
  iconClass = "bg-orange-50 text-orange-600",
  definitions = [],
  overview,
  loading = false,
  onSelectStatus,
  gridClassName,
}) {
  const SectionIcon = icon;

  return (
    <section className="space-y-3">
      <div className="flex items-center gap-2.5">
        <span
          className={`flex h-9 w-9 items-center justify-center rounded-xl ${iconClass}`}
        >
          <SectionIcon className="h-5 w-5" />
        </span>
        <div>
          <h3 className="text-base font-bold text-gray-900">{title}</h3>
          {subtitle ? (
            <p className="text-xs text-gray-500">{subtitle}</p>
          ) : null}
        </div>
      </div>
      <StatsCardGrid
        definitions={definitions}
        overview={overview}
        loading={loading}
        onSelectStatus={onSelectStatus}
        className={
          gridClassName ??
          "grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
        }
      />
    </section>
  );
}
