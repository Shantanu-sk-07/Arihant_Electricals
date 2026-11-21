import { Link } from "react-router-dom";
import { ArrowRight, Award, CalendarDays, CheckCircle2, MapPin, ShieldCheck, Sun, Target, Users, Zap, Eye } from "lucide-react";
import heroImg from "../assets/MSD_ThumpsUp.png";
import storyImg from "../assets/Vendor_Consumer.jpeg";
import teamImg from "../assets/HowPlanSOlar.jpeg";
import tataLogo from "../assets/tata-logo.jpeg";
import adaniLogo from "../assets/adani-logo.webp";
import waareeLogo from "../assets/waaree.webp";

const STYLE = `
.ab { font-family:"Manrope","Segoe UI",Roboto,Arial,sans-serif; color:#0F2A3F; overflow:hidden; }
.ab a { color:inherit; text-decoration:none; }
.ab img { display:block; max-width:100%; }
.ab-wrap { max-width:1200px; margin:0 auto; padding:0 20px; }
.ab-eyebrow { display:inline-block; font-size:12.5px; font-weight:800; letter-spacing:.14em; text-transform:uppercase; color:#0369A1; background:#E0F2FE; padding:7px 14px; border-radius:999px; }
.ab-hero { position:relative; background:#075985; color:#fff; overflow:hidden; }
.ab-hero-img { position:absolute; inset:0; }
.ab-hero-img img { width:100%; height:100%; object-fit:cover; object-position:center 5%; }
.ab-hero::after { content:""; position:absolute; inset:0; background:linear-gradient(90deg,rgba(7,89,133,.74) 0%,rgba(14,165,233,.25) 75%); }
.ab-hero-in { position:relative; z-index:2; padding:84px 0 92px; max-width:720px; }
.ab-hero .ab-eyebrow { background:rgba(255,255,255,.2); color:#fff; }
.ab-hero h1 { font-size:clamp(34px,4.8vw,54px); font-weight:800; line-height:1.08; margin:16px 0 16px; }
.ab-hero p { font-size:17.5px; line-height:1.7; color:#E0F2FE; margin:0; }
.ab-sec { padding:76px 0; }
.ab-soft { background:#F3F9FD; }
.ab-split { display:grid; grid-template-columns:1fr 1fr; gap:56px; align-items:center; }
.ab-split img { width:100%; height:420px; object-fit:cover; border-radius:24px; box-shadow:0 26px 60px rgba(3,105,161,.2); }
.ab-h2 { font-size:clamp(26px,3vw,36px); font-weight:800; color:#075985; margin:12px 0 14px; line-height:1.18; }
.ab-lead { font-size:16.5px; line-height:1.75; color:#4B5D6E; margin:0 0 14px; }
.ab-facts { display:grid; gap:0; margin-top:24px; }
.ab-fact { display:grid; grid-template-columns:48px 1fr; gap:16px; align-items:center; padding:16px 0; border-top:1px solid #DCEAF3; }
.ab-fact:last-child { border-bottom:1px solid #DCEAF3; }
.ab-fact-ico { width:44px; height:44px; border-radius:12px; background:#E0F2FE; color:#0369A1; display:flex; align-items:center; justify-content:center; }
.ab-fact b { display:block; font-size:16px; color:#075985; }
.ab-fact span { font-size:14.5px; color:#4B5D6E; line-height:1.55; }
.ab-mv { display:grid; grid-template-columns:1fr 1fr; gap:40px; }
.ab-mv-item { border-left:4px solid #0EA5E9; padding:4px 0 4px 22px; }
.ab-mv-item h3 { margin:0 0 8px; font-size:20px; font-weight:800; color:#075985; display:flex; align-items:center; gap:9px; }
.ab-mv-item p { margin:0; font-size:16px; line-height:1.75; color:#4B5D6E; }
.ab-list { list-style:none; padding:0; margin:20px 0 0; display:grid; gap:12px; }
.ab-list li { display:flex; gap:11px; align-items:flex-start; font-size:15.5px; line-height:1.6; color:#2E4455; }
.ab-list svg { color:#16A34A; flex-shrink:0; margin-top:2px; }
.ab-areas { display:flex; flex-wrap:wrap; gap:10px; margin-top:20px; }
.ab-area { display:inline-flex; align-items:center; gap:7px; background:#fff; border:1px solid #DCEAF3; color:#075985; font-weight:800; padding:10px 16px; border-radius:999px; font-size:14.5px; }
.ab-brands { display:flex; gap:44px; align-items:center; justify-content:center; flex-wrap:wrap; margin-top:30px; }
.ab-brands img { height:45px; width:auto; max-width:180px;background: transparent;   border-radius: 3px; border:1px solid #DCEAF3; object-fit:contain; }
.ab-cta { margin-top:44px; background:linear-gradient(135deg,#075985,#0EA5E9); color:#fff; border-radius:22px; padding:32px; display:flex; justify-content:space-between; align-items:center; gap:20px; flex-wrap:wrap; }
.ab-cta h3 { margin:0 0 6px; font-size:22px; font-weight:800; }
.ab-cta p { margin:0; color:#E0F2FE; }
.ab-cta a { display:inline-flex; align-items:center; gap:9px; background:#FBBF24; color:#0F2A3F; padding:14px 24px; border-radius:13px; font-weight:800; }
@media (max-width:900px){ .ab-split, .ab-mv { grid-template-columns:1fr; gap:30px; } .ab-split img { height:280px; } }
`;

