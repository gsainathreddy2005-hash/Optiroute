import React, { useEffect, useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { promptService } from '../services/promptService';
import { MessageSquare, ThumbsUp, ThumbsDown, Star } from 'lucide-react';

export default function Feedback() {
  const [feedbackList, setFeedbackList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    promptService.getFeedback()
      .then(setFeedbackList)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <DashboardLayout title="User Feedback & Response Sentiment">
      <div className="space-y-6 max-w-6xl mx-auto">
        <div>
          <h1 className="text-xl font-bold text-white">Feedback Audit Trail</h1>
          <p className="text-xs text-slate-400 mt-1">Review user ratings and comments to monitor model quality satisfaction</p>
        </div>

        <div className="bg-navy-900/80 border border-navy-800 rounded-xl p-6">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-navy-800 text-slate-400 font-semibold uppercase">
                  <th className="py-3 px-3">Rating</th>
                  <th className="py-3 px-3">Request ID</th>
                  <th className="py-3 px-3">Model</th>
                  <th className="py-3 px-3">Complexity</th>
                  <th className="py-3 px-3">Quality Score</th>
                  <th className="py-3 px-3">User Comment</th>
                  <th className="py-3 px-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-800/60 text-slate-300 font-medium">
                {feedbackList.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="py-8 text-center text-slate-500">
                      No user feedback submitted yet.
                    </td>
                  </tr>
                ) : (
                  feedbackList.map((fb) => (
                    <tr key={fb.id} className="hover:bg-navy-850/50">
                      <td className="py-3 px-3 font-semibold">
                        {fb.rating === 1 ? (
                          <span className="flex items-center gap-1 text-emerald-400">
                            <ThumbsUp className="w-3.5 h-3.5" /> Good (+1)
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-rose-400">
                            <ThumbsDown className="w-3.5 h-3.5" /> Poor (-1)
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 font-mono text-slate-400">{fb.request_id}</td>
                      <td className="py-3 px-3 font-mono text-brand-cyan">{fb.model || 'N/A'}</td>
                      <td className="py-3 px-3">{fb.complexity || 'N/A'}</td>
                      <td className="py-3 px-3 font-bold">{fb.quality_score ? `${fb.quality_score}%` : 'N/A'}</td>
                      <td className="py-3 px-3 text-slate-200">{fb.comment || 'No comment provided'}</td>
                      <td className="py-3 px-3 text-slate-500">{new Date(fb.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
