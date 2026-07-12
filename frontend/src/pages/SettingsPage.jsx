import React, { useState, useEffect } from 'react';

export default function SettingsPage() {
  const storedUser = localStorage.getItem('user');
  let user = null;
  if (storedUser) {
    try {
      user = JSON.parse(storedUser);
    } catch (e) {
      console.error("Failed to parse user", e);
    }
  }

  const [depotName, setDepotName] = useState(user?.depotName || 'Gandhinagar Depot Gv24');
  const [saveStatus, setSaveStatus] = useState('idle'); // 'idle', 'saving', 'saved'

  const handleSave = async () => {
    setSaveStatus('saving');
    try {
      const res = await fetch('http://localhost:5000/api/auth/depot', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'true', // actually the backend accepts cookies
        body: JSON.stringify({ depotName })
      });
      const data = await res.json();
      
      if (data.success) {
        // Update local storage user object
        const updatedUser = { ...user, depotName: data.user.depotName };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus('idle'), 2000);
      } else {
        setSaveStatus('idle');
        alert(data.message || 'Failed to update depot name');
      }
    } catch (err) {
      setSaveStatus('idle');
      alert('Network error or not authenticated.');
    }
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-headline-lg text-headline-lg font-bold text-on-surface tracking-tight">General Settings</h2>
          <p className="text-text-secondary font-body-md mt-1">Manage core platform preferences and role-based access.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={saveStatus !== 'idle'}
          className={`font-body-md font-medium px-5 py-2 rounded-lg transition-all self-start sm:self-auto flex items-center gap-2 shadow-[0_2px_8px_rgba(232,149,46,0.2)] ${
            saveStatus === 'saved' 
              ? 'bg-status-success text-white hover:bg-status-success' 
              : 'bg-primary text-on-primary-fixed hover:bg-primary-container active:scale-95'
          } disabled:opacity-80`}
        >
          <span className="material-symbols-outlined text-[18px]">
            {saveStatus === 'saved' ? 'check' : 'save'}
          </span>
          {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'saved' ? 'Saved!' : 'Save Changes'}
        </button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* General Preferences Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-bg-surface rounded-[10px] border border-border-subtle p-5 shadow-sm">
            <h3 className="font-headline-md text-headline-md font-semibold text-on-surface mb-5 flex items-center gap-2">
              <span className="material-symbols-outlined text-text-secondary">tune</span>
              Depot Configuration
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block font-label-caps text-label-caps text-text-secondary mb-1.5 uppercase">Depot Name</label>
                <input 
                  value={depotName}
                  onChange={(e) => setDepotName(e.target.value)}
                  className="w-full bg-surface-bright border border-border-subtle rounded-lg py-2 px-3 text-sm text-text-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors text-on-surface" 
                  type="text" 
                />
              </div>
              <div>
                <label className="block font-label-caps text-label-caps text-text-secondary mb-1.5 uppercase">Currency Base</label>
                <div className="w-full bg-surface-bright border border-border-subtle rounded-lg py-2 px-3 text-sm text-text-secondary opacity-70 cursor-not-allowed">
                  INR (₹)
                </div>
              </div>
              <div>
                <label className="block font-label-caps text-label-caps text-text-secondary mb-1.5 uppercase">Distance Unit</label>
                <div className="w-full bg-surface-bright border border-border-subtle rounded-lg py-2 px-3 text-sm text-text-secondary opacity-70 cursor-not-allowed">
                  Kilometers (km)
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* RBAC Table Card */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-bg-surface rounded-[10px] border border-border-subtle p-5 shadow-sm overflow-hidden flex flex-col h-full">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-headline-md text-headline-md font-semibold text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-text-secondary">shield_person</span>
                Role-Based Access Control (RBAC)
              </h3>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border-subtle">
                    <th className="py-3 px-4 font-label-caps text-label-caps text-text-secondary uppercase tracking-wide font-semibold w-40">Role</th>
                    <th className="py-3 px-2 font-label-caps text-label-caps text-text-secondary uppercase tracking-wide font-semibold text-center">Dashboard</th>
                    <th className="py-3 px-2 font-label-caps text-label-caps text-text-secondary uppercase tracking-wide font-semibold text-center">Fleet</th>
                    <th className="py-3 px-2 font-label-caps text-label-caps text-text-secondary uppercase tracking-wide font-semibold text-center">Drivers</th>
                    <th className="py-3 px-2 font-label-caps text-label-caps text-text-secondary uppercase tracking-wide font-semibold text-center">Trips</th>
                    <th className="py-3 px-2 font-label-caps text-label-caps text-text-secondary uppercase tracking-wide font-semibold text-center">Fuel/Exp</th>
                    <th className="py-3 px-2 font-label-caps text-label-caps text-text-secondary uppercase tracking-wide font-semibold text-center">Analytics</th>
                  </tr>
                </thead>
                <tbody className="font-body-md text-body-md">
                  {/* Fleet Manager */}
                  <tr className="border-b border-border-subtle hover:bg-surface-container-highest transition-colors group">
                    <td className="py-3 px-4 font-medium text-on-surface border-r border-border-subtle/50">Fleet Manager</td>
                    <td className="py-3 px-2 text-center"><span className="material-symbols-outlined text-status-success text-lg">check_circle</span></td>
                    <td className="py-3 px-2 text-center"><span className="material-symbols-outlined text-status-success text-lg">check_circle</span></td>
                    <td className="py-3 px-2 text-center"><span className="material-symbols-outlined text-status-success text-lg">check_circle</span></td>
                    <td className="py-3 px-2 text-center"><span className="material-symbols-outlined text-status-success text-lg">check_circle</span></td>
                    <td className="py-3 px-2 text-center"><span className="material-symbols-outlined text-status-success text-lg">check_circle</span></td>
                    <td className="py-3 px-2 text-center"><span className="material-symbols-outlined text-status-success text-lg">check_circle</span></td>
                  </tr>
                  
                  {/* Dispatcher */}
                  <tr className="border-b border-border-subtle hover:bg-surface-container-highest transition-colors group bg-primary/5">
                    <td className="py-3 px-4 font-medium text-primary border-r border-border-subtle/50 flex items-center gap-2">
                      Dispatcher
                      <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                    </td>
                    <td className="py-3 px-2 text-center"><span className="material-symbols-outlined text-status-success text-lg">check_circle</span></td>
                    <td className="py-3 px-2 text-center"><span className="material-symbols-outlined text-status-success text-lg">check_circle</span></td>
                    <td className="py-3 px-2 text-center"><span className="material-symbols-outlined text-status-success text-lg">check_circle</span></td>
                    <td className="py-3 px-2 text-center"><span className="material-symbols-outlined text-status-success text-lg">check_circle</span></td>
                    <td className="py-3 px-2 text-center"><span className="material-symbols-outlined text-text-secondary/30 text-lg">remove</span></td>
                    <td className="py-3 px-2 text-center"><span className="material-symbols-outlined text-text-secondary/30 text-lg">remove</span></td>
                  </tr>
                  
                  {/* Safety Officer */}
                  <tr className="border-b border-border-subtle hover:bg-surface-container-highest transition-colors group">
                    <td className="py-3 px-4 font-medium text-on-surface border-r border-border-subtle/50">Safety Officer</td>
                    <td className="py-3 px-2 text-center"><span className="material-symbols-outlined text-status-success text-lg">check_circle</span></td>
                    <td className="py-3 px-2 text-center"><span className="material-symbols-outlined text-status-success text-lg">check_circle</span></td>
                    <td className="py-3 px-2 text-center"><span className="material-symbols-outlined text-status-success text-lg">check_circle</span></td>
                    <td className="py-3 px-2 text-center"><span className="material-symbols-outlined text-status-success text-lg">check_circle</span></td>
                    <td className="py-3 px-2 text-center"><span className="material-symbols-outlined text-text-secondary/30 text-lg">remove</span></td>
                    <td className="py-3 px-2 text-center"><span className="material-symbols-outlined text-status-success text-lg">check_circle</span></td>
                  </tr>
                  
                  {/* Financial Analyst */}
                  <tr className="hover:bg-surface-container-highest transition-colors group">
                    <td className="py-3 px-4 font-medium text-on-surface border-r border-border-subtle/50">Financial Analyst</td>
                    <td className="py-3 px-2 text-center"><span className="material-symbols-outlined text-status-success text-lg">check_circle</span></td>
                    <td className="py-3 px-2 text-center"><span className="material-symbols-outlined text-text-secondary/30 text-lg">remove</span></td>
                    <td className="py-3 px-2 text-center"><span className="material-symbols-outlined text-text-secondary/30 text-lg">remove</span></td>
                    <td className="py-3 px-2 text-center"><span className="material-symbols-outlined text-text-secondary/30 text-lg">remove</span></td>
                    <td className="py-3 px-2 text-center"><span className="material-symbols-outlined text-status-success text-lg">check_circle</span></td>
                    <td className="py-3 px-2 text-center"><span className="material-symbols-outlined text-status-success text-lg">check_circle</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div className="mt-4 text-xs text-text-secondary text-right italic">
              * Matrix reflects standard operational PRD.
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
