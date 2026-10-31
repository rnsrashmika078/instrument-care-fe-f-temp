import {
  BeakerIcon,
  BuildingOffice2Icon,
  BuildingOfficeIcon,
  CubeIcon,
} from "@heroicons/react/24/outline";
import StatsSection from "./StatsSection";
import TechnicianStatsSection from "./TechnicianStatsSection";

const institutionCardDefinitions = [
  {
    key: "institutes",
    label: "Institutions",
    icon: BuildingOffice2Icon,
    iconClass: "bg-orange-500",
  },
  {
    key: "faculties",
    label: "Faculties",
    icon: BuildingOffice2Icon,
    iconClass: "bg-orange-500",
  },
  {
    key: "departments",
    label: "Departments",
    icon: BuildingOfficeIcon,
    iconClass: "bg-orange-500",
  },
  {
    key: "laboratories",
    label: "Laboratories",
    icon: BeakerIcon,
    iconClass: "bg-orange-500",
  },
  {
    key: "instruments",
    label: "Instruments",
    icon: CubeIcon,
    iconClass: "bg-orange-500",
  },
];

export default function ReportOverviewCards({
  overview,
  loading = false,
  onSelectStatus,
}) {
  return (
    <div className="space-y-5">
      <StatsSection
        title="Institution Overview"
        subtitle="Institutions, faculties, departments, laboratories and registered instruments"
        icon={BuildingOffice2Icon}
        iconClass="bg-orange-50 text-orange-600"
        definitions={institutionCardDefinitions}
        overview={overview}
        loading={loading}
        gridClassName="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5"
      />
      <TechnicianStatsSection
        overview={overview}
        loading={loading}
        onSelectStatus={onSelectStatus}
      />
    </div>
  );
}
