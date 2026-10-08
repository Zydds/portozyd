import { getHomeData } from '@/lib/home-data';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroSection from '@/components/sections/HeroSection';
import AboutSection from '@/components/sections/AboutSection';
import ExperienceSection from '@/components/sections/ExperienceSection';
import SkillsSection from '@/components/sections/SkillsSection';
import PortfolioSection from '@/components/sections/PortfolioSection';
import ContactSection from '@/components/sections/ContactSection';

export const revalidate = 300; // ISR: homepage data refreshes every 5 min

export default async function Home() {
  const { details, profile, experiences, skills, projects } = await getHomeData();

  return (
    <>
      <Header />
      <main style={{ paddingTop: '64px' }}>
        <HeroSection />
        <div className="wrap"><div className="divider"></div></div>
        <AboutSection details={details} />
        <div className="wrap"><div className="divider"></div></div>
        <ExperienceSection experiences={experiences} />
        <div className="wrap"><div className="divider"></div></div>
        <SkillsSection skills={skills} />
        <div className="wrap"><div className="divider"></div></div>
        <PortfolioSection projects={projects} />
        <div className="wrap"><div className="divider"></div></div>
        <ContactSection profile={profile} details={details} />
      </main>
      <Footer profile={profile} details={details} />
    </>
  );
}
