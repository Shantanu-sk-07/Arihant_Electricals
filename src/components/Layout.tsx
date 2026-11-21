import { useEffect, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import {
  ArrowRight, Award, ChevronDown, Clock, Facebook, Instagram, Linkedin, Mail, MapPin, Menu,
  MessageCircle, Phone, ShieldCheck, Sun, X, Youtube, Zap,
} from "lucide-react";
import EnquiryPopup from "../pages/EnquiryPopUp";
import Logo from '../assets/Logo.jpeg'

const PHONE_DISPLAY = "+91 77748 55501";
const PHONE_TEL = "tel:+917774855501";
const EMAIL = "arihantelectricals159@gmail.com";
const WHATSAPP = "https://wa.me/917774855501?text=Hello%20Arihant%20Electricals%2C%20I%20would%20like%20a%20free%20solar%20consultation";
// Replace with your real profile links.
const SOCIAL = {
  instagram: "https://www.instagram.com/",
  facebook: "https://www.facebook.com/",
  youtube: "https://www.youtube.com/",
  linkedin: "https://www.linkedin.com/",
};

interface SubLink { label: string; to: string; desc: string }
interface NavItem { label: string; to: string; children?: SubLink[] }

const PRODUCT_LINKS: SubLink[] = [
  { label: "On-Grid Solar", to: "/products/on-grid", desc: "Net metering with MSEDCL" },
  { label: "Off-Grid Solar", to: "/products/off-grid", desc: "Battery system, no grid connection" },
  { label: "Hybrid Solar", to: "/products/hybrid", desc: "Grid plus battery backup" },
];

const FAQ_LINKS: SubLink[] = [
  { label: "Top Questions", to: "/faq", desc: "Most asked by Maharashtra homeowners" },
  { label: "General", to: "/faq/general", desc: "Eligibility, documents, MSEDCL" },
  { label: "Installation", to: "/faq/installation", desc: "Roof, timeline, maintenance" },
  { label: "Financial", to: "/faq/financial", desc: "Subsidy, loans, payback" },
  { label: "Technical", to: "/faq/technical", desc: "Systems, warranties, net metering" },
];

const NAV: NavItem[] = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Products", to: "/products", children: PRODUCT_LINKS },
  { label: "PM Surya Ghar", to: "/pm-surya-ghar" },
  { label: "Industries", to: "/industries" },
  { label: "Process", to: "/process" },
  { label: "Gallery", to: "/gallery" },
  { label: "FAQ", to: "/faq", children: FAQ_LINKS },
  { label: "Contact", to: "/contact" },
];

