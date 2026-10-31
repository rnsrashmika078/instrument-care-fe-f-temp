import {
  BeakerIcon,
  BuildingOffice2Icon,
  BuildingOfficeIcon,
  CubeIcon,
} from "@heroicons/react/24/outline";
import StatsSection from "./StatsSection";

const cardDefinitions = [
  {
    key: "faculties",
    label: "Faculties",
    icon: BuildingOffice2Icon,
    iconClass: "bg-orange-500",
  },
  {
    key: "departments",
    label: "Departments",
    icon: BuildingOffice2Icon,
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

export default function InstituteOverviewCards({ overview, loading = false }) {
  return (
    <StatsSection
      title="Institution Overview"
      subtitle="Faculties, departments, laboratories and registered instruments"
      icon={BuildingOffice2Icon}
      iconClass="bg-orange-50 text-orange-600"
      definitions={cardDefinitions}
      overview={overview}
      loading={loading}
    />
  );
}
