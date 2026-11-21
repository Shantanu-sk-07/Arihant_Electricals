import { useEffect, useRef, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Battery,
  BadgeIndianRupee,
  CheckCircle2,
  Gauge,
  HardHat,
  PenTool,
  Phone,
  Search,
  ShieldCheck,
  Sun,
  TrendingUp,
  Zap,
  Star,
  Quote,
} from "lucide-react";

// --- Your images (same files as before) ---
import heroImg from "../assets/MSD_Home.png";
import aboutImg from "../assets/HowPlanSOlar.jpeg";
import installImg from "../assets/Vendor_Consumer.jpeg";
import closeUpImg from "../assets/MSD_withSolarPanels.png";
import workerImg from "../assets/InstallationWorker.jpeg";
import thumbsImg from "../assets/MSD_ThumpsUp.png";
import adaniLogo from "../assets/adani-logo.webp";
import tataLogo from "../assets/tata-logo.jpeg";
import waareeLogo from "../assets/waaree.webp";

const STYLE = `
.h { font-family: "Manrope", "Segoe UI", Roboto, Arial, sans-serif; color: #0F2A3F; overflow: hidden; }
.h a { color: inherit; text-decoration: none; }
.h img { display: block; max-width: 100%; }
.h-wrap { max-width: 1240px; margin: 0 auto; padding: 0 20px; }
.h-eyebrow { display: inline-flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 800; letter-spacing: .14em; text-transform: uppercase; color: #0369A1; background: #E0F2FE; padding: 7px 14px; border-radius: 999px; }
.h-h2 { font-size: clamp(28px, 3.6vw, 42px); line-height: 1.15; font-weight: 800; color: #075985; margin: 14px 0 16px; }
.h-lead { font-size: 17px; line-height: 1.75; color: #5B6B7A; }
.h-section { padding: 96px 0; }
.h-soft { background: #F3F9FD; }
.h-center { text-align: center; }
.h-center .h-lead { max-width: 680px; margin: 0 auto; }

.h-btn { display: inline-flex; align-items: center; gap: 10px; padding: 15px 28px; border-radius: 14px; font-weight: 800; font-size: 16px; transition: transform .25s, box-shadow .25s, background .25s, color .25s; border: 0; cursor: pointer; }
.h-btn:hover { transform: translateY(-3px); }
.h-btn-sun { background: #FBBF24; color: #0F2A3F; box-shadow: 0 14px 30px rgba(251,191,36,.38); }
.h-btn-sun:hover { background: #FCD34D; box-shadow: 0 20px 40px rgba(251,191,36,.5); }
.h-btn-white { background: #fff; color: #075985; box-shadow: 0 14px 30px rgba(0,0,0,.18); }
.h-btn-white:hover { background: #E0F2FE; }
.h-btn-ghost { background: transparent; color: #fff; border: 1.5px solid rgba(255,255,255,.8); }
.h-btn-ghost:hover { background: #fff; color: #075985; }

/* Reveal on scroll */
.h-reveal { opacity: 0; transform: translateY(28px); transition: opacity .8s ease, transform .8s ease; }
.h-reveal.in { opacity: 1; transform: none; }

/* HERO */
.h-hero { position: relative; min-height: 88vh; display: flex; align-items: center; color: #fff; background: #075985; }
.h-hero-img { position: absolute; inset: 0; }
.h-hero-img img { width: 100%; height: 100%; object-fit: cover; object-position: center center; opacity: 1; }
@keyframes hKen { from { transform: scale(1.02); } to { transform: scale(1.14) translate(-1%, 1%); } }
.h-hero::after { content: ""; position: absolute; inset: 0; background: linear-gradient(90deg, rgba(7,89,133,.78) 0%, rgba(14,165,233,.28) 55%, rgba(14,165,233,.08) 100%); }
.h-hero-body { position: relative; z-index: 2; padding: 120px 0 150px; max-width: 760px; }
.h-hero .h-eyebrow { background: rgba(255,255,255,.16); color: #fff; backdrop-filter: blur(6px); }
.h-hero .h-eyebrow i { width: 8px; height: 8px; border-radius: 50%; background: #FBBF24; box-shadow: 0 0 0 4px rgba(251,191,36,.3); animation: hBlink 1.6s infinite; }
@keyframes hBlink { 50% { opacity: .3; } }
.h-hero h1 { font-size: clamp(38px, 6vw, 68px); line-height: 1.04; font-weight: 800; margin: 22px 0 20px; letter-spacing: -.01em; animation: hRise .9s ease both; }
.h-hero h1 span { color: #FBBF24; }
.h-hero p { font-size: clamp(16px, 1.7vw, 19px); line-height: 1.7; color: #E0F2FE; max-width: 620px; animation: hRise 1s .15s ease both; }
.h-hero-cta { display: flex; gap: 14px; flex-wrap: wrap; margin-top: 34px; animation: hRise 1s .3s ease both; }
@keyframes hRise { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: none; } }
.h-hero-wave { position: absolute; left: 0; right: 0; bottom: -1px; z-index: 2; line-height: 0; }
.h-hero-wave svg { width: 100%; height: 50px; display: block; }

/* Brands */
.h-brands { background: #fff; padding: 46px 0; border-bottom: 1px solid #DCEAF3; }
.h-brands-row { display: flex; align-items: center; justify-content: space-between; gap: 30px; flex-wrap: wrap; margin-top: 26px; }
.h-brands-row img { height: 46px; width: auto; max-width: 160px; object-fit: contain; filter: grayscale(.2); transition: transform .3s, filter .3s; }
.h-brands-row img:hover { transform: scale(1.08); filter: none; }
.h-brands-label { font-size: 13px; font-weight: 800; letter-spacing: .14em; text-transform: uppercase; color: #5B6B7A; text-align: center; }

/* About */
.h-about-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 64px; align-items: center; }
.h-about-img { position: relative; }
.h-about-img img { width: 100%; height: 480px; object-fit: cover; border-radius: 26px; box-shadow: 0 30px 70px rgba(3,105,161,.22); }
.h-badge-float { position: absolute; left: -22px; bottom: 34px; background: #fff; border-radius: 18px; padding: 16px 20px; display: flex; align-items: center; gap: 14px; box-shadow: 0 20px 40px rgba(3,105,161,.18); animation: hFloat 4s ease-in-out infinite; }
@keyframes hFloat { 50% { transform: translateY(-10px); } }
.h-badge-float b { display: block; font-size: 26px; color: #0369A1; line-height: 1; }
.h-badge-float small { font-size: 13px; color: #5B6B7A; font-weight: 600; }
.h-badge-ico { width: 48px; height: 48px; border-radius: 14px; background: #FBBF24; display: flex; align-items: center; justify-content: center; color: #0F2A3F; }
.h-checks { list-style: none; padding: 0; margin: 26px 0 32px; display: grid; gap: 14px; }
.h-checks li { display: flex; align-items: center; gap: 12px; font-weight: 700; font-size: 16px; }
.h-checks svg { color: #0EA5E9; flex-shrink: 0; }

/* Solutions cards */
.h-solutions { display: grid; grid-template-columns: repeat(3, 1fr); gap: 28px; margin-top: 56px; }
.h-card { background: #fff; border-radius: 22px; overflow: hidden; border: 1px solid #DCEAF3; box-shadow: 0 14px 34px rgba(3,105,161,.08); transition: transform .4s, box-shadow .4s; display: flex; flex-direction: column; }
.h-card:hover { transform: translateY(-10px); box-shadow: 0 30px 60px rgba(3,105,161,.18); }
.h-card-img { height: 210px; position: relative; overflow: hidden; }
.h-card-img img { width: 100%; height: 100%; object-fit: cover; transition: transform .8s; }
.h-card:hover .h-card-img img { transform: scale(1.1); }
.h-card-tag { position: absolute; top: 16px; left: 16px; width: 48px; height: 48px; border-radius: 14px; background: #fff; color: #0369A1; display: flex; align-items: center; justify-content: center; box-shadow: 0 8px 18px rgba(0,0,0,.15); }
.h-card-body { padding: 26px 26px 28px; display: flex; flex-direction: column; flex: 1; }
.h-card h3 { font-size: 22px; font-weight: 800; color: #075985; margin: 0 0 10px; }
.h-card p { color: #5B6B7A; line-height: 1.7; font-size: 15px; margin: 0 0 22px; flex: 1; }
.h-card-link { display: inline-flex; align-items: center; gap: 8px; font-weight: 800; color: #0369A1; font-size: 15px; }
.h-card-link svg { transition: transform .3s; }
.h-card:hover .h-card-link svg { transform: translateX(6px); }

/* Process */
.h-steps { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; margin-top: 56px; position: relative; }
.h-steps::before { content: ""; position: absolute; top: 40px; left: 12%; right: 12%; height: 3px; background: repeating-linear-gradient(90deg, #7DD3FC 0 10px, transparent 10px 20px); }
.h-step { position: relative; text-align: center; padding: 0 12px; }
.h-step-num { width: 80px; height: 80px; border-radius: 50%; margin: 0 auto 22px; background: linear-gradient(135deg, #0EA5E9, #0369A1); color: #fff; display: flex; align-items: center; justify-content: center; font-size: 26px; font-weight: 800; border: 6px solid #F3F9FD; box-shadow: 0 14px 28px rgba(14,165,233,.35); position: relative; z-index: 1; transition: transform .3s; }
.h-step:hover .h-step-num { transform: scale(1.1) rotate(-6deg); }
.h-step h3 { font-size: 19px; font-weight: 800; color: #075985; margin: 0 0 10px; }
.h-step p { color: #5B6B7A; font-size: 15px; line-height: 1.65; margin: 0; }

/* Why us */
.h-why { background: linear-gradient(135deg, #0369A1 0%, #0EA5E9 100%); color: #fff; position: relative; }
.h-why::before { content: ""; position: absolute; inset: 0; background: radial-gradient(circle at 85% 15%, rgba(251,191,36,.25), transparent 40%); }
.h-why-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 64px; align-items: center; position: relative; }
.h-why .h-eyebrow { background: rgba(255,255,255,.18); color: #fff; }
.h-why .h-h2 { color: #fff; }
.h-why-img img { width: 100%; height: 520px; object-fit: cover; border-radius: 26px; box-shadow: 0 30px 70px rgba(7,89,133,.45); }
.h-feat { display: grid; gap: 16px; margin-top: 28px; }
.h-feat-item { display: flex; gap: 18px; padding: 20px; border-radius: 18px; background: rgba(255,255,255,.1); border: 1px solid rgba(255,255,255,.18); transition: background .3s, transform .3s; }
.h-feat-item:hover { background: rgba(255,255,255,.2); transform: translateX(8px); }
.h-feat-ico { width: 52px; height: 52px; border-radius: 14px; background: #FBBF24; color: #0F2A3F; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.h-feat-item h4 { margin: 0 0 6px; font-size: 18px; font-weight: 800; }
.h-feat-item p { margin: 0; font-size: 15px; line-height: 1.6; color: #E0F2FE; }

/* Counters */
.h-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 22px; margin-top: 56px; }
.h-stat { background: #fff; border-radius: 22px; padding: 34px 20px; text-align: center; border: 1px solid #DCEAF3; box-shadow: 0 12px 30px rgba(3,105,161,.07); transition: transform .3s, box-shadow .3s; }
.h-stat:hover { transform: translateY(-6px); box-shadow: 0 24px 50px rgba(3,105,161,.16); }
.h-stat b { display: block; font-size: clamp(38px, 4.4vw, 52px); font-weight: 800; color: #0EA5E9; line-height: 1; }
.h-stat span { display: block; margin-top: 10px; color: #5B6B7A; font-weight: 700; font-size: 15px; }

/* Calculator */
.h-calc { background: #fff; border-radius: 28px; box-shadow: 0 30px 70px rgba(3,105,161,.16); border: 1px solid #DCEAF3; padding: 48px; display: grid; grid-template-columns: 1.1fr 1fr; gap: 48px; align-items: center; }
.h-calc input[type=range] { width: 100%; accent-color: #0EA5E9; margin: 12px 0 6px; cursor: pointer; }
.h-calc-val { font-size: 40px; font-weight: 800; color: #0369A1; }
.h-calc-note { font-size: 13px; color: #5B6B7A; }
.h-results { display: grid; gap: 14px; }
.h-res { display: flex; justify-content: space-between; align-items: center; padding: 18px 20px; border-radius: 16px; background: #F3F9FD; transition: transform .3s; }
.h-res:hover { transform: translateX(6px); }
.h-res span { font-weight: 700; color: #5B6B7A; font-size: 15px; }
.h-res b { font-size: 24px; color: #075985; font-weight: 800; }
.h-res.hl { background: linear-gradient(135deg, #0EA5E9, #0369A1); }
.h-res.hl span, .h-res.hl b { color: #fff; }

/* Testimonials */
.h-testi { display: grid; grid-template-columns: 0.9fr 1.1fr; gap: 56px; align-items: center; }
.h-testi-img img { width: 100%; height: 540px; object-fit: cover; border-radius: 26px; box-shadow: 0 30px 70px rgba(3,105,161,.2); }
.h-quotes { display: grid; gap: 22px; }
.h-quote { background: #fff; border-radius: 22px; padding: 30px; border: 1px solid #DCEAF3; box-shadow: 0 12px 30px rgba(3,105,161,.07); position: relative; transition: transform .3s; }
.h-quote:hover { transform: translateY(-4px); }
.h-quote-ico { position: absolute; top: 22px; right: 24px; color: #BAE6FD; }
.h-stars { display: flex; gap: 3px; color: #FBBF24; margin-bottom: 14px; }
.h-quote p { font-style: italic; color: #3B4F60; line-height: 1.75; margin: 0 0 18px; font-size: 16px; }
.h-quote b { color: #075985; font-size: 16px; }

/* CTA */
.h-cta { position: relative; padding: 90px 0; color: #fff; text-align: center; background: linear-gradient(135deg, #075985, #0EA5E9); overflow: hidden; }
.h-cta::before, .h-cta::after { content: ""; position: absolute; border-radius: 50%; background: rgba(255,255,255,.08); }
.h-cta::before { width: 420px; height: 420px; top: -160px; left: -120px; }
.h-cta::after { width: 320px; height: 320px; bottom: -140px; right: -80px; }
.h-cta h2 { font-size: clamp(30px, 4vw, 46px); font-weight: 800; margin: 0 0 14px; position: relative; }
.h-cta p { color: #E0F2FE; font-size: 17px; max-width: 620px; margin: 0 auto 32px; position: relative; line-height: 1.7; }
.h-cta-btns { display: flex; gap: 14px; justify-content: center; flex-wrap: wrap; position: relative; }

/* Responsive */
@media (max-width: 1000px) {
  .h-about-grid, .h-why-grid, .h-testi, .h-calc { grid-template-columns: 1fr; gap: 40px; }
  .h-solutions { grid-template-columns: 1fr 1fr; }
  .h-stats { grid-template-columns: 1fr 1fr; }
  .h-steps { grid-template-columns: 1fr 1fr; row-gap: 40px; }
  .h-steps::before { display: none; }
  .h-about-img img, .h-why-img img, .h-testi-img img { height: 380px; }
  .h-badge-float { left: 12px; }
}
@media (max-width: 640px) {
  .h-section { padding: 70px 0; }
  .h-solutions { grid-template-columns: 1fr; }
  .h-steps { grid-template-columns: 1fr; }
  .h-calc { padding: 28px; }
  .h-hero-body { padding: 90px 0 130px; }
}
`;

