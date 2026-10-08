import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

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

// GET: Return all data for admin dashboard summary
export async function GET() {
  try {
    const session = await auth();
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const [skills, projects, experiences, messages, topicPages] = await Promise.all([
      prisma.skill.findMany({ orderBy: { order: 'asc' } }),
      prisma.project.findMany({ orderBy: [{ order: 'asc' }, { createdAt: 'desc' }] }),
      prisma.experience.findMany({ orderBy: [{ order: 'asc' }, { createdAt: 'desc' }] }),
      prisma.contactMessage.findMany({ orderBy: { createdAt: 'desc' } }),
      prisma.topicPage.findMany({ orderBy: { title: 'asc' } }),
    ]);
    return NextResponse.json({ skills, projects, experiences, messages, topicPages });
  } catch (err) {
    console.error('Error in GET /api/admin/crud:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
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
          imageUrl: imageUrl || null,
          demoUrl: demoUrl || null,
          githubUrl: githubUrl || null,
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
    console.error('Error in POST /api/admin/crud:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
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
          ...(imageUrl !== undefined && { imageUrl: imageUrl || null }),
          ...(demoUrl !== undefined && { demoUrl: demoUrl || null }),
          ...(githubUrl !== undefined && { githubUrl: githubUrl || null }),
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
    console.error('Error in PUT /api/admin/crud:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
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
    console.error('Error in DELETE /api/admin/crud:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
