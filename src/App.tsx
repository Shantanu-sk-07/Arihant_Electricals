import { Routes, Route, Navigate } from 'react-router-dom';

// Public pages
import Layout from '@/layout/Layout';
import Home from '@/pages/Home';
import About from '@/pages/About';
import Services from '@/pages/Services';
import Pricing from '@/pages/Pricing';
import MediaPage from '@/pages/Media';
import Contact from '@/pages/Contact';

// Admin pages
import Login from '@/pages/admin/Login';
import Dashboard from '@/pages/admin/Dashboard';
import HomeEditor from '@/pages/admin/HomeEditor';
import AboutEditor from '@/pages/admin/AboutEditor';
import ServicesManager from '@/pages/admin/ServicesManager';
import PricingManager from '@/pages/admin/PricingManger';
import BenefitsManager from '@/pages/admin/BenefitsManager';
import TestimonialsManager from '@/pages/admin/TestimonialManager';
import MediaManager from '@/pages/admin/MediaManager';
import ContactsList from '@/pages/admin/ContactsList';
import Settings from '@/pages/admin/Settings';
import SiteContentManager from '@/pages/admin/SiteContentManager';

// Layouts
import AdminLayout from '@/layout/AdminLayout';
import ProtectedRoute from '@/hooks/ProtectedRoute';

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
        <Route index element={<Dashboard />} />
        <Route path="home" element={<HomeEditor />} />
        <Route path="about" element={<AboutEditor />} />
        <Route path="services" element={<ServicesManager />} />
        <Route path="pricing" element={<PricingManager />} />
        <Route path="benefits" element={<BenefitsManager />} />
        <Route path="testimonials" element={<TestimonialsManager />} />
        <Route path="media" element={<MediaManager />} />
        <Route path="contacts" element={<ContactsList />} />
        <Route path="settings" element={<Settings />} />
        <Route path="content" element={<SiteContentManager />} />
      </Route>

      {/* ============ FALLBACK ============ */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}