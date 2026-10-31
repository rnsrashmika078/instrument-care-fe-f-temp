import React from "react";
import { Link } from "react-router-dom";
import { HOME_BASE } from "../../config";

export default function InstituteRegistrationSuccess() {
  const backHref = HOME_BASE || "/";

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] px-4 py-8">
      <div className="w-full max-w-[720px] rounded-[20px] border border-[#e5e7eb] bg-white shadow-[0_18px_45px_rgba(15,23,42,0.08)] overflow-hidden">
        <div className="bg-[#0f172a] px-6 py-6 text-center">
          <span className="inline-block rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.08em] text-white">
            Registration Submitted
          </span>
        </div>

        <div className="px-6 py-10 sm:px-12">
          <div className="mb-6 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#dcfce7] text-3xl">
              ✓
            </div>
          </div>

          <h1 className="text-center text-3xl font-extrabold text-[#111827] mb-4">
            Your institute registration was submitted successfully
          </h1>

          <p className="text-center text-base leading-7 text-[#374151] mb-4">
            We have sent a confirmation email to the official institution and focal contact email addresses you provided.
            Please check your inbox and spam/junk folder for further instructions.
          </p>

          <p className="text-center text-base leading-7 text-[#374151] mb-8">
            Once the NID team reviews your request, they will contact you with the next steps and any required follow-up information.
          </p>

          <div className="flex justify-center">
            <Link
              to={backHref}
              className="inline-flex items-center justify-center rounded-[10px] bg-[#EE9310] px-6 py-3 text-base font-bold text-white no-underline transition hover:bg-[#d88106]"
            >
              Go Back
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
