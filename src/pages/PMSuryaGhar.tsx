import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, BadgeIndianRupee, CheckCircle2, ChevronDown, ClipboardCheck, FileText, Landmark, MapPin, ShieldCheck, Sun, Zap } from "lucide-react";
import heroImg from "../assets/Vendor_Consumer.jpeg";
import sideImg from "../assets/HowPlanSOlar.jpeg";

const STYLE = `
.ps { font-family:"Manrope","Segoe UI",Roboto,Arial,sans-serif; color:#0F2A3F; overflow:hidden; }
.ps a { color:inherit; text-decoration:none; }
.ps img { display:block; max-width:100%; }
.ps-wrap { max-width:1200px; margin:0 auto; padding:0 20px; }
.ps-eyebrow { display:inline-block; font-size:12.5px; font-weight:800; letter-spacing:.14em; text-transform:uppercase; color:#0369A1; background:#E0F2FE; padding:7px 14px; border-radius:999px; }
.ps-hero { position:relative; background:#075985; color:#fff; overflow:hidden; }
.ps-hero-img { position:absolute; inset:0; }
.ps-hero-img img { width:100%; height:100%; object-fit:contain; object-position:center 25%; }
.ps-hero::after { content:""; position:absolute; inset:0; background:linear-gradient(90deg,rgba(7,89,133,.94) 0%,rgba(14,165,233,.5) 70%); }
.ps-hero-in { position:relative; z-index:2; display:grid; grid-template-columns:1.2fr .8fr; gap:50px; align-items:center; padding:84px 0 90px; }
.ps-hero .ps-eyebrow { background:rgba(255,255,255,.2); color:#fff; }
.ps-hero h1 { font-size:clamp(34px,4.8vw,54px); font-weight:800; line-height:1.08; margin:16px 0 16px; }
.ps-hero h1 span { color:#FBBF24; }
.ps-hero p { font-size:17.5px; line-height:1.7; color:#E0F2FE; margin:0 0 28px; }
.ps-btn { display:inline-flex; align-items:center; gap:9px; padding:14px 26px; border-radius:13px; font-weight:800; background:#FBBF24; color:#0F2A3F; box-shadow:0 12px 24px rgba(251,191,36,.35); transition:transform .25s; }
.ps-btn:hover { transform:translateY(-3px); }
.ps-keyfacts { background:#fff; color:#0F2A3F; border-radius:22px; padding:28px; box-shadow:0 26px 60px rgba(0,0,0,.25); }
.ps-keyfacts h3 { margin:0 0 14px; font-size:15px; font-weight:800; color:#0369A1; text-transform:uppercase; letter-spacing:.1em; }
.ps-kf { display:flex; justify-content:space-between; gap:12px; padding:12px 0; border-top:1px solid #E6F1F8; font-size:15px; }
.ps-kf:first-of-type { border-top:0; }
.ps-kf span { color:#4B5D6E; }
.ps-kf b { color:#075985; font-weight:800; text-align:right; }
.ps-sec { padding:76px 0; }
.ps-soft { background:#F3F9FD; }
.ps-h2 { font-size:clamp(26px,3vw,36px); font-weight:800; color:#075985; margin:12px 0 14px; line-height:1.18; }
.ps-lead { font-size:16.5px; line-height:1.75; color:#4B5D6E; margin:0 0 14px; }
.ps-split { display:grid; grid-template-columns:1fr 1fr; gap:56px; align-items:center; }
.ps-split img { width:100%; height:auto; max-height:520px; object-fit:contain; border-radius:24px; box-shadow:0 24px 56px rgba(3,105,161,.2); }
.ps-table { width:100%; border-collapse:collapse; background:#fff; border-radius:18px; overflow:hidden; border:1px solid #DCEAF3; margin-top:26px; }
.ps-table th, .ps-table td { padding:16px 20px; text-align:left; font-size:15.5px; border-top:1px solid #E6F1F8; }
.ps-table th { background:#0EA5E9; color:#fff; border-top:0; font-weight:800; }
.ps-table td:first-child { font-weight:800; color:#075985; }
.ps-table td.amt { font-weight:800; color:#0369A1; font-size:17px; }
.ps-note { font-size:14.5px; color:#4B5D6E; margin-top:14px; line-height:1.65; }
.ps-mh { display:grid; gap:14px; margin-top:26px; }
.ps-mh-item { display:flex; gap:14px; align-items:flex-start; background:#fff; border:1px solid #DCEAF3; border-radius:16px; padding:18px 20px; }
.ps-mh-item svg { color:#0EA5E9; flex-shrink:0; margin-top:2px; }
.ps-mh-item p { margin:0; font-size:15.5px; line-height:1.65; color:#2E4455; }
.ps-check { list-style:none; padding:0; margin:22px 0 0; display:grid; gap:12px; }
.ps-check li { display:flex; gap:11px; align-items:flex-start; font-size:15.5px; line-height:1.6; color:#2E4455; }
.ps-check svg { color:#16A34A; flex-shrink:0; margin-top:2px; }
.ps-steps { margin-top:34px; display:grid; gap:0; }
.ps-step { display:grid; grid-template-columns:64px 1fr; gap:20px; padding:22px 0; border-top:1px solid #DCEAF3; }
.ps-step:last-child { border-bottom:1px solid #DCEAF3; }
.ps-step-n { width:50px; height:50px; border-radius:14px; background:linear-gradient(135deg,#0EA5E9,#0369A1); color:#fff; display:flex; align-items:center; justify-content:center; }
.ps-step h3 { margin:0 0 6px; font-size:18px; font-weight:800; color:#075985; display:flex; align-items:center; gap:8px; }
.ps-step p { margin:0; color:#4B5D6E; line-height:1.7; font-size:15.5px; }
.ps-docs { display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-top:26px; }
.ps-doc { display:flex; gap:12px; align-items:flex-start; background:#fff; border:1px solid #DCEAF3; border-radius:16px; padding:18px 20px; }
.ps-doc svg { color:#0369A1; flex-shrink:0; margin-top:2px; }
.ps-doc b { display:block; font-size:15.5px; color:#075985; margin-bottom:4px; }
.ps-doc span { font-size:14.5px; color:#4B5D6E; line-height:1.6; }
.ps-faq { margin-top:30px; }
.ps-q { border-top:1px solid #DCEAF3; }
.ps-q:last-child { border-bottom:1px solid #DCEAF3; }
.ps-q button { width:100%; display:flex; justify-content:space-between; align-items:center; gap:16px; padding:18px 4px; background:none; border:0; cursor:pointer; text-align:left; font:inherit; font-weight:800; font-size:16px; color:#075985; }
.ps-q svg { transition:transform .3s; color:#0EA5E9; flex-shrink:0; }
.ps-q.open svg { transform:rotate(180deg); }
.ps-q-body { max-height:0; overflow:hidden; transition:max-height .4s ease; }
.ps-q.open .ps-q-body { max-height:500px; }
.ps-q-body p { margin:0 0 18px; padding:0 4px; color:#3E5263; line-height:1.75; font-size:15.5px; }
.ps-cta { margin-top:50px; background:linear-gradient(135deg,#075985,#0EA5E9); color:#fff; border-radius:22px; padding:34px; display:flex; justify-content:space-between; align-items:center; gap:20px; flex-wrap:wrap; }
.ps-cta h3 { margin:0 0 6px; font-size:23px; font-weight:800; }
.ps-cta p { margin:0; color:#E0F2FE; }
.ps-cta a { display:inline-flex; align-items:center; gap:9px; background:#FBBF24; color:#0F2A3F; padding:14px 24px; border-radius:13px; font-weight:800; box-shadow:0 10px 22px rgba(251,191,36,.35); }
@media (max-width:900px){ .ps-hero-in, .ps-split { grid-template-columns:1fr; gap:30px; } .ps-split img { height:auto; max-height:520px; } }
@media (max-width:620px){ .ps-docs { grid-template-columns:1fr; } .ps-table th, .ps-table td { padding:12px; font-size:14px; } .ps-step { grid-template-columns:50px 1fr; gap:14px; } .ps-step-n { width:42px; height:42px; } }
/* ---- Hero: solid brand background, keyfacts card stays on the right ---- */
.ps-hero { background:linear-gradient(105deg,#075985 0%,#0369A1 55%,#0EA5E9 100%); }
.ps-hero::after { display:none; }
.ps-hero-img { display:none; }

`;

