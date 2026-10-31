import { ChevronDown, SlidersHorizontal } from "lucide-react";

const filterGroups = [
  { key: "institutes", label: "Institution" },
  { key: "types", label: "Testing Services" },
  { key: "conditions", label: "Condition" },
  { key: "faculties", label: "Faculty" },
  { key: "years", label: "Manufacture Year" },
  { key: "statuses", label: "Request Status" },
];

export default function ReportFilterSidebar({
  options = {},
  selected = {},
  onChange,
  onClear,
  loading = false,
  lockedKeys = [],
  showDateFilter = false,
  datePreset = "all",
  onDatePresetChange,
  onDateChange,
  onClearDateFilter,
}) {
  const dateFrom = selected?.date_from ?? "";
  const dateTo = selected?.date_to ?? "";
  const hasDateFilter = datePreset !== "all";

  const activeCount =
    filterGroups.reduce(
      (total, group) =>
        lockedKeys.includes(group.key)
          ? total
          : total + (selected[group.key]?.length ?? 0),
      0,
    ) + (hasDateFilter ? 1 : 0);

  return (
    <aside className="h-fit overflow-hidden rounded-[1.5rem] border border-gray-200 bg-white">
      <div className="flex items-start justify-between gap-3 border-b border-gray-100 px-4 py-4">
        <div className="flex items-start gap-2.5">
          <span className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
            <SlidersHorizontal className="h-4 w-4" />
          </span>
          <div>
            <h2 className="text-sm font-bold text-gray-900">Filters</h2>
            <p className="mt-0.5 text-xs text-gray-500">
              {activeCount > 0
                ? `${activeCount} selected`
                : "Filter the live statistics"}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClear}
          disabled={activeCount === 0}
          className="text-xs font-semibold text-orange-600 transition hover:text-orange-700 disabled:cursor-not-allowed disabled:text-gray-300"
        >
          Clear all
        </button>
      </div>

      {showDateFilter ? (
        <div className="border-b border-gray-100 px-3 py-3">
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm font-semibold text-gray-700">
              Date range
            </span>
            {hasDateFilter ? (
              <button
                type="button"
                onClick={onClearDateFilter}
                className="text-xs font-semibold text-orange-600 transition hover:text-orange-700"
              >
                Clear
              </button>
            ) : null}
          </div>

          <select
            value={datePreset}
            onChange={(event) => onDatePresetChange?.(event.target.value)}
            className="mt-2 w-full rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-sm text-gray-700 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
          >
            <option value="all">All time</option>
            <option value="today">Today</option>
            <option value="week">This week</option>
            <option value="month">This month</option>
            <option value="year">This year</option>
            <option value="custom">Custom range</option>
          </select>

          {datePreset === "custom" ? (
            <div className="mt-2 grid grid-cols-2 gap-2">
              <label className="flex flex-col gap-1 text-[11px] font-semibold text-gray-500">
                From
                <input
                  type="date"
                  value={dateFrom}
                  max={dateTo || undefined}
                  onChange={(event) =>
                    onDateChange?.("date_from", event.target.value)
                  }
                  className="w-full rounded-lg border border-gray-200 px-2 py-1.5 text-xs font-normal text-gray-700 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                />
              </label>
              <label className="flex flex-col gap-1 text-[11px] font-semibold text-gray-500">
                To
                <input
                  type="date"
                  value={dateTo}
                  min={dateFrom || undefined}
                  onChange={(event) =>
                    onDateChange?.("date_to", event.target.value)
                  }
                  className="w-full rounded-lg border border-gray-200 px-2 py-1.5 text-xs font-normal text-gray-700 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                />
              </label>
            </div>
          ) : null}

          <p className="mt-1.5 text-[11px] text-gray-400">
            Applies to all statistics on this page.
          </p>
        </div>
      ) : null}

      <div className="max-h-[68vh] overflow-y-auto px-2 py-1">
        {filterGroups.map((group) => {
          const isLocked = lockedKeys.includes(group.key);
          const selectedValues = selected?.[group.key] ?? [];
          const groupOptions = options?.[group.key] ?? [];
          const visibleOptions = isLocked
            ? groupOptions.filter((option) =>
                selectedValues.includes(String(option.id)),
              )
            : groupOptions;

          return (
            <details
              key={group.key}
              className="group border-b border-gray-100 last:border-b-0"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-2 rounded-xl px-3 py-3 text-sm font-semibold text-gray-700 transition hover:bg-orange-50/70 [&::-webkit-details-marker]:hidden">
                <span>{group.label}</span>
                <span className="flex items-center gap-2">
                  {selectedValues.length > 0 ? (
                    <span className="rounded-full bg-orange-100 px-2 py-0.5 text-[11px] font-bold text-orange-700">
                      {selectedValues.length}
                    </span>
                  ) : null}
                  <ChevronDown className="h-4 w-4 text-gray-400 transition group-open:rotate-180" />
                </span>
              </summary>

              <div className="max-h-52 space-y-0.5 overflow-y-auto px-1 pb-2">
                {visibleOptions.length === 0 ? (
                  <p className="px-2 py-2 text-xs text-gray-400">
                    {isLocked && selectedValues.length === 0
                      ? "Select an institution above"
                      : "No options available"}
                  </p>
                ) : (
                  visibleOptions.map((option) => {
                    const value = String(option.id);
                    const checked = selectedValues.includes(value);

                    return (
                      <label
                        key={value}
                        className={`flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm text-gray-600 ${
                          isLocked
                            ? "cursor-default"
                            : "cursor-pointer transition hover:bg-gray-50"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          disabled={isLocked}
                          onChange={() =>
                            onChange(group.key, value, !checked)
                          }
                          className="h-4 w-4 rounded border-gray-300 text-orange-500 focus:ring-orange-400 disabled:cursor-not-allowed disabled:opacity-70"
                        />
                        <span className="truncate">{option.label}</span>
                      </label>
                    );
                  })
                )}
              </div>
            </details>
          );
        })}
      </div>

      {loading ? (
        <div className="border-t border-gray-100 px-4 py-2.5 text-xs font-semibold text-orange-600">
          Updating results...
        </div>
      ) : null}
    </aside>
  );
}
