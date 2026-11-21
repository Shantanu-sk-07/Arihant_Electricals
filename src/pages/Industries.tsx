import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Building2, CheckCircle2, ChevronDown, Factory, GraduationCap, Hotel, Snowflake, Store, TrendingUp, Warehouse } from "lucide-react";
import heroImg from "../assets/InstallationWorker.jpeg";
import sideImg from "../assets/Vendor_Consumer.jpeg";

const STYLE = `
.in-pg { font-family:"Manrope","Segoe UI",Roboto,Arial,sans-serif; color:#0F2A3F; overflow:hidden; }
.in-pg a { color:inherit; text-decoration:none; }
.in-pg img { display:block; max-width:100%; }
.in-wrap { max-width:1200px; margin:0 auto; padding:0 20px; }
.in-eyebrow { display:inline-block; font-size:12.5px; font-weight:800; letter-spacing:.14em; text-transform:uppercase; color:#0369A1; background:#E0F2FE; padding:7px 14px; border-radius:999px; }
.in-hero { position:relative; background:#075985; color:#fff; overflow:hidden; }
.in-hero-img { position:absolute; inset:0; }
.in-hero-img img { width:100%; height:100%; object-fit:cover; object-position:center 30%; }
.in-hero::after { content:""; position:absolute; inset:0; background:linear-gradient(90deg,rgba(7,89,133,.74),rgba(14,165,233,.25)); }
.in-hero-in { position:relative; z-index:2; padding:84px 0 92px; max-width:740px; }
.in-hero .in-eyebrow { background:rgba(255,255,255,.2); color:#fff; }
.in-hero h1 { font-size:clamp(34px,4.8vw,54px); font-weight:800; line-height:1.08; margin:16px 0 16px; }
.in-hero p { font-size:17.5px; line-height:1.7; color:#E0F2FE; margin:0 0 26px; }
.in-btn { display:inline-flex; align-items:center; gap:9px; padding:14px 24px; border-radius:13px; font-weight:800; background:#FBBF24; color:#0F2A3F; box-shadow:0 12px 24px rgba(251,191,36,.35); }
.in-sec { padding:76px 0; }
.in-soft { background:#F3F9FD; }
.in-h2 { font-size:clamp(26px,3vw,36px); font-weight:800; color:#075985; margin:12px 0 14px; line-height:1.18; }
.in-lead { font-size:16.5px; line-height:1.75; color:#4B5D6E; margin:0 0 14px; }
.in-split { display:grid; grid-template-columns:1fr 1fr; gap:56px; align-items:center; }
.in-split img { width:100%; height:400px; object-fit:cover; border-radius:24px; box-shadow:0 24px 56px rgba(3,105,161,.2); }
.in-table { width:100%; border-collapse:collapse; background:#fff; border:1px solid #DCEAF3; border-radius:18px; overflow:hidden; margin-top:26px; }
.in-table th, .in-table td { padding:14px 18px; text-align:left; font-size:15px; border-top:1px solid #E6F1F8; vertical-align:top; }
.in-table th { background:#0EA5E9; color:#fff; border-top:0; font-weight:800; }
.in-table td:first-child { font-weight:800; color:#075985; }
.in-table td { color:#3E5263; }
.in-sectors { display:grid; gap:0; margin-top:28px; }
.in-sector { border-top:1px solid #DCEAF3; }
.in-sector:last-child { border-bottom:1px solid #DCEAF3; }
.in-sector-head { width:100%; display:grid; grid-template-columns:52px 1fr auto; gap:18px; align-items:center; padding:20px 4px; background:none; border:0; cursor:pointer; font:inherit; text-align:left; color:#075985; font-weight:800; font-size:18px; }
.in-sector-head .ico { width:46px; height:46px; border-radius:13px; background:#E0F2FE; color:#0369A1; display:flex; align-items:center; justify-content:center; }
.in-sector-head svg.chev { transition:transform .3s; color:#0EA5E9; }
.in-sector.open .in-sector-head svg.chev { transform:rotate(180deg); }
.in-sector-body { max-height:0; overflow:hidden; transition:max-height .45s ease; }
.in-sector.open .in-sector-body { max-height:600px; }
.in-sector-body div { padding:0 4px 24px 70px; }
.in-sector-body p { margin:0 0 12px; color:#3E5263; line-height:1.75; font-size:15.5px; }
.in-list { list-style:none; padding:0; margin:12px 0 0; display:grid; gap:10px; }
.in-list li { display:flex; gap:10px; align-items:flex-start; font-size:15px; line-height:1.6; color:#2E4455; }
.in-list svg { color:#16A34A; flex-shrink:0; margin-top:2px; }
.in-grid2 { display:grid; grid-template-columns:1fr 1fr; gap:40px; margin-top:20px; }
.in-pts { list-style:none; padding:0; margin:0; display:grid; gap:14px; }
.in-pts li { display:flex; gap:12px; align-items:flex-start; font-size:15.5px; line-height:1.65; color:#2E4455; }
.in-pts svg { color:#0369A1; flex-shrink:0; margin-top:2px; }
.in-cta { margin-top:44px; background:linear-gradient(135deg,#075985,#0EA5E9); color:#fff; border-radius:22px; padding:32px; display:flex; justify-content:space-between; align-items:center; gap:20px; flex-wrap:wrap; }
.in-cta h3 { margin:0 0 6px; font-size:22px; font-weight:800; }
.in-cta p { margin:0; color:#E0F2FE; }
.in-cta a { display:inline-flex; align-items:center; gap:9px; background:#FBBF24; color:#0F2A3F; padding:14px 24px; border-radius:13px; font-weight:800; }
@media (max-width:900px){ .in-split, .in-grid2 { grid-template-columns:1fr; gap:30px; } .in-split img { height:280px; } .in-sector-body div { padding-left:4px; } }
@media (max-width:620px){ .in-table th, .in-table td { padding:11px 12px; font-size:14px; } .in-sector-head { grid-template-columns:44px 1fr auto; font-size:16px; } .in-sector-head .ico { width:40px; height:40px; } }
`;