const SUBSIDY = [
  { kw: "1 kW", central: "Rs 30,000", note: "Central amount" },
  { kw: "2 kW", central: "Rs 60,000", note: "Central amount" },
  { kw: "3 kW and above", central: "Rs 78,000", note: "Central cap for residential" },
];

const STEPS = [
  { icon: <MapPin size={20} />, title: "Free site survey", text: "We visit your home, check the roof, shading and your MSEDCL bill, and confirm the system size and subsidy you qualify for." },
  { icon: <FileText size={20} />, title: "Portal registration", text: "We register your consumer details on the national PM Surya Ghar portal and select Arihant Electricals as your vendor." },
  { icon: <ClipboardCheck size={20} />, title: "Document upload", text: "Aadhaar, electricity bill, bank details and property proof are uploaded and checked for accuracy." },
  { icon: <Zap size={20} />, title: "MSEDCL feasibility approval", text: "MSEDCL reviews the feasibility of connecting your system to the grid. We track this and respond to any queries." },
  { icon: <Sun size={20} />, title: "Installation", text: "Our certified team installs the panels, inverter and earthing in about one day, with testing before handover." },
  { icon: <ShieldCheck size={20} />, title: "Net meter and commissioning", text: "MSEDCL fits the bidirectional net meter and inspects the system. We submit the commissioning report to the portal." },
  { icon: <Landmark size={20} />, title: "Subsidy credited", text: "After verification, the central subsidy is paid directly into your bank account. Any state amount is paid as per the state process." },
];

