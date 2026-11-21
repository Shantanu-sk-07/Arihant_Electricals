import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, FileCheck, Gauge, HardHat, PenTool, Search, Wrench } from "lucide-react";
import heroImg from "../assets/InstallationWorker.jpeg";
import sideImg from "../assets/HowPlanSOlar.jpeg";

const STYLE = `
.pc { font-family:"Manrope","Segoe UI",Roboto,Arial,sans-serif; color:#0F2A3F; overflow:hidden; }
.pc a { color:inherit; text-decoration:none; }
.pc img { display:block; max-width:100%; }
.pc-wrap { max-width:1200px; margin:0 auto; padding:0 20px; }
.pc-eyebrow { display:inline-block; font-size:12.5px; font-weight:800; letter-spacing:.14em; text-transform:uppercase; color:#0369A1; background:#E0F2FE; padding:7px 14px; border-radius:999px; }
.pc-hero { position:relative; background:#075985; color:#fff; overflow:hidden; }
.pc-hero-img { position:absolute; inset:0; }
.pc-hero-img img { width:100%; height:100%; object-fit:cover; object-position:center 30%; }
.pc-hero::after { content:""; position:absolute; inset:0; background:linear-gradient(90deg,rgba(7,89,133,.74) 0%,rgba(14,165,233,.25) 75%); }
.pc-hero-in { position:relative; z-index:2; padding:84px 0 92px; max-width:740px; }
.pc-hero .pc-eyebrow { background:rgba(255,255,255,.2); color:#fff; }
.pc-hero h1 { font-size:clamp(34px,4.8vw,54px); font-weight:800; line-height:1.08; margin:16px 0 16px; }
.pc-hero p { font-size:17.5px; line-height:1.7; color:#E0F2FE; margin:0; }
.pc-sec { padding:76px 0; }
.pc-soft { background:#F3F9FD; }
.pc-h2 { font-size:clamp(26px,3vw,36px); font-weight:800; color:#075985; margin:12px 0 14px; line-height:1.18; }
.pc-lead { font-size:16.5px; line-height:1.75; color:#4B5D6E; margin:0 0 14px; }
.pc-split { display:grid; grid-template-columns:1fr 1fr; gap:56px; align-items:center; }
.pc-split img { width:100%; height:400px; object-fit:cover; border-radius:24px; box-shadow:0 24px 56px rgba(3,105,161,.2); }
.pc-tl { margin-top:34px; }
.pc-step { display:grid; grid-template-columns:80px 1fr; gap:24px; padding:30px 0; border-top:1px solid #DCEAF3; }
.pc-step:last-child { border-bottom:1px solid #DCEAF3; }
.pc-step-n { width:68px; height:68px; border-radius:50%; background:linear-gradient(135deg,#0EA5E9,#0369A1); color:#fff; display:flex; align-items:center; justify-content:center; box-shadow:0 12px 26px rgba(14,165,233,.3); }
.pc-step h3 { margin:0 0 4px; font-size:21px; font-weight:800; color:#075985; }
.pc-step .pc-days { font-size:13px; font-weight:800; color:#B45309; letter-spacing:.06em; text-transform:uppercase; margin-bottom:10px; }
.pc-step p { margin:0 0 14px; color:#3E5263; line-height:1.75; font-size:15.5px; }
.pc-cols { display:grid; grid-template-columns:1fr 1fr; gap:26px; }
.pc-col { background:#fff; border:1px solid #DCEAF3; border-radius:18px; padding:20px 22px; }
.pc-col h4 { margin:0 0 10px; font-size:14px; font-weight:800; color:#0369A1; text-transform:uppercase; letter-spacing:.08em; }
.pc-col ul { list-style:none; padding:0; margin:0; display:grid; gap:9px; }
.pc-col li { display:flex; gap:10px; align-items:flex-start; font-size:15px; line-height:1.6; color:#2E4455; }
.pc-col li svg { color:#16A34A; flex-shrink:0; margin-top:3px; }
.pc-table { width:100%; border-collapse:collapse; background:#fff; border:1px solid #DCEAF3; border-radius:18px; overflow:hidden; margin-top:26px; }
.pc-table th, .pc-table td { padding:14px 18px; text-align:left; font-size:15px; border-top:1px solid #E6F1F8; }
.pc-table th { background:#0EA5E9; color:#fff; border-top:0; font-weight:800; }
.pc-table td:first-child { font-weight:800; color:#075985; }
.pc-table td { color:#3E5263; }
.pc-cta { margin-top:44px; background:linear-gradient(135deg,#075985,#0EA5E9); color:#fff; border-radius:22px; padding:32px; display:flex; justify-content:space-between; align-items:center; gap:20px; flex-wrap:wrap; }
.pc-cta h3 { margin:0 0 6px; font-size:22px; font-weight:800; }
.pc-cta p { margin:0; color:#E0F2FE; }
.pc-cta a { display:inline-flex; align-items:center; gap:9px; background:#FBBF24; color:#0F2A3F; padding:14px 24px; border-radius:13px; font-weight:800; }
@media (max-width:900px){ .pc-split, .pc-cols { grid-template-columns:1fr; gap:30px; } .pc-split img { height:280px; } }
@media (max-width:620px){ .pc-step { grid-template-columns:52px 1fr; gap:16px; } .pc-step-n { width:50px; height:50px; } .pc-step h3 { font-size:18px; } .pc-table th, .pc-table td { padding:11px 12px; font-size:14px; } }
`;

