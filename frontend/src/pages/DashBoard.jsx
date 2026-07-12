import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const DashBoard = () => {
  const [kpis, setKpis] = useState(null);
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        let kpisData = null;
        let tripsData = [];

        try {
          const kpiRes = await axios.get('http://localhost:5000/api/dashboard/kpis', { withCredentials: true });
          kpisData = kpiRes.data;
        } catch (kpiErr) {
          console.error("Failed to fetch KPIs:", kpiErr);
        }

        try {
          const tripsRes = await axios.get('http://localhost:5000/api/trips?limit=4', { withCredentials: true });
          const fetchedTrips = Array.isArray(tripsRes.data) ? tripsRes.data : (tripsRes.data.trips || []);
          tripsData = fetchedTrips.slice(0, 4);
        } catch (tripErr) {
          console.error("Failed to fetch Trips:", tripErr);
        }

        if (!kpisData && tripsData.length === 0) {
           setError('Failed to fetch dashboard data. Make sure you are logged in and have the correct permissions.');
        } else {
           setKpis(kpisData);
           setTrips(tripsData);
        }
      } catch (err) {
        setError('An unexpected error occurred while fetching data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center h-full">
        <div className="text-primary text-xl animate-pulse">Loading Dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 p-6">
        <div className="bg-error-container text-on-error-container p-4 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  const { vehicles, activeTrips } = kpis || {
    vehicles: { total: 0, available: 0, onTrip: 0, inShop: 0 },
    activeTrips: 0
  };

  const calculatePercentage = (value, total) => {
    if (!total) return 0;
    return Math.round((value / total) * 100);
  };

  const availablePct = calculatePercentage(vehicles.available, vehicles.total);
  const onTripPct = calculatePercentage(vehicles.onTrip, vehicles.total);
  const inShopPct = calculatePercentage(vehicles.inShop, vehicles.total);
  const fleetUtilization = vehicles.total ? Math.round(((vehicles.onTrip + vehicles.available) / vehicles.total) * 100) : 0;

  return (
    <>
      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        <div className="bg-surface-container rounded-lg p-5 border border-border-subtle flex flex-col justify-between h-28 hover:bg-surface-container-high transition-colors">
          <h3 className="text-label-caps text-text-secondary uppercase tracking-wide">Active Vehicles</h3>
          <div className="text-headline-lg font-headline-lg text-primary">{vehicles.total || 0}</div>
        </div>
        <div className="bg-surface-container rounded-lg p-5 border border-border-subtle flex flex-col justify-between h-28 hover:bg-surface-container-high transition-colors">
          <h3 className="text-label-caps text-text-secondary uppercase tracking-wide">Available Vehicles</h3>
          <div className="text-headline-lg font-headline-lg text-status-success">{vehicles.available || 0}</div>
        </div>
        <div className="bg-surface-container rounded-lg p-5 border border-border-subtle flex flex-col justify-between h-28 hover:bg-surface-container-high transition-colors">
          <h3 className="text-label-caps text-text-secondary uppercase tracking-wide">Vehicles in Maint.</h3>
          <div className="text-headline-lg font-headline-lg text-primary-container">{vehicles.inShop || 0}</div>
        </div>
        <div className="bg-surface-container rounded-lg p-5 border border-border-subtle flex flex-col justify-between h-28 hover:bg-surface-container-high transition-colors">
          <h3 className="text-label-caps text-text-secondary uppercase tracking-wide">Active Trips</h3>
          <div className="text-headline-lg font-headline-lg text-status-info">{activeTrips || 0}</div>
        </div>
        <div className="bg-surface-container rounded-lg p-5 border border-border-subtle flex flex-col justify-between h-28 hover:bg-surface-container-high transition-colors">
          <h3 className="text-label-caps text-text-secondary uppercase tracking-wide">Pending Trips</h3>
          <div className="text-headline-lg font-headline-lg text-on-surface">--</div>
        </div>
        <div className="bg-surface-container rounded-lg p-5 border border-border-subtle flex flex-col justify-between h-28 hover:bg-surface-container-high transition-colors">
          <h3 className="text-label-caps text-text-secondary uppercase tracking-wide">Drivers on Duty</h3>
          <div className="text-headline-lg font-headline-lg text-on-surface">--</div>
        </div>
        <div className="bg-surface-container rounded-lg p-5 border border-border-subtle flex flex-col justify-between h-28 hover:bg-surface-container-high transition-colors">
          <h3 className="text-label-caps text-text-secondary uppercase tracking-wide">Fleet Utilization</h3>
          <div className="text-headline-lg font-headline-lg text-status-success">{fleetUtilization}%</div>
        </div>
      </div>

      {/* Main Data Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Trips Table */}
        <div className="lg:col-span-2 bg-surface-container rounded-lg border border-border-subtle overflow-hidden flex flex-col">
          <div className="p-4 border-b border-border-subtle flex justify-between items-center bg-surface-container-high/50">
            <h2 className="text-body-md font-bold text-on-surface uppercase tracking-wider">Recent Trips</h2>
            <Link to="/trips" className="text-primary text-sm hover:underline">View All</Link>
          </div>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-label-caps text-text-secondary border-b border-border-subtle bg-surface-container-low">
                  <th className="px-4 py-3 font-semibold uppercase tracking-wider">Trip ID</th>
                  <th className="px-4 py-3 font-semibold uppercase tracking-wider">Vehicle</th>
                  <th className="px-4 py-3 font-semibold uppercase tracking-wider">Driver</th>
                  <th className="px-4 py-3 font-semibold uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 font-semibold uppercase tracking-wider text-right">ETA</th>
                </tr>
              </thead>
              <tbody className="text-body-md font-data-mono">
                {trips.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-4 py-8 text-center text-text-secondary">No recent trips found</td>
                  </tr>
                ) : (
                  trips.map((trip) => (
                    <tr key={trip._id} className="border-b border-border-subtle hover:bg-surface-container-high/50 transition-colors">
                      <td className="px-4 py-3 text-on-surface">{trip.tripId || trip._id.substring(0, 8)}</td>
                      <td className="px-4 py-3 text-text-secondary">{trip.vehicle?.registrationNumber || '--'}</td>
                      <td className="px-4 py-3 text-text-secondary">{trip.driver?.name || '--'}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${
                          trip.status === 'Completed' ? 'bg-status-success/15 text-status-success border-status-success/20' :
                          trip.status === 'Dispatched' || trip.status === 'OnTrip' ? 'bg-status-info/15 text-status-info border-status-info/20' :
                          'bg-surface-variant text-text-secondary border-border-subtle'
                        }`}>
                          {trip.status || 'Draft'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right text-text-secondary">{trip.eta ? `${trip.eta} h` : '--'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Vehicle Status Chart */}
        <div className="bg-surface-container rounded-lg border border-border-subtle p-5 flex flex-col">
          <h2 className="text-body-md font-bold text-on-surface uppercase tracking-wider mb-6 border-b border-border-subtle pb-3">Vehicle Status</h2>
          <div className="space-y-5 flex-1">
            <div>
              <div className="flex justify-between text-body-md mb-2">
                <span className="text-text-secondary">Available</span>
                <span className="font-data-mono text-on-surface font-medium">{vehicles.available || 0}</span>
              </div>
              <div className="w-full bg-surface-container-highest rounded-full h-2">
                <div className="bg-status-success h-2 rounded-full" style={{ width: `${availablePct}%` }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-body-md mb-2">
                <span className="text-text-secondary">On Trip</span>
                <span className="font-data-mono text-on-surface font-medium">{vehicles.onTrip || 0}</span>
              </div>
              <div className="w-full bg-surface-container-highest rounded-full h-2">
                <div className="bg-status-info h-2 rounded-full" style={{ width: `${onTripPct}%` }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-body-md mb-2">
                <span className="text-text-secondary">In Shop</span>
                <span className="font-data-mono text-on-surface font-medium">{vehicles.inShop || 0}</span>
              </div>
              <div className="w-full bg-surface-container-highest rounded-full h-2">
                <div className="bg-primary-container h-2 rounded-full" style={{ width: `${inShopPct}%` }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-body-md mb-2">
                <span className="text-text-secondary">Retired</span>
                <span className="font-data-mono text-text-secondary">0</span>
              </div>
              <div className="w-full bg-surface-container-highest rounded-full h-2">
                <div className="bg-surface-variant h-2 rounded-full" style={{ width: `0%` }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashBoard;
