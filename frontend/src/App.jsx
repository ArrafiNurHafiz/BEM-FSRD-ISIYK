import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Layouts
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';

// Public Pages
import Home from './pages/Home';
import About from './pages/About';
import Programs from './pages/Programs';
import ProgramDetail from './pages/ProgramDetail';
import News from './pages/News';
import NewsDetail from './pages/NewsDetail';
import Gallery from './pages/Gallery';
import Events from './pages/Events';
import Contact from './pages/Contact';

// Admin Pages
import AdminLogin from './pages/admin/Login';
import AdminDashboard from './pages/admin/Dashboard';
import AdminNews from './pages/admin/News';
import AdminPrograms from './pages/admin/Programs';
import AdminEvents from './pages/admin/Events';
import AdminGallery from './pages/admin/Gallery';
import AdminComments from './pages/admin/Comments';
import AdminMessages from './pages/admin/Messages';
import AdminAspirations from './pages/admin/Aspirations';
import AdminOrganization from './pages/admin/Organization';
import AdminAbout from './pages/admin/About';
import HeroSlider from './pages/admin/HeroSlider';
import AdminChairmanGreeting from './pages/admin/ChairmanGreeting';
import AdminKabinetSasmita from './pages/admin/KabinetSasmita';

// Protected Route Component
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="tentang-kami" element={<About />} />
            <Route path="program-kerja" element={<Programs />} />
            <Route path="program-kerja/:slug" element={<ProgramDetail />} />
            <Route path="berita" element={<News />} />
            <Route path="berita/:slug" element={<NewsDetail />} />
            <Route path="galeri" element={<Gallery />} />
            <Route path="kalender-kegiatan" element={<Events />} />
            <Route path="kontak" element={<Contact />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="berita" element={<AdminNews />} />
            <Route path="program-kerja" element={<AdminPrograms />} />
            <Route path="kegiatan" element={<AdminEvents />} />
            <Route path="galeri" element={<AdminGallery />} />
            <Route path="organisasi" element={<AdminOrganization />} />
            <Route path="tentang-kami" element={<AdminAbout />} />
            <Route path="sambutan-ketua" element={<AdminChairmanGreeting />} />
            <Route path="kabinet-sasmita" element={<AdminKabinetSasmita />} />
            <Route path="komentar" element={<AdminComments />} />
            <Route path="pesan" element={<AdminMessages />} />
            <Route path="aspirasi" element={<AdminAspirations />} />
            <Route path="hero-slider" element={<HeroSlider />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

