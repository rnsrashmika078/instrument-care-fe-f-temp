import { useEffect } from "react";
import { ChevronLeft, ChevronRight, Inbox, Search } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Card + header                                                      */
/* ------------------------------------------------------------------ */

export function TableCard({ children, className = "" }) {
    return (
        <section
            className={`overflow-hidden rounded-[1.5rem] border-2 border-gray-200 bg-white font-poppins shadow-sm ${className}`}
        >
            {children}
        </section>
    );
}

export function TableHead({ title, subtitle, actions, className = "" }) {
    return (
        <header
            className={`flex flex-col gap-4 border-b border-gray-100 bg-gradient-to-b from-white to-orange-50/40 px-4 py-4 sm:px-5 ${className}`}
        >
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="min-w-0">
                    <h3 className="truncate text-lg font-bold tracking-tight text-gray-900">
                        {title}
                    </h3>
                    {subtitle ? (
                        <p className="mt-0.5 text-xs text-gray-500">{subtitle}</p>
                    ) : null}
                </div>
                {actions ? (
                    <div className="flex flex-wrap items-center gap-2">
                        {actions}
                    </div>
                ) : null}
            </div>
        </header>
    );
}

export function TableToolbar({ children, className = "" }) {
    return (
        <div
            className={`flex flex-col gap-3 border-b border-gray-100/70 bg-orange-50/30 px-4 py-3.5 sm:px-5 lg:flex-row lg:flex-wrap lg:items-end ${className}`}
        >
            {children}
        </div>
    );
}

/* ------------------------------------------------------------------ */
/*  Form controls                                                      */
/* ------------------------------------------------------------------ */

const CONTROL =
    "w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-gray-400 focus:ring-4 focus:ring-gray-100";

export function SearchInput({ value, onChange, placeholder = "Search…" }) {
    return (
        <div className="relative min-w-0 flex-1 sm:max-w-xs">
            <Search
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
                aria-hidden="true"
            />
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className={`${CONTROL} pl-9`}
            />
        </div>
    );
}

const CHEVRON_SVG =
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='none' stroke='%239ca3af' stroke-width='1.75' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m5 7.5 5 5 5-5'/%3E%3C/svg%3E\")";

/** `options` is an array of `{ value, label }`. */
export function FilterSelect({ value, onChange, options, className = "" }) {
    return (
        <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={`${CONTROL} cursor-pointer appearance-none pr-9 ${className}`}
            style={{
                backgroundImage: CHEVRON_SVG,
                backgroundPosition: "right 0.65rem center",
                backgroundSize: "1rem 1rem",
                backgroundRepeat: "no-repeat",
            }}
        >
            {options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                    {opt.label}
                </option>
            ))}
        </select>
    );
}

export function DateField({ label, value, onChange }) {
    return (
        <label className="flex min-w-0 flex-1 flex-col gap-1 sm:max-w-[9.5rem]">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                {label}
            </span>
            <input
                type="date"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className={CONTROL}
            />
        </label>
    );
}

export function FilterLabel({ children }) {
    return (
        <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">
            {children}
        </span>
    );
}

export function RecordsBadge({ count, noun = "records" }) {
    return (
        <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-gray-200 bg-orange-50 px-3 py-1.5 text-xs font-semibold text-orange-700">
            {count} {noun}
        </span>
    );
}

export function ActionButton({ tone = "orange", icon: Icon, children, size = "md", ...rest }) {
    const tones = {
        orange: "bg-orange-500 text-white hover:bg-orange-600 shadow-sm shadow-orange-200",
        green: "bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm shadow-emerald-200",
        red: "bg-rose-600 text-white hover:bg-rose-700 shadow-sm shadow-rose-200",
        slate: "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50",
    };
    const sizes = {
        md: "gap-2 px-3.5 py-2.5 text-sm",
        sm: "gap-1.5 px-2.5 py-1.5 text-xs",
    };
    const iconSize = size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4";

    return (
        <button
            type="button"
            className={`inline-flex shrink-0 items-center rounded-xl font-semibold transition active:scale-[0.98] ${sizes[size] ?? sizes.md} ${tones[tone]}`}
            {...rest}
        >
            {Icon ? <Icon className={iconSize} aria-hidden="true" /> : null}
            {children}
        </button>
    );
}

/* ------------------------------------------------------------------ */
/*  Table body                                                         */
/* ------------------------------------------------------------------ */

