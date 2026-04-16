import React from 'react';
import { MessageSquare, Star } from 'lucide-react';

export default function RecentFeedback() {
  return (
    <div className="bg-white rounded-[1.25rem] border border-slate-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] p-6 w-full h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-blue-50 rounded-lg">
            <MessageSquare className="w-5 h-5 text-blue-600" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">Recent Feedback</h3>
        </div>
        <button className="text-blue-500 text-sm font-semibold hover:text-blue-600 hover:underline underline-offset-4 transition-all">
          View all
        </button>
      </div>

      <div className="space-y-6 flex-1">
        {/* Feedback Item 1 */}
        <div className="space-y-3 group">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-4 h-4 fill-[#FACC15] text-[#FACC15]" />
                ))}
              </div>
              <span className="font-bold text-slate-800 text-[14px]">Highly recommended</span>
            </div>
            <span className="text-slate-400 text-xs font-medium">2 days ago</span>
          </div>
          <p className="text-slate-500 text-[14px] leading-relaxed group-hover:text-slate-700 transition-colors">
            "Dr. Jenkins was extremely helpful and clarified all my questions regarding the new tax regulations. Very professional and straight to the point."
          </p>
        </div>

        <hr className="border-slate-100" />

        {/* Feedback Item 2 */}
        <div className="space-y-3 group">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-4 h-4 fill-[#FACC15] text-[#FACC15]" />
                ))}
              </div>
              <span className="font-bold text-slate-800 text-[14px]">Highly recommended</span>
            </div>
            <span className="text-slate-400 text-xs font-medium">2 days ago</span>
          </div>
          <p className="text-slate-500 text-[14px] leading-relaxed group-hover:text-slate-700 transition-colors">
            "Dr. Jenkins was extremely helpful and clarified all my questions regarding the new tax regulations. Very professional and straight to the point."
          </p>
        </div>
      </div>
    </div>
  );
}