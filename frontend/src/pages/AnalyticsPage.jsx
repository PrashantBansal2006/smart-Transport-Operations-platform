import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function AnalyticsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:5000/api/reports/analytics', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const json = await res.json();
        
        if (res.ok) {
          setData(json);
        } else {
          setError(json.message || 'Failed to fetch analytics');
        }
      } catch (err) {
        setError('Network error connecting to backend.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchAnalytics();
  }, []);

  if (loading) {
    return <div className="p-8 text-on-surface font-body-md animate-pulse">Loading analytics data...</div>;
  }

  if (error) {
    return <div className="p-8 text-status-danger font-body-md bg-status-danger/10 border border-status-danger rounded-lg">{error}</div>;
  }

  // 1. Map backend data to KPI Top Row
  const kpiData = [
    { label: 'AVG FUEL EFFICIENCY', value: data.fuelEfficiency.toFixed(1), unit: 'km/l', subtext: 'Lifetime fleet avg', trend: 'up', icon: 'local_gas_station', color: 'tertiary-container' },
    { label: 'FLEET UTILIZATION', value: data.fleetUtilization.toFixed(1), unit: '%', subtext: '', progress: data.fleetUtilization, icon: 'pie_chart', color: 'status-info' },
    { label: 'OPERATIONAL COST', value: (data.operationalCost / 1000).toFixed(1), unit: 'k', prefix: '₹', subtext: 'Total expenses', trend: 'down', icon: 'account_balance_wallet', color: 'status-danger' },
    { label: 'AVG VEHICLE ROI', value: (data.vehicleROI / 1000).toFixed(1), unit: 'k', prefix: '₹', subtext: 'Net profit', trend: 'up', icon: 'trending_up', color: 'primary' }
  ];

  // 2. Map monthly revenue to Chart
  // The backend currently only provides revenue, so we mock a realistic proportional cost for the visualization
  const chartData = (data.monthlyRevenue || []).map(item => {
    // Format YYYY-MM to Month string
    const dateObj = new Date(item.month + '-01');
    const monthStr = dateObj.toLocaleString('default', { month: 'short' });
    return {
      month: monthStr,
      revenue: item.revenue / 1000, 
      cost: (item.revenue * 0.4) / 1000 // 40% margin cost
    };
  });

  // If no chart data exists, provide a flatline fallback so the chart doesn't break
  if (chartData.length === 0) {
    chartData.push({ month: 'No Data', revenue: 0, cost: 0 });
  }

  // 3. Map Costliest Assets
  const costliestAssets = (data.topCostliestVehicles || []).map(asset => ({
    id: asset.registrationNumber,
    type: 'Vehicle',
    cost: `₹${asset.totalCost.toLocaleString()}`,
    status: asset.totalCost > 50000 ? 'danger' : 'normal',
    icon: 'local_shipping'
  }));

  const handleExport = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/reports/export.csv', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!res.ok) throw new Error('Export failed');
      
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'fleet_report.csv';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('Error downloading CSV:', err);
      alert('Failed to download CSV report.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-headline-lg text-headline-lg font-bold text-on-surface tracking-tight">Reports & Analytics</h2>
          <p className="text-body-md text-text-secondary mt-1">Live fleet performance and operational metrics.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-5 py-2 bg-primary-container text-on-primary-container font-medium rounded-lg hover:brightness-110 transition-colors text-body-md" onClick={handleExport}>
            <span className="material-symbols-outlined text-[18px]">download</span>
            Export CSV
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiData.map((kpi, idx) => (
          <div key={idx} className="bg-surface-container border border-border-subtle rounded-xl p-5 flex flex-col justify-between h-[140px]">
            <div className="flex justify-between items-start">
              <span className="text-label-caps font-label-caps text-text-secondary uppercase">{kpi.label}</span>
              <div className="w-8 h-8 rounded bg-bg-surface flex items-center justify-center border border-border-subtle">
                <span className="material-symbols-outlined text-[18px] text-text-secondary">{kpi.icon}</span>
              </div>
            </div>
            <div>
              <div className="flex items-baseline gap-1 mt-2">
                {kpi.prefix && <span className="text-headline-md text-text-secondary font-medium">{kpi.prefix}</span>}
                <span className="text-[32px] leading-tight font-bold text-on-surface tracking-tight">{kpi.value}</span>
                <span className="text-body-md text-text-secondary ml-1">{kpi.unit}</span>
              </div>
              
              {kpi.progress !== undefined ? (
                <div className="w-full h-1.5 bg-bg-surface rounded-full mt-3 overflow-hidden">
                  <div className="h-full bg-status-info rounded-full transition-all duration-1000" style={{ width: `${kpi.progress}%` }}></div>
                </div>
              ) : (
                <div className={`flex items-center gap-1 mt-1 text-body-md ${kpi.trend === 'up' && kpi.color !== 'status-danger' ? 'text-status-success' : 'text-status-danger'}`}>
                  {kpi.trend && <span className="material-symbols-outlined text-[16px]">{kpi.trend === 'up' ? 'trending_up' : 'trending_down'}</span>}
                  <span>{kpi.subtext}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-surface-container border border-border-subtle rounded-xl p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="font-headline-md text-on-surface">Revenue vs Cost</h3>
              <p className="text-body-md text-text-secondary">Historical fleet performance</p>
            </div>
            <div className="flex items-center gap-4 text-label-caps font-label-caps text-text-secondary">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm bg-[#e8952e]"></div>
                REVENUE
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm bg-[#363940]"></div>
                COST
              </div>
            </div>
          </div>
          
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }} barGap={0}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#2A303C" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#8A93A3', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#8A93A3', fontSize: 12 }} tickFormatter={(value) => `₹${value}k`} />
                <Tooltip cursor={{ fill: '#2A303C', opacity: 0.4 }} contentStyle={{ backgroundColor: '#1d2026', borderColor: '#2A303C', color: '#e1e2eb' }} formatter={(value) => [`₹${value.toFixed(1)}k`]} />
                <Bar dataKey="cost" fill="#363940" radius={[2, 2, 0, 0]} barSize={32} />
                <Bar dataKey="revenue" fill="#e8952e" radius={[2, 2, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Costliest Assets */}
        <div className="bg-surface-container border border-border-subtle rounded-xl p-6">
          <h3 className="font-headline-md text-on-surface">Top Costliest Assets</h3>
          <p className="text-body-md text-text-secondary mb-6">By maintenance & fuel</p>
          
          <div className="space-y-5">
            {costliestAssets.length === 0 ? (
              <div className="text-text-secondary text-body-md text-center py-8">No asset expenses logged yet.</div>
            ) : costliestAssets.map((asset, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded border flex items-center justify-center ${
                    asset.status === 'danger' ? 'bg-status-danger/10 border-status-danger/20 text-status-danger' :
                    'bg-bg-surface border-border-subtle text-text-secondary'
                  }`}>
                    <span className="material-symbols-outlined text-[20px]">{asset.icon}</span>
                  </div>
                  <div>
                    <div className="font-body-md font-medium text-on-surface">{asset.id}</div>
                    <div className="text-label-caps text-text-secondary text-[11px]">{asset.type}</div>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <div className="font-body-md font-medium text-on-surface">{asset.cost}</div>
                  <div className="w-16 h-1 mt-1 rounded-full bg-bg-surface overflow-hidden">
                    <div className={`h-full rounded-full ${asset.status === 'danger' ? 'bg-status-danger' : 'bg-primary'}`} style={{ width: `${100 - (idx * 15)}%` }}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