const STEPS = [
  {
    icon: <Search size={28} />,
    title: "Free site survey",
    days: "Week 1",
    what: "Our consultant visits your home or business. We measure the roof, check shading from trees and buildings, look at the structure and the orientation, and review your last twelve months of MSEDCL bills.",
    you: ["Share your latest MSEDCL bill and consumer number", "Show us the roof and any access points"],
    us: ["Shadow and structure check", "Load and bill analysis", "Feasibility view for on-grid, off-grid or hybrid"],
  },
  {
    icon: <PenTool size={28} />,
    title: "Design and written quote",
    days: "Week 1 to 2",
    what: "We design the layout, choose the modules, inverter and battery where needed, and calculate expected generation. You receive a written quote that shows the cost, the central subsidy, any state top-up and an estimated payback.",
    you: ["Review the layout and system size", "Choose the battery and backup circuits, if hybrid"],
    us: ["Layout and single-line diagram", "Generation estimate for your site", "Subsidy and payback calculation"],
  },
  {
    icon: <FileCheck size={28} />,
    title: "Subsidy and approvals",
    days: "Week 2 to 4",
    what: "We register your household on the PM Surya Ghar portal, select Arihant as your vendor, upload the documents and apply for feasibility approval from MSEDCL. We track every query until approval.",
    you: ["Provide Aadhaar, bank details and property proof", "Confirm the consumer details on the portal"],
    us: ["Portal registration and upload", "MSEDCL feasibility application", "Query handling and follow-up"],
  },
  {
    icon: <HardHat size={28} />,
    title: "Installation",
    days: "After approval, about 1 day on site",
    what: "Our certified team installs the mounting structure, modules, inverter, cabling and earthing. Each stage is tested before the next. We clean up the site and walk you through the system before we leave.",
    you: ["Keep the site accessible on the agreed day", "Confirm the handover walkthrough"],
    us: ["Mounting and module fixing", "AC and DC cabling, earthing, surge protection", "Testing and handover"],
  },
  {
    icon: <Gauge size={28} />,
    title: "Net meter and commissioning",
    days: "After installation, as per MSEDCL",
    what: "MSEDCL fits the bidirectional net meter and inspects the installation. Once they approve it, the system is commissioned and the commissioning report is submitted to the portal.",
    you: ["Be available for the MSEDCL inspection", "Keep the commissioning report for your records"],
    us: ["Inspection coordination with MSEDCL", "Commissioning report on the portal", "Monitoring app set up for you"],
  },
  {
    icon: <Wrench size={28} />,
    title: "Subsidy credit and aftercare",
    days: "After verification, as per portal",
    what: "The portal verifies the commissioning details and the central subsidy is paid into your bank account. After that, we offer annual maintenance, cleaning and performance checks for the life of the system.",
    you: ["Check your bank account for the credit", "Book the first annual service"],
    us: ["Subsidy follow-up with the portal", "Annual cleaning and inspection", "Performance reports and support"],
  },
];