const DOCS = [
  { t: "Aadhaar card", d: "Of the applicant, linked to the mobile number used for registration." },
  { t: "MSEDCL electricity bill", d: "Recent bill showing your 12-digit consumer number and name." },
  { t: "Bank details", d: "Passbook or cancelled cheque for the account where the subsidy is paid." },
  { t: "Property proof", d: "Property tax receipt in towns, or 7/12 or 8A extract for rural plots." },
];

const FAQS = [
  { q: "Is the subsidy the same for every district in Maharashtra?", a: "The central amount is the same across India. Any state top-up can differ by district or scheme period, so we confirm the total for your district at the time of application." },
  { q: "Can I get the subsidy if I take a bank loan?", a: "Yes. The subsidy is paid to your bank account once the installation and net-meter steps are complete. Many families use it to reduce the loan principal, which we explain during your survey." },
  { q: "What if my roof is shaded or small?", a: "A smaller system still qualifies for a proportionate subsidy. We design the system to fit the usable roof area and tell you the expected generation before you decide." },
  { q: "How long does the whole process take?", a: "Installation itself takes about one day. Portal approvals, MSEDCL feasibility, net-meter fitting and subsidy credit depend on government and DISCOM processing, and we keep you updated at every stage." },
];

export default function PMSuryaGhar() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="ps">
      <style>{STYLE}</style>

      <section className="ps-hero">
        <div className="ps-hero-img"><img src={heroImg} alt="" /></div>
        <div className="ps-wrap ps-hero-in">
          <div>
            <span className="ps-eyebrow">PM Surya Ghar, Maharashtra</span>
            <h1>Free rooftop solar with <span>central subsidy</span> up to Rs 78,000</h1>
            <p>PM Surya Ghar Muft Bijli Yojana supports residential rooftop solar across Maharashtra. Arihant Electricals manages registration, documents, MSEDCL approval and subsidy follow-up for you.</p>
            <Link to="/contact" className="ps-btn">Check my eligibility <ArrowRight size={18} /></Link>
          </div>
          <div className="ps-keyfacts">
            <h3>Scheme at a glance</h3>
            <div className="ps-kf"><span>Scheme</span><b>PM Surya Ghar</b></div>
            <div className="ps-kf"><span>Applies to</span><b>Residential homes</b></div>
            <div className="ps-kf"><span>Electricity board</span><b>MSEDCL (Mahavitaran)</b></div>
            <div className="ps-kf"><span>Maximum central subsidy</span><b>Rs 78,000</b></div>
            <div className="ps-kf"><span>Paid to</span><b>Your bank account</b></div>
          </div>
        </div>
      </section>

      <section className="ps-sec">
        <div className="ps-wrap ps-split">
          <div>
            <span className="ps-eyebrow">Subsidy structure</span>
            <h2 className="ps-h2">How much you receive</h2>
            <p className="ps-lead">The central subsidy depends on the capacity of the grid-connected system you install. It is capped for systems of 3 kW and above.</p>
            <table className="ps-table">
              <thead><tr><th>System capacity</th><th>Central subsidy</th></tr></thead>
              <tbody>
                {SUBSIDY.map((r) => (
                  <tr key={r.kw}><td>{r.kw}</td><td className="amt">{r.central}<br /><span style={{ fontWeight: 600, color: "#4B5D6E", fontSize: 13 }}>{r.note}</span></td></tr>
                ))}
              </tbody>
            </table>
            <p className="ps-note">Maharashtra may add a state contribution on top of the central amount. Confirm the current figure for your district with us before you apply.</p>
          </div>
          <img src={sideImg} alt="Arihant team planning a PM Surya Ghar installation" />
        </div>
      </section>

      <section className="ps-sec ps-soft">
        <div className="ps-wrap ps-split">
          <img src={heroImg} alt="Residential rooftop solar installation in Maharashtra" style={{ objectPosition: "center 40%" }} />
          <div>
            <span className="ps-eyebrow">Eligibility</span>
            <h2 className="ps-h2">Who can apply in Maharashtra</h2>
            <ul className="ps-check">
              <li><CheckCircle2 size={19} /> You own a residential property with a suitable roof, or have the owner's written consent</li>
              <li><CheckCircle2 size={19} /> You have a valid domestic electricity connection in your name with MSEDCL</li>
              <li><CheckCircle2 size={19} /> You have not already claimed a central subsidy for rooftop solar on this property</li>
              <li><CheckCircle2 size={19} /> You have a bank account in your name and an Aadhaar-linked mobile number</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="ps-sec">
        <div className="ps-wrap">
          <span className="ps-eyebrow">Documents</span>
          <h2 className="ps-h2">What you need to keep ready</h2>
          <div className="ps-docs">
            {DOCS.map((d) => (
              <div key={d.t} className="ps-doc"><FileText size={20} /><div><b>{d.t}</b><span>{d.d}</span></div></div>
            ))}
          </div>
        </div>
      </section>

      <section className="ps-sec ps-soft">
        <div className="ps-wrap">
          <span className="ps-eyebrow">Step by step</span>
          <h2 className="ps-h2">The Maharashtra process, from survey to subsidy</h2>
          <p className="ps-lead">Every step is handled by our team. You are told what happens next at every stage.</p>
          <div className="ps-steps">
            {STEPS.map((s, i) => (
              <div key={s.title} className="ps-step">
                <div className="ps-step-n">{s.icon}</div>
                <div><h3>{i + 1}. {s.title}</h3><p>{s.text}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="ps-sec">
        <div className="ps-wrap">
          <span className="ps-eyebrow"><BadgeIndianRupee size={14} style={{ verticalAlign: "-2px" }} /> Questions</span>
          <h2 className="ps-h2">PM Surya Ghar questions, answered</h2>
          <div className="ps-faq">
            {FAQS.map((f, i) => {
              const isOpen = open === i;
              return (
                <div key={f.q} className={`ps-q${isOpen ? " open" : ""}`}>
                  <button onClick={() => setOpen(isOpen ? null : i)} aria-expanded={isOpen}>{f.q}<ChevronDown size={20} /></button>
                  <div className="ps-q-body"><p>{f.a}</p></div>
                </div>
              );
            })}
          </div>

          <div className="ps-cta">
            <div>
              <h3>Find out your exact subsidy today</h3>
              <p>Send your MSEDCL bill and roof details. We reply with the system size, subsidy and payback.</p>
            </div>
            <Link to="/contact">Start my application <ArrowRight size={18} /></Link>
          </div>
        </div>
      </section>
    </div>
  );
}