import { PrismaClient } from '@prisma/client';
import { prisma } from '../../lib/prisma';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      // Fetch sorted: Urgent first, then by publishDate descending
      const notices = await prisma.notice.findMany({
        orderBy: [
          { priority: 'desc' }, // 'Urgent' comes before 'Normal' alphabetically/enum order if defined correctly, or handled explicitly.
          // To guarantee strict DB enum ordering safely across flavors, sorting programmatically or using dual-field ordering works perfectly:
          { publishDate: 'desc' }
        ],
      });
      
      // Secondary fallback sorting in JS if the DB enum sorting behaves unexpectedly:
      const sortedNotices = notices.sort((a, b) => {
        if (a.priority === 'Urgent' && b.priority !== 'Urgent') return -1;
        if (a.priority !== 'Urgent' && b.priority === 'Urgent') return 1;
        return new Date(b.publishDate) - new Date(a.publishDate);
      });

      return res.status(200).json(sortedNotices);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch notices' });
    }
  }

  if (req.method === 'POST') {
    const { title, body, category, priority, publishDate, imageUrl } = req.body;

    // Server-side validation
    if (!title || !body || !category || !priority || !publishDate) {
      return res.status(400).json({ error: 'Missing required fields.' });
    }

    try {
      const newNotice = await prisma.notice.create({
        data: {
          title,
          body,
          category,
          priority,
          publishDate: new Date(publishDate),
          imageUrl: imageUrl || null,
        },
      });
      return res.status(201).json(newNotice);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to create notice' });
    }
  }

  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}