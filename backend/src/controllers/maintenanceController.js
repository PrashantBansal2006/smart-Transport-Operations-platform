import { MaintenanceLog } from '../model/maintainenceLog.model.js';
import Vehicle from '../model/vehicle.model.js'

// POST /api/maintenance -> opens a maintenance record, sets vehicle to 'InShop'
async function createMaintenance(req, res) {
    const { vehicleId, serviceType, cost, date } = req.body;

    if (!vehicleId || !serviceType || cost === undefined || !date) {
        return res.status(400).json({ success: false, message: "Please provide all required fields" });
    }

    try {
        const vehicle = await Vehicle.findById(vehicleId);
        if (!vehicle) {
            return res.status(404).json({ success: false, message: "Vehicle not found" });
        }

        if (vehicle.status === 'Retired') {
            return res.status(400).json({ success: false, message: "Cannot log maintenance for a retired vehicle" });
        }

        if (vehicle.status === 'OnTrip') {
            return res.status(400).json({ success: false, message: "Cannot send an on-trip vehicle to maintenance" });
        }

        const maintenanceLog = new MaintenanceLog({
            vehicleId,
            serviceType,
            cost,
            date,
            status: 'Active'
        });

        await maintenanceLog.save();
        vehicle.status = 'InShop';
        await vehicle.save();
        return res.status(201).json({ success: true, data: maintenanceLog });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ success: false, error: "Server error" });
    }
}

// POST /api/maintenance/:id/close -> closes record, restores vehicle (skip if Retired)
async function closeMaintenance(req, res) {
    const { id } = req.params;
    try {
        const maintenanceLog = await MaintenanceLog.findById(id);
        if (!maintenanceLog) {
            return res.status(404).json({ success: false, message: "Maintenance record not found" });
        }
        if (maintenanceLog.status === 'Completed') {
            return res.status(400).json({ success: false, message: "Maintenance record already closed" });
        }
        maintenanceLog.status = 'Completed';
        await maintenanceLog.save();
        const vehicle = await Vehicle.findById(maintenanceLog.vehicleId);
        if (vehicle && vehicle.status !== 'Retired') {
            vehicle.status = 'Available';
            await vehicle.save();
        }
        return res.status(200).json({ success: true, data: maintenanceLog });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ success: false, error: "Server error" });
    }
}
// GET /api/maintenance -> list, optional ?status= filter
async function getMaintenanceLogs(req, res) {
    const { status } = req.query;
    try {
        const filter = {};
        if (status) filter.status = status;

        const logs = await MaintenanceLog.find(filter)
            .populate('vehicleId', 'registrationNumber model status')
            .sort({ createdAt: -1 });

        return res.status(200).json({ success: true, data: logs });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ success: false, error: "Server error" });
    }
}

export { createMaintenance, closeMaintenance, getMaintenanceLogs };