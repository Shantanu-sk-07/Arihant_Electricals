import type { ReactElement } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { ArrowRight, Battery, BadgeIndianRupee, CheckCircle2, MapPin, Sun, XCircle, Zap, Home } from "lucide-react";
import heroImg from "../assets/MSD_Home.png";
import onImg from "../assets/MSD_withSolarPanels.png";
import offImg from "../assets/Vendor_Consumer.jpeg";
import hybImg from "../assets/InstallationWorker.jpeg";
import tataLogo from "../assets/tata-logo.jpeg";
import adaniLogo from "../assets/adani-logo.webp";
import waareeLogo from "../assets/waaree.webp";

type Key = "on-grid" | "off-grid" | "hybrid";

interface Sys {
  label: string;
  title: string;
  tagline: string;
  img: string;
  icon: ReactElement;
  overview: string[];
  how: { title: string; text: string }[];
  comps: { name: string; role: string }[];
  benefits: string[];
  limits: string[];
  suits: string[];
  mh: string[];
  pmSurya: string;
}

const SIZING = [
  { kw: "1 kW", roof: "About 100 sq ft", units: "110 to 130 units", subsidy: "Rs 30,000" },
  { kw: "2 kW", roof: "About 200 sq ft", units: "220 to 260 units", subsidy: "Rs 60,000" },
  { kw: "3 kW", roof: "About 300 sq ft", units: "330 to 390 units", subsidy: "Rs 78,000" },
  { kw: "5 kW", roof: "About 500 sq ft", units: "550 to 650 units", subsidy: "Rs 78,000 (central cap)" },
];