export function TableScroll({ children, maxHeight = "max-h-[720px]" }) {
    return (
        <div className={`${maxHeight} overflow-auto`}>
            <table className="w-full border-collapse text-left text-sm">
                {children}
            </table>
        </div>
    );
}

export function Th({ children, align = "left", className = "" }) {
    return (
        <th
            scope="col"
            className={`sticky top-0 z-10 whitespace-nowrap border-b border-gray-100 bg-orange-50/95 px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-gray-600 backdrop-blur ${align === "center" ? "text-center" : "text-left"} ${className}`}
        >
            {children}
        </th>
    );
}

export function Td({ children, align = "left", mono = false, className = "" }) {
    return (
        <td
            className={`border-b border-gray-100 px-4 py-3.5 align-middle text-gray-700 transition-colors ${
                align === "center" ? "text-center" : "text-left"
            } ${mono ? "font-mono text-xs tabular-nums text-gray-500" : ""} ${className}`}
        >
            {children}
        </td>
    );
}

export function Tr({ children, onClick, className = "" }) {
    return (
        <tr
            onClick={onClick}
            className={`group transition-colors last:[&>td]:border-b-0 hover:bg-orange-50/50 ${
                onClick ? "cursor-pointer" : ""
            } ${className}`}
        >
            {children}
        </tr>
    );
}

export function IdTag({ prefix, value }) {
    if (value === null || value === undefined || value === "") {
        return <span className="text-xs italic text-gray-300">—</span>;
    }

    return (
        <span className="inline-flex items-center rounded-md bg-gray-50 px-1.5 py-0.5 font-mono text-[11px] font-medium tabular-nums text-gray-600 ring-1 ring-inset ring-gray-100">
            {prefix ? <span className="text-gray-400">{prefix}</span> : null}
            {value}
        </span>
    );
}

const STATUS_TONES = {
    approved: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    completed: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    consented: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    active: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    submitted: "bg-sky-50 text-sky-700 ring-sky-200",
    registered: "bg-sky-50 text-sky-700 ring-sky-200",
    "in progress": "bg-sky-50 text-sky-700 ring-sky-200",
    pending: "bg-amber-50 text-amber-700 ring-gray-200",
    declined: "bg-rose-50 text-rose-700 ring-rose-200",
    rejected: "bg-rose-50 text-rose-700 ring-rose-200",
    cancelled: "bg-rose-50 text-rose-700 ring-rose-200",
    canceled: "bg-rose-50 text-rose-700 ring-rose-200",
    pass: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    fail: "bg-rose-50 text-rose-700 ring-rose-200",
};