/* ---------- Helpers ---------- */

function Reveal({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [shown, setShown] = useState<boolean>(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={`h-reveal${shown ? " in" : ""}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLElement | null>(null);
  const [value, setValue] = useState<number>(0);
  const [started, setStarted] = useState<boolean>(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          io.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    const duration = 1600;
    const begin = performance.now();
    let raf = 0;
    const tick = (now: number): void => {
      const p = Math.min((now - begin) / duration, 1);
      setValue(Math.round(to * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [started, to]);

  return (
    <b ref={ref as React.RefObject<HTMLElement>}>
      {value}
      {suffix}
    </b>
  );
}

function SavingsCalculator() {
  const [bill, setBill] = useState<number>(3000);

  // Indicative only: ~₹8 per unit, ~120 units per kW per month.
  const units = bill / 8;
  const kw = Math.max(1, Math.ceil(units / 120));
  const subsidy = kw === 1 ? 30000 : kw === 2 ? 60000 : 78000;
  const monthlySave = Math.round(bill * 0.85);

  return (
    <div className="h-calc">
      <div>
        <span className="h-eyebrow">Savings Calculator</span>
        <h2 className="h-h2">See how much you could save</h2>
        <p className="h-lead">
          Move the slider to your average monthly electricity bill to see an indicative system size and subsidy.
        </p>
        <div style={{ marginTop: 28 }}>
          <div className="h-calc-val">₹{bill.toLocaleString("en-IN")}</div>
          <div className="h-calc-note">Average monthly electricity bill</div>
          <input
            type="range"
            min={500}
            max={20000}
            step={100}
            value={bill}
            onChange={(e) => setBill(Number(e.target.value))}
            aria-label="Monthly electricity bill"
          />
          <div className="h-calc-note" style={{ display: "flex", justifyContent: "space-between" }}>
            <span>₹500</span>
            <span>₹20,000</span>
          </div>
        </div>
      </div>

      <div className="h-results">
        <div className="h-res">
          <span>Recommended system</span>
          <b>{kw} kW</b>
        </div>
        <div className="h-res">
          <span>PM Surya Ghar subsidy</span>
          <b>₹{subsidy.toLocaleString("en-IN")}</b>
        </div>
        <div className="h-res hl">
          <span>Est. monthly savings</span>
          <b>₹{monthlySave.toLocaleString("en-IN")}</b>
        </div>
        <Link to="/contact" className="h-btn h-btn-sun" style={{ justifyContent: "center", marginTop: 8 }}>
          Get my exact estimate <ArrowRight size={18} />
        </Link>
        <p className="h-calc-note" style={{ margin: 0 }}>
          Indicative figures only. Final size and savings depend on your roof and consumption.
        </p>
      </div>
    </div>
  );
}

/* ---------- Page ---------- */

const SOLUTIONS = [
  {
    icon: <Sun size={24} />,
    title: "On-Grid Solar",
    img: closeUpImg,
    text: "Connected to the grid, no batteries required. Cut monthly bills through net metering.",
    to: "/products/on-grid",
  },
  {
    icon: <Battery size={24} />,
    title: "Off-Grid Solar",
    img: installImg,
    text: "Complete independence from the grid with solar batteries for 24/7 power backup.",
    to: "/products/off-grid",
  },
  {
    icon: <Zap size={24} />,
    title: "Hybrid Solar",
    img: workerImg,
    text: "Grid connection plus battery backup for uninterrupted power supply at all times.",
    to: "/products/hybrid",
  },
];

const PROCESS = [
  { icon: <Search size={30} />, title: "Site Inspection", text: "Free assessment of your roof space, shadow analysis and energy needs." },
  { icon: <PenTool size={30} />, title: "Custom Design", text: "A tailored plan with accurate savings projections and ROI analysis." },
  { icon: <BadgeIndianRupee size={30} />, title: "Subsidy & Approvals", text: "We handle the government paperwork and PM Surya Ghar registration." },
  { icon: <HardHat size={30} />, title: "Install & Net Meter", text: "Certified technicians install safely, then we coordinate your net meter." },
];

const WHY = [
  { icon: <TrendingUp size={24} />, title: "Maximize Your Savings", text: "High-efficiency systems designed to cut your bill substantially with a fast return on investment." },
  { icon: <ShieldCheck size={24} />, title: "Subsidy Support", text: "We manage the PM Surya Ghar process so you can claim up to ₹78,000 in subsidy." },
  { icon: <Gauge size={24} />, title: "Professional Installation", text: "Certified technicians, storm-ready mounting structures and safe net metering integration." },
];

export const Home = () => {
  return (
    <div className="h">
      <style>{STYLE}</style>

      {/* HERO */}
     <section
        style={{
          position: "relative",
          color: "#fff",
          background: "#075985",
          overflow: "hidden",
          fontFamily: '"Manrope","Segoe UI",Roboto,Arial,sans-serif',
        }}
      >
               <div style={{ position: "absolute", inset: 0 }}>
          <img
            src={heroImg}
            alt="Arihant Electricals rooftop solar installation"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "10% 40%", // or "center 22%" to focus on the face
              display: "block",
            }}
          />
        </div>

        {/* Gradient overlay */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(90deg, rgba(7,89,133,.82) 0%, rgba(14,165,233,.28) 55%, rgba(14,165,233,.05) 100%)",
          }}
        />

        <div
          style={{
            maxWidth: "1240px",
            margin: "0 auto",
            padding: "0 20px",
            position: "relative",
            zIndex: 2,
          }}
        >
          <div style={{ padding: "96px 0 120px", maxWidth: "720px" }}>
            <span
              style={{
                display: "inline-block",
                fontSize: "12.5px",
                fontWeight: 800,
                letterSpacing: ".14em",
                textTransform: "uppercase",
                color: "#fff",
                background: "rgba(255,255,255,.2)",
                padding: "7px 14px",
                borderRadius: "999px",
              }}
            >
              Experts in hybrid solar solutions
            </span>

            <h1
              style={{
                fontSize: "clamp(36px,5.2vw,62px)",
                lineHeight: 1.06,
                fontWeight: 800,
                margin: "20px 0 18px",
              }}
            >
              Power without interruption.{" "}
              <span style={{ color: "#FBBF24" }}>Savings without limits.</span>
            </h1>

            <p
              style={{
                fontSize: "clamp(16px,1.6vw,18.5px)",
                lineHeight: 1.7,
                color: "#E0F2FE",
                maxWidth: "620px",
                margin: 0,
              }}
            >
              Arihant Electricals designs and installs on-grid, off-grid and
              hybrid rooftop solar across Sangli, Kolhapur and Satara, and
              guides you through PM Surya Ghar subsidy from start to finish.
            </p>

            <div
              style={{
                display: "flex",
                gap: "14px",
                flexWrap: "wrap",
                marginTop: "30px",
              }}
            >
              <Link
                to="/contact"
                className="h-btn h-sun"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "9px",
                  padding: "14px 26px",
                  borderRadius: "13px",
                  fontWeight: 800,
                  fontSize: "15.5px",
                  background: "#FBBF24",
                  color: "#0F2A3F",
                  boxShadow: "0 12px 26px rgba(251,191,36,.35)",
                  textDecoration: "none",
                }}
              >
                Get a free quote <ArrowRight size={18} />
              </Link>
              <Link
                to="/products"
                className="h-btn h-ghost"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "9px",
                  padding: "14px 26px",
                  borderRadius: "13px",
                  fontWeight: 800,
                  fontSize: "15.5px",
                  background: "transparent",
                  color: "#fff",
                  border: "1.5px solid rgba(255,255,255,.85)",
                  textDecoration: "none",
                }}
              >
                Explore products
              </Link>
            </div>
          </div>
        </div>

        {/* Wave bottom */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: "-1px",
            zIndex: 2,
            lineHeight: 0,
          }}
        >
          <svg
            viewBox="0 0 1440 90"
            preserveAspectRatio="none"
            style={{ width: "100%", height: "50px", display: "block" }}
          >
            <path
              d="M0,40 C240,90 480,0 720,30 C960,60 1200,10 1440,45 L1440,90 L0,90 Z"
              fill="#ffffff"
            />
          </svg>
        </div>
      </section>

      {/* BRANDS */}
      <section className="h-brands">
        <div className="h-wrap">
          <p className="h-brands-label">Powered by leading solar brands</p>
          <div className="h-brands-row">
            <img src={tataLogo} alt="Tata Power Solar" />
            <img src={adaniLogo} alt="Adani Solar" />
            <img src={waareeLogo} alt="Waaree Energies" />
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section className="h-section">
        <div className="h-wrap h-about-grid">
          <Reveal>
            <div className="h-about-img">
              <img src={aboutImg} alt="Arihant team planning a solar installation" />
              <div className="h-badge-float">
                <div className="h-badge-ico"><Sun size={24} /></div>
                <div>
                  <b>500+</b>
                  <small>Solar projects completed</small>
                </div>
              </div>
            </div>
          </Reveal>
          <Reveal delay={150}>
            <span className="h-eyebrow">About Arihant Electricals</span>
            <h2 className="h-h2">Trusted Solar Panel Dealer & Installer</h2>
            <p className="h-lead">
              At Arihant Electricals we specialize in end-to-end solar energy solutions. From site inspection and subsidy assistance to professional installation and net metering, we handle everything, so you simply enjoy the savings.
            </p>
            <ul className="h-checks">
              <li><CheckCircle2 size={22} /> End-to-end EPC services</li>
              <li><CheckCircle2 size={22} /> Government subsidy assistance</li>
              <li><CheckCircle2 size={22} /> High-quality Tier-1 panels</li>
            </ul>
            <Link to="/about" className="h-btn h-btn-sun">
              Read Our Full Story <ArrowRight size={18} />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* SOLUTIONS */}
      <section className="h-section h-soft">
        <div className="h-wrap">
          <Reveal>
            <div className="h-center">
              <span className="h-eyebrow">Our Solar Solutions</span>
              <h2 className="h-h2">Rooftop solar systems for homes & businesses</h2>
              <p className="h-lead">Choose the setup that fits your roof, your usage and your power-backup needs.</p>
            </div>
          </Reveal>
          <div className="h-solutions">
            {SOLUTIONS.map((s, i) => (
              <Reveal key={s.title} delay={i * 120}>
                <Link to={s.to} className="h-card" style={{ height: "100%" }}>
                  <div className="h-card-img">
                    <img src={s.img} alt={s.title} />
                    <div className="h-card-tag">{s.icon}</div>
                  </div>
                  <div className="h-card-body">
                    <h3>{s.title}</h3>
                    <p>{s.text}</p>
                    <span className="h-card-link">Learn more <ArrowRight size={18} /></span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="h-section">
        <div className="h-wrap">
          <Reveal>
            <div className="h-center">
              <span className="h-eyebrow">Installation Process</span>
              <h2 className="h-h2">Our professional installation process</h2>
              <p className="h-lead">Transparent, efficient and hassle-free from first call to first unit of clean power.</p>
            </div>
          </Reveal>
          <div className="h-steps">
            {PROCESS.map((p, i) => (
              <Reveal key={p.title} delay={i * 120}>
                <div className="h-step">
                  <div className="h-step-num">{i + 1}</div>
                  <h3>{p.title}</h3>
                  <p>{p.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="h-section h-why">
        <div className="h-wrap h-why-grid">
          <Reveal>
            <div className="h-why-img">
              <img src={installImg} alt="Arihant solar installation" />
            </div>
          </Reveal>
          <Reveal delay={150}>
            <span className="h-eyebrow">Why Choose Us</span>
            <h2 className="h-h2">Why choose Arihant Electricals?</h2>
            <div className="h-feat">
              {WHY.map((w) => (
                <div key={w.title} className="h-feat-item">
                  <div className="h-feat-ico">{w.icon}</div>
                  <div>
                    <h4>{w.title}</h4>
                    <p>{w.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* COUNTERS */}
      <section className="h-section h-soft" style={{ paddingTop: 80, paddingBottom: 80 }}>
        <div className="h-wrap">
          <div className="h-stats">
            <Reveal>
              <div className="h-stat"><Counter to={500} suffix="+" /><span>Solar projects completed</span></div>
            </Reveal>
            <Reveal delay={100}>
              <div className="h-stat"><Counter to={450} suffix="+" /><span>Happy solar customers</span></div>
            </Reveal>
            <Reveal delay={200}>
              <div className="h-stat"><Counter to={50} suffix="+" /><span>5-star customer reviews</span></div>
            </Reveal>
            <Reveal delay={300}>
              <div className="h-stat"><Counter to={100} suffix="%" /><span>Subsidy assistance</span></div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* CALCULATOR */}
      <section className="h-section">
        <div className="h-wrap">
          <Reveal>
            <SavingsCalculator />
          </Reveal>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="h-section h-soft">
        <div className="h-wrap h-testi">
          <Reveal>
            <div className="h-testi-img">
              <img src={thumbsImg} alt="Happy Arihant customer" />
            </div>
          </Reveal>
          <Reveal delay={150}>
            <div>
              <span className="h-eyebrow">Customer Reviews</span>
              <h2 className="h-h2" style={{ marginBottom: 28 }}>Trusted by homeowners across the region</h2>
              <div className="h-quotes">
                <div className="h-quote">
                  <Quote size={40} className="h-quote-ico" />
                  <div className="h-stars">
                    {[0, 1, 2, 3, 4].map((n) => <Star key={n} size={18} fill="currentColor" />)}
                  </div>
                  <p>
                    "Arihant Electricals provided professional rooftop solar installation. Their team explained the complete process clearly and completed the installation on time. Our electricity bill reduced by more than 70% within three months. Highly recommended!"
                  </p>
                  <b>— Amit Chaudhary</b>
                </div>
                <div className="h-quote">
                  <Quote size={40} className="h-quote-ico" />
                  <div className="h-stars">
                    {[0, 1, 2, 3, 4].map((n) => <Star key={n} size={18} fill="currentColor" />)}
                  </div>
                  <p>
                    "Arihant handled everything from solar site inspection to government subsidy approvals. The rooftop solar panels are working perfectly. Best solar panel installer in the region."
                  </p>
                  <b>— Neha Bansal</b>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="h-cta">
        <div className="h-wrap" style={{ position: "relative" }}>
          <Reveal>
            <h2>Ready to switch to clean, free power?</h2>
            <p>Book a free site inspection and get a customized solar plan with subsidy guidance, at no cost.</p>
            <div className="h-cta-btns">
              <Link to="/contact" className=" inline-flex items-center gap-2 bg-orange-400 text-white font-bold px-5 py-2.5 rounded-lg transition-all duration-300 border-2 border-transparent hover:border-yellow-400 hover:bg-orange-500">
                Request Free Consultation <ArrowRight size={18} />
              </Link>







              <a href="tel:+919876543210" className="h-btn h-btn-ghost">
                <Phone size={18} /> +91 7774855501
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
};

export default Home;