const SECTORS = [
  {
    icon: <Factory size={22} />,
    title: "Factories and manufacturing units",
    profile: "Heavy daytime load from motors, compressors and machinery.",
    system: "Grid-connected rooftop system sized to daytime consumption, often 50 kW to several hundred kW on sheds.",
    points: [
      "Solar matches the daytime load, so most of the generation is used on site",
      "Elevated structures can be built over factory sheds to protect the roof",
      "Monitoring shows the output of each block of panels",
      "Installation planned around production so downtime stays minimal",
    ],
  },
  {
    icon: <Store size={22} />,
    title: "Shops, malls and retail outlets",
    profile: "Lighting, air-conditioning and refrigeration through store hours.",
    system: "Rooftop on-grid system sized to the store's daytime load. Hybrid is added where uptime is critical.",
    points: [
      "Lower daytime bills, since solar supplies most store-hour consumption",
      "Refrigeration and billing systems stay powered when a battery backup is included",
      "Compact installation that does not disrupt trading",
    ],
  },
  {
    icon: <Building2 size={22} />,
    title: "Offices and IT campuses",
    profile: "Predictable weekday load from computing, HVAC and lighting.",
    system: "Grid-connected system sized to office hours, with optional battery for server rooms and critical loads.",
    points: [
      "Predictable load makes sizing accurate and payback clear",
      "Battery backup protects servers and networking during outages",
      "Reporting that suits corporate sustainability goals",
    ],
  },
  {
    icon: <Hotel size={22} />,
    title: "Hotels and guest houses",
    profile: "Round-the-clock load with peaks in the evening and at night.",
    system: "Hybrid system where the battery covers the evening peak and essential loads during outages.",
    points: [
      "Battery shifts solar energy into the evening, when tariffs and demand are highest",
      "Guest comfort is protected during outages",
      "A good fit for properties with large roof areas",
    ],
  },
  {
    icon: <GraduationCap size={22} />,
    title: "Schools and colleges",
    profile: "Daytime load on weekdays, with low use on holidays.",
    system: "On-grid rooftop system sized to school hours, with a small battery for computer labs if required.",
    points: [
      "Sizing matches term-time load, so the system is not oversized",
      "Good for education institutions that want visible sustainability",
    ],
  },
  {
    icon: <Snowflake size={22} />,
    title: "Cold storage and pharma",
    profile: "Continuous load for refrigeration, where a power cut means loss of stock.",
    system: "Hybrid system with a battery and backup for cold-chain loads, sized on the critical load only.",
    points: [
      "Backup keeps cold rooms running during outages",
      "Critical loads are separated so the battery is used efficiently",
      "Monitoring alerts you to supply issues",
    ],
  },
  {
    icon: <Warehouse size={22} />,
    title: "Warehouses and logistics",
    profile: "Large roof areas and steady daytime loads for lighting, fans and material handling.",
    system: "Large on-grid system on flat or sloped warehouse roofs, with structural check before installation.",
    points: [
      "Large roof areas give high generation per site",
      "Structural assessment confirms the roof can take the system",
      "Lower operating cost over long leases and long-term use",
    ],
  },
];

