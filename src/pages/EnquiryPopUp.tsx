import { useEffect, useRef, useState, type FormEvent } from "react";
import { CheckCircle2, Send, X } from "lucide-react";

// Shows 10 seconds after a page loads, then every 2 minutes until the visitor submits.
// Returning to the tab shows it again after 3 seconds.
const FIRST_DELAY_MS = 10_000;
const REPEAT_DELAY_MS = 120_000;
const RETURN_DELAY_MS = 3_000;
const SUBMITTED_KEY = "arihant-enquiry-submitted";

interface Form { name: string; phone: string; email: string }

const buildMessage = (f: Form): string =>
  `Hello Arihant Electricals, my name is ${f.name.trim() || "[your name]"}. ` +
  `Please contact me to arrange a free site survey and a solar estimate, including PM Surya Ghar subsidy guidance.`;

const STYLE = `
.enq-overlay { position:fixed; inset:0; z-index:100; background:rgba(7,40,64,.6); backdrop-filter:blur(4px); display:flex; align-items:center; justify-content:center; padding:14px; font-family:"Manrope","Segoe UI",Roboto,Arial,sans-serif; animation:enqFade .25s ease both; }
.enq { position:relative; width:100%; max-width:440px; background:#fff; color:#0F2A3F; border-radius:20px; box-shadow:0 30px 80px rgba(3,105,161,.4); overflow:hidden; animation:enqPop .35s ease both; }
.enq-head { background:linear-gradient(135deg,#0369A1,#0EA5E9); color:#fff; padding:18px 22px; }
.enq-head small { display:block; font-size:11px; font-weight:800; letter-spacing:.14em; text-transform:uppercase; color:#FDE68A; }
.enq-head h2 { margin:4px 0 0; font-size:20px; font-weight:800; line-height:1.2; color:#fff; }
.enq-x { position:absolute; top:12px; right:12px; width:32px; height:32px; border-radius:50%; border:0; background:rgba(255,255,255,.22); color:#fff; display:flex; align-items:center; justify-content:center; cursor:pointer; }
.enq-x:hover { background:rgba(255,255,255,.35); }
.enq-body { padding:18px 22px 20px; }
.enq-field { display:flex; flex-direction:column; gap:5px; margin-bottom:11px; }
.enq-field label { font-size:13px; font-weight:700; color:#0F2A3F; }
.enq-field input, .enq-field textarea { font:inherit; font-size:14.5px; color:#0F2A3F; background:#fff; border:1.5px solid #CFE5F1; border-radius:11px; padding:10px 12px; outline:none; transition:border-color .2s, box-shadow .2s; }
.enq-field input:focus, .enq-field textarea:focus { border-color:#0EA5E9; box-shadow:0 0 0 4px rgba(14,165,233,.18); }
.enq-field textarea { min-height:70px; resize:none; line-height:1.45; }
.enq-err { color:#B91C1C; font-size:13px; font-weight:700; background:#FEF2F2; border-radius:10px; padding:8px 12px; margin-bottom:10px; }
.enq-submit { width:100%; border:0; border-radius:12px; padding:13px; background:#0369A1; color:#fff; font:inherit; font-weight:800; font-size:15.5px; display:flex; align-items:center; justify-content:center; gap:8px; cursor:pointer; box-shadow:0 10px 22px rgba(3,105,161,.35); transition:background .2s; }
.enq-submit:hover:not(:disabled) { background:#075985; }
.enq-submit:disabled { opacity:.7; cursor:wait; }
.enq-later { display:block; width:100%; margin-top:6px; background:none; border:0; color:#4B5D6E; font:inherit; font-weight:700; font-size:13.5px; cursor:pointer; padding:6px; }
.enq-later:hover { color:#0369A1; }
.enq-done { text-align:center; padding:26px 22px 28px; }
.enq-done svg { color:#0EA5E9; }
.enq-done h3 { font-size:21px; color:#075985; margin:10px 0 6px; }
.enq-done p { color:#4B5D6E; margin:0; line-height:1.6; font-size:14.5px; }
@keyframes enqFade { from { opacity:0; } to { opacity:1; } }
@keyframes enqPop { from { opacity:0; transform:translateY(16px) scale(.97);} to { opacity:1; transform:none; } }
`;

