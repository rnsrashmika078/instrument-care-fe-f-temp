import { ChevronLeft, ChevronRight, Quote } from "lucide-react";

const stakeholders = [
  {
    name: "Prof. Mahanama de Silva",
    title: "Vice-Chancellor",
    institute: "University of Peradeniya",
    message:
      "We are proud to contribute to the national instrument database with our extensive collection of research instruments across multiple faculties.",
  },
  {
    name: "Prof. Nilanthi Bandara",
    title: "Former Vice-Chancellor",
    institute: "University of Ruhuna",
    message:
      "This initiative helps bridge the gap between institutions, enabling resource sharing and collaborative research across Sri Lanka.",
  },
  {
    name: "Prof. Kapila Senarath",
    title: "Dean, Faculty of Science",
    institute: "University of Jaffna",
    message:
      "The platform significantly reduces duplication of expensive equipment purchases while maximizing utilization of existing resources.",
  },
];

const Stakeholders = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            Messages from Leading Stakeholders
          </h2>
          <div className="flex gap-2">
            <button className="w-9 h-9 rounded-full border border-gray-200 bg-white flex items-center justify-center hover:border-orange-500 transition-colors">
              <ChevronLeft className="w-4 h-4 text-gray-900" />
            </button>
            <button className="w-9 h-9 rounded-full border border-gray-200 bg-white flex items-center justify-center hover:border-orange-500 transition-colors">
              <ChevronRight className="w-4 h-4 text-gray-900" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stakeholders.map((person) => (
            <div
              key={person.name}
              className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-md transition-shadow"
            >
              <Quote className="w-8 h-8 text-orange-500/30 mb-3" />
              <p className="text-gray-500 text-sm leading-relaxed mb-5">
                {person.message}
              </p>
              <div className="border-t border-gray-200 pt-4">
                <p className="font-semibold text-sm text-gray-900">{person.name}</p>
                <p className="text-xs text-gray-500">{person.title}</p>
                <p className="text-xs text-orange-500">{person.institute}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stakeholders;