const STYLE = `
@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;700;800&display=swap');
.ar { --sky:#0EA5E9; --sky-dark:#0369A1; --sky-deep:#075985; --sky-light:#E0F2FE; --sky-soft:#F3F9FD; --sun:#FBBF24; --sun-hover:#FCD34D; --ink:#0F2A3F; --muted:#4B5D6E; --line:#DCEAF3;
  font-family:"Manrope","Segoe UI",Roboto,Arial,sans-serif; color:var(--ink); background:#fff; min-height:100vh; display:flex; flex-direction:column; overflow-x:hidden; }
.ar a { color:inherit; text-decoration:none; }
.ar img { max-width:100%; display:block; }
.ar-wrap { max-width:1280px; margin:0 auto; padding:0 18px; }
.ar-topbar { background:var(--sky-deep); color:#E0F2FE; font-size:12.5px; }
.ar-topbar .ar-wrap { display:flex; justify-content:space-between; align-items:center; min-height:36px; gap:14px; flex-wrap:wrap; }
.ar-topbar span, .ar-topbar a { display:inline-flex; align-items:center; gap:6px; }
.ar-topbar a:hover { color:var(--sun); }
.ar-header { position:sticky; top:0; z-index:60; background:rgba(255,255,255,.97); backdrop-filter:blur(10px); border-bottom:1px solid transparent; transition:box-shadow .3s, border-color .3s; }
.ar-header.is-scrolled { box-shadow:0 10px 28px rgba(3,105,161,.12); border-color:var(--line); }
.ar-nav { display:flex; align-items:center; justify-content:space-between; height:70px; gap:12px; }
.ar-logo { display:flex; align-items:center; gap:10px; flex-shrink:0; }
.ar-logo-mark { width:42px; height:42px; border-radius:12px; background:linear-gradient(135deg,var(--sky),var(--sky-dark)); color:var(--sun); display:flex; align-items:center; justify-content:center; }
.ar-logo-text strong { display:block; font-size:17px; font-weight:800; color:var(--sky-dark); line-height:1; }
.ar-logo-text span { display:block; font-size:10px; font-weight:800; letter-spacing:.18em; text-transform:uppercase; color:#B45309; margin-top:3px; }
.ar-menu { display:flex; align-items:center; gap:2px; }

.ar-link { position:relative; display:inline-flex; align-items:center; gap:3px; padding:8px 9px; font-size:14px; font-weight:700; color:var(--muted); border-radius:9px; white-space:nowrap; transition:color .2s, background .2s; }
.ar-link::after { content:""; position:absolute; left:9px; right:9px; bottom:2px; height:2px; background:var(--sun); border-radius:2px; transform:scaleX(0); transition:transform .3s; }
.ar-link:hover { color:var(--sky-dark); background:var(--sky-soft); }
.ar-link:hover::after, .ar-link.is-active::after { transform:scaleX(1); }
.ar-link.is-active { color:var(--sky-dark); }
.ar-dd { position:relative; }
.ar-dd-menu { position:absolute; top:100%; left:0; padding-top:8px; min-width:170px; z-index:80; }
.ar-dd-panel { background:#fff; border-radius:12px; padding:6px; box-shadow:0 14px 30px rgba(3,105,161,.18); border:1px solid var(--line); animation:arDrop .2s ease both; }
.ar-dd-item { display:block; padding:8px 12px; font-size:13px; font-weight:600; color:var(--ink); border-radius:8px; white-space:nowrap; }
.ar-dd-item:hover { background:var(--sky-light); color:var(--sky-dark); }
.ar-cta { display:inline-flex; align-items:center; gap:7px; padding:10px 16px; border-radius:11px; background:var(--sun); color:var(--ink); font-weight:800; font-size:14px; white-space:nowrap; box-shadow:0 8px 18px rgba(251,191,36,.35); transition:transform .25s, background .25s; flex-shrink:0; }
.ar-cta:hover { transform:translateY(-2px); background:var(--sun-hover); }
.ar-burger { display:none; width:42px; height:42px; border-radius:11px; align-items:center; justify-content:center; background:var(--sky-light); color:var(--sky-dark); border:0; cursor:pointer; flex-shrink:0; }
.ar-mobile { display:none; border-top:1px solid var(--line); background:#fff; padding:12px 18px 20px; max-height:calc(100vh - 110px); overflow-y:auto; animation:arDrop .3s ease both; }
.ar-mobile a, .ar-mobile button.ar-m-link { display:flex; width:100%; align-items:center; justify-content:space-between; padding:12px 14px; border-radius:11px; font-weight:700; font-size:15px; color:var(--ink); background:none; border:0; cursor:pointer; text-align:left; font-family:inherit; }
.ar-mobile a:hover, .ar-mobile a.is-active { background:var(--sky-light); color:var(--sky-dark); }
.ar-m-sub { padding:2px 0 8px 14px; }
.ar-m-sub a { font-weight:600; font-size:14px; color:var(--muted); }
.ar-m-cta a { justify-content:center; background:var(--sun); color:var(--ink); margin-top:10px; }
@media (max-width:1180px){ .ar-menu, .ar-cta-desk { display:none !important; } .ar-burger { display:inline-flex; } .ar-mobile { display:block; } }
@media (max-width:860px){ .ar-hide-sm { display:none !important; } }
@keyframes arDrop { from { opacity:0; transform:translateY(-6px);} to { opacity:1; transform:none; } }
.ar-main { flex:1 0 auto; }
.ar-rail { position:fixed; right:14px; top:50%; transform:translateY(-50%); z-index:70; display:flex; flex-direction:column; gap:10px; }
.ar-rail a { position:relative; width:50px; height:50px; border-radius:50%; display:flex; align-items:center; justify-content:center; color:#fff; box-shadow:0 12px 24px rgba(0,0,0,.22); transition:transform .25s; }
.ar-rail a:hover { transform:scale(1.1); }
.ar-rail a em { position:absolute; right:60px; top:50%; transform:translateY(-50%); background:var(--ink); color:#fff; font-style:normal; font-size:12px; font-weight:700; padding:6px 10px; border-radius:8px; white-space:nowrap; opacity:0; pointer-events:none; transition:opacity .2s; }
.ar-rail a:hover em { opacity:1; }
.ar-rail .wa { background:#25D366; }
.ar-rail .ig { background:linear-gradient(45deg,#F58529,#DD2A7B,#8134AF); }
.ar-rail .call { background:var(--sky-dark); }
@media (max-width:640px){ .ar-rail { right:8px; gap:8px; } .ar-rail a { width:42px; height:42px; } .ar-rail a em { display:none; } }
.ar-footer { background:var(--sky-deep); color:#D7EEFA; }
.ar-trust { border-bottom:1px solid rgba(255,255,255,.12); }
.ar-trust .ar-wrap { display:grid; grid-template-columns:repeat(4,1fr); gap:14px; padding-top:20px; padding-bottom:20px; }
.ar-trust div { display:flex; align-items:center; gap:10px; font-weight:700; font-size:14px; color:#fff; }
.ar-trust svg { color:var(--sun); flex-shrink:0; }
.ar-foot { display:grid; grid-template-columns:1.3fr 1fr 1fr 1.2fr; gap:36px; padding-top:50px; padding-bottom:42px; }
.ar-foot h4 { color:#fff; font-size:13px; text-transform:uppercase; letter-spacing:.12em; margin:0 0 16px; }
.ar-foot ul { list-style:none; padding:0; margin:0; display:grid; gap:10px; font-size:14px; }
.ar-foot li a:hover { color:var(--sun); }
.ar-foot p { font-size:14px; line-height:1.7; color:#B7DDF2; margin:0 0 16px; }
.ar-foot-contact li { display:flex; gap:10px; align-items:flex-start; }
.ar-foot-contact svg { color:var(--sun); flex-shrink:0; margin-top:2px; }
.ar-social { display:flex; gap:9px; }
.ar-social a { width:34px; height:34px; border-radius:50%; display:flex; align-items:center; justify-content:center; background:rgba(255,255,255,.12); transition:background .2s; }
.ar-social a:hover { background:var(--sun); color:var(--ink); }
.ar-copy { border-top:1px solid rgba(255,255,255,.12); font-size:13px; color:#9CD3EE; }
.ar-copy .ar-wrap { display:flex; justify-content:space-between; flex-wrap:wrap; gap:10px; padding-top:16px; padding-bottom:16px; }
@media (max-width:960px){ .ar-trust .ar-wrap { grid-template-columns:repeat(2,1fr); } .ar-foot { grid-template-columns:1fr 1fr; } }
@media (max-width:560px){ .ar-foot { grid-template-columns:1fr; } }
`;

