import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { safeUrl } from '@/lib/safe-url';
import { apiErrorResponse } from '@/lib/api-error';

function pick(obj, keys) {
  if (!obj || typeof obj !== 'object') return {};
  const result = {};
  for (const key of keys) {
    if (key in obj && obj[key] !== undefined) {
      result[key] = obj[key];
    }
  }
  return result;
}

// GET: List admin entities. ?entity=skill|project|experience|contactMessage|topicPage
// returns only that table; no param returns all five (dashboard/back-compat).
const LIST_SELECT = {
  skill: { id: true, name: true, category: true, iconKey: true, color: true, order: true },
  // content stays: the admin edit form loads it from the list row.
  project: { id: true, title: true, slug: true, description: true, content: true, imageUrl: true, demoUrl: true, githubUrl: true, category: true, featured: true, order: true },
  experience: { id: true, title: true, company: true, location: true, startDate: true, endDate: true, isCurrent: true, description: true, tags: true, order: true },
  // message bodies live in /api/admin/inbox, not here.
  contactMessage: { id: true, name: true, email: true, subject: true, read: true, createdAt: true },
  topicPage: { id: true, slug: true, title: true, icon: true, intro: true, focusItems: true, toolsItems: true, highlights: true },
};

const RESPONSE_KEY = {
  skill: 'skills',
  project: 'projects',
  experience: 'experiences',
  contactMessage: 'messages',
  topicPage: 'topicPages',
};

function listQuery(entity) {
  const select = LIST_SELECT[entity];
  switch (entity) {
    case 'skill': return prisma.skill.findMany({ orderBy: { order: 'asc' }, select });
    case 'project': return prisma.project.findMany({ orderBy: [{ order: 'asc' }, { createdAt: 'desc' }], select });
    case 'experience': return prisma.experience.findMany({ orderBy: [{ order: 'asc' }, { createdAt: 'desc' }], select });
    case 'contactMessage': return prisma.contactMessage.findMany({ orderBy: { createdAt: 'desc' }, select });
    case 'topicPage': return prisma.topicPage.findMany({ orderBy: { title: 'asc' }, select });
    default: return null;
  }
}

export async function GET(request) {
  try {
    const session = await auth();
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const entity = new URL(request.url).searchParams.get('entity');
    if (entity) {
      const query = listQuery(entity);
      if (!query) return NextResponse.json({ error: 'Unknown entity' }, { status: 400 });
      return NextResponse.json({ [RESPONSE_KEY[entity]]: await query });
    }
    const [skills, projects, experiences, messages, topicPages] = await Promise.all([
      listQuery('skill'),
      listQuery('project'),
      listQuery('experience'),
      listQuery('contactMessage'),
      listQuery('topicPage'),
    ]);
    return NextResponse.json({ skills, projects, experiences, messages, topicPages });
  } catch (err) {
    return apiErrorResponse('Error in GET /api/admin/crud:', err);
  }
}

