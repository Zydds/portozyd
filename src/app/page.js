import { ThemeProvider } from '@/components/ThemeProvider';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroSection from '@/components/sections/HeroSection';
import AboutSection from '@/components/sections/AboutSection';
import ExperienceSection from '@/components/sections/ExperienceSection';
import SkillsSection from '@/components/sections/SkillsSection';
import PortfolioSection from '@/components/sections/PortfolioSection';
import ContactSection from '@/components/sections/ContactSection';

export default function Home() {
  return (
    <ThemeProvider>
      <Header />
      <main style={{ paddingTop: '64px' }}>
        <HeroSection />
        <div className="wrap"><div className="divider"></div></div>
        <AboutSection />
        <div className="wrap"><div className="divider"></div></div>
        <ExperienceSection />
        <div className="wrap"><div className="divider"></div></div>
        <SkillsSection />
        <div className="wrap"><div className="divider"></div></div>
        <PortfolioSection />
        <div className="wrap"><div className="divider"></div></div>
        <ContactSection />
      </main>
      <Footer />
    </ThemeProvider>
  );
}