const TABLE = [
  ["Load profile", "Daytime-heavy, steady", "Daytime and night, higher peaks"],
  ["Typical system", "On-grid, large rooftop", "On-grid or hybrid, sized to load"],
  ["Approval route", "MSEDCL commercial connection", "MSEDCL, with additional checks"],
  ["Subsidy", "Not part of PM Surya Ghar", "Not part of PM Surya Ghar"],
  ["Tax benefit", "Accelerated depreciation may apply", "Accelerated depreciation may apply"],
];

const FAQS = [
  { q: "What is accelerated depreciation for solar?", a: "Businesses can claim accelerated depreciation on solar assets under the Income Tax rules. The rate currently applicable to solar equipment is commonly 40 percent in the first year, for eligible businesses. Confirm the treatment with your chartered accountant before you decide." },
  { q: "Does a commercial system qualify for PM Surya Ghar?", a: "No. PM Surya Ghar is for residential homes. Commercial and industrial systems follow their own approval and tariff route with MSEDCL, and the financial benefits differ." },
  { q: "Can we use open access for a large plant?", a: "Open access lets a business buy power from a generator through the grid, and it is relevant for larger loads. We advise on whether open access makes sense for your site, given its approvals and charges." },
  { q: "How do you size a commercial system?", a: "We study at least twelve months of electricity bills, the load pattern during the day and night, and the roof or land available. That gives a system size matched to your real consumption, rather than a guess." },
];

