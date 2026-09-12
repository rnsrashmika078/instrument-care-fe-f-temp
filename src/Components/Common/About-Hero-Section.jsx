import React from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import AboutHeroImage from "../../assets/images/about-hero-bg-2.jpg";

export default function AboutHero() {
  return (
    <section className="relative bg-cover bg-center py-20 px-4 overflow-hidden">
      {/* Background Image + Blur */}
      <div className="absolute inset-0">
        <img
          src={AboutHeroImage}
          alt="Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-white/40 backdrop-blur-xs" />
      </div>

      {/* Content Wrapper */}
      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6">
        {/* Heading and Intro */}
        <div className="text-center">
          <h1 className="text-3xl md:text-5xl font-bold leading-tight text-[#1B1B1D] font-poppins">
            We Are Revolutionizing{" "}
            <span className="text-[#e78f0c]">Scientific Instrument Repairs</span>{" "}
            Through Technology
          </h1>
          <p className="text-gray-600 mt-4 text-base leading-relaxed max-w-4xl mx-auto font-poppins">
            It’s no longer acceptable for scientific progress to stall due to faulty equipment. Instrument Care System bridges the gap between instrument owners and skilled technicians through an intelligent, secure, and streamlined platform designed for the scientific community.
          </p>
        </div>

        {/* Vision and Mission - Side-by-side Cards with Top-Centered Icon & Title */}
        <div className="mt-12 grid md:grid-cols-2 gap-8">
          {/* Mission Card */}
          <div className="bg-white/70 shadow-xl border-l-4 border-orange-400 rounded-xl p-6 flex flex-col items-center text-center">
            <div className="flex flex-col items-center mb-4">
              {/* <div className="bg-orange-500 text-white p-4 rounded-full mb-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M5 13l4 4L19 7" />
                </svg>
              </div> */}
              <h4 className="text-xl font-bold text-gray-900 font-poppins">Our Mission</h4>
            </div>
            <p className="text-sm text-gray-700 font-poppins leading-relaxed">
              To empower labs, researchers, and organizations by providing a fast, reliable, and transparent system for repairing and maintaining scientific instruments.
            </p>
          </div>

          {/* Vision Card */}
          <div className="bg-white/70 shadow-xl border-l-4 border-yellow-400 rounded-xl p-6 flex flex-col items-center text-center">
            <div className="flex flex-col items-center mb-4">
              {/* <div className="bg-yellow-500 text-white p-4 rounded-full mb-2">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M12 20l9-5-9-5-9 5 9 5z" />
                </svg>
              </div> */}
              <h4 className="text-xl font-bold text-gray-900 font-poppins">Our Vision</h4>
            </div>
            <p className="text-sm text-gray-700 font-poppins leading-relaxed">
              To be the leading digital ecosystem for scientific instrument care, where every broken device finds the right expert, without delay.
            </p>
          </div>
        </div>

        {/* CTA Button */}
        <div className="mt-10 text-center">
          <Link to="https://nid.nsf.gov.lk/">
            <button className="bg-[#ee8828] text-white px-6 py-3 rounded-full flex items-center gap-2 hover:bg-[#ff9900] transition mx-auto font-poppins">
              Explore More <ArrowRight size={18} />
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
