# 🚛 TransitOps — Smart Transport Operations Platform

TransitOps is a centralized, end-to-end transport operations platform that digitizes vehicle, driver, dispatch, maintenance, and expense management — replacing spreadsheets and manual logbooks with a single source of operational truth.

Built in an **8-hour hackathon sprint** by a 4-member team, TransitOps enforces real business rules (license validity, load capacity, vehicle/driver availability) and automatically keeps fleet state consistent as trips are dispatched, completed, or cancelled, and as vehicles enter/exit maintenance.

---

## 📌 Problem Statement

Many logistics companies still rely on spreadsheets and manual logbooks to manage transport operations. This leads to:

- Scheduling conflicts
- Underutilized vehicles
- Missed maintenance
- Expired driver licenses going unnoticed
- Inaccurate expense tracking
- Poor operational visibility

**TransitOps** solves this by providing a single platform to manage the complete lifecycle of transport operations — from vehicle registration and driver management to dispatching, maintenance, fuel logging, and analytics.

---

## 👥 Team

| Name | GitHub |
|---|---|
| Sanskar Gupta | [@SANSKAR-D](https://github.com/SANSKAR-D) |
| Prashant Bansal | [@PrashantBansal2006](https://github.com/PrashantBansal2006) |
| Naman Kumar | [@krnaman2007](https://github.com/krnaman2007) |
| Kailash Vishwakarma | [@Mr-Magic1](https://github.com/Mr-Magic1) |

---

## 🎯 Target Users

| Role | Responsibility |
|---|---|
| **Fleet Manager** | Oversees fleet assets, maintenance, vehicle lifecycle, and operational efficiency |
| **Driver** | Creates trips, assigns vehicles and drivers, monitors active deliveries |
| **Safety Officer** | Ensures driver compliance, tracks license validity, monitors safety scores |
| **Financial Analyst** | Reviews operational expenses, fuel consumption, maintenance costs, and profitability |

---

## ✨ Features

### 🔐 Authentication
- Secure login using email and password
- Role-Based Access Control (RBAC)
- Only authenticated users can access the application

### 📊 Dashboard
- Real-time KPIs: Active Vehicles, Available Vehicles, Vehicles in Maintenance, Active Trips, Pending Trips, Drivers on Duty, and Fleet Utilization (%)
- Filters by vehicle type, status, and region

### 🚗 Vehicle Registry
- Master list of vehicles with Registration Number (unique), Vehicle Name/Model, Type, Maximum Load Capacity, Odometer, Acquisition Cost, and Status
- Status values: `Available`, `On Trip`, `In Shop`, `Retired`

### 🧑‍✈️ Driver Management
- Driver profiles with Name, License Number, License Category, License Expiry Date, Contact Number, Safety Score, and Status
- Status values: `Available`, `On Trip`, `Off Duty`, `Suspended`

### 🛣️ Trip Management
- Create trips by selecting source, destination, an available vehicle, an available driver, cargo weight, and planned distance
- Trip lifecycle: `Draft → Dispatched → Completed → Cancelled`
- Dedicated **Trip Dispatcher** frontend module for assigning and tracking trips

### 🔧 Maintenance
- Create maintenance records for vehicles
- Adding a vehicle to a maintenance log automatically switches its status to `In Shop`, removing it from the driver's selection pool

### ⛽ Fuel & Expense Management
- Record fuel logs (liters, cost, date) and other expenses (tolls, maintenance, etc.)
- Automatically computes total operational cost (Fuel + Maintenance) per vehicle

### 📈 Reports & Analytics
- Fuel Efficiency (Distance / Fuel)
- Fleet Utilization
- Operational Cost
- Vehicle ROI: `(Revenue − (Maintenance + Fuel)) / Acquisition Cost`
- CSV export (PDF export optional/bonus)

---

## ⚙️ Mandatory Business Rules

The system enforces the following rules through a dedicated **Status Engine** service:

- Vehicle registration numbers must be **unique**
- `Retired` or `In Shop` vehicles never appear in the dispatch selection pool
- Drivers with **expired licenses** or `Suspended` status cannot be assigned to trips
- A driver or vehicle already marked `On Trip` cannot be assigned to another trip
- **Cargo Weight must not exceed** the vehicle's maximum load capacity
- Dispatching a trip automatically sets both vehicle and driver status to `On Trip`
- Completing a trip automatically resets both vehicle and driver status to `Available`
- Cancelling a dispatched trip restores the vehicle and driver to `Available`
- Creating an active maintenance record automatically sets vehicle status to `In Shop`
- Closing maintenance restores the vehicle to `Available` (unless retired)

---

## 🔄 Example Workflow

1. Register a vehicle `Van-05` with a maximum capacity of 500 kg → Status: `Available`
2. Register driver `Alex` with a valid driving license
3. Create a trip with Cargo Weight = 450 kg
4. System validates 450 kg ≤ 500 kg → allows dispatch
5. Vehicle and Driver status automatically become `On Trip`
6. Complete the trip by entering final odometer and fuel consumed
7. System marks both Vehicle and Driver as `Available`
8. Create a maintenance record (e.g., Oil Change) → Vehicle status automatically becomes `In Shop` and is hidden from dispatch
9. Reports update operational cost and fuel efficiency based on the latest trip and fuel log

---

## 🗄️ Database Entities

`Users` · `Roles` · `Vehicles` · `Drivers` · `Trips` · `Maintenance Logs` · `Fuel Logs` · `Expenses`

---

## 🛠️ Tech Stack

**Frontend**
- React (Vite)
- Tailwind CSS (dark theme)
- React Router (`ProtectedRoute` for auth-gated routes)

**Backend**
- Node.js + Express
- MongoDB with Mongoose (ES Modules)
- Custom validators & middleware for auth and RBAC

**Architecture**
- REST API with modular controllers, models, and routes
- A dedicated `services/statusEngine.js` centralizes automatic status transitions (vehicle/driver availability logic) to keep business rules consistent across trip, maintenance, and dispatch flows

---

## 📁 Project Structure

### Backend

```
backend/
├── src/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── dashboard.controller.js
│   │   ├── driver.controller.js
│   │   ├── expense.controller.js
│   │   ├── fuelLog.controller.js
│   │   ├── maintenanceController.js
│   │   ├── reports.controller.js
│   │   ├── trip.controller.js
│   │   └── vehicle.controller.js
│   ├── middleware/
│   │   └── middleware.js
│   ├── model/
│   │   ├── driver.model.js
│   │   ├── expense.js
│   │   ├── fuelLog.js
│   │   ├── maintainenceLog.model.js
│   │   ├── trip.model.js
│   │   ├── UserModel.js
│   │   └── vehicle.model.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── dashboard.js
│   │   ├── driver.routes.js
│   │   ├── expense.routes.js
│   │   ├── fuelLog.routes.js
│   │   ├── maintenanceRoutes.js
│   │   ├── reports.js
│   │   ├── trip.route.js
│   │   └── vehicle.routes.js
│   ├── services/
│   │   └── statusEngine.js
│   ├── validators/
│   │   └── authValidator.js
│   └── app.js
├── .env
├── package.json
└── server.js
```

### Frontend

```
frontend/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── AddFuelExpenseModal.jsx
│   │   ├── AddVehicleModal.jsx
│   │   ├── Layout.jsx
│   │   ├── ProtectedRoute.jsx
│   │   ├── Sidebar.jsx
│   │   ├── StatusBadge.jsx
│   │   └── TopNavbar.jsx
│   ├── pages/
│   │   ├── AnalyticsPage.jsx
│   │   ├── DashBoardPage.jsx
│   │   ├── DriversPage.jsx
│   │   ├── FuelExpensesPage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── MaintenancePage.jsx
│   │   ├── RegisterPage.jsx
│   │   ├── SettingsPage.jsx
│   │   ├── TripDispatcher.jsx
│   │   └── VehicleRegistry.jsx
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   └── main.jsx
├── tailwind.config.js
├── vite.config.js
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB (local instance or Atlas connection string)
- npm

### 1. Clone the repository

```bash
git clone https://github.com/PrashantBansal2006/smart-Transport-Operations-platform
cd transitops
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside `backend/` with:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Run the backend server:

```bash
npm run dev
```

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend will run on `http://localhost:5173` (Vite default) and the backend API on `http://localhost:5000`.

---

## 🔑 Core API Modules

| Module | Description |
|---|---|
| `authRoutes` | Login, registration, RBAC-protected auth flows |
| `vehicle.routes` | CRUD for vehicle registry, status management |
| `driver.routes` | CRUD for driver profiles, license/status tracking |
| `trip.route` | Trip creation, dispatch, completion, cancellation |
| `maintenanceRoutes` | Maintenance log creation and closure |
| `fuelLog.routes` | Fuel log entries per vehicle |
| `expense.routes` | Miscellaneous expense tracking |
| `dashboard` | Aggregated KPIs for the dashboard |
| `reports` | Fuel efficiency, utilization, cost, and ROI analytics |

---

## 🎨 Design Reference

Mockup: [Excalidraw Wireframe](https://link.excalidraw.com/l/65VNwvy7c4X/1FHGDNgD2td)

---

## 📄 License

This project was built as part of an 8-hour hackathon submission and is intended for educational/demo purposes.

---

