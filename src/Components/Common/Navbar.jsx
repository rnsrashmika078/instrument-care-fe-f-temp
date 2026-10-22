import React, { useEffect, useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
/* Tracked asset, so it resolves on every build host. A byte-identical copy of
   instrument/catalogUploads/nsf_logo.png can replace this once that file is
   actually deployed - importing it while it was untracked broke the Linux
   build with "Could not resolve .../nsf_logo.png". */
import NsfLogo from "../../assets/images/NSF-Logo.jpg";
import { doFullLogout } from "../auth/Logout";
import { HOME_BASE } from "../../config";

/* These mirror the .login-btn / .dashboard-btn / .register-btn rules in
   instrument/application/views/home/partials/navbar_v2.php, so the navbar
   renders identically in both apps. Palette comes from
   instrument/layout/css/theme.css (--c-primary, --c-primary-hover,
   --c-primary-ghost, --c-primary-ghost-fg, --c-primary-ghost-alt). */
const loginBtnClass =
  "inline-flex items-center justify-center uppercase whitespace-nowrap " +
  "font-semibold tracking-[0.5px] text-[12px] h-[43px] rounded-lg " +
  "min-w-[96px] px-[12px] border border-[#e5e7eb] bg-[#FFF7EC] text-[#C96F00] " +
  "max-[575.98px]:h-12 " +
  "hover:bg-[#fa7901] hover:text-white transition-all duration-300";

/* Mirrors .register-btn in navbar_v2.php - neutral pale fill, brand text. */
const registerBtnClass =
  "inline-flex items-center justify-center uppercase whitespace-nowrap " +
  "font-semibold tracking-[0.5px] text-[12px] h-[43px] rounded-lg " +
  "min-w-[96px] px-[12px] border border-[#e5e7eb] bg-[#f8f8f8] text-[#fa7901] " +
  "max-[575.98px]:h-12 " +
  "hover:bg-[#fa7901] hover:text-white transition-all duration-300";

/* Temporarily hidden - used by the commented-out "Register as Technician" buttons.
const techRegisterBtnClass =
  "inline-flex items-center justify-center uppercase whitespace-nowrap " +
  "font-semibold tracking-[0.4px] text-[12px] h-[43px] rounded-lg " +
  "min-w-[150px] px-[12px] border border-[#e5e7eb] bg-[#FFF7EC] text-[#C96F00] " +
  "max-[575.98px]:h-12 overflow-hidden text-ellipsis " +
  "hover:bg-[#fa7901] hover:text-white transition-all duration-300";
*/

const dashboardBtnClass =
  "inline-flex items-center justify-center uppercase whitespace-nowrap " +
  "font-semibold tracking-[0.5px] text-[12px] h-[43px] rounded-lg " +
  "min-w-[96px] px-[12px] border border-none bg-[#fa7901] text-white " +
  "max-[575.98px]:h-12 " +
  "hover:bg-[#d88106] transition-all duration-300";

/* Mirrors .register-btn.user-dropdown-toggle - neutral pale fill, brand text. */
const accountBtnClass =
  "inline-flex items-center justify-center uppercase whitespace-nowrap " +
  "font-semibold tracking-[0.5px] text-[12px] rounded-lg " +
  "min-w-[130px] px-3 py-2 border border-[#e5e7eb] bg-[#f8f8f8] text-[#fa7901] " +
  "max-[575.98px]:h-12 " +
  "hover:bg-[#fa7901] hover:text-white transition-all duration-300";

const CI_BASE = HOME_BASE;

export default function Navbar() {
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const readSession = () => {
    setIsLoggedIn(!!sessionStorage.getItem("user_id"));
  };

  useEffect(() => {
    readSession();
    window.addEventListener("storage", readSession);
    return () => window.removeEventListener("storage", readSession);
  }, []);

  useEffect(() => {
    readSession();
  }, [pathname]);

  const navLinks = [
    { label: "Home", to: `${CI_BASE}/home`, external: true },
    {
      label: "Testing Service",
      to: `${CI_BASE}/eproductView`,
      external: true,
    },
    { label: "Institutes", to: `${CI_BASE}/einstituteView`, external: true },
    { label: "Laboratories", to: `${CI_BASE}/elaboratories`, external: true },
    { label: "Contact", to: "/contact" },
  ];

  const dashboardPath = (() => {
    const role = sessionStorage.getItem("role");
    if (role === "1") return "/admin/dashboard";
    if (role === "10") return "/tech/dashboard";
    return "/user/dashboard";
  })();

  const handleLogout = () => {
    // Logs out of both inst-care AND the instrument (CodeIgniter) session.
    doFullLogout();
    setIsLoggedIn(false);
    setDropdownOpen(false);
    setMenuOpen(false);
    // window.location.href = HOME_BASE is handled inside doFullLogout
  };

  const renderLinks = (mobile = false) =>
    navLinks.map((link) => {
      const active =
        !link.external &&
        (link.to === "/" ? pathname === "/" : pathname.startsWith(link.to));
      /* Matches .navbar .nav-link: 15px / weight 500 / #374151, hover + active
         #ea580c, active weight 600. The pale fill on active is mobile-only in
         CI (below 1200px), so it is not applied on desktop.
         px-2 supplies the 8px side padding that Bootstrap's
         .navbar-expand-xl .navbar-nav .nav-link adds from 1200px up, which
         together with the mx-2 wrapper gives CI's 32px text-to-text gap. */
      const base =
        "rounded-md transition-colors duration-200 hover:text-[#ea580c] " +
        (mobile
          ? "text-center py-[11px] px-2 text-[16px] w-full "
          : "text-[15px] px-2 ");
      const linkClass =
        base +
        (active
          ? ` text-[#ea580c] font-semibold${mobile ? " bg-[#FFF7EC]" : ""}`
          : " text-[#374151] font-medium");

      const content = (
        <span
          className="inline-flex items-center"
          style={{ letterSpacing: "0.2px" }}
        >
          {link.label}
        </span>
      );

      return (
        <div key={link.label} className={mobile ? "w-full" : "mx-2"}>
          {link.external ? (
            <a href={link.to} className={linkClass}>
              {content}
            </a>
          ) : (
            <Link
              to={link.to}
              onClick={() => {
                if (mobile) setMenuOpen(false);
              }}
              className={linkClass}
            >
              {content}
            </Link>
          )}
        </div>
      );
    });

  /* CI renders .dashboard-btn for every visitor, not just logged-in ones, and
     points non-technicians at homedashboard. Same target and label here. */
  const renderDashboard = () => (
    <a href={`${CI_BASE}/homedashboard`} className={dashboardBtnClass} role="button">
      Dashboard
    </a>
  );

  const renderActions = () =>
    isLoggedIn ? (
      <>
        {renderDashboard()}
        <div className="relative">
          {dropdownOpen && (
            <div
              className="fixed inset-0 z-10"
              onClick={() => setDropdownOpen(false)}
            />
          )}
          <div className="relative z-20">
            <button
              type="button"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              aria-haspopup="true"
              aria-expanded={dropdownOpen}
              className={accountBtnClass + " cursor-pointer justify-between"}
            >
              <span className="truncate">My Account</span>
              <ChevronDown
                size={16}
                className={
                  dropdownOpen
                    ? "rotate-180 transition-transform"
                    : "transition-transform"
                }
              />
            </button>

          {dropdownOpen && (
                <div className="absolute right-0 top-full mt-3 min-w-[210px] p-2 bg-white border border-black/10 rounded-[10px] shadow-[0_10px_26px_rgba(0,0,0,0.1)] flex flex-col">
                  <Link
                    to={dashboardPath}
                    onClick={() => {
                      setDropdownOpen(false);
                      setMenuOpen(false);
                    }}
                    className="px-3.5 py-2.5 rounded-md text-[14.5px] font-medium text-[#2f2a26] transition-colors duration-200 hover:bg-[#FFF7EC] hover:text-[#C96F00]"
                  >
                    Dashboard
                  </Link>
                  <div className="my-1.5 h-px bg-[#f0eadf]"></div>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="text-left px-3.5 py-2.5 rounded-md text-[14.5px] font-medium text-[#dc2626] transition-colors duration-200 hover:bg-[#fef2f2] hover:text-[#b91c1c] cursor-pointer"
                  >
                    Logout
</button>
                </div>
              )}
            </div>
          </div>
      </>
    ) : (
      <>
        {renderDashboard()}
        <Link to="/auth/login" className={loginBtnClass}>
          Login
        </Link>
        <a href={`${CI_BASE}/register`} className={registerBtnClass}>
          Register
        </a>
        {/* Temporarily hidden - reachable from the registration tabs instead.
        <Link
          to="/auth/tech-registration"
          className={techRegisterBtnClass}
          title="Register as a technician / instrument specialist"
        >
          Register as Technician
        </Link>
        */}
      </>
    );

  return (
    <nav
      className="w-full bg-white sticky top-0 z-50 border-b border-[#f1f5f9]"
      aria-label="Primary navigation"
    >
      <div
        className="mx-auto w-full flex items-center justify-between min-h-[70px] min-[576px]:min-h-[80px] px-3 sm:px-6"
        style={{ maxWidth: 1400 }}
      >
        {/* Logo - CI sizes .navbar-brand img to 46px, growing to 52px below 576px */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <img
            src={NsfLogo}
            alt="NSF Logo"
            className="h-[46px] max-[575.98px]:h-[52px] w-auto object-contain"
          />
          <span className="sr-only">
            Official National Science Foundation instrument database
          </span>
        </Link>

        {/* Toggler */}
        <button
          type="button"
          className="lg:hidden text-[#111827] p-1.5 cursor-pointer"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>

        {/* Desktop: center links + actions. CI uses .navbar-brand margin-right:16px and mx-2 per nav item. */}
        <div className="hidden lg:flex flex-1 items-center justify-between ml-4">
          <div className="flex items-center mx-auto">{renderLinks()}</div>
          <div className="flex items-center gap-2">{renderActions()}</div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="lg:hidden w-full border-t border-[#f1f5f9] mt-2 px-3 pb-3 pt-3 flex flex-col items-stretch gap-2 overflow-x-hidden">
          <div className="flex flex-col items-stretch">{renderLinks(true)}</div>
          <div className="mt-1 flex flex-col items-stretch gap-2.5">
            {isLoggedIn ? (
              <>
                <a
                  href={`${CI_BASE}/homedashboard`}
                  className={dashboardBtnClass + " w-full"}
                  role="button"
                >
                  Dashboard
                </a>
                <div className="relative">
                  {dropdownOpen && (
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setDropdownOpen(false)}
                    />
                  )}
                  <div className="relative z-20 flex flex-col">
                    <button
                      type="button"
                      onClick={() => setDropdownOpen(!dropdownOpen)}
                      aria-haspopup="true"
                      aria-expanded={dropdownOpen}
                      className={accountBtnClass + " w-full cursor-pointer"}
                    >
                      My Account
                      <ChevronDown size={16} />
                    </button>
                    {dropdownOpen && (
                      <div className="mt-1.5 p-2 bg-white border border-black/10 rounded-[10px] shadow-[0_10px_26px_rgba(0,0,0,0.1)] flex flex-col">
                        <Link
                          to={dashboardPath}
                          onClick={() => {
                            setDropdownOpen(false);
                            setMenuOpen(false);
                          }}
                          className="px-3.5 py-2.5 rounded-md text-[14.5px] font-medium text-[#2f2a26] transition-colors duration-200 hover:bg-[#FFF7EC] hover:text-[#C96F00]"
                        >
                          Dashboard
                        </Link>
                        <div className="my-1.5 h-px bg-[#f0eadf]"></div>
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="text-left px-3.5 py-2.5 rounded-md text-[14.5px] font-medium text-[#dc2626] transition-colors duration-200 hover:bg-[#fef2f2] hover:text-[#b91c1c] cursor-pointer"
                        >
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <>
                <a
                  href={`${CI_BASE}/homedashboard`}
                  className={dashboardBtnClass + " w-full"}
                  role="button"
                >
                  Dashboard
                </a>
                <Link to="/auth/login" className={loginBtnClass + " w-full"}>
                  Login
                </Link>
                <a
                  href={`${CI_BASE}/register`}
                  className={registerBtnClass + " w-full"}
                >
                  Register
                </a>
                {/* Temporarily hidden - reachable from the registration tabs instead.
                <Link
                  to="/auth/tech-registration"
                  className={techRegisterBtnClass + " w-full"}
                >
                  Register as Technician
                </Link>
                */}
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
