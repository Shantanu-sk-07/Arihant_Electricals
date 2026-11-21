import { useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { ChevronDown, HelpCircle, Star } from "lucide-react";
import heroImg from "../assets/MSD_Home.png";

type Cat = "general" | "installation" | "financial" | "technical";
interface QA { q: string; a: string[] }

const TOP: QA[] = [
  {
    q: "How much subsidy can I get under PM Surya Ghar in Maharashtra?",
    a: [
      "The central subsidy for a grid-connected residential rooftop system is Rs 30,000 for 1 kW, Rs 60,000 for 2 kW, and Rs 78,000 for 3 kW and above.",
      "Maharashtra may offer an additional state contribution. Because state terms can change, we confirm the current state amount for your district at the time of application, before you commit to a system.",
    ],
  },
  {
    q: "Will I have electricity during a power cut?",
    a: [
      "An on-grid system shuts down during an MSEDCL outage for the safety of linemen, so it gives no backup. That is a design requirement, not a fault.",
      "A hybrid system with a battery keeps your chosen backup circuits running during outages. If cuts are frequent in your area, hybrid is the right choice.",
    ],
  },
  {
    q: "Is the site survey and estimate free?",
    a: [
      "Yes. Our site survey, roof assessment, system design and written estimate are free, and you are under no obligation to proceed.",
      "The survey covers roof structure, shading, your electricity bill, the subsidy you qualify for, and the expected payback period.",
    ],
  },
  {
    q: "How long does installation take?",
    a: [
      "A residential rooftop system is usually installed in about one day once the design is approved and materials are on site.",
      "The full process, including portal registration, MSEDCL feasibility approval, net-meter fitting and subsidy credit, depends on the portal and DISCOM processing time. We keep you updated at every stage.",
    ],
  },
];

const CATS: Record<Cat, { label: string; intro: string; items: QA[] }> = {
  general: {
    label: "General",
    intro: "Eligibility, documents and how the PM Surya Ghar scheme works for homes in Maharashtra.",
    items: [
      {
        q: "Who is eligible for PM Surya Ghar in Maharashtra?",
        a: [
          "Residential homeowners with a suitable rooftop and a valid domestic electricity connection in their name are eligible to apply.",
          "The applicant should not already have received a central subsidy for rooftop solar on the same property. If you are a tenant, the owner's consent is usually required. We confirm eligibility during the free site visit.",
        ],
      },
      {
        q: "Which electricity board is involved in Maharashtra?",
        a: [
          "In most of Maharashtra, including Sangli, Kolhapur and Satara, the distribution company is MSEDCL, known as Mahavitaran. Feasibility, net-meter fitting and commissioning all go through MSEDCL.",
          "Parts of Mumbai and Thane are served by private distributors such as Tata Power or Adani Electricity. The paperwork is similar but the local contact points differ, so tell us your area when you enquire.",
        ],
      },
      {
        q: "Which documents are normally needed?",
        a: [
          "Typically: Aadhaar card, a recent MSEDCL electricity bill showing your consumer number, bank passbook or cancelled cheque for the subsidy transfer, and proof of ownership of the property.",
          "For rural plots in Maharashtra this is often a 7/12 extract or 8A extract, or a Gram Panchayat property tax receipt. In towns and cities, a property tax receipt is usually accepted. The exact list can change, so we confirm it before you apply.",
        ],
      },
      {
        q: "Where do I register for the scheme?",
        a: [
          "Registration is on the national PM Surya Ghar portal. You enter your electricity consumer number and mobile details, select your DISCOM, and choose an approved vendor.",
          "Arihant Electricals can complete the registration on your behalf, so you do not have to navigate the portal yourself. We keep you informed at each stage.",
        ],
      },
      {
        q: "Can I apply if I already have a solar system?",
        a: [
          "If you already have a grid-connected system, the central subsidy usually cannot be claimed again for the same property. If the existing system is not yet subsidised, we check its status and advise whether an upgrade or an additional capacity is eligible.",
        ],
      },
      {
        q: "Can tenants apply for PM Surya Ghar?",
        a: [
          "Applications are normally made by the owner of the property, because the net meter and subsidy are tied to the owner's electricity connection and ownership documents.",
          "Tenants can still arrange a system with the owner's written consent. We explain the options during the survey.",
        ],
      },
    ],
  },
  installation: {
    label: "Installation",
    intro: "Roof suitability, what happens on installation day, safety and aftercare for your system.",
    items: [
      {
        q: "What kind of roof is suitable for solar?",
        a: [
          "A roof that is structurally sound, receives good sunlight for most of the day, and is not heavily shaded by trees, water tanks or neighbouring buildings. The best orientation in Maharashtra is south-facing, though east and west roofs also work with a suitable layout.",
          "We check the roof type, the load capacity and the shadow pattern during the free survey, and tell you clearly if your roof is not suitable.",
        ],
      },
      {
        q: "Will the installation damage my roof or cause leaks?",
        a: [
          "The mounting structure is fixed with care so that the roof waterproofing is respected. We use appropriate sealing at every fixing point and avoid unnecessary penetrations.",
          "We explain the method, any roof work and the sealing used before the installation starts, so you know exactly what will happen on your roof.",
        ],
      },
      {
        q: "How much roof area do I need?",
        a: [
          "As a practical guide, a 1 kW system needs about 100 square feet of unshaded roof area. A 2 kW system needs about 200 square feet, and a 3 kW system about 300 square feet.",
          "Exact requirement depends on the panel size, layout and the clearance needed for access and maintenance.",
        ],
      },
      {
        q: "How long does installation take on the day?",
        a: [
          "For a typical residential system, the physical installation is completed in about one day. Mounting, panel fitting, cabling, inverter installation, earthing and testing are all covered in that time.",
          "Net-meter fitting and commissioning are scheduled separately with MSEDCL, and we coordinate those dates for you.",
        ],
      },
      {
        q: "Can installation be done during the monsoon?",
        a: [
          "Yes, installation can continue during the monsoon, but heavy rain and strong winds cause delays. We schedule installation around weather windows and keep the roof protected during work.",
          "Plan ahead if you want installation before the monsoon season, because demand and weather both affect timing.",
        ],
      },
      {
        q: "What maintenance does the system need?",
        a: [
          "Panels need periodic cleaning, particularly after dust storms and during the dry season when bird droppings and dust build up. Regular inspection of connections, earthing and the inverter keeps the system healthy.",
          "We offer annual maintenance support including cleaning, inspection and performance checks. Ask our team about the current maintenance plan for your system.",
        ],
      },
    ],
  },
  financial: {
    label: "Financial",
    intro: "Subsidy amounts, when money is credited, bank loans, and the likely payback on your investment.",
    items: [
      {
        q: "What is the subsidy amount and how is it calculated?",
        a: [
          "The central subsidy is Rs 30,000 for 1 kW, Rs 60,000 for 2 kW, and Rs 78,000 for 3 kW and above. The amount is based on the capacity of the system you install, up to the central cap.",
          "Maharashtra may add a state contribution on top. We state the total you can expect for your district before you commit.",
        ],
      },
      {
        q: "When is the subsidy credited to my bank account?",
        a: [
          "The subsidy is paid directly into your bank account after installation, commissioning and net-meter approval, once the portal has verified your documents and the system details.",
          "Processing time varies with the portal and DISCOM workload. We track your application so you know where it stands.",
        ],
      },
      {
        q: "Can I get a loan for a rooftop solar system?",
        a: [
          "Several public-sector and partner banks offer loans for residential rooftop solar systems. Interest rates, tenure and eligibility are set by each bank and can change, so compare current offers before you apply.",
          "If the main applicant does not meet the bank's criteria, a co-applicant such as a spouse or family member may be added. We help you prepare the paperwork.",
        ],
      },
      {
        q: "How long will it take to recover my investment?",
        a: [
          "Payback depends on the system size, your current tariff, how much you use during the day and the subsidy received. Many homes in Maharashtra see a payback of several years, after which the savings are largely profit over the life of the system.",
          "We provide a written estimate based on your actual bill, so the payback figure is specific to your home rather than a general claim.",
        ],
      },
      {
        q: "Is there any cost if the subsidy is delayed?",
        a: [
          "The subsidy is paid by the government, so it is not tied to your installation payment. If you take a loan, the EMI continues on schedule while the subsidy is processed.",
          "We keep the application moving and follow up with the portal and DISCOM, so delays are handled on your behalf.",
        ],
      },
      {
        q: "Does a solar system increase the value of my property?",
        a: [
          "Buyers often value lower running costs, and a well-maintained system with transferable documents can be a selling point. The effect varies by location and market, so treat it as a benefit rather than a guaranteed increase in price.",
        ],
      },
    ],
  },
  technical: {
    label: "Technical",
    intro: "The difference between the three systems, net metering in Maharashtra, warranties and batteries.",
    items: [
      {
        q: "What is the difference between on-grid, off-grid and hybrid?",
        a: [
          "On-grid works alongside the MSEDCL supply and exports surplus through net metering. It has no battery and therefore no backup during outages.",
          "Off-grid has no grid connection and runs entirely on batteries. Hybrid combines the grid connection, a battery and a hybrid inverter, so you get net metering and backup for selected circuits.",
        ],
      },
      {
        q: "What is net metering and how is it settled?",
        a: [
          "Net metering lets your system export extra units to MSEDCL during the day and receive credit for them against the units you import. You are billed only for the net consumption in the billing period.",
          "Surplus credits are settled as per MERC rooftop solar rules. The treatment of surplus units at the end of the year depends on the rules in force, and we explain your settlement clearly.",
        ],
      },
      {
        q: "How long do the solar panels last?",
        a: [
          "Solar modules are usually covered by a long performance warranty, often around 25 years, with a guaranteed minimum output at the end of that period. Output declines slightly each year, which is normal.",
          "We provide the exact warranty for each brand we install, including Tata Power Solar and Waaree modules.",
        ],
      },
      {
        q: "How long do inverters and batteries last?",
        a: [
          "Inverters are usually warranted for several years, commonly 5 to 10 depending on the model, and may need replacement during the life of the panels. Lithium batteries typically last longer than lead-acid, and their life depends on depth of discharge and temperature.",
          "We size the battery to your actual use, so it is not overworked, and we explain the warranty and expected life before you decide.",
        ],
      },
      {
        q: "Which equipment brands do you use?",
        a: [
          "Arihant Electricals is an official retail partner of Tata Power Solar and a distribution partner of Waaree Energies. We also work with Adani Solar.",
          "We recommend the module, inverter and battery combination that suits your roof, budget and backup needs, rather than pushing one brand for every site.",
        ],
      },
      {
        q: "Can an on-grid system be upgraded to hybrid later?",
        a: [
          "In many cases yes. The hybrid inverter and battery can be added to an existing on-grid system, subject to the inverter and wiring being compatible.",
          "We check your existing system during the survey and tell you whether an upgrade is practical and what it would cost.",
        ],
      },
    ],
  },
};

const CAT_KEYS = Object.keys(CATS) as Cat[];

const STYLE = `
.fq { font-family:"Manrope","Segoe UI",Roboto,Arial,sans-serif; color:#0F2A3F; overflow:hidden; }
.fq a { color:inherit; text-decoration:none; }
.fq-wrap { max-width:960px; margin:0 auto; padding:0 20px; }
.fq-hero { position:relative; background:#075985; color:#fff; overflow:hidden; }
.fq-hero-img { position:absolute; inset:0; }
.fq-hero-img img { width:100%; height:100%; object-fit:cover; object-position:center 30%; }
.fq-hero::after { content:""; position:absolute; inset:0; background:linear-gradient(90deg,rgba(7,89,133,.74) 0%,rgba(14,165,233,.25) 75%); }
.fq-hero-in { position:relative; z-index:2; padding:126px 0 84px; }
.fq-eyebrow { display:inline-block; font-size:12.5px; font-weight:800; letter-spacing:.14em; text-transform:uppercase; color:#0369A1; background:#E0F2FE; padding:7px 14px; border-radius:999px; }
.fq-hero .fq-eyebrow { background:rgba(255,255,255,.2); color:#fff; }
.fq-hero h1 { font-size:clamp(32px,4.4vw,50px); font-weight:800; line-height:1.1; margin:16px 0 12px; }
.fq-hero p { font-size:17px; line-height:1.7; color:#E0F2FE; margin:0; max-width:680px; }
.fq-tabs { background:#fff; border-bottom:1px solid #DCEAF3; position:sticky; top:70px; z-index:20; }
.fq-tabs-in { display:flex; gap:6px; overflow-x:auto; padding:12px 0; }
.fq-tab { flex:1; min-width:120px; text-align:center; padding:11px 14px; border-radius:12px; font-weight:800; font-size:14.5px; color:#4B5D6E; background:#F3F9FD; border:1px solid #DCEAF3; }
.fq-tab:hover { color:#0369A1; }
.fq-tab.is-on { background:#0EA5E9; color:#fff; border-color:#0EA5E9; }
.fq-body { padding:56px 0 80px; }
.fq-intro { font-size:16.5px; line-height:1.7; color:#4B5D6E; margin:0 0 26px; }
.fq-h2 { font-size:22px; font-weight:800; color:#075985; margin:0 0 16px; display:flex; align-items:center; gap:10px; }
.fq-item { border-top:1px solid #DCEAF3; }
.fq-item:last-child { border-bottom:1px solid #DCEAF3; }
.fq-q { width:100%; display:flex; justify-content:space-between; align-items:center; gap:16px; background:none; border:0; padding:19px 4px; cursor:pointer; font:inherit; font-weight:800; font-size:16.5px; color:#0F2A3F; text-align:left; }
.fq-q:hover { color:#0369A1; }
.fq-q svg { transition:transform .3s; color:#0EA5E9; flex-shrink:0; }
.fq-item.open .fq-q svg { transform:rotate(180deg); }
.fq-item.open .fq-q { color:#075985; }
.fq-a { max-height:0; overflow:hidden; transition:max-height .45s ease; }
.fq-item.open .fq-a { max-height:900px; }
.fq-a div { padding:0 4px 20px; }
.fq-a p { margin:0 0 12px; color:#3E5263; line-height:1.8; font-size:15.5px; }
.fq-a p:last-child { margin-bottom:0; }
.fq-cta { margin-top:46px; background:linear-gradient(135deg,#075985,#0EA5E9); color:#fff; border-radius:20px; padding:30px; display:flex; justify-content:space-between; align-items:center; gap:18px; flex-wrap:wrap; }
.fq-cta h3 { margin:0 0 6px; font-size:21px; font-weight:800; }
.fq-cta p { margin:0; color:#E0F2FE; font-size:15px; }
.fq-cta a { background:#FBBF24; color:#0F2A3F; padding:13px 22px; border-radius:12px; font-weight:800; box-shadow:0 10px 22px rgba(251,191,36,.35); }
@media (max-width:620px){ .fq-q { font-size:15.5px; } .fq-a p { font-size:15px; } }
`;

function Accordion({ items, openFirst }: { items: QA[]; openFirst: boolean }) {
  const [open, setOpen] = useState<number | null>(openFirst ? 0 : null);
  return (
    <div>
      {items.map((it, i) => {
        const isOpen = open === i;
        return (
          <div key={it.q} className={`fq-item${isOpen ? " open" : ""}`}>
            <button className="fq-q" onClick={() => setOpen(isOpen ? null : i)} aria-expanded={isOpen}>
              {it.q}
              <ChevronDown size={20} />
            </button>
            <div className="fq-a">
              <div>{it.a.map((p, k) => <p key={k}>{p}</p>)}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function FAQ() {
  const { category } = useParams();
  if (category && !(category in CATS)) return <Navigate to="/faq" replace />;

  const isTop = !category;
  const cat = category ? CATS[category as Cat] : null;
  const title = isTop ? "Top questions answered" : `${cat!.label} questions`;
  const intro = isTop
    ? "The questions Maharashtra homeowners ask us most, answered in full."
    : cat!.intro;

  return (
    <div className="fq">
      <style>{STYLE}</style>
      <section className="fq-hero">
        <div className="fq-hero-img">
  <img src={heroImg} alt="" />
</div>
        <div className="fq-wrap">
          <div className="fq-hero-in">
            <span className="fq-eyebrow">FAQ</span>
            <h1>{title}</h1>
            <p>{intro}</p>
          </div>
        </div>
      </section>

      <div className="fq-tabs">
        <div className="fq-wrap fq-tabs-in">
          <Link to="/faq" className={`fq-tab${isTop ? " is-on" : ""}`}>Top Questions</Link>
          {CAT_KEYS.map((k) => (
            <Link key={k} to={`/faq/${k}`} className={`fq-tab${category === k ? " is-on" : ""}`}>{CATS[k].label}</Link>
          ))}
        </div>
      </div>

      <section className="fq-body">
        <div className="fq-wrap">
          {isTop ? (
            <>
              <h2 className="fq-h2"><Star size={22} color="#F59E0B" fill="#F59E0B" /> Most asked</h2>
              <Accordion key="top" items={TOP} openFirst />
            </>
          ) : (
            <>
              <h2 className="fq-h2"><HelpCircle size={22} color="#0369A1" /> {cat!.label}</h2>
              <Accordion key={category} items={cat!.items} openFirst />
            </>
          )}

          <div className="fq-cta">
            <div>
              <h3>Still have a question?</h3>
              <p>Talk to our solar team. We reply within 24 hours on working days.</p>
            </div>
            <Link to="/contact">Ask our team</Link>
          </div>
        </div>
      </section>
    </div>
  );
}