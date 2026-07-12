import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AddFuelExpenseModal from '../components/AddFuelExpenseModal';

export default function FuelExpensesPage() {
  const [activeTab, setActiveTab] = useState('fuel'); // 'fuel' or 'expenses'
  const [fuelLogs, setFuelLogs] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const headers = { 'Authorization': `Bearer ${token}` };

      const [fuelRes, expenseRes] = await Promise.all([
        axios.get('http://localhost:5000/api/fuel-logs', { headers }),
        axios.get('http://localhost:5000/api/expenses', { headers })
      ]);
      
      if (fuelRes.data.success) {
        setFuelLogs(fuelRes.data.data);
      }
      if (expenseRes.data.success) {
        setExpenses(expenseRes.data.data);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h2 className="text-headline-lg-mobile md:text-headline-lg font-headline-lg font-bold text-on-surface mb-1">Fuel & Expenses</h2>
          <p className="text-body-md text-text-secondary">Track operational costs, fuel efficiency, and vehicle expenses.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-primary hover:bg-primary-fixed-dim text-on-primary font-medium text-body-md py-2 px-5 rounded-lg transition-colors active:scale-95 shadow-sm shadow-primary/20 cursor-pointer"
        >
          <span className="material-symbols-outlined text-xl">add</span>
          <span>Log Expense/Fuel</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border-subtle mb-6 gap-6">
        <button 
          onClick={() => setActiveTab('fuel')}
          className={`pb-3 text-body-md font-medium transition-colors border-b-2 ${activeTab === 'fuel' ? 'border-primary text-primary' : 'border-transparent text-text-secondary hover:text-on-surface'}`}
        >
          Fuel Logs
        </button>
        <button 
          onClick={() => setActiveTab('expenses')}
          className={`pb-3 text-body-md font-medium transition-colors border-b-2 ${activeTab === 'expenses' ? 'border-primary text-primary' : 'border-transparent text-text-secondary hover:text-on-surface'}`}
        >
          Other Expenses
        </button>
      </div>

      {/* Data Table Container */}
      <div className="bg-bg-surface rounded-xl border border-border-subtle overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap">
            <thead>
              <tr className="bg-surface-container border-b border-border-subtle">
                <th className="table-cell-pad text-label-caps font-label-caps text-text-secondary uppercase tracking-wide">Date</th>
                <th className="table-cell-pad text-label-caps font-label-caps text-text-secondary uppercase tracking-wide">Vehicle</th>
                {activeTab === 'fuel' ? (
                  <>
                    <th className="table-cell-pad text-label-caps font-label-caps text-text-secondary uppercase tracking-wide text-right">Liters</th>
                    <th className="table-cell-pad text-label-caps font-label-caps text-text-secondary uppercase tracking-wide text-right">Cost ($)</th>
                  </>
                ) : (
                  <>
                    <th className="table-cell-pad text-label-caps font-label-caps text-text-secondary uppercase tracking-wide">Expense Type</th>
                    <th className="table-cell-pad text-label-caps font-label-caps text-text-secondary uppercase tracking-wide text-right">Amount ($)</th>
                  </>
                )}
                <th className="table-cell-pad text-label-caps font-label-caps text-text-secondary uppercase tracking-wide text-right">Trip ID</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {loading ? (
                <tr>
                  <td colSpan="5" className="table-cell-pad text-center text-text-secondary py-8">
                    Loading records...
                  </td>
                </tr>
              ) : activeTab === 'fuel' ? (
                fuelLogs.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="table-cell-pad text-center text-text-secondary py-8">
                      No fuel logs found.
                    </td>
                  </tr>
                ) : (
                  fuelLogs.map((log) => (
                    <tr key={log._id} className="hover:bg-surface-container-low transition-colors group">
                      <td className="table-cell-pad font-data-mono text-on-surface">
                        {new Date(log.date).toLocaleDateString()}
                      </td>
                      <td className="table-cell-pad text-body-md text-on-surface-variant font-medium">
                        {log.vehicleId?.registrationNumber || 'Unknown'} - {log.vehicleId?.model || ''}
                      </td>
                      <td className="table-cell-pad font-data-mono text-on-surface-variant text-right">
                        {log.liters?.toFixed(2)} L
                      </td>
                      <td className="table-cell-pad font-data-mono text-status-warning text-right">
                        ${log.cost?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="table-cell-pad font-data-mono text-text-secondary text-right">
                        {log.tripId?._id || log.tripId || '-'}
                      </td>
                    </tr>
                  ))
                )
              ) : (
                expenses.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="table-cell-pad text-center text-text-secondary py-8">
                      No expenses found.
                    </td>
                  </tr>
                ) : (
                  expenses.map((exp) => (
                    <tr key={exp._id} className="hover:bg-surface-container-low transition-colors group">
                      <td className="table-cell-pad font-data-mono text-on-surface">
                        {new Date(exp.date).toLocaleDateString()}
                      </td>
                      <td className="table-cell-pad text-body-md text-on-surface-variant font-medium">
                        {exp.vehicleId?.registrationNumber || 'Unknown'} - {exp.vehicleId?.model || ''}
                      </td>
                      <td className="table-cell-pad text-body-md text-on-surface-variant">
                        {exp.type}
                      </td>
                      <td className="table-cell-pad font-data-mono text-status-warning text-right">
                        ${exp.amount?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="table-cell-pad font-data-mono text-text-secondary text-right">
                        {exp.tripId?._id || exp.tripId || '-'}
                      </td>
                    </tr>
                  ))
                )
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AddFuelExpenseModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchData}
      />
    </>
  );
}