export function StatusPill({ status }) {
    const key = String(status ?? "").trim().toLowerCase();
    const tone = STATUS_TONES[key] ?? "bg-gray-50 text-gray-600 ring-gray-200";
    const label = key ? key.charAt(0).toUpperCase() + key.slice(1) : "—";

    return (
        <span
            className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ring-inset ${tone}`}
        >
            <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" aria-hidden="true" />
            {label}
        </span>
    );
}

export function IconButton(props) {
    const { tone = "gray", icon: Icon, title, ...rest } = props;
    const tones = {
        blue: "text-sky-600 hover:bg-sky-50 hover:text-sky-700",
        red: "text-rose-600 hover:bg-rose-50 hover:text-rose-700",
        green: "text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700",
        gray: "text-gray-500 hover:bg-gray-100 hover:text-gray-700",
    };

    return (
        <button
            type="button"
            title={title}
            aria-label={title}
            className={`inline-flex h-8 w-8 items-center justify-center rounded-lg transition active:scale-95 ${tones[tone]}`}
            {...rest}
        >
            <Icon className="h-4 w-4" aria-hidden="true" />
        </button>
    );
}

/* ------------------------------------------------------------------ */
/*  Loading / empty / pagination                                       */
/* ------------------------------------------------------------------ */

export function TableSkeleton({ rows = 6, columns = 5 }) {
    return (
        <div className="space-y-2.5 p-4 sm:p-5" role="status" aria-label="Loading table">
            {Array.from({ length: rows }).map((_, r) => (
                <div key={r} className="flex items-center gap-3">
                    {Array.from({ length: columns }).map((__, c) => (
                        <div
                            key={c}
                            className="h-4 animate-pulse rounded-md bg-gray-100"
                            style={{ width: c === 0 ? "18%" : `${Math.max(10, 22 - c * 2)}%` }}
                        />
                    ))}
                </div>
            ))}
        </div>
    );
}

export function TableEmpty({ title = "Nothing to show", message, hint }) {
    return (
        <div className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-gray-100 bg-orange-50 text-orange-400">
                <Inbox className="h-6 w-6" aria-hidden="true" />
            </span>
            <div className="space-y-1">
                <p className="text-sm font-semibold text-gray-800">{title}</p>
                <p className="mx-auto max-w-sm text-xs leading-relaxed text-gray-500">
                    {message ?? "No records match the current filters. Try widening your search."}
                </p>
            </div>
            {hint ? (
                <span className="rounded-full bg-gray-50 px-3 py-1 text-[11px] font-medium text-gray-500">
                    {hint}
                </span>
            ) : null}
        </div>
    );
}

export function Pagination({ page, totalPages, total, onPage, noun = "entries" }) {
    if (totalPages <= 1) return null;

    const from = (page - 1) * 10 + 1;
    const to = Math.min(page * 10, total);

    const navBtn =
        "inline-flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 transition hover:border-gray-300 hover:bg-orange-50 hover:text-orange-600 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-gray-200 disabled:hover:bg-white";

    return (
        <footer className="flex flex-col items-center justify-between gap-3 border-t border-gray-100 bg-orange-50/30 px-4 py-3.5 sm:flex-row sm:px-5">
            <p className="text-xs text-gray-500">
                Showing <span className="font-semibold text-gray-700">{from}</span>–
                <span className="font-semibold text-gray-700">{to}</span> of{" "}
                <span className="font-semibold text-gray-700">{total}</span> {noun}
            </p>
            <div className="flex items-center gap-2">
                <button
                    type="button"
                    onClick={() => onPage(Math.max(page - 1, 1))}
                    disabled={page === 1}
                    className={navBtn}
                    aria-label="Previous page"
                >
                    <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                </button>
                <span className="min-w-[6.5rem] text-center text-xs font-semibold text-gray-600">
                    Page {page} of {totalPages}
                </span>
                <button
                    type="button"
                    onClick={() => onPage(Math.min(page + 1, totalPages))}
                    disabled={page === totalPages}
                    className={navBtn}
                    aria-label="Next page"
                >
                    <ChevronRight className="h-4 w-4" aria-hidden="true" />
                </button>
            </div>
        </footer>
    );
}

/* ------------------------------------------------------------------ */
/*  Confirmation dialog                                                */
/* ------------------------------------------------------------------ */

const CONFIRM_TONES = {
    orange: "bg-orange-500",
    green: "bg-emerald-600",
    red: "bg-rose-600",
};

export function ConfirmDialog({
    open,
    icon: Icon,
    tone = "orange",
    title,
    message,
    detail,
    confirmLabel = "Confirm",
    cancelLabel = "Cancel",
    busy = false,
    onConfirm,
    onCancel,
}) {
    useEffect(() => {
        if (!open || busy) return;

        const onKeyDown = (e) => {
            if (e.key === "Escape") onCancel?.();
        };

        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [open, busy, onCancel]);

    if (!open) return null;

    return (
        <div
            className="fixed inset-0 z-[60] flex items-center justify-center bg-gray-900/50 p-4 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-dialog-title"
            onClick={(e) => {
                if (e.target === e.currentTarget && !busy) onCancel?.();
            }}
        >
            <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
                <div className="flex gap-4 p-6">
                    {Icon ? (
                        <span
                            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-white ${CONFIRM_TONES[tone] ?? CONFIRM_TONES.orange}`}
                        >
                            <Icon className="h-6 w-6" aria-hidden="true" />
                        </span>
                    ) : null}

                    <div className="min-w-0 flex-1">
                        <h3
                            id="confirm-dialog-title"
                            className="text-lg font-bold tracking-tight text-gray-900"
                        >
                            {title}
                        </h3>
                        <p className="mt-1.5 text-sm leading-relaxed text-gray-500">
                            {message}
                        </p>
                        {detail ? (
                            <p className="mt-3 rounded-xl border border-gray-100 bg-orange-50/60 px-3 py-2 text-sm font-medium text-gray-700">
                                {detail}
                            </p>
                        ) : null}
                    </div>
                </div>

                <div className="flex justify-end gap-3 border-t border-gray-100 bg-orange-50/30 px-6 py-4">
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={busy}
                        className="rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {cancelLabel}
                    </button>

                    <ActionButton
                        tone={tone}
                        icon={Icon}
                        disabled={busy}
                        onClick={onConfirm}
                    >
                        {busy ? "Working…" : confirmLabel}
                    </ActionButton>
                </div>
            </div>
        </div>
    );
}
