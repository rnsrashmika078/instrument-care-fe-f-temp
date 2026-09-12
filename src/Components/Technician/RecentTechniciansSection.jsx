import { useEffect, useState } from "react";
import {
  CheckCircle,
  Award,
  Home,
  ArrowUpRight,
  SquareArrowOutUpRight,
  Microscope,
} from "lucide-react";
import { Link } from "react-router-dom";
import ProfileImage from "../../assets/images/profile-image.jpeg";
import { API_BASE } from "../../config";

export default function RecentTechniciansSection() {
  const [technicians, setTechnicians] = useState([]);

  useEffect(() => {
    const fetchTechnicians = async () => {
      try {
        const response = await fetch(
          `${API_BASE}/user/dashboard`
        );
        const data = await response.json();

        // 🔀 Shuffle and pick only 6 random items
        const shuffled = data.sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, 6);

        // 🧩 Map backend data to UI structure
        const formattedData = selected.map((item) => ({
          name: item.full_name,
          position: item.current_designation || "Technician",
          title: item.bio || "Experienced technician available for service.",
          followers: item.years_of_experience || 0,
          institute: item.institute_name || "N/A",
          img: item.profile_image_url || ProfileImage,
          caring_instruments: item.caring_instruments,
          certificate_name: item.certificate_name,
        }));

        setTechnicians(formattedData);
      } catch (error) {
        console.error("Failed to fetch technicians:", error);
      }
    };

    fetchTechnicians();
  }, []);

  return (
    <section className="bg-[#1a1a1a] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-white text-3xl font-semibold mb-8 text-center">
          <span className="text-sm font-semibold font-poppins uppercase text-amber-600 bg-orange-200 rounded-full px-4 py-1 inline-block mb-4 tracking-wide">
            ── Recent Available Technicians ──
          </span>
        </h2>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {technicians.map((tech, index) => (
            <div
              key={index}
              className="bg-[#494949] rounded-3xl p-5 text-white w-full max-w-sm mx-auto shadow-md flex flex-col justify-between min-h-[500px]"
            >
              <div>
                {/* Image */}
                <div className="rounded-2xl overflow-hidden mb-4">
                  <img
                    src={tech.img}
                    alt={tech.name}
                    className="w-full h-64 object-cover rounded-2xl"
                  />
                </div>

                {/* Name */}
                <div className="flex items-center justify-between mt-4 text-sm text-white">
                  <div className="text-lg font-semibold flex items-center gap-1">
                    {tech.name}
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  </div>
                  <div className="text-xs font-semibold flex items-center gap-1">
                    {tech.position}
                  </div>
                </div>

                {/* Title */}
                <p className="text-gray-400 text-sm mt-1">{tech.title}</p>

                {/* Stats */}
                <div className="flex flex-col mt-4 text-sm text-gray-400 gap-2">
                      <div className="flex items-center gap-1">
                        <Award className="w-4 h-4" /> {tech.certificate_name || "-"}
                      </div>
                      <div className="flex items-center gap-1">
                        <Home className="w-4 h-4" /> {tech.institute || "-"}
                      </div>
                      <div className="flex items-center gap-1">
                        <Microscope className="w-4 h-4" /> {tech.caring_instruments || "-"}
                      </div>
                    </div>
              </div>

              {/* Buttons */}
              <div className="mt-5 flex gap-2">
                <Link to={'/auth/login'}>
                  <button className="flex-1 bg-orange-300 text-black font-semibold text-sm py-2 p-3 rounded-full flex items-center justify-center gap-1 hover:bg-gray-100 transition">
                    Viwe Profile <SquareArrowOutUpRight className="w-3 h-3" />
                  </button>
                </Link>
                <Link to={'/auth/login'}>
                  <button className="flex-1 bg-gray-800 text-white font-semibold text-sm py-2 p-2 rounded-full flex items-center justify-center gap-1 hover:bg-gray-700 transition">
                    Service Request <ArrowUpRight className="w-4 h-4" />
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
