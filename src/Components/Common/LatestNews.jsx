const LatestNews = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <span className="text-orange-500 font-semibold text-sm uppercase tracking-wider">
              Latest News
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-2 mb-4">
              Explore the Availability of Research Instruments
            </h2>
            <p className="text-gray-500 leading-relaxed mb-6">
              The National Instrument Database enables you to search for research
              instruments available at different institutes. Researchers can now
              quickly and easily identify and locate available instruments
              required for their research experiments.
            </p>
            <a
              href="#"
              className="inline-flex items-center text-orange-500 font-semibold text-sm hover:underline"
            >
              Learn More →
            </a>
          </div>

          <div className="relative">
            <div className="rounded-xl overflow-hidden shadow-lg">
              <img
                src="https://images.unsplash.com/photo-1581093588401-fbb62a02f120?w=600&h=400&fit=crop"
                alt="Research laboratory instruments"
                className="w-full h-72 object-cover"
              />
            </div>
            <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-orange-500/10 rounded-full -z-10" />
            <div className="absolute -top-4 -right-4 w-16 h-16 bg-orange-500/10 rounded-full -z-10" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default LatestNews;
