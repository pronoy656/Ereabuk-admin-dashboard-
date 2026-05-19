"use client";

import React, { useState, useEffect } from 'react';
import { MessageSquare, Star, User } from 'lucide-react';
import api from '@/lib/axios';
import { formatDistanceToNow } from 'date-fns';

export default function RecentFeedback() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await api.get('/review/recent');
        const data = response.data?.data || response.data;
        if (Array.isArray(data)) {
          setReviews(data);
        }
      } catch (err) {
        console.error("Failed to fetch recent reviews:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  return (
    <div className="bg-white rounded-[1.25rem] border border-slate-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] p-6 w-full h-full flex flex-col">
      <div className="flex items-center justify-between mb-6 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-blue-50 rounded-lg">
            <MessageSquare className="w-5 h-5 text-blue-600" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">Recent Feedback</h3>
        </div>
        {reviews.length > 0 && (
          <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
            {reviews.length} {reviews.length === 1 ? 'Review' : 'Reviews'}
          </span>
        )}
      </div>

      <div className="space-y-6 flex-1 overflow-y-auto custom-scrollbar pr-1 max-h-[400px]">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-slate-500 font-medium">Loading recent feedback...</p>
          </div>
        ) : reviews.length === 0 ? (
          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-8 text-center flex flex-col items-center justify-center gap-3 h-full">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-slate-800 text-base">No Feedback Yet</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto leading-relaxed">
                When clients complete consultations and leave reviews, their feedback will appear here.
              </p>
            </div>
          </div>
        ) : (
          reviews.map((review: any, index: number) => {
            const userName = review.user?.name || "Client User";
            const userImage = review.user?.image || review.user?.avatar || null;
            const initial = userName.charAt(0).toUpperCase();
            const rating = review.rating || 5;

            let timeAgo = "Just now";
            if (review.createdAt) {
              try {
                timeAgo = formatDistanceToNow(new Date(review.createdAt), { addSuffix: true });
              } catch (e) {}
            }

            return (
              <React.Fragment key={review._id || review.id || index}>
                {index > 0 && <hr className="border-slate-100 my-4" />}
                <div className="space-y-3 group bg-[#FAFAFA] hover:bg-slate-50 border border-slate-100/80 rounded-2xl p-4 transition-all shadow-sm">
                  <div className="flex items-center justify-between gap-4 flex-wrap">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm shrink-0 border border-white shadow-sm overflow-hidden">
                        {userImage ? (
                          <img src={userImage} alt={userName} className="w-full h-full object-cover" />
                        ) : (
                          initial
                        )}
                      </div>
                      <div>
                        <span className="font-bold text-slate-800 text-[15px] block">{userName}</span>
                        <div className="flex items-center gap-1 mt-0.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star 
                              key={star} 
                              className={`w-3.5 h-3.5 ${star <= rating ? "fill-[#FACC15] text-[#FACC15]" : "text-slate-200"}`} 
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <span className="text-slate-400 text-xs font-medium self-start mt-1">{timeAgo}</span>
                  </div>
                  <p className="text-slate-600 text-[14px] leading-relaxed group-hover:text-slate-800 transition-colors pt-1 italic">
                    "{review.comment || "No comment provided."}"
                  </p>
                </div>
              </React.Fragment>
            );
          })
        )}
      </div>
    </div>
  );
}