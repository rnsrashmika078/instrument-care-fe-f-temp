import { Building2, Users, Layers, FlaskConical, Package, Wrench, UserCog } from "lucide-react";

const stats = [
  { icon: Building2, label: "Institutes", value: 71 },
  { icon: Users, label: "Faculties", value: 65 },
  { icon: Layers, label: "Departments", value: 315 },
  { icon: FlaskConical, label: "Laboratories", value: 586 },
  { icon: Package, label: "Products", value: 390 },
  { icon: Wrench, label: "Instruments", value: 1481 },
  { icon: UserCog, label: "Technicians", value: 243 },
];

const StatsSection = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-5xl mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-2">
          Database Statistics
        </h2>
        <p className="text-center text-gray-500 mb-10">
          A growing network of research infrastructure across Sri Lanka
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-6">
          {stats.map(({ icon: Icon, label, value }) => (
            <div
              key={label}
              className="flex flex-col items-center gap-3 p-4 rounded-lg bg-gray-50 hover:shadow-md transition-shadow"
            >
              <div className="w-14 h-14 rounded-full bg-orange-50 flex items-center justify-center">
                <Icon className="w-6 h-6 text-orange-500" />
              </div>
              <span className="text-2xl font-bold text-gray-900">
                {value.toLocaleString()}
              </span>
                <span className="text-xs text-gray-500 font-medium text-center">
                {label}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <div className="inline-block bg-orange-500 text-white rounded-full px-8 py-3 font-semibold text-sm">
            Number of Registered Users: 853
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
