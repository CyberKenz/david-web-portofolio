import { MotionConfig } from 'framer-motion';
import { useLenisSmoothScroll } from './hooks/useLenisSmoothScroll';
import { NavigationBar } from './components/navigation/NavigationBar';
import { HeroSection } from './components/hero/HeroSection';
import { AboutSection } from './components/about/AboutSection';
import { SpecialtiesSection } from './components/specialties/SpecialtiesSection';
import { JourneyTimeline } from './components/journey/JourneyTimeline';
import { CertificationSection } from './components/certification/CertificationSection';
import { FAQSection } from './components/faq/FAQSection';
import { GallerySection } from './components/gallery/GallerySection';
import { ContactSection } from './components/contact/ContactSection';
import { FloatingWhatsApp } from './components/common/FloatingWhatsApp';
import { WaveDivider } from './components/common/WaveDivider';
import { ChatWidget } from './components/chat/ChatWidget';

export function App() {
  useLenisSmoothScroll();

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-[100dvh] bg-cream text-night">
        <a href="#konten" className="skip-link">
          Lewati ke konten utama
        </a>

        <NavigationBar />

        <main id="konten">
          <HeroSection />
          <WaveDivider from="bg-brand" to="text-cream" />

          <AboutSection />
          <WaveDivider from="bg-cream" to="text-night" />

          <SpecialtiesSection />
          <WaveDivider from="bg-night" to="text-cream" />

          <JourneyTimeline />
          <CertificationSection />
          <WaveDivider from="bg-cream-deep" to="text-night" />

          <GallerySection />
          <FAQSection />
          <ContactSection />
        </main>

        <FloatingWhatsApp />
        <ChatWidget />
      </div>
    </MotionConfig>
  );
}

export default App;
