
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      
      const notices = await prisma.notice.findMany({
        orderBy: [
          { priority: 'desc' }, 
          
          { publishDate: 'desc' }
        ],
      });
      

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