const isActive = (cur: string, to: string) => (to === "/" ? cur === "/" : cur.startsWith(to));

export const Layout = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState<string | null>(null);
  const [deskOpen, setDeskOpen] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setMobileOpen(null);
    setDeskOpen(null);
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="ar">
      <style>{STYLE}</style>

      <div className="ar-topbar">
        <div className="ar-wrap">
          <div style={{ display: "flex", gap: 18, alignItems: "center", flexWrap: "wrap" }}>
            <span><Clock size={13} /> Mon–Sat, 9:00 AM – 7:00 PM</span>
            <span className="ar-hide-sm"><Mail size={13} /> {EMAIL}</span>
          </div>
          <a href={PHONE_TEL} style={{ fontWeight: 800 }}><Phone size={13} /> {PHONE_DISPLAY}</a>
        </div>
      </div>

      <header className={`ar-header${scrolled ? " is-scrolled" : ""}`}>
        <div className="ar-wrap ar-nav">
         
       <img 
  src={Logo} 
  alt="Arihant Electricals" 
  style={{ height: "52px", width: "180px", objectFit: "contain" }} 
/>
          <nav className="ar-menu" aria-label="Main navigation">
            {NAV.map((item) =>
              item.children ? (
                <div
                  key={item.label}
                  className="ar-dd"
                  onMouseEnter={() => setDeskOpen(item.label)}
                  onMouseLeave={() => setDeskOpen(null)}
                >
                  <Link to={item.to} className={`ar-link${isActive(location.pathname, item.to) ? " is-active" : ""}`}>
                    {item.label} <ChevronDown size={14} />
                  </Link>
                  {deskOpen === item.label && (
                    <div className="ar-dd-menu">
                      <div className="ar-dd-panel">
                        {item.children.map((c) => (
                          <Link key={c.to} to={c.to} className="ar-dd-item" onClick={() => setDeskOpen(null)}>{c.label}</Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link key={item.to} to={item.to} className={`ar-link${isActive(location.pathname, item.to) ? " is-active" : ""}`}>
                  {item.label}
                </Link>
              ),
            )}
          </nav>

          <Link to="/contact" className="ar-cta ar-cta-desk">Free Quote <ArrowRight size={15} /></Link>

          <button className="ar-burger" onClick={() => setMenuOpen((o) => !o)} aria-label="Toggle menu" aria-expanded={menuOpen}>
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {menuOpen && (
          <div className="ar-mobile">
            {NAV.map((item) =>
              item.children ? (
                <div key={item.label}>
                  <button className="ar-m-link" onClick={() => setMobileOpen(mobileOpen === item.label ? null : item.label)} aria-expanded={mobileOpen === item.label}>
                    {item.label}
                    <ChevronDown size={18} style={{ transform: mobileOpen === item.label ? "rotate(180deg)" : "none", transition: "transform .25s" }} />
                  </button>
                  {mobileOpen === item.label && (
                    <div className="ar-m-sub">
                      {item.children.map((c) => <Link key={c.to} to={c.to}>{c.label}</Link>)}
                    </div>
                  )}
                </div>
              ) : (
                <Link key={item.to} to={item.to} className={isActive(location.pathname, item.to) ? "is-active" : ""}>{item.label}</Link>
              ),
            )}
            <div className="ar-m-cta"><Link to="/contact">Get a Free Quote</Link></div>
          </div>
        )}
      </header>

      <main className="ar-main"><Outlet /></main>

      <div className="ar-rail">
        <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" className="wa" aria-label="Chat on WhatsApp">
          <MessageCircle size={22} /><em>Chat on WhatsApp</em>
        </a>
        <a href={SOCIAL.instagram} target="_blank" rel="noopener noreferrer" className="ig" aria-label="Instagram">
          <Instagram size={22} /><em>Follow on Instagram</em>
        </a>
        <a href={PHONE_TEL} className="call" aria-label="Call us">
          <Phone size={20} /><em>Call {PHONE_DISPLAY}</em>
        </a>
      </div>

      <footer className="ar-footer">
        <div className="ar-trust">
          <div className="ar-wrap">
            <div><ShieldCheck size={20} /> Government Approved</div>
            <div><Award size={20} /> Tata Power Solar Retail Partner</div>
            <div><Zap size={20} /> Waaree Distribution Partner</div>
            <div><Sun size={20} /> PM Surya Ghar Vendor</div>
          </div>
        </div>
        <div className="ar-wrap ar-foot">
          <div>
            <div className="ar-logo" style={{ marginBottom: 16 }}>
              <div className="ar-logo-mark"><Sun size={22} /></div>
              <div className="ar-logo-text"><strong style={{ color: "#fff" }}>Arihant</strong><span>Electricals</span></div>
            </div>
            <p>Experts in hybrid solar solutions. Power without interruption, savings without limits.</p>
            <div className="ar-social">
              <a href={SOCIAL.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook"><Facebook size={15} /></a>
              <a href={SOCIAL.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram"><Instagram size={15} /></a>
              <a href={SOCIAL.youtube} target="_blank" rel="noopener noreferrer" aria-label="YouTube"><Youtube size={15} /></a>
              <a href={SOCIAL.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><Linkedin size={15} /></a>
            </div>
          </div>
          <div>
            <h4>Quick links</h4>
            <ul>{NAV.map((l) => <li key={l.to}><Link to={l.to}>{l.label}</Link></li>)}</ul>
          </div>
          <div>
            <h4>Solutions</h4>
            <ul>
              {PRODUCT_LINKS.map((p) => <li key={p.to}><Link to={p.to}>{p.label}</Link></li>)}
              <li><Link to="/pm-surya-ghar">PM Surya Ghar subsidy</Link></li>
            </ul>
          </div>
          <div>
            <h4>Get in touch</h4>
            <ul className="ar-foot-contact">
              <li><MapPin size={17} /> <span>Sangli, Kolhapur &amp; Satara, Maharashtra</span></li>
              <li><Phone size={15} /> <a href={PHONE_TEL}>{PHONE_DISPLAY}</a></li>
              <li><Mail size={15} /> <a href={`mailto:${EMAIL}`}>{EMAIL}</a></li>
            </ul>
          </div>
        </div>
        <div className="ar-copy">
          <div className="ar-wrap">
            <span>© {new Date().getFullYear()} Arihant Electricals. All rights reserved.</span>
            <span>Privacy Policy · Terms of Service</span>
          </div>
        </div>
      </footer>

      <EnquiryPopup />
    </div>
  );
};

export default Layout;