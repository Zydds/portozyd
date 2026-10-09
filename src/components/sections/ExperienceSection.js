export default function ExperienceSection({ experiences = [], details = {} }) {
  const items = experiences.map(e => ({
    title: e.title,
    company: e.company,
    dates: `${e.startDate} – ${e.isCurrent ? 'Present' : (e.endDate || 'Present')}`,
    description: e.description,
    tags: e.tags || [],
  }));
  const sectionTitle = details.experience_title || 'Experience';

  return (
    <section id="experience" style={{ padding: 'clamp(48px, 7vw, 80px) 0', position: 'relative', zIndex: 2 }}>
      <div className="wrap">
        <div className="bar">
          <div className="bar-title">
            <h2>{sectionTitle}</h2>
          </div>
          <span className="meta">{items.length} roles</span>
        </div>

        <div className="timeline">
          {items.map((exp, i) => (
            <div className="titem" key={i}>
              <div className="posted">posted by <b style={{ color: 'var(--text-secondary)' }}>zydds</b> · {exp.dates.split('–')[0].trim()}</div>
              <div className="row">
                <span className="title">{exp.title}</span>
                <span className="dates">{exp.dates}</span>
              </div>
              <div className="company">{exp.company}</div>
              <div className="desc">{exp.description}</div>
              {exp.tags && exp.tags.length > 0 && (
                <div className="tags">
                  {exp.tags.map(tag => <span className="tag" key={tag}>{tag}</span>)}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}