import React, { useState } from 'react';
import { X, AlertCircle, CheckCircle2, Send, MessageSquare } from 'lucide-react';
import { submitFeedback } from '../services/api';

export default function ReportIssueModal({
  isOpen,
  onClose,
  stationId = 'dadar',
  stationName = 'Dadar Central',
  targetItem = null // optional { id, name, category, floor_level }
}) {
  const [feedbackCategory, setFeedbackCategory] = useState('facility_information');
  const [details, setDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const categories = [
    { id: 'facility_information', label: 'Facility information' },
    { id: 'platform_information', label: 'Platform information' },
    { id: 'entrance_or_exit', label: 'Entrance or exit' },
    { id: 'accessibility_information', label: 'Accessibility information' },
    { id: 'facility_availability', label: 'Facility availability' },
    { id: 'other', label: 'Other' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!details.trim()) {
      setErrorMsg('Please add a few details to help us understand.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    const payload = {
      station_id: stationId,
      item_id: targetItem?.id || targetItem?.facility_id || null,
      issue_type: feedbackCategory,
      description: targetItem?.name
        ? `[${targetItem.name}] ${details.trim()}`
        : details.trim(),
      timestamp: new Date().toISOString()
    };

    const res = await submitFeedback(payload);
    setIsSubmitting(false);

    if (res.success) {
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setDetails('');
        onClose();
      }, 2000);
    } else {
      setErrorMsg('Could not submit feedback right now. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl shadow-xl border border-slate-200 max-w-lg w-full overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Provide Feedback</h3>
              <p className="text-xs text-slate-500">
                Help keep {stationName} navigation accurate for commuters
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        {submitted ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-slate-900">Thank you for your feedback</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
              Your feedback has been queued for verification. Submissions help ensure reliable station wayfinding for everyone.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {targetItem && (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700">
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Feedback for:</span>
                <span className="font-semibold text-slate-900">{targetItem.name}</span>
                {targetItem.floor_level && <span className="text-slate-500"> ({targetItem.floor_level})</span>}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Select what needs attention
              </label>
              <select
                value={feedbackCategory}
                onChange={(e) => setFeedbackCategory(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
              >
                {categories.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Add details
              </label>
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                rows={3}
                placeholder="Describe any changes or corrections (e.g. elevator under maintenance, entrance relocated, etc.)..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
              />
            </div>

            {errorMsg && (
              <p className="text-xs text-rose-600 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errorMsg}</span>
              </p>
            )}

            <p className="text-[11px] text-slate-400 leading-relaxed">
              * Submissions are reviewed against station surveys before station information is updated.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-xl hover:bg-slate-100 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-semibold rounded-xl shadow-xs transition"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'Submitting...' : 'Submit Feedback'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
