# TransitOps — PRD & Architecture Document
**Smart Transport Operations Platform | 8-Hour Hackathon | Stack: React + Tailwind + Express + MongoDB**

---

## 1. Product Summary

TransitOps digitizes fleet operations for a logistics company: vehicles, drivers, trip
dispatching, maintenance, and fuel/expense tracking, with role-based access and
live operational KPIs. Every status transition (vehicle/driver → On Trip → Available,
→ In Shop, etc.) is system-enforced, not manual.

**Roles:** Fleet Manager, Dispatcher, Safety Officer, Financial Analyst — one login,
role determines what's visible (per the mockup's Auth screen access matrix).

**Demo-critical path (must work, end to end):**
Login → Register vehicle → Register driver → Create trip → Dispatch (validates
capacity + availability) → Complete trip → Log maintenance (auto → In Shop) →
Dashboard KPIs & Fuel/Cost report reflect it all.

---

## 2. Scope for 8 Hours

### In scope (Must-Have — build these, in this priority order)
1. Auth + RBAC (login only; skip signup UI — seed users directly in DB)
2. Vehicle Registry (CRUD, unique reg. number, status enum)
3. Driver Management (CRUD, license expiry, status enum)
4. Trip Dispatcher (create → dispatch → complete/cancel, with all validation rules)
5. Maintenance (create record → auto "In Shop"; close → auto "Available")
6. Fuel & Expense logging + auto total operational cost per vehicle
7. Dashboard KPIs (computed, not hardcoded)
8. Reports & Analytics (Fuel Efficiency, Fleet Utilization, Op Cost, Vehicle ROI)

