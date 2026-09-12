import BG from '../../assets/images/technician-hero-bg-5.jpg';
import Technician from '../../assets/images/Technician-image-1.jpg';

export default function TechnicianHeader({ searchTerm, setSearchTerm }) {
  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // return (
  //   <section className="relative overflow-hidden">
  //     <div className="absolute inset-0 z-0">
  //       <img src={BG} alt="Background" className="w-full h-full object-cover" />
  //     </div>
  //     <div className="absolute inset-0 bg-white/70 z-10" />

  //     <div className="relative z-20 container mx-auto px-4 pt-8 pb-4 lg:pt-10 lg:pb-6">
  //       <div className="grid lg:grid-cols-2 gap-4 items-center min-h-[50vh]">
  //         {/* Left Content */}
  //         <div className="space-y-4 lg:space-y-12 order-2 lg:order-1">
  //           <p className="text-lg md:text-xl font-medium text-gray-700">
  //             Skilled professionals, passionate about precision and performance.
  //           </p>
  //           <h1 className="text-8xl font-black text-gray-900 mt-10">
  //             Find Your Technicians
  //           </h1>

  //           {/* Search Bar */}
  //           <div className="flex flex-wrap w-full max-w-5xl mx-auto p-2 gap-2">
  //             <div className="flex-1">
  //               <input
  //                 type="text"
  //                 value={searchTerm} // controlled input
  //                 onChange={handleInputChange}
  //                 placeholder="Search Instrument or Technician"
  //                 className="w-full border-2 rounded-md px-4 py-2 focus:outline-none"
  //               />
  //             </div>
  //           </div>
  //         </div>

  //         {/* Right Image */}
  //         <div className="relative order-1 lg:order-2 flex justify-center lg:justify-end">
  //           <div className="relative w-80 h-80 md:w-96 md:h-96 lg:w-[500px] lg:h-[500px]">
  //             <div className="absolute inset-0 rounded-full overflow-hidden shadow-2xl">
  //               <img src={Technician} alt="Technician" className="object-cover w-full h-full" />
  //             </div>
  //             <div className="absolute -inset-4 rounded-full border-2 border-white/30" />
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   </section>
  // );

  return (
    <section className="relative overflow-hidden border-b border-orange-100 bg-[#fffaf5]">
      <div className="absolute inset-0 z-0">
        <img src={BG} alt="Background" className="h-full w-full object-cover" />
      </div>
      <div className="absolute inset-0 z-10 bg-[#fffaf5]/85" />

      <div className="relative z-20 mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <div className="grid items-center gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="order-2 space-y-6 lg:order-1">
            <div className="inline-flex items-center rounded-full border border-orange-200 bg-orange-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-orange-600">
              Trusted service network
            </div>

            <div className="space-y-4">
              <p className="text-base font-medium text-gray-700 md:text-lg">
                Skilled professionals, passionate about precision and performance.
              </p>
              <h1 className="max-w-xl text-4xl font-black leading-tight text-gray-900 sm:text-5xl md:text-6xl lg:text-7xl">
                Find the right technician for your equipment.
              </h1>
            </div>

            <div className="flex flex-wrap gap-3 text-sm text-gray-700">
              <span className="rounded-full border border-gray-200 bg-white px-3 py-1.5 font-medium">
                Verified technicians
              </span>
              <span className="rounded-full border border-gray-200 bg-white px-3 py-1.5 font-medium">
                Fast scheduling
              </span>
              <span className="rounded-full border border-gray-200 bg-white px-3 py-1.5 font-medium">
                Quality support
              </span>
            </div>
          </div>

          <div className="order-1 flex justify-center lg:order-2 lg:justify-end">
            <div className="relative w-full max-w-md rounded-[2rem] border border-orange-200 bg-white p-3 md:p-4">
              <div className="overflow-hidden rounded-[1.5rem] border border-orange-100 bg-orange-50">
                <img
                  src={Technician}
                  alt="Technician"
                  className="h-[330px] w-full object-cover sm:h-[420px]"
                />
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-orange-200 bg-orange-50 p-3">
                  <p className="text-xs font-medium uppercase tracking-[0.12em] text-orange-600">
                    Active
                  </p>
                  <p className="mt-1 text-2xl font-bold text-gray-900">250+</p>
                </div>
                <div className="rounded-2xl border border-orange-200 bg-orange-50 p-3">
                  <p className="text-xs font-medium uppercase tracking-[0.12em] text-orange-600">
                    Rating
                  </p>
                  <p className="mt-1 text-2xl font-bold text-gray-900">4.9/5</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
