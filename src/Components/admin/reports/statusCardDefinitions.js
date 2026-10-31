import {
  ArrowPathIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

export const statusCardDefinitions = [
  {
    key: "pending_requests",
    label: "Pending Requests",
    description: "Awaiting action",
    icon: ClockIcon,
    iconClass: "bg-amber-500",
    labelClass: "text-amber-600",
    hoverClass: "hover:border-amber-200",
    isStatus: true,
  },
  {
    key: "in_progress_requests",
    label: "In Progress Requests",
    description: "Currently being handled",
    icon: ArrowPathIcon,
    iconClass: "bg-sky-500",
    labelClass: "text-sky-600",
    hoverClass: "hover:border-sky-200",
    isStatus: true,
  },
  {
    key: "completed_requests",
    label: "Completed Requests",
    description: "Successfully resolved",
    icon: CheckCircleIcon,
    iconClass: "bg-emerald-500",
    labelClass: "text-emerald-600",
    hoverClass: "hover:border-emerald-200",
    isStatus: true,
  },
  {
    key: "rejected_requests",
    label: "Rejected Requests",
    description: "Declined requests",
    icon: XCircleIcon,
    iconClass: "bg-rose-500",
    labelClass: "text-rose-600",
    hoverClass: "hover:border-rose-200",
    isStatus: true,
  },
];
