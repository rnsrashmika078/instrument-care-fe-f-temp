import { Inbox } from "lucide-react";

const SKELETON_BARS = [45, 70, 55, 85, 60, 40];

export function ChartSkeleton({ height = "h-[300px]" }) {
    return (
        <div
            className={`flex w-full items-end gap-2 ${height}`}
            role="status"
            aria-label="Loading chart"
        >
            {SKELETON_BARS.map((size, index) => (
                <div
                    key={index}
                    className="flex-1 animate-pulse rounded-t-lg bg-orange-100"
                    style={{ height: `${size}%` }}
                />
            ))}
        </div>
    );
}

export function ChartEmptyState(props) {
    const {
        icon: IconComponent = Inbox,
        title = "No data yet",
        message = "Data will appear here as soon as it is recorded.",
    } = props;

    return (
        <div className="flex h-full min-h-[220px] w-full flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-gray-200 bg-gradient-to-b from-orange-50/70 to-white px-6 py-10 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 text-orange-500">
                <IconComponent className="h-6 w-6" aria-hidden="true" />
            </span>
            <div className="space-y-1">
                <p className="text-sm font-semibold text-gray-800">{title}</p>
                <p className="mx-auto max-w-[20rem] text-xs leading-relaxed text-gray-500">
                    {message}
                </p>
            </div>
        </div>
    );
}
