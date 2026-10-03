import { Routes, Route, Navigate } from 'react-router-dom';

// Public pages
import Layout from '@/layout/Layout';
import Home from '@/pages/Home';
import About from '@/pages/About';
import Services from '@/pages/Services';
import Pricing from '@/pages/Pricing';
import MediaPage from '@/pages/Media';
import Contact from '@/pages/Contact';

// Admin
import Login from '@/pages/admin/Login';
import AdminLayout from '@/layout/AdminLayout';
import ProtectedRoute from '@/helpers/ProtectedRoute';

import BasicDetailsEditor from '@/pages/admin/BasicDetailsEditor';
import ServicesManager from '@/pages/admin/ServicesManager';
import PricingManager from '@/pages/admin/PricingManager';
import MediaManager from '@/pages/admin/MediaManager';
import BenefitsTestimonialsManager from '@/pages/admin/BenefitsTestimonialsManager';
import ExtraDetailsManager from '@/pages/admin/ExtraDetailsManager';

export default function App() {
  return (
    <Routes>
      {/* ============ PUBLIC SITE ============ */}
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/media" element={<MediaPage />} />
        <Route path="/contact" element={<Contact />} />
      </Route>

      {/* ============ ADMIN LOGIN ============ */}
      <Route path="/admin/login" element={<Login />} />

      {/* ============ ADMIN DASHBOARD ============ */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/admin/basic" replace />} />
        <Route path="basic" element={<BasicDetailsEditor />} />
        <Route path="services" element={<ServicesManager />} />
        <Route path="pricing" element={<PricingManager />} />
        <Route path="media" element={<MediaManager />} />
        <Route path="benefits" element={<BenefitsTestimonialsManager />} />
        <Route path="extra" element={<ExtraDetailsManager />} />
      </Route>

      {/* ============ FALLBACK ============ */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}