import React from 'react';

export default function StatusBadge({ status }) {
  // Normalize status string for case-insensitive matching
  const normalizedStatus = status?.toLowerCase() || '';

  // Determine colors based on status per PRD
  let colors = '';
  
  if (['available', 'completed', 'active'].includes(normalizedStatus)) {
    colors = 'bg-status-success/15 text-status-success border-status-success/20';
  } else if (['on trip', 'dispatched'].includes(normalizedStatus)) {
    colors = 'bg-status-info/15 text-status-info border-status-info/20';
  } else if (['in shop', 'pending', 'draft'].includes(normalizedStatus)) {
    colors = 'bg-status-warning/15 text-status-warning border-status-warning/20';
  } else if (['retired', 'suspended', 'cancelled'].includes(normalizedStatus)) {
    colors = 'bg-status-danger/15 text-status-danger border-status-danger/20';
  } else {
    // Default fallback
    colors = 'bg-surface-container-high text-text-secondary border-border-subtle';
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${colors}`}>
      {status}
    </span>
  );
}
