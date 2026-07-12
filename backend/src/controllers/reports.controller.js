import Vehicle from "../model/vehicle.model.js";
import { Trip } from "../model/trip.model.js";
import FuelLog from "../model/fuelLog.js";
import Expense from "../model/expense.js";
import { MaintenanceLog } from "../model/maintainenceLog.model.js";

export const getAnalytics = async (req, res) => {
  try {
    // 1. Fuel Efficiency (Total distance / Total Fuel)
    const trips = await Trip.find({ status: 'Completed' });
    let totalDistance = 0;
    let totalFuel = 0;
    
    trips.forEach(t => {
      totalDistance += (t.plannedDistanceKm || 0);
      totalFuel += (t.fuelConsumedLiters || 0);
    });
    
    const fuelEfficiency = totalFuel > 0 ? (totalDistance / totalFuel) : 0;

    // 2. Fleet Utilization (Active Vehicles / Total Vehicles)
    const totalVehicles = await Vehicle.countDocuments();
    const activeVehicles = await Vehicle.countDocuments({ status: { $in: ['OnTrip', 'InShop'] } });
    const fleetUtilization = totalVehicles > 0 ? (activeVehicles / totalVehicles) * 100 : 0;

    // 3. Operational Cost (Maintenance + Fuel + Expenses)
    const maintenanceLogs = await MaintenanceLog.find();
    const fuelLogs = await FuelLog.find();
    const expenses = await Expense.find();

    let operationalCost = 0;
    maintenanceLogs.forEach(m => operationalCost += (m.cost || 0));
    fuelLogs.forEach(f => operationalCost += (f.cost || 0));
    expenses.forEach(e => operationalCost += (e.amount || 0));

    // 4. Mocked Revenue and ROI (Using 100 rupees * distance as requested)
    let totalRevenue = totalDistance * 100;
    const vehicleROI = totalRevenue - operationalCost;

    // 5. Monthly Revenue (mocking using past trips)
    const monthlyRevenueMap = {};
    trips.forEach(t => {
      if (t.completedAt) {
        const monthYear = `${t.completedAt.getFullYear()}-${String(t.completedAt.getMonth() + 1).padStart(2, '0')}`;
        if (!monthlyRevenueMap[monthYear]) monthlyRevenueMap[monthYear] = 0;
        monthlyRevenueMap[monthYear] += (t.plannedDistanceKm || 0) * 100;
      }
    });

    const monthlyRevenue = Object.keys(monthlyRevenueMap).map(month => ({
      month,
      revenue: monthlyRevenueMap[month]
    })).sort((a, b) => a.month.localeCompare(b.month));

    // 6. Top Costliest Vehicles
    const vehicleCostsMap = {};
    
    maintenanceLogs.forEach(m => {
      const vId = m.vehicleId.toString();
      if (!vehicleCostsMap[vId]) vehicleCostsMap[vId] = 0;
      vehicleCostsMap[vId] += (m.cost || 0);
    });
    fuelLogs.forEach(f => {
      const vId = f.vehicleId.toString();
      if (!vehicleCostsMap[vId]) vehicleCostsMap[vId] = 0;
      vehicleCostsMap[vId] += (f.cost || 0);
    });
    expenses.forEach(e => {
      const vId = e.vehicleId.toString();
      if (!vehicleCostsMap[vId]) vehicleCostsMap[vId] = 0;
      vehicleCostsMap[vId] += (e.amount || 0);
    });

    const costliestVehicleIds = Object.keys(vehicleCostsMap)
      .sort((a, b) => vehicleCostsMap[b] - vehicleCostsMap[a])
      .slice(0, 5);

    const costliestVehiclesData = await Vehicle.find({ _id: { $in: costliestVehicleIds } });
    
    const topCostliestVehicles = costliestVehicleIds.map(id => {
      const v = costliestVehiclesData.find(v => v._id.toString() === id);
      return {
        vehicleId: id,
        registrationNumber: v ? v.registrationNumber : 'Unknown',
        totalCost: vehicleCostsMap[id]
      };
    });

    res.status(200).json({
      fuelEfficiency,
      fleetUtilization,
      operationalCost,
      vehicleROI,
      monthlyRevenue,
      topCostliestVehicles
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching analytics", error: error.message });
  }
};

export const exportCSV = async (req, res) => {
  try {
    const vehicles = await Vehicle.find();
    const maintenanceLogs = await MaintenanceLog.find();
    const fuelLogs = await FuelLog.find();
    const expenses = await Expense.find();

    const vehicleCostsMap = {};
    maintenanceLogs.forEach(m => {
      const vId = m.vehicleId.toString();
      if (!vehicleCostsMap[vId]) vehicleCostsMap[vId] = 0;
      vehicleCostsMap[vId] += (m.cost || 0);
    });
    fuelLogs.forEach(f => {
      const vId = f.vehicleId.toString();
      if (!vehicleCostsMap[vId]) vehicleCostsMap[vId] = 0;
      vehicleCostsMap[vId] += (f.cost || 0);
    });
    expenses.forEach(e => {
      const vId = e.vehicleId.toString();
      if (!vehicleCostsMap[vId]) vehicleCostsMap[vId] = 0;
      vehicleCostsMap[vId] += (e.amount || 0);
    });

    let csv = "Registration Number,Model,Type,Status,Odometer,Total Operational Cost (INR)\n";
    
    vehicles.forEach(v => {
      const vId = v._id.toString();
      const cost = vehicleCostsMap[vId] || 0;
      csv += `"${v.registrationNumber}","${v.model || ''}","${v.type || ''}","${v.status}",${v.odometer || 0},${cost}\n`;
    });

    res.header('Content-Type', 'text/csv');
    res.attachment('fleet_report.csv');
    return res.send(csv);
  } catch (error) {
    res.status(500).json({ message: "Error exporting CSV", error: error.message });
  }
};
