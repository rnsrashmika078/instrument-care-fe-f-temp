import {
  CheckCircle,
  Award,
  Home,
  ArrowUpRight,
  SquareArrowOutUpRight,
  Microscope,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import DefaultProfileImage from "../../assets/images/profile-image.jpeg";
import { fetchWithAuth } from "../utils/api";

export default function TechniciansCard() {
  const [technicians, setTechnicians] = useState([]);
  const navigate = useNavigate();
  const userId = sessionStorage.getItem("user_id");

  useEffect(() => {
    const fetchTechnicians = async () => {
      try {
        const response = await fetchWithAuth(
          "http://localhost/instrument-care-back-end/public/user/dashboard/approved",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch technicians");

        const data = await response.json();
        console.log(data);
        setTechnicians(data);
      } catch (error) {
        console.error("Error fetching technicians:", error);
      }
    };

    fetchTechnicians();
  }, []);

  const handleViewProfile = async (tech_user_id, tech_id) => {
    console.log("tech_id", tech_id);

    const payload = {
      client_id: userId,
      technician_id: tech_user_id,
      search_term: null,
    };

    console.log("Payload to send:", payload);

    try {
      const response = await fetch(`http://localhost/instrument-care-back-end/public/user/dashboard/search`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
        body: JSON.stringify(payload)
      })

      const result = await response.json();
      console.log(result);
      navigate(`/user/view-profile/${tech_id}`);
    }
    catch (error) {
      console.error("Error navigating to profile:", error);
    }

  };



  return (
    <section className="bg-white py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Recently Joined Technicians</h2>
        <div className="grid gap-4 sm:grid-cols-4 lg:grid-cols-4">
          {technicians.length > 0 ? (
            technicians.map((tech, index) => {
              // Use profile_image_url if available, otherwise default local image
              const imageUrl =
                tech.picture !== null
                  ? `http://localhost/instrument-care-back-end/public/${tech.picture}`
                  : DefaultProfileImage;

              return (
                <div
                  key={index}
                  className="bg-[#494949] rounded-3xl p-5 text-white w-full max-w-sm mx-auto shadow-md flex flex-col justify-between min-h-[500px]"
                >
                  <div>
                    <div className="rounded-2xl overflow-hidden mb-4">
                      <img
                        src={imageUrl}
                        alt={tech.first_name + " " + tech.last_name || "No Name"}
                        className="w-full h-64 object-cover rounded-2xl"
                      />
                    </div>

                    <div className="flex items-center justify-between mt-4 text-sm text-white">
                      <div className="text-lg font-semibold flex items-center gap-1">
                        {tech.first_name + " " + tech.last_name || "No Name"}
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      </div>
                      <div className="text-xs font-semibold flex items-center gap-1">
                        {tech.designation || "-"}
                      </div>
                    </div>

                    <p className="text-gray-400 text-sm mt-1">{tech.bio || "-"}</p>

                    <div className="flex flex-col mt-4 text-sm text-gray-400 gap-2">
                      <div className="flex items-center gap-1">
                        <Home className="w-4 h-4" /> {tech.institute_name || "-"}
                      </div>
                      <div className="flex items-center gap-1">
                        <Microscope className="w-4 h-4" /> {tech.instruments || "-"}
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 flex gap-2">
                    {/* <Link to={`/user/view-profile/${tech.id}`}> */}
                    <button className="flex-1 bg-orange-300 text-black font-semibold text-sm py-2 p-3 rounded-full flex items-center justify-center gap-1 hover:bg-gray-100 transition"
                      onClick={() => handleViewProfile(tech.user_id, tech.id)}
                    >
                      View Profile <SquareArrowOutUpRight className="w-3 h-3" />
                    </button>
                    {/* </Link> */}

                    <Link to={`/user/service-request/${tech.id}`}>
                      <button className="flex-1 bg-gray-800 text-white font-semibold text-sm py-2 p-2 rounded-full flex items-center justify-center gap-1 hover:bg-gray-700 transition">
                        Service Request <ArrowUpRight className="w-4 h-4" />
                      </button>
                    </Link>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-center text-gray-500 col-span-4 mt-10">
              No technicians found.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
