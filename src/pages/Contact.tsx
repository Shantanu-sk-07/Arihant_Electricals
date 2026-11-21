import { useState, type FormEvent } from "react";
import { CheckCircle2, Clock, Mail, MapPin, MessageCircle, Phone, Send } from "lucide-react";
import heroImg from "../assets/MSD_ThumpsUp.png";
import { submitLead } from "@/config/Services";

const PHONE_DISPLAY = "+91 77748 55501";
const PHONE_TEL = "tel:+917774855501";
const EMAIL = "arihantelectricals159@gmail.com";
const WHATSAPP = "https://wa.me/917774855501?text=Hello%20Arihant%20Electricals%2C%20I%20would%20like%20a%20free%20solar%20survey";

const STYLE = `
.ct { font-family:"Manrope","Segoe UI",Roboto,Arial,sans-serif; color:#0F2A3F; overflow:hidden; }
.ct a { color:inherit; text-decoration:none; }
.ct-wrap { max-width:1200px; margin:0 auto; padding:0 20px; }
.ct-eyebrow { display:inline-block; font-size:12.5px; font-weight:800; letter-spacing:.14em; text-transform:uppercase; color:#0369A1; background:#E0F2FE; padding:7px 14px; border-radius:999px; }
.ct-hero { position:relative; background:#075985; color:#fff; overflow:hidden; }
.ct-hero-img { position:absolute; inset:0; }
.ct-hero-img img { width:100%; height:100%; object-fit:cover; object-position:center 5%; }
.ct-hero::after { content:""; position:absolute; inset:0; background:linear-gradient(90deg,rgba(7,89,133,.74),rgba(14,165,233,.35)); }
.ct-hero-in { position:relative; z-index:2; padding:76px 0 84px; max-width:720px; }
.ct-hero .ct-eyebrow { background:rgba(255,255,255,.2); color:#fff; }
.ct-hero h1 { font-size:clamp(32px,4.4vw,50px); font-weight:800; line-height:1.1; margin:16px 0 14px; }
.ct-hero p { font-size:17px; line-height:1.7; color:#E0F2FE; margin:0; }
.ct-main { display:grid; grid-template-columns:1.1fr .9fr; gap:34px; padding:60px 0 84px; align-items:start; }
.ct-form { background:#fff; border:1px solid #DCEAF3; border-radius:22px; padding:34px; box-shadow:0 20px 50px rgba(3,105,161,.1); }
.ct-form h2 { margin:0 0 6px; font-size:24px; font-weight:800; color:#075985; }
.ct-form > p { margin:0 0 24px; color:#4B5D6E; font-size:15px; line-height:1.6; }
.ct-row { display:grid; grid-template-columns:1fr 1fr; gap:14px; }
.ct-field { display:flex; flex-direction:column; gap:6px; margin-bottom:14px; }
.ct-field label { font-size:14px; font-weight:700; color:#0F2A3F; }
.ct-field input, .ct-field textarea { font:inherit; font-size:15px; color:#0F2A3F; background:#fff; border:1.5px solid #CFE5F1; border-radius:12px; padding:12px 14px; outline:none; transition:border-color .2s, box-shadow .2s; }
.ct-field input:focus, .ct-field textarea:focus { border-color:#0EA5E9; box-shadow:0 0 0 4px rgba(14,165,233,.18); }
.ct-field textarea { min-height:110px; resize:vertical; line-height:1.5; }
.ct-err { color:#B91C1C; font-size:13px; font-weight:700; }
.ct-submit { width:100%; border:0; border-radius:13px; padding:15px; background:#FBBF24; color:#0F2A3F; font:inherit; font-weight:800; font-size:16px; display:flex; align-items:center; justify-content:center; gap:9px; cursor:pointer; box-shadow:0 12px 24px rgba(251,191,36,.35); transition:transform .2s; }
.ct-submit:hover:not(:disabled) { transform:translateY(-2px); }
.ct-submit:disabled { opacity:.7; cursor:wait; }
.ct-done { text-align:center; padding:30px 10px; }
.ct-done svg { color:#0EA5E9; }
.ct-done h3 { font-size:22px; color:#075985; margin:12px 0 8px; }
.ct-done p { color:#4B5D6E; margin:0 0 18px; line-height:1.6; }
.ct-link { background:none; border:0; color:#0369A1; font:inherit; font-weight:800; cursor:pointer; text-decoration:underline; }
.ct-side { display:grid; gap:18px; align-content:start; }
.ct-info { background:linear-gradient(135deg,#075985,#0369A1); color:#fff; border-radius:22px; padding:30px; }
.ct-info h3 { margin:0 0 18px; font-size:22px; font-weight:800; }
.ct-item { display:flex; gap:14px; align-items:flex-start; padding:14px 0; border-top:1px solid rgba(255,255,255,.18); }
.ct-item:first-of-type { border-top:0; padding-top:0; }
.ct-item svg { color:#FBBF24; flex-shrink:0; margin-top:3px; }
.ct-item b { display:block; font-size:15px; margin-bottom:2px; }
.ct-item span { color:#E0F2FE; font-size:15px; line-height:1.55; }
.ct-btns { display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-top:20px; }
.ct-btn { display:flex; align-items:center; justify-content:center; gap:8px; padding:14px; border-radius:13px; font-weight:800; font-size:15px; }
.ct-btn-call { background:#fff; color:#075985; }
.ct-btn-wa { background:#25D366; color:#fff; }
.ct-hours { background:#F3F9FD; border:1px solid #DCEAF3; border-radius:20px; padding:24px; }
.ct-hours h4 { margin:0 0 10px; font-size:17px; color:#075985; display:flex; gap:8px; align-items:center; }
.ct-hours p { margin:0; color:#4B5D6E; font-size:15px; line-height:1.8; }
.ct-note { background:#fff; border:1px solid #DCEAF3; border-radius:20px; padding:24px; }
.ct-note h4 { margin:0 0 12px; font-size:17px; color:#075985; }
.ct-note ul { list-style:none; padding:0; margin:0; display:grid; gap:10px; }
.ct-note li { display:flex; gap:10px; align-items:flex-start; font-size:15px; line-height:1.6; color:#2E4455; }
.ct-note li svg { color:#16A34A; flex-shrink:0; margin-top:3px; }
@media (max-width:900px){ .ct-main { grid-template-columns:1fr; } }
@media (max-width:560px){ .ct-form { padding:24px; } .ct-row, .ct-btns { grid-template-columns:1fr; } }
`;

