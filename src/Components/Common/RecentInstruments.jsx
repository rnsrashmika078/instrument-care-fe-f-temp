import { ChevronLeft, ChevronRight } from "lucide-react";

const instruments = [
  {
    name: "Gas Chromatography Mass Spectrometer (GCMS)",
    institute: "Industrial Technology Institute",
    image: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=400&h=300&fit=crop",
  },
  {
    name: "ICP-OES Spectrophotometer",
    institute: "National Institute of Fundamental Studies",
    image: "https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?w=400&h=300&fit=crop",
  },
  {
    name: "Microwave Digestion System",
    institute: "Industrial Technology Institute",
    image: "https://images.unsplash.com/photo-1576086213369-97a306d36557?w=400&h=300&fit=crop",
  },
  {
    name: "Brookfield Water Resistance Tester",
    institute: "National Institute of Fundamental Studies",
    image: "https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=400&h=300&fit=crop",
  },
];

const RecentInstruments = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            Recently Added Instruments
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {instruments.map((item) => (
            <div
              key={item.name}
              className="bg-white rounded-lg overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow group cursor-pointer"
            >
              <div className="h-48 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-sm text-gray-900 line-clamp-2 mb-1">
                  {item.name}
                </h3>
                <p className="text-xs text-gray-500">{item.institute}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RecentInstruments;
