import PersonalInfo from "../admin/technicianProfile/PersonalInfo";
import TechnicalExpertise from "../admin/technicianProfile/TechnicalExpertise";
import WorkExperience from "../admin/technicianProfile/WorkExperience";
import Certificates from "../admin/technicianProfile/Certificates";
import ProofDocument from "../admin/technicianProfile/ProofDocument";

export default function TechnicianProfile({ userId }) {
    return (
        <div className="w-full mx-auto p-8 space-y-8">
            <h2 className="text-2xl font-bold text-gray-700">Technician Profile</h2>

            <PersonalInfo userId={userId} />

            <TechnicalExpertise userId={userId} />

            <WorkExperience userId={userId} />

            <Certificates userId={userId} />

            <ProofDocument userId={userId} />

        </div>
    );
}