const SYSTEMS: Record<Key, Sys> = {
  "on-grid": {
    label: "On-Grid",
    title: "On-Grid Solar System",
    tagline: "Lowest cost and fastest payback. Works alongside your MSEDCL connection.",
    img: onImg,
    icon: <Sun size={24} />,
    overview: [
      "An on-grid system is connected to the MSEDCL distribution network. Your solar panels power your home first. Any surplus electricity flows into the grid through a bidirectional net meter, and the units you export are credited against the units you import.",
      "There is no battery in this system. That keeps the upfront cost the lowest of the three options, reduces maintenance to periodic cleaning and inspection, and makes it the most common choice for Maharashtra homes with a reasonably stable supply.",
    ],
    how: [
      { title: "Panels generate DC power", text: "Sunlight falling on the modules creates direct current. Output rises through the day and peaks around noon." },
      { title: "Inverter synchronises with the grid", text: "The grid-tied inverter converts DC to AC at the same frequency and voltage as the MSEDCL supply." },
      { title: "Home uses solar first", text: "Fans, lights, fridge, pumps and appliances draw solar power before any grid power is used." },
      { title: "Surplus is exported and credited", text: "Extra units go to the grid through the net meter and reduce the units you pay for in the billing cycle." },
      { title: "Night and cloudy hours", text: "When solar output is low, your home draws from the grid as normal. You are billed only for the net units." },
    ],
    comps: [
      { name: "Solar modules", role: "Convert sunlight into electricity. We use Tier-1 modules from Tata Power Solar, Adani and Waaree." },
      { name: "Grid-tied inverter", role: "Converts DC to grid-synchronised AC and protects against faults." },
      { name: "Bidirectional net meter", role: "Records power you import and export. Supplied and approved by MSEDCL." },
      { name: "Mounting structure", role: "Galvanised or aluminium frame that holds the modules at the correct tilt and resists wind." },
      { name: "AC/DC cabling and earthing", role: "Safe wiring, DC isolators, surge protection and proper earthing." },
      { name: "Monitoring", role: "App or web dashboard showing daily and monthly generation." },
    ],
    benefits: [
      "Lowest upfront cost per kilowatt of the three systems",
      "PM Surya Ghar central subsidy applies to residential grid-connected rooftop systems",
      "Net metering credits offset the units you draw from MSEDCL",
      "No battery to replace, so long-term running cost is low",
      "Usually installed within a day once the design is approved",
    ],
    limits: [
      "No backup power during an MSEDCL outage. The inverter shuts down for safety",
      "Export and net metering depend on MSEDCL approval and the rules in force",
      "Generation falls on heavy monsoon days, so savings vary through the year",
    ],
    suits: [
      "Homes with a reasonably reliable MSEDCL supply",
      "Shops, offices and clinics that use most power during the day",
      "Households looking for the fastest payback at the lowest cost",
    ],
    mh: [
      "Net-meter approval and inspection are processed through MSEDCL (Mahavitaran) under the MERC rooftop solar rules. Arihant handles the application and coordination.",
      "In the Sangli, Kolhapur and Satara belt, a well-sited system typically generates around 3.5 to 4.5 units per kW per day, depending on season and shading.",
      "Central PM Surya Ghar subsidy is paid for grid-connected residential systems. Any Maharashtra state top-up is confirmed for your district before you apply.",
    ],
    pmSurya: "Eligible. On-grid is the standard configuration under PM Surya Ghar for residential homes.",
  },
  "off-grid": {
    label: "Off-Grid",
    title: "Off-Grid Solar System",
    tagline: "Complete independence from the grid, with battery storage for day and night.",
    img: offImg,
    icon: <Battery size={24} />,
    overview: [
      "An off-grid system is not connected to the MSEDCL network at all. Solar panels charge a battery bank through a charge controller, and an off-grid inverter supplies your appliances from that stored energy, through the day, the night and cloudy spells.",
      "Because no grid is involved, an off-grid system suits sites where an MSEDCL connection is unavailable, delayed or expensive to bring in, such as farmhouses, orchards, remote plots and telecom or pump installations.",
    ],
    how: [
      { title: "Panels charge the batteries", text: "Solar modules feed a charge controller, which charges the battery bank safely and efficiently." },
      { title: "Batteries store the energy", text: "The battery bank holds the day's surplus so it can be used after sunset or on cloudy days." },
      { title: "Inverter supplies your loads", text: "The off-grid inverter converts stored DC power to AC for appliances, pumps and lighting." },
      { title: "Sizing matches your daily use", text: "Panels and battery capacity are chosen from your daily units and the number of autonomy days you need." },
      { title: "Surplus is not exported", text: "When batteries are full, extra solar power is curtailed unless you have a diversion load such as a water heater." },
    ],
    comps: [
      { name: "Solar modules", role: "Generate the energy that charges the battery bank each day." },
      { name: "MPPT charge controller", role: "Maximises harvest from the panels and charges batteries correctly." },
      { name: "Battery bank", role: "Lithium (LiFePO4) or tubular lead-acid storage for night and cloudy-day supply." },
      { name: "Off-grid inverter", role: "Supplies AC loads from the batteries and manages the power flow." },
      { name: "Battery management system", role: "Protects lithium cells from over-charge, over-discharge and high temperature." },
      { name: "DC and AC distribution", role: "Fuses, isolators, breakers and earthing for safe operation." },
    ],
    benefits: [
      "Works where there is no MSEDCL connection",
      "Power during every outage, with no switching delay",
      "No monthly electricity bill for the solar-supplied units",
      "Suitable for farms, pumps, remote sheds and off-site loads",
    ],
    limits: [
      "Highest upfront cost, largely because of the battery bank",
      "Batteries are replaced after several years, depending on chemistry and use",
      "Power is limited to what the battery and panels can supply, so loads must be planned",
      "Not connected to the grid, so no net-metering credit is possible",
    ],
    suits: [
      "Farmhouses, orchards and plots without a grid connection",
      "Sites where a new MSEDCL connection will take a long time",
      "Pumps and loads in remote locations",
    ],
    mh: [
      "Off-grid systems are generally outside the grid-connected PM Surya Ghar subsidy. Confirm eligibility with us before ordering.",
      "Monsoon weeks have lower solar output. Plan a larger battery reserve or keep load shedding rules for those weeks.",
      "If the site will later get an MSEDCL connection, we can design the system so it can be converted to hybrid.",
    ],
    pmSurya: "Generally not covered by the grid-connected PM Surya Ghar subsidy. Confirm with us for your site.",
  },
  hybrid: {
    label: "Hybrid",
    title: "Hybrid Solar System",
    tagline: "Grid connection plus battery backup. The best choice for frequent power cuts.",
    img: hybImg,
    icon: <Zap size={24} />,
    overview: [
      "A hybrid system combines a grid connection with a battery bank and a hybrid inverter. It keeps the savings of net metering, and during an MSEDCL outage it continues to power selected backup circuits from solar and the battery.",
      "Arihant Electricals specialises in hybrid systems. We design the backup circuits around the loads that matter most, such as fans, lights, Wi-Fi, refrigerator, water pump and medical equipment.",
    ],
    how: [
      { title: "Solar powers the home first", text: "Daytime generation supplies your loads before anything else." },
      { title: "Surplus charges the battery", text: "Extra energy is stored so it can supply the evening and night load." },
      { title: "Export when allowed", text: "Any surplus beyond battery needs can be exported to the grid under net metering." },
      { title: "Grid tops up when needed", text: "When the battery is low, MSEDCL supply completes the load automatically." },
      { title: "Automatic backup during outages", text: "On an outage the system separates from the grid and powers the backup circuits, then reconnects when supply returns." },
    ],
    comps: [
      { name: "Solar modules", role: "Tier-1 modules that provide daytime generation and battery charging." },
      { name: "Hybrid inverter", role: "Manages solar, battery, grid and backup supply in one unit." },
      { name: "Lithium battery", role: "Typically 5 to 15 kWh, sized to your backup needs. Long cycle life." },
      { name: "Backup distribution board", role: "Separate circuit for the essential loads that stay on during outages." },
      { name: "Bidirectional net meter", role: "Records import and export for MSEDCL net-metering settlement." },
      { name: "Monitoring", role: "Live view of solar, battery, grid and backup status." },
    ],
    benefits: [
      "Backup power for essential loads during MSEDCL outages",
      "Maximum use of your own solar energy",
      "Net metering still applies to any surplus exported",
      "Ideal for clinics, pharmacies, small offices and homes in high-outage areas",
    ],
    limits: [
      "Higher upfront cost than on-grid because of the battery and hybrid inverter",
      "Backup covers only the circuits wired for it, so the load must be planned",
      "Battery is replaced over the life of the system",
    ],
    suits: [
      "Homes that face frequent power cuts from storms, feeder faults or load shedding",
      "Clinics, pharmacies, cold-storage and small offices that cannot afford downtime",
      "Households that want one system for lower bills and dependable backup",
    ],
    mh: [
      "Monsoon storms are the most common cause of outages in the Sangli, Kolhapur and Satara belt. Hybrid systems keep backup circuits running through them.",
      "Hybrid is grid-connected, so net metering with MSEDCL applies. Confirm the PM Surya Ghar subsidy treatment for your battery configuration before you apply.",
      "Battery sizing depends on the backup hours you need and the load you want covered. We size it on your actual consumption.",
    ],
    pmSurya: "Grid-connected, so it can be considered for PM Surya Ghar. Confirm eligibility for your battery configuration with us.",
  },
};