export default function EnquiryPopup() {
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState<boolean>(() => {
    try { return sessionStorage.getItem(SUBMITTED_KEY) === "1"; } catch { return false; }
  });
  const [form, setForm] = useState<Form>({ name: "", phone: "", email: "" });
  const [message, setMessage] = useState<string>(buildMessage({ name: "", phone: "", email: "" }));
  const [messageEdited, setMessageEdited] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const firstRef = useRef(true);

  useEffect(() => {
    if (!messageEdited) setMessage(buildMessage(form));
  }, [form, messageEdited]);

  useEffect(() => {
    if (open || submitted) return;
    const delay = firstRef.current ? FIRST_DELAY_MS : REPEAT_DELAY_MS;
    firstRef.current = false;
    const t = window.setTimeout(() => setOpen(true), delay);
    return () => window.clearTimeout(t);
  }, [open, submitted]);

  useEffect(() => {
    if (submitted) return;
    const onVisible = () => {
      if (document.visibilityState === "visible") window.setTimeout(() => setOpen(true), RETURN_DELAY_MS);
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, [submitted]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  if (!open) return null;

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const digits = form.phone.replace(/\D/g, "");
    if (!form.name.trim()) { setError("Please enter your full name."); return; }
    if (digits.length !== 10) { setError("Enter a valid 10-digit mobile number."); return; }
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) { setError("Enter a valid email address."); return; }
    setBusy(true);
    setError("");
    try {
      const { submitLead } = await import("../config/Services");
            await submitLead({
        name: form.name.trim(),
        phone: digits,
        pincode: "000000",
        monthlyBill: 0,
        message: `${message.trim()} (${form.email || "No email"})`,
      });
      setDone(true);
      setSubmitted(true);
      try { sessionStorage.setItem(SUBMITTED_KEY, "1"); } catch { /* storage blocked */ }
      window.setTimeout(() => setOpen(false), 2600);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="enq-overlay" onMouseDown={(e) => { if (e.target === e.currentTarget) setOpen(false); }}>
      <style>{STYLE}</style>
      <div className="enq" role="dialog" aria-modal="true" aria-labelledby="enq-title">
        <button className="enq-x" onClick={() => setOpen(false)} aria-label="Close"><X size={16} /></button>

        {done ? (
          <div className="enq-done">
            <CheckCircle2 size={56} />
            <h3>Thank you, {form.name.trim().split(" ")[0]}!</h3>
            <p>Our team will call you within 24 hours to arrange your free site survey.</p>
          </div>
        ) : (
          <>
            <div className="enq-head">
              <small>Free solar consultation</small>
              <h2 id="enq-title">Get your free solar estimate</h2>
            </div>
            <form className="enq-body" onSubmit={submit} noValidate>
              <div className="enq-field">
                <label htmlFor="enq-name">Full name</label>
                <input id="enq-name" autoComplete="name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="Your full name" />
              </div>
              <div className="enq-field">
                <label htmlFor="enq-phone">Mobile number</label>
                <input id="enq-phone" inputMode="numeric" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value.replace(/\D/g, "").slice(0, 10) }))} placeholder="10-digit mobile number" />
              </div>
              <div className="enq-field">
                <label htmlFor="enq-email">Email ID</label>
                <input id="enq-email" type="email" autoComplete="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} placeholder="you@example.com" />
              </div>
              <div className="enq-field">
                <label htmlFor="enq-msg">Message</label>
                <textarea id="enq-msg" value={message} onChange={(e) => { setMessageEdited(true); setMessage(e.target.value); }} />
              </div>
              {error && <div className="enq-err">{error}</div>}
              <button type="submit" className="enq-submit" disabled={busy}><Send size={16} /> {busy ? "Sending..." : "Send enquiry"}</button>
              <button type="button" className="enq-later" onClick={() => setOpen(false)}>Maybe later</button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}