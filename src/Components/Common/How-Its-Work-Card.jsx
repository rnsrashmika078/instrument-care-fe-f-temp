import React from "react";

const cards = [
  {
    title: "Create Your Profile",
    desc: "Sign up as an Instrument Owner or a Technician. it only takes a minute to get started.",
    icon: "1", // You can replace this with an actual icon/image
  },
  {
    title: "Find the Right Match",
    desc: "Owners can search, filter, and explore technician profiles based on expertise, location, and ratings.",
    icon: "2",
  },
  {
    title: "Send a Service Request",
    desc: "Found a match? Send a Service request with details. The technician reviews and responds accordingly.",
    icon: "3",
  },
  {
    title: "Chat Securely",
    desc: "Discuss the issue through our built-in real-time messaging system. no need for emails or third-party apps.",
    icon: "4",
  },
  {
    title: "Complete the Job Together",
    desc: "Once the service is done, both parties confirm the job is completed. ensuring transparency and trust.",
    icon: "5",
  },
  {
    title: "Rate and Review",
    desc: "After confirmation, owners leave a rating and review to help other users and reward great service.",
    icon: "6",
  },
];

export default function FeatureCards() {
  return (
    <section className="bg-[#f9fbfd] py-16 px-4 text-center">
        <span className="text-sm font-semibold font-poppins uppercase text-amber-600 bg-orange-200 rounded-full px-4 py-1 inline-block mb-4 tracking-wide">
                ── How It Works ──
        </span>
      <div className="max-w-7xl mx-auto grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {cards.map((card, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
          >
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-orange-400 to-orange-600 flex items-center justify-center text-white text-xl mb-4">
              {card.icon}
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2 font-poppins">{card.title}</h3>
            <p className="text-sm text-gray-600 font-poppins">{card.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
