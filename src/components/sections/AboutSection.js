'use client';

import Image from 'next/image';

const defaultParagraphs = {
  about_p1: "I'm a software quality advocate and web developer based in Indonesia. My journey started with curiosity about how things work behind the scenes, which led me to QA and full-stack development.",
  about_p2: "I build reliable, user-friendly web applications while making sure every detail meets high standards, from automated test suites to responsive interfaces.",
  about_p3: "Outside of testing and coding, I explore new tech, play strategy games, and organize projects with my favorite productivity tools.",
};

export default function AboutSection({ details = {} }) {
  const copy = {
    about_p1: details.about_p1 || defaultParagraphs.about_p1,
    about_p2: details.about_p2 || defaultParagraphs.about_p2,
    about_p3: details.about_p3 || defaultParagraphs.about_p3,
  };
  const title = details.about_title || 'About me';
  const quote = details.about_quote || 'Curiosity about how things work behind the scenes led me here.';
  const edu1 = {
    title: details.edu_1_title || "Bachelor's Degree, Information Technology",
    place: details.edu_1_place || 'Your University Name',
    years: details.edu_1_years || '[Year] – [Year]',
    image: details.edu_1_image || '',
  };
  const edu2 = {
    title: details.edu_2_title || 'High School Diploma',
    place: details.edu_2_place || 'Your High School Name',
    years: details.edu_2_years || '[Year] – [Year]',
    image: details.edu_2_image || '',
  };

  return (
    <section id="about" style={{ padding: 'clamp(48px, 7vw, 80px) 0', position: 'relative', zIndex: 2 }}>
      <div className="wrap">
        <div className="bar">
          <div className="bar-title">
            <h2>{title}</h2>
          </div>
          <span className="meta">3 entries</span>
        </div>

        <div className="about-grid">
          <div>
            <blockquote>{quote}</blockquote>
            <p>{copy.about_p1}</p>
            <p>{copy.about_p2}</p>
            <p>{copy.about_p3}</p>
          </div>

          <div className="about-side">
            <div className="panel">
              <div className="panel-header">
                <span className="lbl"><span className="icon-chip"></span> education</span>
                <span>2 records</span>
              </div>
              <div className="panel-body">
                <div className="panel-item">
                  {edu1.image && (
                    <span className="edu-thumb">
                      <Image src={edu1.image} alt="" width={56} height={56} sizes="56px" onError={(e) => { e.currentTarget.parentElement.style.display = 'none'; }} />
                    </span>
                  )}
                  <div>
                    <div className="role">{edu1.title}</div>
                    <div className="place">{edu1.place}</div>
                    <div className="years">{edu1.years}</div>
                  </div>
                </div>
                <div className="panel-item">
                  {edu2.image && (
                    <span className="edu-thumb">
                      <Image src={edu2.image} alt="" width={56} height={56} sizes="56px" onError={(e) => { e.currentTarget.parentElement.style.display = 'none'; }} />
                    </span>
                  )}
                  <div>
                    <div className="role">{edu2.title}</div>
                    <div className="place">{edu2.place}</div>
                    <div className="years">{edu2.years}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
