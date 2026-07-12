import React, { useState, useEffect } from 'react';
import axios from 'axios';
import StatusBadge from '../components/StatusBadge';
import Sidebar from '../components/Sidebar';
import TopNavbar from '../components/TopNavbar';
import AddVehicleModal from '../components/AddVehicleModal';

export default function VehicleRegistry() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:5000/api/vehicles')
      .then((response) => {
        if (response.data.success) {
          setVehicles(response.data.data);
        }
      })
      .catch((err) => console.error('Error fetching vehicles:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-background w-full">

      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 bg-background">
        <TopNavbar />
        <main className="flex-1 overflow-y-auto p-margin-mobile md:p-margin-desktop bg-surface-dim">
          <div className="max-w-container-max mx-auto space-y-6">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
              <div>
                <h2 className="text-headline-lg-mobile md:text-headline-lg font-headline-lg font-bold text-on-surface mb-1">Vehicle Registry</h2>
                <p className="text-body-md text-text-secondary">Manage and monitor your entire fleet assets.</p>
              </div>
              <button 
                onClick={() => setIsAddModalOpen(true)}
                className="flex items-center justify-center gap-2 bg-primary hover:bg-primary-fixed-dim text-on-primary font-medium text-body-md py-2 px-5 rounded-lg transition-colors active:scale-95 shadow-sm shadow-primary/20 cursor-pointer"
              >
                <span className="material-symbols-outlined text-xl">add</span>
                <span>Add Vehicle</span>
              </button>
            </div>

            {/* Filters Bar */}
            <div className="bg-bg-surface p-4 rounded-xl border border-border-subtle mb-6 flex flex-col lg:flex-row gap-4 items-center justify-between">
              <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                <div className="relative min-w-[160px]">
                  <select className="w-full appearance-none bg-surface-container-low border border-border-subtle rounded-lg pl-4 pr-10 py-2 text-body-md text-on-surface focus:outline-none focus:border-primary transition-colors cursor-pointer">
                    <option value="">Type: All</option>
                    <option value="van">Van</option>
                    <option value="truck">Truck</option>
                    <option value="mini">Mini</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none">expand_more</span>
                </div>
                <div className="relative min-w-[160px]">
                  <select className="w-full appearance-none bg-surface-container-low border border-border-subtle rounded-lg pl-4 pr-10 py-2 text-body-md text-on-surface focus:outline-none focus:border-primary transition-colors cursor-pointer">
                    <option value="">Status: All</option>
                    <option value="available">Available</option>
                    <option value="on-trip">On Trip</option>
                    <option value="in-shop">In Shop</option>
                    <option value="retired">Retired</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none">expand_more</span>
                </div>
              </div>
              <div className="relative w-full lg:w-80">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary text-lg">search</span>
                <input className="w-full bg-surface-container-low border border-border-subtle rounded-lg pl-10 pr-4 py-2 text-body-md text-on-surface focus:outline-none focus:border-primary transition-colors" placeholder="Search Reg No..." type="text" />
              </div>
            </div>

            {/* Data Table Container */}
            <div className="bg-bg-surface rounded-xl border border-border-subtle overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left whitespace-nowrap">
                  <thead>
                    <tr className="bg-surface-container border-b border-border-subtle">
                      <th className="table-cell-pad text-label-caps font-label-caps text-text-secondary uppercase tracking-wide">Reg No. (Unique)</th>
                      <th className="table-cell-pad text-label-caps font-label-caps text-text-secondary uppercase tracking-wide">Name/Model</th>
                      <th className="table-cell-pad text-label-caps font-label-caps text-text-secondary uppercase tracking-wide">Type</th>
                      <th className="table-cell-pad text-label-caps font-label-caps text-text-secondary uppercase tracking-wide text-right">Capacity</th>
                      <th className="table-cell-pad text-label-caps font-label-caps text-text-secondary uppercase tracking-wide text-right">Odometer</th>
                      <th className="table-cell-pad text-label-caps font-label-caps text-text-secondary uppercase tracking-wide text-right">Acq. Cost</th>
                      <th className="table-cell-pad text-label-caps font-label-caps text-text-secondary uppercase tracking-wide">Status</th>
                      <th className="table-cell-pad w-10"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-subtle">
                    {loading ? (
                      <tr>
                        <td colSpan="8" className="table-cell-pad text-center text-text-secondary py-8">
                          Loading vehicles...
                        </td>
                      </tr>
                    ) : vehicles.length === 0 ? (
                      <tr>
                        <td colSpan="8" className="table-cell-pad text-center text-text-secondary py-8">
                          No vehicles found.
                        </td>
                      </tr>
                    ) : (
                      vehicles.map((v) => (
                        <tr key={v._id || v.registrationNumber} className={`hover:bg-surface-container-low transition-colors group ${v.status === 'Retired' ? 'opacity-70' : ''}`}>
                          <td className={`table-cell-pad font-data-mono text-on-surface ${v.status === 'Retired' ? 'line-through decoration-text-secondary/50' : ''}`}>
                            {v.registrationNumber}
                          </td>
                          <td className={`table-cell-pad text-body-md ${v.status === 'Retired' ? 'text-text-secondary' : 'text-on-surface-variant'} font-medium`}>
                            {v.model}
                          </td>
                          <td className="table-cell-pad text-body-md text-text-secondary">
                            {v.type}
                          </td>
                          <td className={`table-cell-pad font-data-mono ${v.status === 'Retired' ? 'text-text-secondary' : 'text-on-surface-variant'} text-right`}>
                            {v.maxLoadCapacity ? `${v.maxLoadCapacity} kg` : '-'}
                          </td>
                          <td className={`table-cell-pad font-data-mono ${v.status === 'Retired' ? 'text-text-secondary' : 'text-on-surface-variant'} text-right`}>
                            {v.odometer ? v.odometer.toLocaleString() : '-'}
                          </td>
                          <td className={`table-cell-pad font-data-mono ${v.status === 'Retired' ? 'text-text-secondary' : 'text-on-surface-variant'} text-right`}>
                            {v.acquisitionCost ? v.acquisitionCost.toLocaleString() : '-'}
                          </td>
                          <td className="table-cell-pad">
                            <StatusBadge status={v.status} />
                          </td>
                          <td className="table-cell-pad text-right">
                            <button className="text-text-secondary hover:text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                              <span className="material-symbols-outlined">more_vert</span>
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Table Footer / Pagination */}
              <div className="bg-surface-container-low px-4 py-3 border-t border-border-subtle flex items-center justify-between text-body-md text-text-secondary">
                <div>
                  Showing <span className="font-medium text-on-surface-variant">{vehicles.length > 0 ? 1 : 0}</span> to <span className="font-medium text-on-surface-variant">{vehicles.length}</span> of <span className="font-medium text-on-surface-variant">{vehicles.length}</span> vehicles
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-1 rounded hover:bg-surface-container-high transition-colors disabled:opacity-50" disabled>
                    <span className="material-symbols-outlined">chevron_left</span>
                  </button>
                  <button className="p-1 rounded hover:bg-surface-container-high transition-colors disabled:opacity-50" disabled>
                    <span className="material-symbols-outlined">chevron_right</span>
                  </button>
                </div>
              </div>
            </div>

            <p className="text-label-caps text-text-secondary/70 mt-4 max-w-2xl">
              Rule: Registration No. must be unique. * Retired/In Shop vehicles are hidden from Trip Dispatcher.
            </p>
          </div>
        </main>
      </div>

      <AddVehicleModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onSuccess={(newVehicle) => {
          setVehicles((prev) => [newVehicle, ...prev]);
          setIsAddModalOpen(false);
        }} 
      />
    </div>
  );
}