const TIMELINE = [
  ["Site survey and quote", "1 to 2 weeks"],
  ["Portal registration and approval", "2 to 4 weeks, depends on portal and DISCOM"],
  ["Installation on site", "About 1 day"],
  ["Net meter and commissioning", "As per MSEDCL schedule"],
  ["Subsidy credited", "After verification, as per portal"],
];

export default function Process() {
  return (
    <div className="pc">
      <style>{STYLE}</style>

      <section className="pc-hero">
        <div className="pc-hero-img"><img src={heroImg} alt="" /></div>
        <div className="pc-wrap">
          <div className="pc-hero-in">
            <span className="pc-eyebrow">Our process</span>
            <h1>From first survey to subsidy, step by step</h1>
            <p>Six clear stages, from the first visit to the subsidy in your bank account. You always know what happens next and what, if anything, you need to do.</p>
          </div>
        </div>
      </section>

      <section className="pc-sec">
        <div className="pc-wrap pc-split">
          <img src={sideImg} alt="Arihant team planning the installation" />
          <div>
            <span className="pc-eyebrow">Overview</span>
            <h2 className="pc-h2">A single team, from start to finish</h2>
            <p className="pc-lead">The same team that surveys your roof also prepares your application and manages the installation. You do not need to deal with the portal, MSEDCL and the installer separately.</p>
            <p className="pc-lead">Timelines below are typical for Maharashtra. Portal and DISCOM processing can vary, and we tell you about any delay as soon as we know.</p>
          </div>
        </div>
      </section>

      <section className="pc-sec pc-soft">
        <div className="pc-wrap">
          <span className="pc-eyebrow">Step by step</span>
          <h2 className="pc-h2">What happens at each stage</h2>
          <div className="pc-tl">
            {STEPS.map((s, i) => (
              <div key={s.title} className="pc-step">
                <div className="pc-step-n">{s.icon}</div>
                <div>
                  <h3>Step {i + 1}: {s.title}</h3>
                  <div className="pc-days">{s.days}</div>
                  <p>{s.what}</p>
                  <div className="pc-cols">
                    <div className="pc-col">
                      <h4>What we do</h4>
                      <ul>{s.us.map((u) => <li key={u}><CheckCircle2 size={17} />{u}</li>)}</ul>
                    </div>
                    <div className="pc-col">
                      <h4>What you do</h4>
                      <ul>{s.you.map((y) => <li key={y}><CheckCircle2 size={17} />{y}</li>)}</ul>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="pc-sec">
        <div className="pc-wrap">
          <span className="pc-eyebrow">Timeline</span>
          <h2 className="pc-h2">Typical timeline for a home system</h2>
          <table className="pc-table">
            <thead><tr><th>Stage</th><th>Typical duration</th></tr></thead>
            <tbody>{TIMELINE.map((r) => <tr key={r[0]}><td>{r[0]}</td><td>{r[1]}</td></tr>)}</tbody>
          </table>

          <div className="pc-cta">
            <div>
              <h3>Ready for step one?</h3>
              <p>Book a free site survey. We will tell you the system size, subsidy and payback before you commit to anything.</p>
            </div>
            <Link to="/contact">Book my free survey <ArrowRight size={18} /></Link>
          </div>
        </div>
      </section>
    </div>
  );
}