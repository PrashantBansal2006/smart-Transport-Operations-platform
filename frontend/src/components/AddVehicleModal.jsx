import React, { useState } from 'react';
import axios from 'axios';

export default function AddVehicleModal({ isOpen, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    regNumber: '',
    nameModel: '',
    type: 'Truck',
    maxLoadCapacityKg: '',
    odometer: '',
    acquisitionCost: '',
    region: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await axios.post(
        'http://localhost:5000/api/vehicles',
        {
          ...formData,
          maxLoadCapacityKg: formData.maxLoadCapacityKg ? Number(formData.maxLoadCapacityKg) : undefined,
          odometer: formData.odometer ? Number(formData.odometer) : undefined,
          acquisitionCost: formData.acquisitionCost ? Number(formData.acquisitionCost) : undefined,
        },
        { withCredentials: true }
      );

      if (response.data.success) {
        onSuccess(response.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'An error occurred while creating the vehicle');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-bg-surface w-full max-w-lg rounded-2xl border border-border-subtle shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border-subtle flex items-center justify-between bg-surface-container-lowest">
          <h3 className="text-headline-md font-headline-md font-bold text-on-surface">Add New Vehicle</h3>
          <button 
            onClick={onClose}
            className="text-text-secondary hover:text-on-surface transition-colors p-1 rounded-full hover:bg-surface-container"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Form Content */}
        <div className="p-6 overflow-y-auto">
          {error && (
            <div className="mb-6 p-3 rounded-lg bg-error-container/20 border border-error-container text-error text-body-md flex items-start gap-2">
              <span className="material-symbols-outlined text-[18px]">error</span>
              <span>{error}</span>
            </div>
          )}

          <form id="add-vehicle-form" onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Registration Number */}
              <div className="col-span-1 sm:col-span-2">
                <label className="block text-label-caps font-label-caps text-text-secondary mb-1">Registration Number *</label>
                <input
                  type="text"
                  name="regNumber"
                  value={formData.regNumber}
                  onChange={handleChange}
                  required
                  placeholder="e.g. MH12AB1234"
                  className="w-full bg-surface-container-low border border-border-subtle rounded-lg px-4 py-2.5 text-body-md text-on-surface focus:outline-none focus:border-primary transition-colors"
                />
              </div>

              {/* Model/Name */}
              <div>
                <label className="block text-label-caps font-label-caps text-text-secondary mb-1">Model / Name *</label>
                <input
                  type="text"
                  name="nameModel"
                  value={formData.nameModel}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Tata 407"
                  className="w-full bg-surface-container-low border border-border-subtle rounded-lg px-4 py-2.5 text-body-md text-on-surface focus:outline-none focus:border-primary transition-colors"
                />
              </div>

              {/* Type */}
              <div>
                <label className="block text-label-caps font-label-caps text-text-secondary mb-1">Vehicle Type *</label>
                <div className="relative">
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    required
                    className="w-full appearance-none bg-surface-container-low border border-border-subtle rounded-lg pl-4 pr-10 py-2.5 text-body-md text-on-surface focus:outline-none focus:border-primary transition-colors cursor-pointer"
                  >
                    <option value="Truck">Truck</option>
                    <option value="Van">Van</option>
                    <option value="Mini Truck">Mini Truck</option>
                    <option value="Pickup">Pickup</option>
                    <option value="Trailer">Trailer</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none">expand_more</span>
                </div>
              </div>

              {/* Capacity */}
              <div>
                <label className="block text-label-caps font-label-caps text-text-secondary mb-1">Max Load (kg)</label>
                <input
                  type="number"
                  name="maxLoadCapacityKg"
                  value={formData.maxLoadCapacityKg}
                  onChange={handleChange}
                  placeholder="e.g. 4000"
                  className="w-full bg-surface-container-low border border-border-subtle rounded-lg px-4 py-2.5 text-body-md text-on-surface focus:outline-none focus:border-primary transition-colors"
                />
              </div>

              {/* Odometer */}
              <div>
                <label className="block text-label-caps font-label-caps text-text-secondary mb-1">Odometer (km)</label>
                <input
                  type="number"
                  name="odometer"
                  value={formData.odometer}
                  onChange={handleChange}
                  placeholder="e.g. 12000"
                  className="w-full bg-surface-container-low border border-border-subtle rounded-lg px-4 py-2.5 text-body-md text-on-surface focus:outline-none focus:border-primary transition-colors"
                />
              </div>

              {/* Acquisition Cost */}
              <div>
                <label className="block text-label-caps font-label-caps text-text-secondary mb-1">Acquisition Cost</label>
                <input
                  type="number"
                  name="acquisitionCost"
                  value={formData.acquisitionCost}
                  onChange={handleChange}
                  placeholder="e.g. 850000"
                  className="w-full bg-surface-container-low border border-border-subtle rounded-lg px-4 py-2.5 text-body-md text-on-surface focus:outline-none focus:border-primary transition-colors"
                />
              </div>

              {/* Region */}
              <div>
                <label className="block text-label-caps font-label-caps text-text-secondary mb-1">Region</label>
                <input
                  type="text"
                  name="region"
                  value={formData.region}
                  onChange={handleChange}
                  placeholder="e.g. Mumbai"
                  className="w-full bg-surface-container-low border border-border-subtle rounded-lg px-4 py-2.5 text-body-md text-on-surface focus:outline-none focus:border-primary transition-colors"
                />
              </div>
            </div>
          </form>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-border-subtle bg-surface-container-lowest flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-5 py-2 rounded-lg text-body-md font-medium text-on-surface-variant hover:bg-surface-container transition-colors disabled:opacity-50 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="add-vehicle-form"
            disabled={loading}
            className="flex items-center justify-center gap-2 bg-primary hover:bg-primary-fixed-dim text-on-primary font-medium text-body-md py-2 px-6 rounded-lg transition-colors active:scale-95 shadow-sm shadow-primary/20 disabled:opacity-70 disabled:pointer-events-none cursor-pointer"
          >
            {loading ? (
              <span className="material-symbols-outlined animate-spin text-[20px]">progress_activity</span>
            ) : (
              <span>Create Vehicle</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