// POST: Create any entity
export async function POST(request) {
  try {
    const session = await auth();
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const body = await request.json();

    if (body.entity === 'skill' || (body.name && body.category && !body.title)) {
      const { name, category, iconKey, color, order } = body;
      const skill = await prisma.skill.create({
        data: {
          name,
          category,
          iconKey: iconKey || null,
          color: color || null,
          order: typeof order === 'number' ? order : 0,
        },
      });
      return NextResponse.json(skill);
    }
    if (body.entity === 'project' || (body.title && (body.slug || body.description) && !body.company)) {
      const { title, slug, description, content, imageUrl, demoUrl, githubUrl, category, featured, order } = body;
      const genSlug = (slug || title).toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
      const project = await prisma.project.create({
        data: {
          title,
          slug: genSlug,
          description: description || '',
          content: content || null,
          imageUrl: safeUrl(imageUrl),
          demoUrl: safeUrl(demoUrl),
          githubUrl: safeUrl(githubUrl),
          category: category || 'web',
          featured: Boolean(featured),
          order: typeof order === 'number' ? order : 0,
        },
      });
      return NextResponse.json(project);
    }
    if (body.entity === 'experience' || (body.title && body.company && !body.name)) {
      const { title, company, location, startDate, endDate, isCurrent, description, tags, order } = body;
      const entry = await prisma.experience.create({
        data: {
          title,
          company,
          location: location || null,
          startDate,
          endDate: endDate || null,
          isCurrent: Boolean(isCurrent),
          description: description || '',
          tags: Array.isArray(tags) ? tags : [],
          order: typeof order === 'number' ? order : 0,
        },
      });
      return NextResponse.json(entry);
    }
    if (body.entity === 'contactMessage' && body.id) {
      const allowedData = pick(body.data, ['read']);
      const msg = await prisma.contactMessage.update({
        where: { id: body.id },
        data: allowedData,
      });
      return NextResponse.json(msg);
    }
    return NextResponse.json({ error: 'Invalid entity payload' }, { status: 400 });
  } catch (err) {
    return apiErrorResponse('Error in POST /api/admin/crud:', err);
  }
}

// PUT: Update any entity
export async function PUT(request) {
  try {
    const session = await auth();
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const body = await request.json();
    const { entity, id, ...data } = body;

    if (entity === 'skill') {
      const allowedData = pick(data, ['name', 'category', 'iconKey', 'color', 'order']);
      const skill = await prisma.skill.update({ where: { id }, data: allowedData });
      return NextResponse.json(skill);
    }
    if (entity === 'project') {
      const { title, slug, description, content, imageUrl, demoUrl, githubUrl, category, featured, order } = data;
      const project = await prisma.project.update({
        where: { id },
        data: {
          ...(title !== undefined && { title }),
          ...(slug !== undefined && { slug: slug.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') }),
          ...(description !== undefined && { description }),
          ...(content !== undefined && { content: content || null }),
          ...(imageUrl !== undefined && { imageUrl: safeUrl(imageUrl) }),
          ...(demoUrl !== undefined && { demoUrl: safeUrl(demoUrl) }),
          ...(githubUrl !== undefined && { githubUrl: safeUrl(githubUrl) }),
          ...(category !== undefined && { category }),
          ...(featured !== undefined && { featured: Boolean(featured) }),
          ...(order !== undefined && { order: Number(order) }),
        },
      });
      return NextResponse.json(project);
    }
    if (entity === 'experience') {
      const allowedData = pick(data, [
        'title',
        'company',
        'location',
        'startDate',
        'endDate',
        'isCurrent',
        'description',
        'tags',
        'order',
      ]);
      const entry = await prisma.experience.update({ where: { id }, data: allowedData });
      return NextResponse.json(entry);
    }
    if (entity === 'contactMessage') {
      const allowedData = pick(data, ['read']);
      const msg = await prisma.contactMessage.update({ where: { id }, data: allowedData });
      return NextResponse.json(msg);
    }
    return NextResponse.json({ error: 'Invalid entity type' }, { status: 400 });
  } catch (err) {
    return apiErrorResponse('Error in PUT /api/admin/crud:', err);
  }
}

// DELETE: Delete any entity
export async function DELETE(request) {
  try {
    const session = await auth();
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { entity, id } = await request.json();

    if (entity === 'skill') {
      await prisma.skill.delete({ where: { id } });
    } else if (entity === 'project') {
      await prisma.project.delete({ where: { id } });
    } else if (entity === 'experience') {
      await prisma.experience.delete({ where: { id } });
    } else if (entity === 'contactMessage') {
      await prisma.contactMessage.delete({ where: { id } });
    } else {
      return NextResponse.json({ error: 'Invalid entity type' }, { status: 400 });
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    return apiErrorResponse('Error in DELETE /api/admin/crud:', err);
  }
}