### Explicitly OUT of scope for 8 hours (cut immediately if behind)
- PDF export (CSV only, or skip entirely — it's optional per spec)
- Email reminders for license expiry
- Vehicle document uploads
- Dark mode toggle (mockup IS dark — just build it dark by default, don't build a toggle)
- Signup flow / password reset
- Notifications system

**Rule:** if a feature isn't in the "must-have" list above and you're past hour 5,
don't start it.

---

## 3. Roles & Permissions (RBAC matrix, from mockup)

| Section | Fleet Manager | Dispatcher | Safety Officer | Financial Analyst |
|---|---|---|---|---|
| Dashboard | ✓ | ✓ | view | view |
| Fleet (Vehicles) | ✓ | view | — | — |
| Drivers | — | view | ✓ | — |
| Trips | — | ✓ | — | — |
| Maintenance | ✓ | — | — | — |
| Fuel & Expenses | — | — | — | ✓ |
| Analytics | view | — | view | ✓ |
| Settings | ✓ (admin-ish) | — | — | — |

Implementation shortcut for 8 hours: **one `role` field on the User model**, a single
`requireRole(['fleetManager','admin'])` Express middleware per protected route, and
a `ROLE_PERMISSIONS` constant object on the frontend that hides/shows nav items and
disables buttons. Don't build a granular permissions engine — hardcode the matrix
above as a JS object both sides can import/mirror.

---

## 4. Database Schema (MongoDB / Mongoose)

Collections: `users`, `vehicles`, `drivers`, `trips`, `maintenancelogs`, `fuellogs`, `expenses`

```js
// User
{
  _id, name, email (unique), passwordHash,
  role: 'fleetManager' | 'dispatcher' | 'safetyOfficer' | 'financialAnalyst',
  depotName: String,
  createdAt
}

// Vehicle
{
  _id,
  regNumber: String (unique, required),
  nameModel: String,
  type: 'Van' | 'Truck' | 'Mini',
  maxLoadCapacityKg: Number,
  odometer: Number,
  acquisitionCost: Number,
  status: 'Available' | 'On Trip' | 'In Shop' | 'Retired',
  createdAt
}

// Driver
{
  _id,
  name: String,
  licenseNumber: String,
  licenseCategory: String,       // e.g. LMV, HMV
  licenseExpiry: Date,
  contactNumber: String,
  safetyScore: Number,           // 0-100
  status: 'Available' | 'On Trip' | 'Off Duty' | 'Suspended',
  createdAt
}

// Trip
{
  _id,
  tripCode: String,              // TR001 etc, auto-generated
  source: String,
  destination: String,
  vehicleId: ObjectId (ref Vehicle),
  driverId: ObjectId (ref Driver),
  cargoWeightKg: Number,
  plannedDistanceKm: Number,
  status: 'Draft' | 'Dispatched' | 'Completed' | 'Cancelled',
  finalOdometer: Number,         // set on completion
  fuelConsumedLiters: Number,    // set on completion
  dispatchedAt: Date,
  completedAt: Date,
  createdAt
}

// MaintenanceLog
{
  _id,
  vehicleId: ObjectId (ref Vehicle),
  serviceType: String,           // Oil Change, Engine Repair, Tyre Replace
  cost: Number,
  date: Date,
  status: 'Active' | 'Completed',
  createdAt
}

// FuelLog
{
  _id,
  vehicleId: ObjectId (ref Vehicle),
  tripId: ObjectId (ref Trip, optional),
  liters: Number,
  cost: Number,
  date: Date,
  createdAt
}

// Expense
{
  _id,
  vehicleId: ObjectId (ref Vehicle),
  tripId: ObjectId (ref Trip, optional),
  type: 'Toll' | 'Misc',
  amount: Number,
  date: Date,
  createdAt
}
```

**Derived, not stored:** total operational cost per vehicle, fuel efficiency, fleet
utilization %, Vehicle ROI — compute these in report endpoints via aggregation, don't
duplicate/store them (avoids sync bugs under time pressure).

---

## 5. Business Rule Enforcement (server-side, non-negotiable)

These must be enforced in the **backend**, not just hidden in the UI:

1. `regNumber` unique → Mongoose `unique: true` index + duplicate-key error handling
2. Retired / In Shop vehicles excluded from `GET /api/vehicles/available`
3. Suspended drivers or `licenseExpiry < now` excluded from `GET /api/drivers/available`
4. Vehicle/driver already `On Trip` cannot be dispatched again (checked in dispatch endpoint)
5. `cargoWeightKg > vehicle.maxLoadCapacityKg` → reject with 400 + clear error message
6. Dispatch trip → sets `trip.status = 'Dispatched'`, `vehicle.status = 'On Trip'`, `driver.status = 'On Trip'` — do this as one function so it's atomic in logic even without a DB transaction
7. Complete trip → trip `'Completed'`, vehicle & driver → `'Available'`
8. Cancel dispatched trip → vehicle & driver → `'Available'`
9. Create active maintenance record → vehicle → `'In Shop'`
10. Close maintenance record → vehicle → `'Available'` (skip if vehicle status is `'Retired'`)

Suggested implementation: a small `services/statusEngine.js` with functions
`dispatchTrip(tripId)`, `completeTrip(tripId, {finalOdometer, fuelConsumed})`,
`cancelTrip(tripId)`, `openMaintenance(...)`, `closeMaintenance(...)` — each function
owns one state transition and is called by the relevant route. This is the single
piece of code that must be correct; assign your strongest backend person to it and
don't let it get rewritten twice by two different AI sessions.

---

## 6. API Contract (Express routes)

Base: `/api`. Auth: `Authorization: Bearer <JWT>` header. All protected routes check role via middleware.

```
POST   /api/auth/login                  { email, password } → { token, user }

GET    /api/vehicles                    ?type=&status=&region=&search=
GET    /api/vehicles/available          (excludes In Shop / Retired)
POST   /api/vehicles                    { regNumber, nameModel, type, maxLoadCapacityKg, odometer, acquisitionCost }
PUT    /api/vehicles/:id
DELETE /api/vehicles/:id

GET    /api/drivers                     ?status=&search=
GET    /api/drivers/available           (excludes Suspended / expired license / On Trip)
POST   /api/drivers                     { name, licenseNumber, licenseCategory, licenseExpiry, contactNumber, safetyScore }
PUT    /api/drivers/:id

GET    /api/trips                       ?status=
POST   /api/trips                       { source, destination, vehicleId, driverId, cargoWeightKg, plannedDistanceKm }  → Draft
POST   /api/trips/:id/dispatch          → runs validation + statusEngine.dispatchTrip
POST   /api/trips/:id/complete          { finalOdometer, fuelConsumedLiters }
POST   /api/trips/:id/cancel

POST   /api/maintenance                 { vehicleId, serviceType, cost, date } → opens, sets vehicle In Shop
POST   /api/maintenance/:id/close       → closes, restores vehicle status
GET    /api/maintenance

POST   /api/fuel-logs                   { vehicleId, tripId?, liters, cost, date }
GET    /api/fuel-logs
POST   /api/expenses                    { vehicleId, tripId?, type, amount, date }
GET    /api/expenses

GET    /api/dashboard/kpis              ?vehicleType=&status=&region=
GET    /api/reports/analytics           → { fuelEfficiency, fleetUtilization, operationalCost, vehicleROI, monthlyRevenue[], topCostliestVehicles[] }
GET    /api/reports/export.csv
```

**Response shape convention:** always `{ success: true, data: {...} }` or
`{ success: false, error: "message" }`. Agree on this literally, word for word,
before anyone starts — it's the #1 source of frontend/backend merge friction.

---

## 7. Team Split (4 people, 8 hours)

| Person | Owns |
|---|---|
| **A — Backend Core** | Auth+JWT+seed users, Vehicle + Driver CRUD APIs, `statusEngine.js` (the state-transition logic), Trip dispatch/complete/cancel endpoints |
| **B — Frontend: Fleet & Drivers** | Dashboard page + KPI cards, Vehicle Registry page/table/form, Driver Management page/table/form |
| **C — Frontend: Trips & Maintenance** | Trip Dispatcher page (Draft→Dispatched flow, live board), Maintenance page, Fuel & Expense page |
| **D — Reports + Integration/Deploy** | Analytics/Reports page + chart components, dashboard KPI aggregation endpoint (`/api/dashboard/kpis`, `/api/reports/analytics`) working with A on the aggregation logic, then from hour 4 onward becomes integration lead: merges, deploys (Vercel + Render/Railway), owns demo data seeding |

### Timeline (8 hours)
| Time | Milestone |
|---|---|
| 0:00–0:25 | Lock this doc as source of truth, no debate — everyone reads schema + API contract |
| 0:25–3:30 | Parallel build, first push |
| 3:30–3:45 | Sync: merge to `dev`, flag blockers |
| 3:45–6:00 | Continue build, wire real APIs into frontend (swap out mocks) |
| 6:00–6:45 | Full integration pass — one person drives, others fix bugs live |
| 6:45–7:15 | Seed realistic demo data (matches mockup numbers if possible), deploy |
| 7:15–7:45 | Bug bash, cut anything broken |
| 7:45–8:00 | Demo script + buffer |

**Merge to `dev` every hour, no exceptions** — with only 8 hours you cannot afford a
hour-7 merge conflict.

---

## 8. Color System & Style Guide

Pulled directly from the mockup: dark background, amber/orange primary action
color, semantic status colors. Use this exact token set so every AI-generated
component (regardless of who prompts it) looks the same.

### Tailwind config tokens (`tailwind.config.js`)

```js
module.exports = {
  theme: {
    extend: {
      colors: {
        // Backgrounds
        'bg-primary':     '#0B0E14',   // app background, near-black navy
        'bg-surface':     '#141821',   // cards, sidebar, table rows
        'bg-surface-alt': '#1B202B',   // input fields, hover states
        'border-subtle':  '#2A303C',

        // Text
        'text-primary':   '#E8EAED',
        'text-secondary': '#8A93A3',
        'text-muted':     '#5C6472',

        // Brand / primary action
        'brand':          '#E8952E',   // orange — buttons like "Sign In", "+ Add Vehicle"
        'brand-hover':    '#D4841F',

        // Semantic status colors
        'status-available':  '#3ECF6E', // green — Available, Completed
        'status-ontrip':     '#3B9CE8', // blue — On Trip, Dispatched
        'status-warning':    '#E8952E', // amber — In Shop, Pending, Draft
        'status-danger':     '#E8544E', // red — Retired, Suspended, Cancelled

        // Chart accents
        'chart-1': '#5B9CE8',
        'chart-2': '#E8954E',
        'chart-3': '#E8544E',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        card: '10px',
      }
    }
  }
}
```

### Usage rules (give this to every AI prompt verbatim)

- Page background: `bg-bg-primary`. Sidebar & cards: `bg-bg-surface`.
- Primary buttons (Sign In, +Add Vehicle, +Log Fuel, Save): `bg-brand text-white hover:bg-brand-hover`, `rounded-card`.
- Secondary/cancel buttons: `bg-bg-surface-alt text-text-primary border border-border-subtle`.
- Status badges (pill-shaped, `rounded-full px-2 py-0.5 text-xs font-medium`):
  - Available / Completed / Active → `bg-status-available/15 text-status-available`
  - On Trip / Dispatched → `bg-status-ontrip/15 text-status-ontrip`
  - In Shop / Pending / Draft → `bg-status-warning/15 text-status-warning`
  - Retired / Suspended / Cancelled → `bg-status-danger/15 text-status-danger`
- Body text: `text-text-primary`; labels/secondary info: `text-text-secondary`; placeholders: `text-text-muted`.
- Tables: header row `text-text-secondary text-xs uppercase tracking-wide`, row borders `border-border-subtle`.
- Font: Inter throughout (`<link>` from Google Fonts or bundle it).
- Error/validation banners: `bg-status-danger/10 border border-status-danger text-status-danger`, exactly like the mockup's red-bordered error boxes.

### One shared component every frontend dev must reuse
Build a single `<StatusBadge status="Available" />` component (Person B builds it
first, hour 0–1) that maps status string → correct color class via a lookup object.
Everyone else imports it instead of re-deriving colors — this alone prevents 90% of
visual inconsistency across AI-generated screens.

---

## 9. Seed Data Checklist (for demo)

Seed at minimum: 4 vehicles (mix of Available/On Trip/In Shop/Retired), 3 drivers
(one Suspended or expired-license to prove the rule works), 3-4 trips across
different lifecycle states, 1-2 maintenance logs, a handful of fuel logs/expenses —
mirror the numbers in the mockup screens where convenient so the demo visually
matches what was pitched.
