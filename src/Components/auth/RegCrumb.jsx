import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { HOME_BASE } from "../../config";

const HOME = (HOME_BASE || "").replace(/\/+$/, "");

/**
 * Registration breadcrumb back control.
 *
 * Sits in a white strip above the card's coloured header: "register" links back
 * to the chooser at /register, then a separator and the current form name as
 * plain text.
 */
export default function RegCrumb({ current }) {
  return (
    <a
      href={`${HOME}/register`}
      className="inline-flex items-center gap-1.5 max-w-full rounded-full border border-[#e5e7eb] bg-[#fdf3e3] px-3 py-[7px] text-[12.5px] font-bold leading-tight text-[#b86900] no-underline transition-colors hover:border-[rgba(250,121,1,0.55)] hover:bg-[#fdf0dc] hover:text-[#b86900] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ee9310]"
    >
      <ChevronLeft className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      <span className="underline underline-offset-2">Back</span>
      <ChevronRight className="h-3 w-3 shrink-0 opacity-65" aria-hidden="true" />
      <span className="min-w-0 truncate font-semibold text-[#334155]">{current}</span>
    </a>
  );
}