import React, { useRef, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../../Components/Common/Navbar";
import Footer from "../../Components/Common/Footer";
import { API_BASE } from "../../config";

const DURATION_OPTIONS = [
  "Less than 1 year",
  "1 - 3 years",
  "3 - 5 years",
  "More than 5 years",
];

export default function SupervisorConsentPage() {
  const { token } = useParams();

  const [info, setInfo] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(null);
  const [message, setMessage] = useState("");

  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [mobile_number, setMobile] = useState("");
  const [password, setPassword] = useState("");
  // Registering is optional - consent can be given without an account.
  const [createAccount, setCreateAccount] = useState(false);

  const [knows, setKnows] = useState(false);
  const [duration, setDuration] = useState("");
  const [comments, setComments] = useState("");
  const [signature, setSignature] = useState("");
  const [typedName, setTypedName] = useState("");
  const [signatureMode, setSignatureMode] = useState("draw");

  const canvasRef = useRef(null);
  const drawingRef = useRef(false);

  useEffect(() => {
    if (!token) {
      setError("Missing invite link.");
      setLoading(false);
      return;
    }
    const load = async () => {
      try {
        const res = await fetch(`${API_BASE}/supervisor/consent/${token}`);
        const data = await res.json();
        if (!res.ok) {
          setError(data.message || "This invite link is not valid.");
        } else {
          setInfo(data);
          setFirstName((data.supervisor_name || "").split(" ")[0] || "");
          setLastName((data.supervisor_name || "").split(" ").slice(1).join(" ") || "");
          if (data.already_consented) {
            setDone("already");
            setMessage(
              data.invite_status === "consented"
                ? "You have already verified and provided your consent for this technician."
                : "Your response has already been recorded."
            );
          }
        }
      } catch (err) {
        setError("Unable to load the invite. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [token]);

  useEffect(() => {
    if (info && info.supervisor_name) {
      const parts = (info.supervisor_name || "").trim().split(/\s+/);
      setFirstName(parts[0] || "");
      setLastName(parts.slice(1).join(" ") || "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (signatureMode !== "draw") return;
    const cv = canvasRef.current;
    if (!cv) return;

    const resizeCanvas = () => {
      const rect = cv.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const dpr = window.devicePixelRatio || 1;
      const w = Math.round(rect.width * dpr);
      const h = Math.round(rect.height * dpr);
      if (w === cv.width && h === cv.height) return;
      cv.width = w;
      cv.height = h;
      const ctx = cv.getContext("2d");
      ctx.scale(dpr, dpr);
      ctx.lineWidth = 2;
      ctx.lineCap = "round";
      ctx.strokeStyle = "#1f2937";
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    let observer = null;
    if (typeof ResizeObserver !== "undefined") {
      observer = new ResizeObserver(resizeCanvas);
      observer.observe(cv);
    }
    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (observer) observer.disconnect();
    };
  }, [signatureMode, info, loading, error, done]);

  useEffect(() => {
    if (done) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [done]);

  const getPos = (e) => {
    const cv = canvasRef.current;
    const rect = cv.getBoundingClientRect();
    const isTouch = e.touches && e.touches.length > 0;
    const pt = isTouch ? e.touches[0] : e;
    return { x: pt.clientX - rect.left, y: pt.clientY - rect.top };
  };

  const startDraw = (e) => {
    e.preventDefault();
    drawingRef.current = true;
    const ctx = canvasRef.current && canvasRef.current.getContext("2d");
    const p = getPos(e);
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
    setSignature("drawn");
  };

  const moveDraw = (e) => {
    if (!drawingRef.current) return;
    e.preventDefault();
    const ctx = canvasRef.current && canvasRef.current.getContext("2d");
    const p = getPos(e);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
  };

  const endDraw = (e) => {
    e.preventDefault();
    drawingRef.current = false;
    const cv = canvasRef.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    const any = ctx.getImageData(0, 0, cv.width, cv.height).data.some((b) => b !== 0);
    setSignature(any ? "drawn" : "");
  };

  const clearCanvas = () => {
    const cv = canvasRef.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    ctx.clearRect(0, 0, cv.width, cv.height);
    setSignature("");
  };

  const exportSignature = () => {
    if (signatureMode === "type") {
      if (!typedName.trim()) return "";
      return typedName.trim();
    }
    const cv = canvasRef.current;
    if (!cv) return "";
    return cv.toDataURL("image/png");
  };

  const handleSubmit = async () => {
    if (!knows) {
      setMessage("Please tick the checkbox to confirm that you know the technician and that they work under your supervision.");
      return;
    }
    if (!duration) {
      setMessage("Please select how long the technician has been working under your supervision.");
      return;
    }
    const sig = exportSignature();
    if (!sig) {
      setMessage("Please provide your signature (draw it on the pad or type your name).");
      return;
    }
    // Consent itself is mandatory; an account is only created when the supervisor
    // opted in, and then the details must be complete.
    if (createAccount && !info.registered) {
      if (!first_name.trim() || !mobile_number.trim() || password.length < 6) {
        setMessage("Please complete your name, mobile number and a password of at least 6 characters, or untick the account option to submit consent only.");
        return;
      }
    }

    setSubmitting(true);
    setMessage("");
    try {
      const res = await fetch(`${API_BASE}/supervisor/consent/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          create_account: createAccount ? 1 : 0,
          first_name: first_name.trim(),
          last_name: last_name.trim(),
          mobile_number: mobile_number.trim(),
          password,
          knows_person: knows ? 1 : 0,
          relationship_duration: duration,
          comments,
          signature_data: signatureMode === "draw" ? sig : "",
          typed_signature: signatureMode === "type" ? sig : "",
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setDone("done");
        setMessage(data.message || "Consent recorded successfully.");
      } else {
        setMessage(data.message || "Submission failed. Please try again.");
      }
    } catch (err) {
      setMessage("Unable to submit. Please try again later.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-orange-100/70 py-10 px-4">
        <div className="max-w-3xl mx-auto bg-white shadow rounded-xl p-6 md:p-8 space-y-6 border-2 border-gray-200">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800">Supervisor's Consent</h1>
            <p className="text-sm text-gray-500 mt-1">National Instrumentation Database (NID) &middot; Instrument Care</p>
          </div>

          {loading && <p className="text-center text-gray-500">Loading invite details…</p>}

          {error && !loading && (
            <div className="bg-red-50 border border-red-300 text-red-800 rounded-lg p-4 text-sm">{error}</div>
          )}

          {done && (
            <div className="bg-green-50 border border-green-300 text-green-800 rounded-lg p-4 text-sm">
              {message}
            </div>
          )}

          {!loading && !error && !done && info && (
            <>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm space-y-1">
                <p className="font-semibold text-gray-700">The following person has listed you as their supervisor:</p>
                <p><strong>Technician:</strong> {info.technician_name}{info.technician_initials ? ` (${info.technician_initials})` : ""}</p>
                {info.institute_name && <p><strong>Institute:</strong> {info.institute_name}</p>}
                {info.technician_designation && <p><strong>Designation:</strong> {info.technician_designation}</p>}
              </div>

              {!info.registered && (
                <div className="border border-gray-200 rounded-lg p-4 space-y-3 bg-gray-50/50">
                  <h2 className="font-semibold text-gray-800">Supervisor account (optional)</h2>
                  <p className="text-xs text-gray-500">
                    You can provide your consent straight away using the confirmation and signature below &mdash; no
                    account needed. Tick this only if you also want a supervisor account so you can follow this
                    technician&rsquo;s progress later.
                  </p>

                  <label className="flex items-start gap-3 text-sm text-gray-700">
                    <input
                      type="checkbox"
                      checked={createAccount}
                      onChange={(e) => setCreateAccount(e.target.checked)}
                      className="mt-1 accent-orange-600"
                    />
                    <span>
                      Create a supervisor account for me
                      {info.supervisor_email ? (
                        <>
                          {" "}
                          using <strong>{info.supervisor_email}</strong> (your email address)
                        </>
                      ) : null}
                      .
                    </span>
                  </label>

                  {createAccount && (
                    <>
                      <div className="grid md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm text-gray-700 mb-1">Full Name</label>
                          <input
                            type="text"
                            name="first_name"
                            value={`${first_name} ${last_name}`.trim()}
                            onChange={(e) => {
                              const [f, ...rest] = e.target.value.split(/\s+/);
                              setFirstName(f || "");
                              setLastName(rest.join(" ") || "");
                            }}
                            className="border rounded w-full p-2 text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-700 mb-1">Mobile Number</label>
                          <input
                            type="text"
                            value={mobile_number}
                            onChange={(e) => setMobile(e.target.value)}
                            placeholder="07XXXXXXXX"
                            maxLength={10}
                            className="phone-prefix border rounded w-full p-2 text-sm"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm text-gray-700 mb-1">Password</label>
                        <input
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="At least 6 characters"
                          className="border rounded w-full p-2 text-sm"
                        />
                      </div>
                    </>
                  )}
                </div>
              )}

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-3">
                <h2 className="font-semibold text-gray-800">
                  Confirm your supervision <span className="text-xs font-normal text-gray-500">(required)</span>
                </h2>
                <label className="flex items-start gap-3 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={knows}
                    onChange={(e) => setKnows(e.target.checked)}
                    className="mt-1 accent-orange-600"
                  />
                  <span>
                    I confirm that I know <strong>{info.technician_name}</strong> and that they work under my
                    supervision{info.institute_name ? ` at ${info.institute_name}` : ""}.
                  </span>
                </label>

                <div>
                  <label className="block text-sm text-gray-700 mb-1">
                    How long has this person been working under your supervision?
                  </label>
                  <select
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="border rounded w-full p-2 text-sm"
                  >
                    <option value="">Select duration</option>
                    {DURATION_OPTIONS.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-1">Comments (optional)</label>
                  <textarea
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    rows={3}
                    placeholder="Any remarks about the technician’s work, competence, etc."
                    className="border rounded w-full p-2 text-sm"
                  />
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-4 space-y-3">
                <h2 className="font-semibold text-gray-800">
                  Signature <span className="text-xs font-normal text-gray-500">(required)</span>
                </h2>
                <div className="flex gap-4 text-sm">
                  <label className="inline-flex items-center gap-2">
                    <input
                      type="radio"
                      name="sigMode"
                      value="draw"
                      checked={signatureMode === "draw"}
                      onChange={() => setSignatureMode("draw")}
                      className="accent-orange-600"
                    /> Draw signature
                  </label>
                  <label className="inline-flex items-center gap-2">
                    <input
                      type="radio"
                      name="sigMode"
                      value="type"
                      checked={signatureMode === "type"}
                      onChange={() => setSignatureMode("type")}
                      className="accent-orange-600"
                    /> Type name as signature
                  </label>
                </div>

                {signatureMode === "draw" ? (
                  <div>
                    <div className="border border-gray-300 rounded overflow-hidden">
                      <canvas
                        ref={canvasRef}
                        style={{ width: "100%", height: "160px", touchAction: "none" }}
                        onMouseDown={startDraw}
                        onMouseMove={moveDraw}
                        onMouseUp={endDraw}
                        onMouseLeave={endDraw}
                        onTouchStart={startDraw}
                        onTouchMove={moveDraw}
                        onTouchEnd={endDraw}
                      />
                    </div>
                    <button type="button" onClick={clearCanvas} className="text-orange-600 text-xs mt-1 hover:underline">
                      Clear
                    </button>
                  </div>
                ) : (
                  <input
                    type="text"
                    value={typedName}
                    onChange={(e) => setTypedName(e.target.value)}
                    placeholder="Type your full name"
                    className="border rounded w-full p-2 text-sm"
                  />
                )}
                <p className="text-xs text-gray-400">{info.technician_name ? `Signing as supervisor of ${info.technician_name}.` : ""}</p>
              </div>

              {message && !done && (
                <div className="bg-amber-50 border border-gray-300 text-amber-800 rounded-lg p-3 text-sm">{message}</div>
              )}

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="bg-orange-600 text-white px-6 py-2.5 rounded-lg hover:bg-orange-500 disabled:opacity-60"
                >
                  {submitting ? "Submitting…" : "Submit Consent"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}