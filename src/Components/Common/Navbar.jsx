import React, { useEffect, useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import NationalLogo from "../../assets/images/national-logo.jpg";
import NsfLogo from "../../assets/images/NSF-Logo.jpg";
import { HOME_BASE } from "../../config";

const loginBtnClass =
  "inline-flex items-center justify-center uppercase whitespace-nowrap " +
  "text-[12px] font-semibold tracking-[0.5px] w-[150px] h-[36px] px-[16px] " +
  "rounded-lg border border-[#EE9310] bg-[#FFF7EC] text-[#C96F00] " +
  "hover:bg-[#EE9310] hover:text-white transition-all duration-300";

const techRegisterBtnClass =
  "inline-flex items-center justify-center uppercase whitespace-nowrap " +
  "text-[12px] font-semibold tracking-[0.4px] w-[170px] h-[36px] px-[16px] " +
  "rounded-lg border border-[#EE9310] bg-[#FFF7EC] text-[#C96F00] " +
  "hover:bg-[#EE9310] hover:text-white transition-all duration-300";

const dashboardBtnClass =
  "inline-flex items-center justify-center uppercase whitespace-nowrap " +
  "text-[12px] font-semibold tracking-[0.5px] w-[110px] h-[36px] px-[16px] " +
  "rounded-lg border-none bg-[#EE9310] text-white " +
  "hover:bg-[#d88106] transition-all duration-300";

const CI_BASE = HOME_BASE;

export default function Navbar() {
  const navigate = useNavigate();
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
      label: "Product Category",
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
    ["isLoggedIn", "role", "user_id", "technician_id", "token"].forEach((key) =>
      sessionStorage.removeItem(key),
    );
    setIsLoggedIn(false);
    setDropdownOpen(false);
    setMenuOpen(false);
    window.location.href = HOME_BASE;
    // this is latest
  };

  const renderLinks = (mobile = false) =>
    navLinks.map((link) => {
      const active =
        !link.external &&
        (link.to === "/" ? pathname === "/" : pathname.startsWith(link.to));
      const base =
        "rounded-md transition-colors duration-200 hover:text-[#ea580c] " +
        (mobile ? "text-center py-2.5 text-[14px] w-full " : "text-[14.5px] ");
      const linkClass =
        base +
        (active
          ? " text-[#ea580c] font-semibold bg-[#FFF7EC]"
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
        <div key={link.label} className={mobile ? "w-full" : ""}>
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

  const renderExplore = () => (
    <a
      href={`${CI_BASE}/homedashboard`}
      className={dashboardBtnClass}
      role="button"
      style={{ fontSize: 12.5 }}
    >
      Explore
    </a>
  );

  const renderActions = () =>
    isLoggedIn ? (
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
            className={
              "inline-flex items-center justify-between gap-2 " +
              "min-w-[120px] px-3.5 py-[7px] text-[13px] " +
              "rounded-lg border border-[#EE9310] bg-[#FFF7EC] text-[#C96F00] " +
              "hover:bg-[#EE9310] hover:text-white transition-all duration-300 " +
              "cursor-pointer"
            }
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
    ) : (
      <>
        <Link to="/auth/login" className={loginBtnClass}>
          Login / Register
        </Link>
        <Link
          to="/auth/tech-registration"
          className={techRegisterBtnClass}
          title="Register as a technician / instrument specialist"
        >
          Register as Technician
        </Link>
      </>
    );

  return (
    <nav
      className="w-full bg-white sticky top-0 z-50 border-b border-[#f1f5f9]"
      aria-label="Primary navigation"
    >
      <div
        className="mx-auto w-full flex items-center justify-between min-h-[70px] md:min-h-[80px] px-3 sm:px-6"
        style={{ maxWidth: 1400 }}
      >
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <img
            src={NationalLogo}
            alt="National Logo"
            className="h-12 md:h-14 w-auto object-contain"
          />
          <img
            src={NsfLogo}
            alt="NSF Logo"
            className="h-12 md:h-14 w-auto object-contain"
          />
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

        {/* Desktop: center links + actions */}
        <div className="hidden lg:flex flex-1 items-center justify-between ml-8">
          <div className="flex items-center gap-4 mx-auto">{renderLinks()}</div>
          <div className="flex items-center gap-2">{renderActions()}</div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="lg:hidden w-full border-t border-[#f1f5f9] mt-2 px-3 pb-3 pt-3 flex flex-col items-stretch gap-2 overflow-x-hidden">
          <div className="flex flex-col items-stretch">{renderLinks(true)}</div>
          <div className="mt-1 flex flex-col items-stretch gap-2.5">
            {isLoggedIn ? (
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
                    className="w-full inline-flex items-center justify-center gap-2 h-10 px-4 rounded-lg border border-[#EE9310] bg-[#FFF7EC] text-[#C96F00] font-semibold cursor-pointer"
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
            ) : (
              <>
                <Link to="/auth/login" className={loginBtnClass + " w-full"}>
                  Login / Register
                </Link>
                <Link
                  to="/auth/tech-registration"
                  className={techRegisterBtnClass + " w-full"}
                >
                  Register as Technician
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
