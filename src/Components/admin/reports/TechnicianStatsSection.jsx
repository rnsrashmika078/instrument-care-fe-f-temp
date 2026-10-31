import {
  ClipboardDocumentCheckIcon,
  WrenchScrewdriverIcon,
} from "@heroicons/react/24/outline";
import StatsSection from "./StatsSection";
import { statusCardDefinitions } from "./statusCardDefinitions";

const technicianCardDefinitions = [
  {
    key: "technicians",
    label: "Technicians",
    icon: WrenchScrewdriverIcon,
    iconClass: "bg-sky-500",
  },
  {
    key: "service_requests",
    label: "Service Requests",
    icon: ClipboardDocumentCheckIcon,
    iconClass: "bg-violet-500",
  },
];

const technicianStatsDefinitions = [
  ...technicianCardDefinitions,
  ...statusCardDefinitions,
];

export default function TechnicianStatsSection({
  overview,
  loading = false,
  onSelectStatus,
}) {
  return (
    <StatsSection
      title="Technicians"
      subtitle="Technician coverage and service request activity"
      icon={WrenchScrewdriverIcon}
      iconClass="bg-sky-50 text-sky-600"
      definitions={technicianStatsDefinitions}
      overview={overview}
      loading={loading}
      onSelectStatus={onSelectStatus}
      gridClassName="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3"
    />
  );
}
