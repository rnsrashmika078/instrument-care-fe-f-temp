import React, { useRef } from "react";
import Sudasinghe from '../../assets/images/dg.jpg';
import nilanthi from '../../assets/images/nilanthi.jpg';
import ranjith from '../../assets/images/ranjith.jpg';
import raviraj1 from '../../assets/images/raviraj1.png';
import vitha from '../../assets/images/vitha.jpg';

const cards = [
  {
    image: `${Sudasinghe}`,
    title1: "Dr. S.R.S.N.Sudasinghe",
    title2: "Director General",
    title3: "National Science Foundation",
    description:
      "To strengthen the manufacturing community. To support new partnerships and to help manufacturers with emerging technology...",
  },
  {
    image: `${nilanthi}`,
    title1: "Prof. Nilanthi de Silva",
    title2: "Vice-Chancellor",
    title3: "University of Kelaniya",
    description:
      "We are very happy that the NSF has taken the initiative to establish a database with details of high-end scientific instruments scattered across Sri Lanka in universities and R&D institutions.",
  },
  {
    image: `${ranjith}`,
    title1: "Emeritus Prof. Ranjith Senaratne",
    title2: "Former Vice-Chanceller, University of Ruhuna",
    title3: "Ex-Chair of the National Science Foundation",
    description:
      "Sri Lanka has over 20 state-owned higher education institutions, a comparable number R&D institutions, and several public sector institutions, such as Sri Lanka Atomic Energy Board, Sri Lanka Standard Institute and Board of Investment, which collectively possess  an immense instrument base including high-end equipment",
  },
  {
    image: `${raviraj1}`,
    title1: "Prof. Ravirajan",
    title2: "Dean and Senior Professor",
    title3: "University of Jaffna",
    description:
      "Even though  the scientific community and funding agencies had recognized the need to develop a Database of the Scientific Instruments available in the Higher Educational Institutions (HEIs) in the country a long time ago, it did not materialise until recently.",
  },
  {
    image: `${vitha}`,
    title1: "Prof. Meththika Vithanage",
    title2: "Faculty of Applied Sciences",
    title3: "University of Sri Jayewardenepura",
    description:
      "This NID helps to locate and place advanced analytical instruments required for both research work and commercial testing purposes. Also, this gives information for planning the instrument budget in proposal formulation.  This will serve as a resource pool for sharing equipment, which has gathered scattered information in to a one platform. A much needed initiative executed by NSF.",
  },
  
];

export default function LeaderMessage() {
  const scrollRef = useRef(null);

  const scroll = (scrollOffset) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: scrollOffset,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="relative py-12 px-4 sm:px-6 flex justify-center overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{ backgroundImage: `url('src/assets/images/hero-bg-2.png')` }}
      >
        <div className="w-full h-full backdrop-blur-sm bg-white/50"></div>
      </div>

      {/* Content */}
      <div className="max-w-[1300px] w-full relative z-10">
        <h2 className="text-xl sm:text-5xl font-semibold text-gray-900 mb-6 font-poppins text-center">
          Messages from Leading <span className="text-orange-400">Stakeholders</span>
        </h2>

        {/* Buttons */}
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={() => scroll(-400)}
            className="text-white bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded disabled:opacity-50"
          >
            ← Prev
          </button>
          <button
            onClick={() => scroll(400)}
            className="text-white bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded"
          >
            Next →
          </button>
        </div>

        {/* Horizontal Slider */}
        <div
          ref={scrollRef}
          className="flex overflow-x-auto gap-4 scroll-smooth no-scrollbar"
        >
          {cards.map((card, index) => (
            <div
              key={index}
              className="min-w-[380px] max-w-[380px] min-h-[520px] bg-white shadow-sm rounded-lg p-4 flex-shrink-0 flex flex-col justify-between"
            >
              <div>
                <div className="w-full h-72 bg-gray-100 flex items-center justify-center mb-4">
                  {card.image ? (
                    <img
                      src={card.image}
                      alt={card.title1 || card.title}
                      className="w-full h-72 object-contain"
                    />
                  ) : (
                    <span className="text-5xl">{card.icon}</span>
                  )}
                </div>
                <h3 className="text-md font-semibold text-gray-900 mb-2 leading-snug text-center">
                  {card.title1 && <>{card.title1}<br /></>}
                  {card.title2 && <>{card.title2}<br /></>}
                  {card.title3 && <>{card.title3}<br /></>}
                  {!card.title1 && card.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed text-center">
                  {card.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
