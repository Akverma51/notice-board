import { PrismaClient } from '@prisma/client';
import Link from 'next/link';


export async function getServerSideProps() {
  const prisma = new PrismaClient();
  const notices = await prisma.notice.findMany({
    orderBy: [
      { priority: 'desc' },
      { publishDate: 'desc' },
    ],
  });

  return {
    props: {
      initialNotices: JSON.parse(JSON.stringify(notices)),
    },
  };
}

export default function NoticesHome({ initialNotices }) {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8 border-b pb-4">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Campus Notice Board</h1>
        <Link href="/add-notice" className="bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 transition">
          + Add Notice
        </Link>
      </div>

      {initialNotices.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No notices available right now.
        </div>
      ) : (
        // Responsive CSS Grid: 1 col on mobile, 2 on tablet, 3 on desktop
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {initialNotices.map((notice) => (
            <div 
              key={notice.id} 
              className={`relative flex flex-col justify-between bg-white rounded-xl shadow-sm border transition hover:shadow-md overflow-hidden ${
                notice.priority === 'Urgent' ? 'border-red-500 ring-1 ring-red-200' : 'border-gray-200'
              }`}
            >
              <div>
                {notice.imageUrl && (
                  <img 
                    src={notice.imageUrl} 
                    alt={notice.title} 
                    className="w-full h-48 object-cover"
                    onError={(e) => { e.target.style.display = 'none'; }} // Fallback if image link breaks
                  />
                )}
                
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-3 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-800">
                      {notice.category}
                    </span>
                    
                    {notice.priority === 'Urgent' && (
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-700 animate-pulse">
                        ⚠️ Urgent
                      </span>
                    )}
                  </div>

                  <h2 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">{notice.title}</h2>
                  <p className="text-gray-600 text-sm whitespace-pre-wrap line-clamp-4">{notice.body}</p>
                </div>
              </div>

              <div className="p-5 pt-0 bg-gray-50 border-t border-gray-100 mt-4 flex justify-between items-center text-xs text-gray-500">
                <span>Published: {new Date(notice.publishDate).toLocaleDateString('en-US', { dateStyle: 'medium' })}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}