const TYPES: Key[] = ["on-grid", "off-grid", "hybrid"];

const STYLE = `
.pr { font-family:"Manrope","Segoe UI",Roboto,Arial,sans-serif; color:#0F2A3F; overflow:hidden; }
.pr a { color:inherit; text-decoration:none; }
.pr img { display:block; max-width:100%; }
.pr-wrap { max-width:1200px; margin:0 auto; padding:0 20px; }

/* --- UPDATED HERO STYLES --- */
.pr-hero { position:relative; overflow:hidden; min-height:500px; background:#075985; color:#fff; display:flex; align-items:center; }
.pr-hero::before { content:""; position:absolute; inset:0; z-index:1; background:linear-gradient(90deg,rgba(7,89,133,.74) 0%,rgba(14,165,233,.25) 75%); }
.pr-hero-grid { position:relative; z-index:2; width:100%; padding-top:80px; padding-bottom:80px; }
.pr-hero .pr-eyebrow { background:rgba(255,255,255,.2); color:#fff; }
.pr-hero h1 { font-size:clamp(32px,4.2vw,50px); font-weight:800; line-height:1.1; margin:16px 0 14px; max-width:600px; }
.pr-hero p { font-size:17px; line-height:1.7; color:#E0F2FE; margin:0; max-width:500px; }
.pr-hero-media { position:absolute; top:0; right:0; bottom:0; width:100%; z-index:0; }
.pr-hero-media img { width:100%; height:100%; object-fit:cover; object-position:center 35%; }
/* --------------------------- */

.pr-eyebrow { display:inline-block; font-size:12.5px; font-weight:800; letter-spacing:.14em; text-transform:uppercase; color:#0369A1; background:#E0F2FE; padding:7px 14px; border-radius:999px; }
.pr-tabs-bar { background:#fff; border-bottom:1px solid #DCEAF3; }
.pr-tabs-in { display:flex; justify-content:center; gap:8px; flex-wrap:wrap; padding-top:16px; padding-bottom:16px; }
.pr-tab { display:inline-flex; align-items:center; justify-content:center; height:34px; min-width:110px; padding:0 18px; border-radius:999px; font-weight:700; font-size:13px; color:#4B5D6E; background:#F3F9FD; border:1px solid #DCEAF3; transition:all .2s; }
.pr-tab:hover { color:#0369A1; border-color:#7DD3FC; }
.pr-tab.is-on { background:#0EA5E9; color:#fff; border-color:#0EA5E9; }
.pr-sec { padding:76px 0; }
.pr-soft { background:#F3F9FD; }
.pr-h2 { font-size:clamp(26px,3vw,36px); font-weight:800; color:#075985; margin:12px 0 14px; line-height:1.18; }
.pr-lead { font-size:16.5px; line-height:1.75; color:#4B5D6E; margin:0 0 14px; }
.pr-split { display:grid; grid-template-columns:1fr 1fr; gap:56px; align-items:center; }
.pr-split img { width:100%; height:auto; max-height:460px; object-fit:contain; border-radius:24px; box-shadow:0 26px 60px rgba(3,105,161,.2); }
.pr-steps { display:grid; gap:0; margin-top:34px; }
.pr-step { display:grid; grid-template-columns:64px 1fr; gap:20px; padding:22px 0; border-top:1px solid #DCEAF3; }
.pr-step:last-child { border-bottom:1px solid #DCEAF3; }
.pr-step-n { width:50px; height:50px; border-radius:14px; background:linear-gradient(135deg,#0EA5E9,#0369A1); color:#fff; font-weight:800; font-size:18px; display:flex; align-items:center; justify-content:center; }
.pr-step h3 { margin:0 0 6px; font-size:18px; font-weight:800; color:#075985; }
.pr-step p { margin:0; color:#4B5D6E; line-height:1.7; font-size:15.5px; }
.pr-table { width:100%; border-collapse:collapse; background:#fff; border-radius:18px; overflow:hidden; border:1px solid #DCEAF3; margin-top:28px; }
.pr-table th, .pr-table td { text-align:left; padding:14px 18px; font-size:15px; border-top:1px solid #E6F1F8; vertical-align:top; }
.pr-table th { background:#0EA5E9; color:#fff; border-top:0; font-weight:800; }
.pr-table td:first-child { font-weight:800; color:#075985; width:30%; }
.pr-table td { color:#3E5263; }
.pr-two { display:grid; grid-template-columns:1fr 1fr; gap:40px; }
.pr-list { list-style:none; padding:0; margin:20px 0 0; display:grid; gap:12px; }
.pr-list li { display:flex; gap:11px; align-items:flex-start; font-size:15.5px; line-height:1.6; color:#2E4455; }
.pr-list svg { flex-shrink:0; margin-top:3px; }
.pr-note { border-left:4px solid #FBBF24; background:#FFFBEB; padding:16px 20px; border-radius:12px; margin-top:16px; }
.pr-note p { margin:0; font-size:15px; line-height:1.65; color:#4B5D6E; }
.pr-pm { display:flex; gap:14px; align-items:flex-start; background:#fff; border:1px solid #DCEAF3; border-radius:16px; padding:20px 22px; margin-top:24px; }
.pr-pm svg { color:#0369A1; flex-shrink:0; margin-top:2px; }
.pr-pm p { margin:0; font-size:15.5px; line-height:1.65; color:#2E4455; }
.pr-mh { display:grid; gap:14px; margin-top:24px; }
.pr-mh-item { display:flex; gap:14px; align-items:flex-start; padding:18px 20px; background:#fff; border:1px solid #DCEAF3; border-radius:16px; }
.pr-mh-item svg { color:#0EA5E9; flex-shrink:0; margin-top:2px; }
.pr-mh-item p { margin:0; font-size:15px; line-height:1.65; color:#2E4455; }
.pr-btn { display:inline-flex; align-items:center; gap:9px; padding:14px 24px; border-radius:13px; font-weight:800; background:#FBBF24; color:#0F2A3F; box-shadow:0 12px 24px rgba(251,191,36,.35); transition:transform .25s; margin-top:24px; }
.pr-btn:hover { transform:translateY(-3px); }
.pr-cmp { width:100%; border-collapse:collapse; background:#fff; border:1px solid #DCEAF3; border-radius:18px; overflow:hidden; }
.pr-cmp th, .pr-cmp td { padding:14px 16px; text-align:left; font-size:15px; border-top:1px solid #E6F1F8; vertical-align:top; }
.pr-cmp th { background:#0EA5E9; color:#fff; border-top:0; }
.pr-cmp td:first-child { font-weight:800; color:#075985; width:24%; }
.pr-cmp td { color:#3E5263; }
.pr-cmp a { color:#0369A1; font-weight:800; }
.pr-brand-row { display:flex; gap:40px; align-items:center; justify-content:center; flex-wrap:wrap; margin-top:30px; }
.pr-brand-row img { height:40px; width:auto; max-width:150px; object-fit:contain; }

@media (max-width:900px){
  .pr-hero { min-height:400px; }
 .pr-hero: { background:linear-gradient(180deg, rgba(7,89,133,0.75) 0%, rgba(7,89,133,0.6) 100%); }
  .pr-hero-media img { object-position:center 50%; }
  .pr-split, .pr-two { grid-template-columns:1fr; gap:30px; }
}
@media (max-width:620px){ .pr-table th, .pr-table td, .pr-cmp th, .pr-cmp td { font-size:14px; padding:12px; } .pr-step { grid-template-columns:50px 1fr; gap:14px; } .pr-step-n { width:42px; height:42px; font-size:16px; } }
`;

