import { Search } from "lucide-react";
import { useState } from "react";
import heroBg from "../../assets/images/hero-lab.jpg";

const HeroSection = () => {
  const [query, setQuery] = useState("");

  return (
    <section className="relative min-h-[420px] flex items-center justify-center overflow-hidden">
      <img
        src={heroBg}
        alt="Laboratory instruments"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/50" />

      <div className="relative z-10 text-center px-4 py-16 max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
          National Instrument Database
        </h1>
        <p className="text-white/80 text-lg mb-8">
          Search across research instruments available at institutes nationwide
        </p>

        <div className="flex items-center bg-white rounded-full shadow-lg overflow-hidden max-w-xl mx-auto">
          <div className="flex-1 flex items-center px-5">
            <Search className="w-5 h-5 text-gray-400 shrink-0" />
            <input
              type="text"
              placeholder="Search instruments, categories, or institutes..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full py-3.5 px-3 bg-transparent outline-none text-gray-900 placeholder:text-gray-400 text-sm"
            />
          </div>
          <button className="bg-orange-500 text-white px-7 py-3.5 font-semibold text-sm hover:bg-orange-600 transition-colors">
            Search
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
