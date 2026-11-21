import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
// Adjust these paths to match your project folders.
import Layout from "../components/Layout";
import Home from "../pages/Home";
import About from "../pages/About";
import Products from "../pages/Products";
import PMSuryaGhar from "../pages/PMSuryaGhar";
import Industries from "../pages/Industries";
import Process from "../pages/Process";
import Gallery from "../pages/Gallery";
import FAQ from "../pages/FAQ";
import Contact from "../pages/Contact";

function NotFound() {
  return (
    <div style={{ textAlign: "center", padding: "120px 20px", fontFamily: "Manrope, Segoe UI, Arial, sans-serif", color: "#0F2A3F" }}>
      <p style={{ fontSize: 13, fontWeight: 800, letterSpacing: ".14em", color: "#0369A1", margin: 0 }}>ERROR 404</p>
      <h1 style={{ fontSize: 40, fontWeight: 800, color: "#075985", margin: "12px 0" }}>Page not found</h1>
      <Link to="/" style={{ background: "#FBBF24", padding: "14px 26px", borderRadius: 13, fontWeight: 800, color: "#0F2A3F" }}>Back to home</Link>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:type" element={<Products />} />
          <Route path="/pm-surya-ghar" element={<PMSuryaGhar />} />
          <Route path="/industries" element={<Industries />} />
          <Route path="/process" element={<Process />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/faq/:category" element={<FAQ />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}