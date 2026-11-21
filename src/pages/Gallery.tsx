import { useEffect, useState } from "react";
import { Camera, Play, X, ChevronLeft, ChevronRight, Youtube } from "lucide-react";
import img1 from "../assets/MSD_withSolarPanels.png";
import img2 from "../assets/InstallationWorker.jpeg";
import img3 from "../assets/Vendor_Consumer.jpeg";
import img4 from "../assets/HowPlanSOlar.jpeg";
import img5 from "../assets/MSD_Home.png";
import img6 from "../assets/MSD_ThumpsUp.png";

// Paste your YouTube video IDs here (the part after v= in the link), e.g. "a1B2c3D4e5F".
const YOUTUBE_IDS: string[] = [];

const PHOTOS = [
  { src: img1, caption: "Rooftop solar panel installation" },
  { src: img2, caption: "Installation crew at work" },
  { src: img3, caption: "Residential solar setup" },
  { src: img4, caption: "Site planning and design" },
  { src: img5, caption: "Completed rooftop system" },
  { src: img6, caption: "Happy Arihant customer" },
];

const STYLE = `
.gl { font-family:"Manrope","Segoe UI",Roboto,Arial,sans-serif; color:#0F2A3F; overflow:hidden; }
.gl a { color:inherit; text-decoration:none; }
.gl-wrap { max-width:1240px; margin:0 auto; padding:0 18px; }
.gl-hero { background:linear-gradient(135deg,#075985,#0EA5E9); color:#fff; padding:80px 0 110px; text-align:center; }
.gl-eyebrow { display:inline-block; font-size:12px; font-weight:800; letter-spacing:.14em; text-transform:uppercase; color:#0369A1; background:#E0F2FE; padding:6px 13px; border-radius:999px; }
.gl-hero .gl-eyebrow { background:rgba(255,255,255,.18); color:#fff; }
.gl-hero h1 { font-size:clamp(30px,4.4vw,50px); font-weight:800; margin:16px 0 12px; line-height:1.12; }
.gl-hero p { font-size:17px; color:#E0F2FE; max-width:620px; margin:0 auto; line-height:1.65; }
.gl-tabs-wrap { margin:-56px auto 0; position:relative; z-index:2; display:flex; justify-content:center; padding:0 18px; }
.gl-tabs { display:inline-flex; background:#fff; border-radius:999px; padding:6px; box-shadow:0 20px 44px rgba(3,105,161,.2); border:1px solid #DCEAF3; }
.gl-tab { display:inline-flex; align-items:center; gap:8px; border:0; background:none; cursor:pointer; padding:12px 24px; border-radius:999px; font:inherit; font-weight:800; font-size:15px; color:#4B5D6E; transition:background .25s, color .25s; }
.gl-tab:hover { color:#0369A1; }
.gl-tab.is-on { background:#0EA5E9; color:#fff; }
.gl-sec { padding:60px 0 90px; }
.gl-masonry { columns:3; column-gap:16px; }
.gl-item { break-inside:avoid; margin:0 0 16px; border-radius:18px; overflow:hidden; background:#fff; border:1px solid #DCEAF3; box-shadow:0 10px 26px rgba(3,105,161,.08); cursor:zoom-in; position:relative; transition:transform .3s, box-shadow .3s; }
.gl-item:hover { transform:translateY(-4px); box-shadow:0 22px 44px rgba(3,105,161,.18); }
.gl-item img { width:100%; height:auto; display:block; }
.gl-cap { position:absolute; left:0; right:0; bottom:0; padding:28px 14px 12px; background:linear-gradient(transparent,rgba(7,40,64,.85)); color:#fff; font-weight:700; font-size:14px; }
.gl-vids { display:grid; grid-template-columns:repeat(2,1fr); gap:22px; }
.gl-vid { background:#fff; border-radius:18px; overflow:hidden; border:1px solid #DCEAF3; box-shadow:0 10px 26px rgba(3,105,161,.08); }
.gl-frame { position:relative; padding-top:56.25%; background:#000; }
.gl-frame iframe { position:absolute; inset:0; width:100%; height:100%; border:0; }
.gl-vid-body { padding:14px 18px; font-weight:700; font-size:15px; color:#075985; display:flex; align-items:center; gap:8px; }
.gl-empty { text-align:center; padding:60px 20px; border:2px dashed #7DD3FC; border-radius:22px; background:#F3F9FD; }
.gl-empty h3 { color:#075985; margin:14px 0 8px; font-size:22px; }
.gl-empty p { color:#4B5D6E; margin:0 auto; max-width:460px; line-height:1.6; }
.gl-cta { margin-top:50px; background:linear-gradient(135deg,#075985,#0EA5E9); color:#fff; border-radius:24px; padding:36px; display:flex; justify-content:space-between; align-items:center; gap:20px; flex-wrap:wrap; }
.gl-cta h3 { font-size:24px; font-weight:800; margin:0 0 6px; }
.gl-cta p { margin:0; color:#E0F2FE; }
.gl-cta a { background:#FBBF24; color:#0F2A3F; padding:14px 24px; border-radius:13px; font-weight:800; box-shadow:0 12px 24px rgba(251,191,36,.35); }
.gl-lb { position:fixed; inset:0; z-index:200; background:rgba(3,20,34,.92); display:flex; align-items:center; justify-content:center; padding:20px; animation:glFade .25s ease both; }
.gl-lb img { max-width:100%; max-height:86vh; border-radius:14px; box-shadow:0 30px 80px rgba(0,0,0,.5); }
.gl-lb-cap { position:absolute; bottom:20px; left:0; right:0; text-align:center; color:#E0F2FE; font-weight:700; }
.gl-lb-btn { position:absolute; width:46px; height:46px; border-radius:50%; border:0; background:rgba(255,255,255,.15); color:#fff; display:flex; align-items:center; justify-content:center; cursor:pointer; transition:background .2s; }
.gl-lb-btn:hover { background:rgba(255,255,255,.3); }
@keyframes glFade { from { opacity:0; } to { opacity:1; } }
@media (max-width:900px){ .gl-masonry { columns:2; } .gl-vids { grid-template-columns:1fr; } }
@media (max-width:520px){ .gl-masonry { columns:1; } .gl-tab { padding:10px 16px; font-size:14px; } }
`;

