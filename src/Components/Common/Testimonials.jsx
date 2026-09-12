import React from "react";

const testimonials = [
  {
    name: "Dr. Nadeesha Perera",
    title: "University of Colombo",
    image: "https://i.pravatar.cc/150?img=1",
    content:
      "The technician responded within minutes and handled my lab equipment with great care. Everything was fixed faster than I expected. Totally recommend this platform!",
  },
  {
    name: "Chaminda Silva",
    title: "Research Engineer",
    image: "https://i.pravatar.cc/150?img=2",
    content:
      "From sending the request to confirming completion, the whole system was seamless. I really liked the real-time chat feature very convenient!",
  },
  {
    name: "Anusha Jayasuriya",
    title: "Lab Manager",
    image: "https://i.pravatar.cc/150?img=3",
    content:
      "I was initially unsure about using an online service, but the technician was polite, on time, and explained everything clearly. Will definitely use it again.",
  },
];

export default function TestimonialSection() {
  return (
    <section className="bg-[#f9fafb] py-16 px-4 sm:px-6 lg:px-20 relative overflow-hidden">
      <div className="text-center max-w-4xl mx-auto mb-12">
        <p className="text-sm text-orange-400 font-semibold uppercase tracking-wide mb-2">
          Testimonials
        </p>
        <h2 className="text-4xl font-bold text-gray-900 mb-2">
          What Institute <em className="italic text-gray-900">said</em>
        </h2>
        <p className="text-gray-500">Real experiences from scientists and professionals who trust us to keep their instruments running smoothly.</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((testimonial, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-sm p-6 flex flex-col justify-between"
          >
            <div>
              <div className="text-yellow-400 text-xl mb-2">★★★★★</div>
              <p className="text-gray-800 mb-6">{testimonial.content}</p>
            </div>
            <div className="flex items-center gap-4 bg-orange-500 text-white p-4 rounded-b-lg -mx-6 mt-auto">
              <img
                src={testimonial.image}
                alt={testimonial.name}
                className="w-10 h-10 rounded-full"
              />
              <div>
                <p className="font-semibold">{testimonial.name}</p>
                <p className="text-sm">{testimonial.title}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows (Non-functional, just styled) */}
      {/* <div className="absolute right-10 transform -translate-y-1/2 flex gap-3">
        <button className="w-9 h-9 rounded-full bg-white border border-gray-300 text-gray-500 shadow-md">
          ←
        </button>
        <button className="w-9 h-9 rounded-full bg-orange-500 text-white shadow-md">
          →
        </button>
      </div> */}
    </section>
  );
}