interface Form { name: string; phone: string; email: string; message: string }

export default function Contact() {
  const [form, setForm] = useState<Form>({ name: "", phone: "", email: "", message: "" });
  const [errors, setErrors] = useState<Partial<Record<keyof Form, string>>>({});
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  const validate = (): boolean => {
    const e: Partial<Record<keyof Form, string>> = {};
    if (!form.name.trim()) e.name = "Please enter your full name.";
    if (form.phone.replace(/\D/g, "").length !== 10) e.phone = "Enter a valid 10-digit mobile number.";
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Enter a valid email address.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

    const onSubmit = async (ev: FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setBusy(true);
    try {
      const fullMessage = form.message.trim() 
        ? `${form.message.trim()} (${form.email || "No email"})`
        : `Email: ${form.email || "No email"}`;

      await submitLead({
        name: form.name.trim(),
        phone: form.phone,
        pincode: "000000", 
        monthlyBill: 0,
        message: fullMessage,
      });
      setSent(true);
      setForm({ name: "", phone: "", email: "", message: "" });
    } catch (error) {
      alert(error instanceof Error ? error.message : "Could not send. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="ct">
      <style>{STYLE}</style>

      <section className="ct-hero">
        <div className="ct-hero-img"><img src={heroImg} alt="" /></div>
        <div className="ct-wrap">
          <div className="ct-hero-in">
            <span className="ct-eyebrow">Contact us</span>
            <h1>Book your free solar survey</h1>
            <p>Tell us a little about your home or business. Our team will call you back, usually within one working day.</p>
          </div>
        </div>
      </section>

      <div className="ct-wrap ct-main">
        <div className="ct-form">
          {sent ? (
            <div className="ct-done">
              <CheckCircle2 size={56} />
              <h3>Thank you. We have your details.</h3>
              <p>Our solar team will call you within one working day to arrange your free survey.</p>
              <button className="ct-link" onClick={() => setSent(false)}>Send another enquiry</button>
            </div>
          ) : (
            <form onSubmit={onSubmit} noValidate>
              <h2>Send us your enquiry</h2>
              <p>Share your details and a short message. We do not share your information.</p>
              <div className="ct-row">
                <div className="ct-field">
                  <label htmlFor="ct-name">Full name</label>
                  <input id="ct-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your full name" />
                  {errors.name && <span className="ct-err">{errors.name}</span>}
                </div>
                <div className="ct-field">
                  <label htmlFor="ct-phone">Mobile number</label>
                  <input id="ct-phone" inputMode="numeric" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value.replace(/\D/g, "").slice(0, 10) })} placeholder="10-digit mobile" />
                  {errors.phone && <span className="ct-err">{errors.phone}</span>}
                </div>
              </div>
              <div className="ct-field">
                <label htmlFor="ct-email">Email ID</label>
                <input id="ct-email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" />
                {errors.email && <span className="ct-err">{errors.email}</span>}
              </div>
              <div className="ct-field">
                <label htmlFor="ct-msg">Message</label>
                <textarea id="ct-msg" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Tell us about your roof, your monthly bill and what you are looking for" />
              </div>
              <button type="submit" className="ct-submit" disabled={busy}><Send size={17} /> {busy ? "Sending..." : "Send enquiry"}</button>
            </form>
          )}
        </div>

        <div className="ct-side">
          <div className="ct-info">
            <h3>Get in touch</h3>
            <div className="ct-item"><Phone size={20} /><div><b>Call us</b><span>{PHONE_DISPLAY}</span></div></div>
            <div className="ct-item"><Mail size={20} /><div><b>Email us</b><span>{EMAIL}</span></div></div>
            <div className="ct-item"><MapPin size={20} /><div><b>Service areas</b><span>Sangli, Kolhapur and Satara, with surrounding towns across Maharashtra</span></div></div>
            <div className="ct-btns">
              <a
  href={PHONE_TEL}
  className="inline-flex items-center gap-2 bg-brandOrange text-white font-bold px-5 py-2.5 rounded-lg transition-all duration-300 border-2 border-transparent bg-orange-400 hover:border-yellow-400 hover:shadow-[0_0_20px_rgba(250,204,21,0.5)]"
>
  <Phone size={18} />
  Call Now
</a>
              <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" className="ct-btn ct-btn-wa"><MessageCircle size={17} /> WhatsApp</a>
            </div>
          </div>

          <div className="ct-hours">
            <h4><Clock size={18} /> Office hours</h4>
            <p>Monday to Saturday: 9:00 AM to 7:00 PM<br />Sunday: closed</p>
          </div>

          <div className="ct-note">
            <h4>What happens next</h4>
            <ul>
              <li><CheckCircle2 size={18} />We call you to understand your bill and roof</li>
              <li><CheckCircle2 size={18} />We book a free site survey at a convenient time</li>
              <li><CheckCircle2 size={18} />You receive a written quote with subsidy and payback</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}