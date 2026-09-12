import React from "react";
import { ShieldCheck, ThumbsUp, Sparkles } from "lucide-react"; // Icons from lucide-react

export default function FeatureCards() {
  return (
    <section className="bg-[#fff4e5] py-5 px-4">
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <div className="bg-[#f78d36] hover:bg-orange-200 hover:text-orange-600 rounded-lg text-white p-6 flex flex-col items-center text-center shadow-md">
          <ShieldCheck className="w-8 h-8 mb-4" />
          <p className="text-lg font-semibold">Professional Expertise</p>
        </div>
        <div className="bg-[#f78d36] hover:bg-orange-200 hover:text-orange-600 rounded-lg text-white p-6 flex flex-col items-center text-center shadow-md">
          <ThumbsUp className="w-8 h-8 mb-4" />
          <p className="text-lg font-semibold">Reliable Service</p>
        </div>
        <div className="bg-[#f78d36] hover:bg-orange-200 hover:text-orange-600 rounded-lg text-white p-6 flex flex-col items-center text-center shadow-md">
          <Sparkles className="w-8 h-8 mb-4" />
          <p className="text-lg font-semibold">Affordable Rates</p>
        </div>
      </div>
    </section>
  );
}
