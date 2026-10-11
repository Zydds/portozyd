// Shared nav/route metadata for the public portfolio pages.
// `web` is the Project.category value; its TopicPage slug is `webdev`.

export const portfolioLinks = [
  { label: 'All Projects', href: '/portfolio' },
  { label: 'Web Development', href: '/portfolio/web' },
  { label: 'QA Testing', href: '/portfolio/qa' },
  { label: 'Project Management', href: '/portfolio/pm' },
];

export const hobbiesLinks = [
  { label: 'Gaming', href: '/gaming' },
  { label: 'Others', href: '/others' },
];

// Route segment -> display + TopicPage lookup. mobile has no TopicPage row
// (not linked in nav) so its category page renders cards only.
export const CATEGORY_META = {
  web: { label: 'Web Development', topicSlug: 'webdev', icon: '💻' },
  qa: { label: 'Quality Assurance', topicSlug: 'qa', icon: '🛡️' },
  pm: { label: 'Project Management', topicSlug: 'pm', icon: '📊' },
  mobile: { label: 'Mobile', topicSlug: null, icon: '📱' },
};

export const VALID_CATEGORIES = Object.keys(CATEGORY_META);
