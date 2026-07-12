import React from 'react';

const STATUS_CONFIG = {
  // Green
  Available: { bg: 'bg-status-success/15', text: 'text-status-success', dot: 'bg-status-success' },
  Completed: { bg: 'bg-status-success/15', text: 'text-status-success', dot: 'bg-status-success' },
  Active: { bg: 'bg-status-success/15', text: 'text-status-success', dot: 'bg-status-success' },
  
  // Blue
  'On Trip': { bg: 'bg-status-info/15', text: 'text-status-info', dot: 'bg-status-info' },
  Dispatched: { bg: 'bg-status-info/15', text: 'text-status-info', dot: 'bg-status-info' },
  
  // Orange/Amber (mapped to primary)
  'In Shop': { bg: 'bg-primary/15', text: 'text-primary', dot: 'bg-primary' },
  Pending: { bg: 'bg-primary/15', text: 'text-primary', dot: 'bg-primary' },
  Draft: { bg: 'bg-primary/15', text: 'text-primary', dot: 'bg-primary' },
  
  // Red
  Retired: { bg: 'bg-status-danger/15', text: 'text-status-danger', dot: 'bg-status-danger' },
  Suspended: { bg: 'bg-status-danger/15', text: 'text-status-danger', dot: 'bg-status-danger' },
  Cancelled: { bg: 'bg-status-danger/15', text: 'text-status-danger', dot: 'bg-status-danger' },

  // Gray/Neutral
  'Off Duty': { bg: 'bg-secondary-container', text: 'text-on-surface-variant', dot: 'bg-on-surface-variant' }
};

export default function StatusBadge({ status }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG['Off Duty']; // Fallback
  
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded ${config.bg} ${config.text} text-[12px] font-bold tracking-wide uppercase`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`}></span>
      {status}
    </span>
  );
}
