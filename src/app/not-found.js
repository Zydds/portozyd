import { redirect } from 'next/navigation';

// Every unknown URL lands here — notFound() from bad slugs/categories/topics
// and fully unmatched paths alike. Wrong addresses get lured to the honeypot
// instead of Next's default 404 (see src/lib/restricted-content.js).
export default function NotFound() {
  redirect('/flag/restricted.html');
}
