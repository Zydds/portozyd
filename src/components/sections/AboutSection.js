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

  return (
    <section id="about" style={{ padding: 'clamp(48px, 7vw, 80px) 0', position: 'relative', zIndex: 2 }}>
      <div className="wrap">
        <div className="bar">
          <div className="bar-title">
            <h2>About me</h2>
          </div>
          <span className="meta">3 entries</span>
        </div>

        <div className="about-grid">
          <div>
            <blockquote>Curiosity about how things work behind the scenes led me here.</blockquote>
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
                  <div className="role">Bachelor&apos;s Degree, Information Technology</div>
                  <div className="place">Your University Name</div>
                  <div className="years">[Year] – [Year]</div>
                </div>
                <div className="panel-item">
                  <div className="role">High School Diploma</div>
                  <div className="place">Your High School Name</div>
                  <div className="years">[Year] – [Year]</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
