import { FaPhoneAlt } from "react-icons/fa";
import { Mail } from "lucide-react";
import Bg from '../../assets/images/about-hero-bg.jpg';

export default function ContactSupport() {
  return (
    <div className="relative w-full py-24 px-4 md:px-10 lg:px-20 overflow-hidden font-poppins">
      {/* Background Image with Blur */}
      <div
        className="absolute inset-0 bg-cover bg-center blur-xs brightness-75"
        style={{
          backgroundImage: `url(${Bg})`, // Replace with your image path
          zIndex: 0,
        }}
      ></div>

      {/* Overlay Content */}
      <div className="relative z-10">
        <div className="text-center mb-12">
          <span className="inline-block bg-orange-100 text-orange-500 text-xs font-semibold px-4 py-1 rounded-full mb-4">
            READY TO SUPPORT
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-3">
            Anything unclear or <span className="italic text-orange-400">need help ?</span>
          </h2>
          <p className="text-white text-sm md:text-base">
            Relax, we are ready to support you
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-6 justify-center">
          {/* Contact Us Card */}
          <div className="flex-1 max-w-md bg-white shadow-md rounded-xl p-8 text-center border border-gray-100">
            <div className="text-orange-500 text-4xl mb-4">🎧</div>
            <h3 className="text-xl font-semibold mb-2">Contact Us</h3>
            <p className="text-gray-600 text-sm mb-3">
              Contact us to seek help from us, we will help you as soon as possible
            </p>
            <p className="text-orange-500 font-medium mb-4">+94 (0)11 2 696771</p>
            <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-full text-sm font-medium transition inline-flex items-center justify-center gap-2">
              Call Now <FaPhoneAlt className="text-sm" />
            </button>
          </div>

          {/* Customer Service Card */}
          <div className="flex-1 max-w-md bg-white shadow-md rounded-xl p-8 text-center border border-gray-100">
            <div className="text-orange-500 text-4xl mb-4">✏️</div>
            <h3 className="text-xl font-semibold mb-2">Customer Service</h3>
            <p className="text-gray-600 text-sm mb-3">
              Contact us to seek help from us, we will help you as soon as possible
            </p>
            <p className="text-orange-500 font-medium mb-4">info@nsf.gov.lk</p>
            <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-full text-sm font-medium transition inline-flex items-center justify-center gap-2">
              Contact <Mail className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