const FACTS = [
  { icon: <CalendarDays size={20} />, t: "Electrical government contractor since 2019", d: "Years of work on electrical installations and government-approved projects across the region." },
  { icon: <Award size={20} />, t: "Official retail partner of Tata Power Solar", d: "Tata Power Solar modules and inverters, supplied and installed with the manufacturer's warranty." },
  { icon: <ShieldCheck size={20} />, t: "Distribution partner of Waaree Energies", d: "Waaree modules for high efficiency and strong long-term performance." },
  { icon: <Sun size={20} />, t: "PM Surya Ghar vendor", d: "We register, document and track residential subsidy applications for Maharashtra households." },
  { icon: <Zap size={20} />, t: "Experts in hybrid solar systems", d: "Battery backup designed for MSEDCL outages, monsoon storms and load shedding." },
];

const SERVICES = [
  "Free site survey and written design for homes and businesses",
  "On-grid, off-grid and hybrid solar installation",
  "PM Surya Ghar registration, documents and subsidy follow-up",
  "MSEDCL net-metering application and net-meter coordination",
  "Commercial and industrial rooftop solar with open-access guidance",
  "Annual maintenance, cleaning and performance monitoring",
];

const WHY = [
  "Honest site survey and design, with no pressure to buy",
  "Clear written quote showing the subsidy and expected payback",
  "Certified installers and Tier-1 equipment",
  "We stay with you from the first survey until the subsidy is credited",
];

export default function About() {
  return (
    <div className="ab">
      <style>{STYLE}</style>

      <section className="ab-hero">
        <div className="ab-hero-img"><img src={heroImg} alt="" /></div>
        <div className="ab-wrap">
          <div className="ab-hero-in">
            <span className="ab-eyebrow">About Arihant Electricals</span>
            <h1>Experts in hybrid solar, trusted across Maharashtra</h1>
            <p>Since 2019 we have helped households and businesses switch to clean, reliable power, with the subsidy and paperwork handled properly from start to finish.</p>
          </div>
        </div>
      </section>

      <section className="ab-sec">
        <div className="ab-wrap ab-split">
          <div>
            <span className="ab-eyebrow">Our story</span>
            <h2 className="ab-h2">Power without interruption, savings without limits</h2>
            <p className="ab-lead">Arihant Electricals started as an electrical contracting business and grew into a solar company as rooftop systems became the practical answer to rising tariffs and frequent outages.</p>
            <p className="ab-lead">Our specialism is hybrid solar, which keeps your bill low and keeps essential loads running when MSEDCL supply fails. We also handle on-grid and off-grid systems, and the PM Surya Ghar paperwork that most families find difficult.</p>
            <div className="ab-facts">
              {FACTS.map((f) => (
                <div key={f.t} className="ab-fact">
                  <div className="ab-fact-ico">{f.icon}</div>
                  <div><b>{f.t}</b><span>{f.d}</span></div>
                </div>
              ))}
            </div>
          </div>
          <img src={storyImg} alt="Arihant team at a rooftop solar site" />
        </div>
      </section>

      <section className="ab-sec ab-soft">
        <div className="ab-wrap">
          <div className="ab-mv">
            <div className="ab-mv-item">
              <h3><Target size={22} color="#0369A1" /> Our mission</h3>
              <p>To make clean, reliable electricity affordable for every home and business in Maharashtra, by designing the right system and handling the subsidy paperwork without making the customer chase anyone.</p>
            </div>
            <div className="ab-mv-item">
              <h3><Eye size={22} color="#0369A1" /> Our vision</h3>
              <p>To be the most trusted solar partner in western Maharashtra, known for honest surveys, dependable installation and customers who are still happy with their system years later.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="ab-sec">
        <div className="ab-wrap ab-split">
          <img src={teamImg} alt="Arihant team planning a solar installation" />
          <div>
            <span className="ab-eyebrow">What we do</span>
            <h2 className="ab-h2">Services from survey to subsidy</h2>
            <ul className="ab-list">
              {SERVICES.map((s) => <li key={s}><CheckCircle2 size={19} />{s}</li>)}
            </ul>
          </div>
        </div>
      </section>

      <section className="ab-sec ab-soft">
        <div className="ab-wrap ab-split">
          <div>
            <span className="ab-eyebrow">Why choose us</span>
            <h2 className="ab-h2">What you can expect from Arihant</h2>
            <ul className="ab-list">
              {WHY.map((w) => <li key={w}><Users size={19} />{w}</li>)}
            </ul>
            <div className="ab-areas">
              <span className="ab-area"><MapPin size={16} /> Sangli</span>
              <span className="ab-area"><MapPin size={16} /> Kolhapur</span>
              <span className="ab-area"><MapPin size={16} /> Satara</span>
            </div>
          </div>
          <div>
            <span className="ab-eyebrow">Equipment partners</span>
            <h2 className="ab-h2" style={{ fontSize: 26 }}>Brands we work with</h2>
            <div className="ab-brands">
              <img src={tataLogo} alt="Tata Power Solar" />
              <img src={adaniLogo} alt="Adani Solar" />
              <img src={waareeLogo} alt="Waaree Energies" />
            </div>
          </div>
        </div>
      </section>

      <section className="ab-sec">
        <div className="ab-wrap">
          <div className="ab-cta">
            <div>
              <h3>Speak to our team</h3>
              <p>Call +91 77748 55501 or request a free site survey and we will get back to you.</p>
            </div>
            <Link to="/contact">Request a free survey <ArrowRight size={18} /></Link>
          </div>
        </div>
      </section>
    </div>
  );
}