import React from "react";
import {
  Drill,
  ArrowLeftRight,
  Merge,
  Star,
  UserRoundCog,
  ShieldUser,
} from "lucide-react"; // Lucide icons

export default function Services() {
  return (
    <section className="bg-[#0e1624] text-white py-16 px-4">
      <div className="max-w-6xl mx-auto text-center mb-12">
        <span className="text-sm font-semibold px-3 py-1 rounded-full bg-white/10 text-white tracking-wide">
          SERVICES
        </span>
        <h2 className="text-3xl md:text-4xl font-semibold mt-4">
          Explore our comprehensive range <br className="hidden md:block" />
          of professional services
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 max-w-6xl mx-auto text-center">
        <div>
          <Drill className="mx-auto mb-4 w-8 h-8" />
          <h3 className="text-lg font-semibold mb-2">Technician Discovery</h3>
          <p className="text-sm text-gray-300">
            Easily search and connect with certified scientific instrument
            technicians based on specialization, location, and customer reviews.
          </p>
        </div>

        <div>
          <ArrowLeftRight className="mx-auto mb-4 w-8 h-8" />
          <h3 className="text-lg font-semibold mb-2">Service Request Management</h3>
          <p className="text-sm text-gray-300">
            Send service requests directly to technicians, monitor job status, 
            manage all ongoing and past repairs from a single dashboard.
          </p>
        </div>

        <div>
          <Merge className="mx-auto mb-4 w-8 h-8" />
          <h3 className="text-lg font-semibold mb-2">Job Progress Tracking</h3>
          <p className="text-sm text-gray-300">
            Monitor the status of each service request from initiation to completion.
            Both parties must confirm before a job is officially closed.
          </p>
        </div>

        <div>
          <Star className="mx-auto mb-4 w-8 h-8" />
          <h3 className="text-lg font-semibold mb-2">Ratings & Reviews</h3>
          <p className="text-sm text-gray-300">
            Leave feedback and rate the technician once the service is complete.
            Help others make informed decisions based on your experience.
          </p>
        </div>

        <div>
          <UserRoundCog className="mx-auto mb-4 w-8 h-8" />
          <h3 className="text-lg font-semibold mb-2">Profile Management</h3>
          <p className="text-sm text-gray-300">
            Technicians can manage their profiles by adding skills, certifications,
            and experience to build trust and attract more service requests.
          </p>
        </div>

        <div>
          <ShieldUser className="mx-auto mb-4 w-8 h-8" />
          <h3 className="text-lg font-semibold mb-2">Admin Oversight & Dispute Handling</h3>
          <p className="text-sm text-gray-300">
            System admins supervise all user activities and can take action
            in case of issues or disputes, ensuring platform fairness and safety.
          </p>
        </div>
      </div>
    </section>
  );
}
