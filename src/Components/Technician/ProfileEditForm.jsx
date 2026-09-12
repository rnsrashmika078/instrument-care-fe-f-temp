import PersonalInfo from "./PersonalInfo";
import TechnicalExpertise from "./TechnicalExpertise";
import WorkExperience from "./WorkExperience";
import Certificates from "./Certificates";
import ProofDocument from "./ProofDocument";
// import TechnicalExpertiseUpdate from "./TechnicalExpertiseUpdate";

export default function ProfileEditForm() {
  return (
    <div className="w-full mx-auto p-8 space-y-8">
      <h2 className="text-2xl font-bold text-gray-700">Technician Profile</h2>

      <PersonalInfo />

      <TechnicalExpertise />
      {/* <TechnicalExpertiseUpdate /> */}

      <WorkExperience />

      <Certificates />

      <ProofDocument />
    </div>
  );
}
