import { Search, FlaskConical, Microscope, Cpu, Zap, Beaker, Waves, Atom, TestTube } from "lucide-react";
import { useState } from "react";

const categories = [
  { icon: FlaskConical, label: "Coffee" },
  { icon: Microscope, label: "Milk" },
  { icon: Cpu, label: "Particle/cell" },
  { icon: Zap, label: "Force" },
  { icon: Beaker, label: "Chemicals" },
  { icon: Waves, label: "Wavelength" },
  { icon: Atom, label: "Material" },
  { icon: TestTube, label: "Others" },
];

const CategorySearch = () => {
  const [filterQuery, setFilterQuery] = useState("");

  return (
    <section className="bg-gray-200 py-10">
      <div className="max-w-5xl mx-auto px-4">
         <h2 className="text-center text-gray-900 font-semibold text-lg mb-2">
          Discover Institutes to Test Your Products
        </h2>
        <p className="text-center text-gray-500 text-sm mb-6">Popular Products</p>

        <div className="flex flex-wrap justify-center gap-6 mb-6">
          {categories.map(({ icon: Icon, label }) => (
            <button
              key={label}
              className="flex flex-col items-center gap-1.5 group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-full bg-white border border-gray-200 flex items-center justify-center group-hover:border-orange-500 group-hover:bg-orange-50 transition-colors">
                <Icon className="w-5 h-5 text-gray-400 group-hover:text-orange-500 transition-colors" />
              </div>
              <span className="text-xs text-gray-500 group-hover:text-gray-900 transition-colors">
                {label}
              </span>
            </button>
          ))}
        </div>

         <div className="flex items-center bg-white rounded-full shadow-sm border border-gray-200 overflow-hidden max-w-xl mx-auto">
          <div className="flex-1 flex items-center px-5">
           <Search className="w-4 h-4 text-gray-400 shrink-0" />
            <input
              type="text"
              placeholder="Search Product Category/Service/Lab/Instrument Name..."
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              className="w-full py-3 px-3 bg-transparent outline-none text-gray-900 placeholder:text-gray-400 text-sm"
            />
          </div>
          <button className="bg-orange-500 text-white px-6 py-3 font-semibold text-sm hover:bg-orange-600 transition-colors">
            Search
          </button>
        </div>

        <p className="text-center mt-3">
           <a href="#" className="text-orange-500 text-sm font-medium hover:underline">
            See All Categories →
          </a>
        </p>
      </div>
    </section>
  );
};

export default CategorySearch;
