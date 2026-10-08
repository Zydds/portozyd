import SkillIcon from '@/components/SkillIcon';

const placeholderCategories = [
  {
    title: 'Languages',
    skills: [
      { name: 'JavaScript', color: '#F7DF1E' },
      { name: 'TypeScript', color: '#3178C6' },
      { name: 'Python', color: '#3776AB' },
      { name: 'PHP', color: '#777BB4' },
    ],
  },
  {
    title: 'Frameworks & Libraries',
    skills: [
      { name: 'React', color: '#61DAFB' },
      { name: 'Next.js', color: '#F5F5F5' },
      { name: 'Vue.js', color: '#4FC08D' },
      { name: 'Node.js', color: '#339933' },
      { name: 'Tailwind CSS', color: '#06B6D4' },
      { name: 'WordPress', color: '#21759B' },
      { name: 'Laravel', color: '#FF2D20' },
    ],
  },
  {
    title: 'Testing & QA Tools',
    skills: [
      { name: 'Cypress', color: '#17202C' },
      { name: 'Playwright', color: '#45ba4b' },
      { name: 'Jest', color: '#C21325' },
      { name: 'Postman', color: '#FF6C37' },
    ],
  },
  {
    title: 'Tools & Productivity',
    skills: [
      { name: 'Notion', color: '#F5F5F5' },
      { name: 'Git', color: '#F05032' },
      { name: 'GitHub', color: '#F5F5F5' },
      { name: 'Jira', color: '#0052CC' },
      { name: 'GitLab', color: '#FC6D26' },
    ],
  },
  {
    title: 'Soft Skills',
    skills: [
      { name: 'MS Office', color: '#0078D4' },
      { name: 'English speaking', color: '#6366F1' },
      { name: 'Indonesian (native)', color: '#E70011' },
      { name: 'Canva (basic editing)', color: '#00C4CC' },
    ],
  },
];

function buildCategoriesFromDB(skills) {
  const map = {};
  skills.forEach(s => {
    const cat = s.category || 'Other';
    if (!map[cat]) map[cat] = [];
    map[cat].push({ name: s.name, color: s.color || '#6366F1', iconKey: s.iconKey || '' });
  });
  return Object.entries(map).map(([title, skills]) => ({ title, skills }));
}

export default function SkillsSection({ skills = [] }) {
  const categories = skills.length > 0 ? buildCategoriesFromDB(skills) : placeholderCategories;

  return (
    <section id="skills" style={{ padding: 'clamp(48px, 7vw, 80px) 0', position: 'relative', zIndex: 2 }}>
      <div className="wrap">
        <div className="bar">
          <div className="bar-title">
            <h2>Skills &amp; Technologies</h2>
          </div>
          <span className="meta">{categories.reduce((n, g) => n + g.skills.length, 0)} listed</span>
        </div>

        {categories.map(({ title, skills }) => (
          <div className="skill-group" key={title}>
            <div className="skill-label">{title.toLowerCase()}</div>
            <div className="skill-row">
              {skills.map(skill => (
                <div className="skill-cell" key={skill.name}>
                  <SkillIcon name={skill.name} iconKey={skill.iconKey} color={skill.color} size={20} />
                  {skill.name}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}