function Hero({ eyebrow, title, text, img }: { eyebrow: string; title: string; text: string; img: string }) {
  return (
    <section className="pr-hero">
      {/* Image placed first so it sits absolutely behind everything */}
      <div className="pr-hero-media"><img src={img} alt={title} /></div>
      <div className="pr-wrap pr-hero-grid">
        <div>
          <span className="pr-eyebrow">{eyebrow}</span>
          <h1>{title}</h1>
          <p>{text}</p>
        </div>
      </div>
    </section>
  );
}

//  width: "100%",
//               height: "100%",
//               objectFit: "cover",
//               objectPosition: "10% 40%", // or "center 22%" to focus on the face
//               display: "block",



function SystemBody({ sys, slug }: { sys: Sys; slug: Key }) {
  return (
    <>
      <section className="pr-sec">
        <div className="pr-wrap pr-split">
          <div>
            <span className="pr-eyebrow">Overview</span>
            <h2 className="pr-h2">What a {sys.label.toLowerCase()} system is</h2>
            {sys.overview.map((p, i) => <p key={i} className="pr-lead">{p}</p>)}
          </div>
          <img src={slug === "on-grid" ? onImg : slug === "off-grid" ? offImg : hybImg} alt={`${sys.label} system detail`} />
        </div>
      </section>

      <section className="pr-sec pr-soft">
        <div className="pr-wrap">
          <span className="pr-eyebrow">How it works</span>
          <h2 className="pr-h2">Step by step</h2>
          <div className="pr-steps">
            {sys.how.map((s, i) => (
              <div key={s.title} className="pr-step">
                <div className="pr-step-n">{i + 1}</div>
                <div><h3>{s.title}</h3><p>{s.text}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="pr-sec">
        <div className="pr-wrap">
          <span className="pr-eyebrow">Components</span>
          <h2 className="pr-h2">What is in the system and what each part does</h2>
          <table className="pr-table">
            <thead><tr><th>Component</th><th>Role in your system</th></tr></thead>
            <tbody>{sys.comps.map((c) => <tr key={c.name}><td>{c.name}</td><td>{c.role}</td></tr>)}</tbody>
          </table>
        </div>
      </section>

      <section className="pr-sec pr-soft">
        <div className="pr-wrap pr-two">
          <div>
            <h2 className="pr-h2" style={{ fontSize: 26 }}>Benefits</h2>
            <ul className="pr-list">{sys.benefits.map((b) => <li key={b}><CheckCircle2 size={19} color="#16A34A" />{b}</li>)}</ul>
          </div>
          <div>
            <h2 className="pr-h2" style={{ fontSize: 26 }}>Limitations to know</h2>
            <ul className="pr-list">{sys.limits.map((l) => <li key={l}><XCircle size={19} color="#DC2626" />{l}</li>)}</ul>
          </div>
        </div>
      </section>

      <section className="pr-sec">
        <div className="pr-wrap pr-two">
          <div>
            <span className="pr-eyebrow">Who should choose it</span>
            <ul className="pr-list" style={{ marginTop: 18 }}>{sys.suits.map((s) => <li key={s}><Home size={19} color="#0369A1" />{s}</li>)}</ul>
          </div>
          <div>
            <span className="pr-eyebrow">Maharashtra and PM Surya Ghar</span>
            <div className="pr-pm"><BadgeIndianRupee size={22} /><p>{sys.pmSurya}</p></div>
            <div className="pr-mh">
              {sys.mh.map((m) => (
                <div key={m} className="pr-mh-item"><MapPin size={19} /><p>{m}</p></div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="pr-sec pr-soft">
        <div className="pr-wrap">
          <span className="pr-eyebrow">Sizing guide</span>
          <h2 className="pr-h2">Approximate sizing for Maharashtra homes</h2>
          <p className="pr-lead">Figures are indicative. Actual generation depends on roof orientation, shading and season. Our survey confirms the exact size.</p>
          <table className="pr-table">
            <thead><tr><th>System size</th><th>Roof area needed</th><th>Monthly generation</th><th>Central subsidy</th></tr></thead>
            <tbody>
              {SIZING.map((r) => (
                <tr key={r.kw}><td>{r.kw}</td><td>{r.roof}</td><td>{r.units}</td><td>{r.subsidy}</td></tr>
              ))}
            </tbody>
          </table>
          <div className="pr-note"><p>Subsidy shown is the central PM Surya Ghar amount for grid-connected residential systems. The central amount is the same for 3 kW and above. Any state top-up is confirmed at application.</p></div>
          <Link to="/contact" className="pr-btn">Get a site survey for {sys.label} <ArrowRight size={18} /></Link>
        </div>
      </section>

      <section className="pr-sec">
        <div className="pr-wrap" style={{ textAlign: "center" }}>
          <span className="pr-eyebrow">Equipment partners</span>
          <h2 className="pr-h2">Tier-1 brands we install</h2>
          <div className="pr-brand-row">
            <img src={tataLogo} alt="Tata Power Solar" />
            <img src={adaniLogo} alt="Adani Solar" />
            <img src={waareeLogo} alt="Waaree Energies" />
          </div>
        </div>
      </section>
    </>
  );
}

const COMPARE = [
  ["Grid connection", "Yes, with MSEDCL", "No", "Yes, with MSEDCL"],
  ["Battery", "Not required", "Required", "Required"],
  ["Backup during outage", "No", "Yes, always", "Yes, for backup circuits"],
  ["Net metering", "Yes", "Not applicable", "Yes, for exported units"],
  ["Relative cost", "Lowest", "Highest", "Mid to high"],
  ["Best for", "Homes with reliable supply", "Farms and remote sites", "Frequent outages and uptime"],
];

export default function Products() {
  const { type } = useParams();

  if (type && !TYPES.includes(type as Key)) return <Navigate to="/products" replace />;

  if (!type) {
    return (
      <div className="pr">
        <style>{STYLE}</style>
        <Hero eyebrow="Our products" title="Three solar systems. One clear choice." text="Compare on-grid, off-grid and hybrid systems side by side, then open the full details for the one that suits your home or business." img={heroImg} />
        <div className="pr-tabs-bar">
          <div className="pr-wrap pr-tabs-in">
            {TYPES.map((t) => (
              <Link key={t} to={`/products/${t}`} className="pr-tab">{SYSTEMS[t].label}</Link>
            ))}
          </div>
        </div>
        <section className="pr-sec">
          <div className="pr-wrap">
            <span className="pr-eyebrow">Comparison</span>
            <h2 className="pr-h2">On-grid, off-grid and hybrid at a glance</h2>
            <table className="pr-cmp">
              <thead><tr><th>Feature</th><th>On-Grid</th><th>Off-Grid</th><th>Hybrid</th></tr></thead>
              <tbody>
                {COMPARE.map((r) => (
                  <tr key={r[0]}><td>{r[0]}</td><td>{r[1]}</td><td>{r[2]}</td><td>{r[3]}</td></tr>
                ))}
                <tr>
                  <td>Full details</td>
                  <td><Link to="/products/on-grid">View On-Grid</Link></td>
                  <td><Link to="/products/off-grid">View Off-Grid</Link></td>
                  <td><Link to="/products/hybrid">View Hybrid</Link></td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
        <section className="pr-sec pr-soft">
          <div className="pr-wrap">
            <span className="pr-eyebrow">Not sure which to choose?</span>
            <h2 className="pr-h2">Our engineers will recommend the right system</h2>
            <p className="pr-lead">Share your monthly MSEDCL bill and how often you lose power. We will recommend a system size, the subsidy you can claim and the payback period, free of charge.</p>
            <Link to="/contact" className="pr-btn">Book a free survey <ArrowRight size={18} /></Link>
          </div>
        </section>
      </div>
    );
  }

  const key = type as Key;
  const sys = SYSTEMS[key];

  return (
    <div className="pr">
      <style>{STYLE}</style>
      <Hero eyebrow={`${sys.label} system`} title={sys.title} text={sys.tagline} img={sys.img} />
      <div className="pr-tabs-bar">
        <div className="pr-wrap pr-tabs-in">
          {TYPES.map((t) => (
            <Link key={t} to={`/products/${t}`} className={`pr-tab${t === key ? " is-on" : ""}`}>{SYSTEMS[t].label}</Link>
          ))}
        </div>
      </div>
      <SystemBody key={key} sys={sys} slug={key} />
    </div>
  );
}