export default function Gallery() {
  const [tab, setTab] = useState<"photos" | "videos">("photos");
  const [idx, setIdx] = useState<number | null>(null);

  useEffect(() => {
    if (idx === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIdx(null);
      if (e.key === "ArrowRight") setIdx((i) => (i === null ? null : (i + 1) % PHOTOS.length));
      if (e.key === "ArrowLeft") setIdx((i) => (i === null ? null : (i - 1 + PHOTOS.length) % PHOTOS.length));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [idx]);

  const current = idx !== null ? PHOTOS[idx] : null;

  return (
    <div className="gl">
      <style>{STYLE}</style>

      <section className="gl-hero">
        <div className="gl-wrap">
          <span className="gl-eyebrow">Gallery</span>
          <h1>Our installations, in pictures and video</h1>
          <p>Real rooftop projects completed by Arihant Electricals across Maharashtra.</p>
        </div>
      </section>

      <div className="gl-tabs-wrap">
        <div className="gl-tabs" role="tablist">
          <button role="tab" aria-selected={tab === "photos"} className={`gl-tab${tab === "photos" ? " is-on" : ""}`} onClick={() => setTab("photos")}>
            <Camera size={17} /> Photos
          </button>
          <button role="tab" aria-selected={tab === "videos"} className={`gl-tab${tab === "videos" ? " is-on" : ""}`} onClick={() => setTab("videos")}>
            <Play size={17} /> Videos
          </button>
        </div>
      </div>

      <section className="gl-sec">
        <div className="gl-wrap">
          {tab === "photos" ? (
            <div className="gl-masonry">
              {PHOTOS.map((p, i) => (
                <figure key={p.caption} className="gl-item" onClick={() => setIdx(i)} style={{ margin: "0 0 16px" }}>
                  <img src={p.src} alt={p.caption} loading="lazy" />
                  <figcaption className="gl-cap">{p.caption}</figcaption>
                </figure>
              ))}
            </div>
          ) : YOUTUBE_IDS.length === 0 ? (
            <div className="gl-empty">
              <Youtube size={48} color="#DC2626" />
              <h3>Videos are coming soon</h3>
              <p>Add your YouTube video IDs in Gallery.tsx to show installation videos here, one per row.</p>
            </div>
          ) : (
            <div className="gl-vids">
              {YOUTUBE_IDS.map((id) => (
                <div key={id} className="gl-vid">
                  <div className="gl-frame">
                    <iframe
                      src={`https://www.youtube-nocookie.com/embed/${id}`}
                      title="Arihant installation video"
                      loading="lazy"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                  <div className="gl-vid-body"><Play size={16} /> Installation video</div>
                </div>
              ))}
            </div>
          )}

          <div className="gl-cta">
            <div>
              <h3>Want a similar installation at your home?</h3>
              <p>Get a free site survey and a customized solar estimate.</p>
            </div>
            <a href="/contact">Get a free quote</a>
          </div>
        </div>
      </section>

      {current && (
        <div className="gl-lb" onClick={() => setIdx(null)}>
          <img src={current.src} alt={current.caption} onClick={(e) => e.stopPropagation()} />
          <button className="gl-lb-btn" style={{ top: 20, right: 20 }} onClick={() => setIdx(null)} aria-label="Close"><X size={22} /></button>
          <button className="gl-lb-btn" style={{ left: 20, top: "50%" }} onClick={(e) => { e.stopPropagation(); setIdx((i) => (i === null ? null : (i - 1 + PHOTOS.length) % PHOTOS.length)); }} aria-label="Previous"><ChevronLeft size={24} /></button>
          <button className="gl-lb-btn" style={{ right: 20, top: "50%" }} onClick={(e) => { e.stopPropagation(); setIdx((i) => (i === null ? null : (i + 1) % PHOTOS.length)); }} aria-label="Next"><ChevronRight size={24} /></button>
          <div className="gl-lb-cap">{current.caption}</div>
        </div>
      )}
    </div>
  );
}