export default function Industries() {
  const [open, setOpen] = useState<number | null>(0);
  const [qOpen, setQOpen] = useState<number | null>(0);

  return (
    <div className="in-pg">
      <style>{STYLE}</style>

      <section className="in-hero">
        <div className="in-hero-img"><img src={heroImg} alt="" /></div>
        <div className="in-wrap">
          <div className="in-hero-in">
            <span className="in-eyebrow">Commercial and industrial solar</span>
            <h1>Solar solutions built for every kind of business</h1>
            <p>From factories and warehouses to schools, hotels and cold storage, we size each commercial system to the load you actually use, and handle the approvals and tax treatment with you.</p>
            <Link to="/contact" className="in-btn">Request an industrial site survey <ArrowRight size={18} /></Link>
          </div>
        </div>
      </section>

      <section className="in-sec">
        <div className="in-wrap in-split">
          <div>
            <span className="in-eyebrow">Overview</span>
            <h2 className="in-h2">Commercial solar is sized to the load, not the roof</h2>
            <p className="in-lead">A business is charged on units consumed and, for many connections, on maximum demand. A well-designed system reduces both, and the design starts from twelve months of your bills and your daily load pattern.</p>
            <p className="in-lead">Commercial projects also follow different approval and tax rules from homes. We explain the route for your category before you commit, so there are no surprises later.</p>
          </div>
          <img src={sideImg} alt="Commercial solar installation" />
        </div>
      </section>

      <section className="in-sec in-soft">
        <div className="in-wrap">
          <span className="in-eyebrow">Sectors</span>
          <h2 className="in-h2">Who we design for</h2>
          <p className="in-lead">Select a sector to see its load profile, the system we recommend and the main points for that business.</p>
          <div className="in-sectors">
            {SECTORS.map((s, i) => {
              const isOpen = open === i;
              return (
                <div key={s.title} className={`in-sector${isOpen ? " open" : ""}`}>
                  <button className="in-sector-head" onClick={() => setOpen(isOpen ? null : i)} aria-expanded={isOpen}>
                    <span className="ico">{s.icon}</span>
                    <span>{s.title}</span>
                    <ChevronDown size={20} className="chev" />
                  </button>
                  <div className="in-sector-body">
                    <div>
                      <p><b>Typical load:</b> {s.profile}</p>
                      <p><b>Recommended system:</b> {s.system}</p>
                      <ul className="in-list">
                        {s.points.map((p) => <li key={p}><CheckCircle2 size={18} />{p}</li>)}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="in-sec">
        <div className="in-wrap">
          <span className="in-eyebrow">Comparison</span>
          <h2 className="in-h2">Commercial and industrial at a glance</h2>
          <table className="in-table">
            <thead><tr><th>Point</th><th>Commercial</th><th>Industrial</th></tr></thead>
            <tbody>{TABLE.map((r) => <tr key={r[0]}><td>{r[0]}</td><td>{r[1]}</td><td>{r[2]}</td></tr>)}</tbody>
          </table>
        </div>
      </section>

      <section className="in-sec in-soft">
        <div className="in-wrap in-grid2">
          <div>
            <span className="in-eyebrow">Financial benefits</span>
            <h2 className="in-h2" style={{ fontSize: 26 }}>Why businesses invest</h2>
            <ul className="in-pts">
              <li><TrendingUp size={19} />Lower electricity cost per unit, especially on daytime tariffs</li>
              <li><TrendingUp size={19} />Accelerated depreciation for eligible businesses</li>
              <li><TrendingUp size={19} />Predictable energy cost for years, protected from tariff rises</li>
              <li><TrendingUp size={19} />Visible sustainability reporting for customers and investors</li>
            </ul>
          </div>
          <div>
            <span className="in-eyebrow">Our process</span>
            <h2 className="in-h2" style={{ fontSize: 26 }}>How a commercial project runs</h2>
            <ul className="in-pts">
              <li><CheckCircle2 size={19} />Twelve-month bill and load study, then a feasibility report</li>
              <li><CheckCircle2 size={19} />Structural check of the roof or site and layout design</li>
              <li><CheckCircle2 size={19} />MSEDCL approvals and net-metering or open-access paperwork</li>
              <li><CheckCircle2 size={19} />Installation planned around operations, then commissioning and monitoring</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="in-sec">
        <div className="in-wrap">
          <span className="in-eyebrow">Questions</span>
          <h2 className="in-h2">Commercial solar questions</h2>
          <div className="in-sectors">
            {FAQS.map((f, i) => {
              const isOpen = qOpen === i;
              return (
                <div key={f.q} className={`in-sector${isOpen ? " open" : ""}`}>
                  <button className="in-sector-head" onClick={() => setQOpen(isOpen ? null : i)} aria-expanded={isOpen}>
                    <span className="ico"><CheckCircle2 size={22} /></span>
                    <span style={{ fontSize: 16 }}>{f.q}</span>
                    <ChevronDown size={20} className="chev" />
                  </button>
                  <div className="in-sector-body"><div><p>{f.a}</p></div></div>
                </div>
              );
            })}
          </div>

          <div className="in-cta">
            <div>
              <h3>Request an industrial site survey</h3>
              <p>Send twelve months of bills and your roof or site details. We reply with a feasibility outline.</p>
            </div>
            <Link to="/contact">Start the survey <ArrowRight size={18} /></Link>
          </div>
        </div>
      </section>
    </div>
  );
}