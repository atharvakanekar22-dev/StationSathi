import React from 'react';

const STATUS_CONFIGS = {
  prototype_data: {
    label: 'Prototype Data',
    bg: 'bg-slate-100 text-slate-700 border-slate-300',
    dot: 'bg-slate-500'
  },
  needs_verification: {
    label: 'Needs Verification',
    bg: 'bg-amber-50 text-amber-800 border-amber-300',
    dot: 'bg-amber-500'
  },
  publicly_sourced: {
    label: 'Publicly Sourced',
    bg: 'bg-sky-50 text-sky-800 border-sky-300',
    dot: 'bg-sky-500'
  },
  manually_collected: {
    label: 'Manually Collected',
    bg: 'bg-teal-50 text-teal-800 border-teal-300',
    dot: 'bg-teal-500'
  },
  user_reported: {
    label: 'User Reported',
    bg: 'bg-purple-50 text-purple-800 border-purple-300',
    dot: 'bg-purple-500'
  },
  temporarily_unavailable: {
    label: 'Temporarily Unavailable',
    bg: 'bg-rose-50 text-rose-800 border-rose-300',
    dot: 'bg-rose-500'
  }
};

export default function VerificationBadge({ status = 'prototype_data', className = '', showDot = true }) {
  const config = STATUS_CONFIGS[status] || STATUS_CONFIGS.prototype_data;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-medium border ${config.bg} ${className}`}
      title={`Data status: ${config.label}`}
    >
      {showDot && <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />}
      {config.label}
    </span>
  );
}
