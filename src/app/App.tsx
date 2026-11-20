import { Routes, Route, Navigate } from "react-router-dom";
import WebsiteLayout from "../layout/WebsiteLayout";
import DashboardLayout from "../layout/DashboardLayout";
import Home from "../pages/Home";
import Services from "../pages/Services";
import About from "../pages/About";
import Media from "../pages/Media";
import Contact from "../pages/Contact";
import { tokenStore } from "../config/Services";
import { JSX } from "react/jsx-runtime";

function RequireAuth({ children }: { children: JSX.Element }) {
  const token = tokenStore.get();
  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route element={<WebsiteLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/about" element={<About />} />
        <Route path="/media" element={<Media />} />
        <Route path="/contact" element={<Contact />} />
      </Route>


      <Route
        path="/admin"
        element={
          <RequireAuth>
            <DashboardLayout />
          </RequireAuth>
        }
      >
        <Route index element={<Navigate to="/admin/content" replace />} />
       
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}