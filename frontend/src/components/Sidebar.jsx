import { NavLink } from 'react-router-dom';

const navItems = [
  { name: 'Dashboard', path: '/', icon: 'dashboard' },
  { name: 'Fleet', path: '/fleet', icon: 'local_shipping' },
  { name: 'Drivers', path: '/drivers', icon: 'person' },
  { name: 'Trips', path: '/trips', icon: 'route' },
  { name: 'Maintenance', path: '/maintenance', icon: 'build' },
  { name: 'Fuel & Expenses', path: '/expenses', icon: 'payments' },
  { name: 'Analytics', path: '/analytics', icon: 'analytics' },
];

export default function Sidebar() {
  return (
    <aside className="bg-surface-container-lowest w-[240px] h-full flex-shrink-0 border-r border-border-subtle flex flex-col py-6 ">
      <div className="px-6 mb-8">
        <h1 className="text-headline-md font-headline-md font-bold text-primary flex items-center gap-2">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
            directions_transit
          </span>
          TransitOps
        </h1>
        <p className="text-label-caps font-label-caps text-text-secondary mt-1 uppercase tracking-widest">
          Logistics Management
        </p>
      </div>
      
      <nav className="flex-1 overflow-y-auto flex flex-col gap-1 px-4">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              isActive
                ? "flex items-center gap-3 px-4 py-3 rounded-lg text-primary font-bold border-l-4 border-primary bg-primary/10 opacity-90 transition-all duration-150"
                : "flex items-center gap-3 px-4 py-3 rounded-lg text-secondary dark:text-secondary-fixed-dim hover:text-on-surface hover:bg-surface-container-high transition-all duration-200 ease-in-out group"
            }
          >
            {({ isActive }) => (
              <>
                <span
                  className={`material-symbols-outlined transition-colors ${
                    isActive ? "" : "group-hover:text-primary"
                  }`}
                  style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}
                >
                  {item.icon}
                </span>
                <span className={`font-body-md ${isActive ? "" : "font-medium"}`}>
                  {item.name}
                </span>
              </>
            )}
          </NavLink>
        ))}

        <NavLink
          to="/settings"
          className={({ isActive }) =>
            isActive
              ? "flex items-center gap-3 px-4 py-3 rounded-lg text-primary font-bold border-l-4 border-primary bg-primary/10 opacity-90 transition-all duration-150 mt-auto"
              : "flex items-center gap-3 px-4 py-3 rounded-lg text-secondary dark:text-secondary-fixed-dim hover:text-on-surface hover:bg-surface-container-high transition-all duration-200 ease-in-out group mt-auto"
          }
        >
          {({ isActive }) => (
            <>
              <span
                className={`material-symbols-outlined transition-colors ${
                  isActive ? "" : "group-hover:text-primary"
                }`}
                style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}
              >
                settings
              </span>
              <span className={`font-body-md ${isActive ? "" : "font-medium"}`}>
                Settings
              </span>
            </>
          )}
        </NavLink>
        
        <div className="mt-2 pt-4 border-t border-border-subtle mx-4 mb-2">
          <button 
            onClick={() => {
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              window.location.href = '/login';
            }}
            className="flex w-full items-center gap-3 px-4 py-3 rounded-lg text-text-secondary hover:text-on-surface hover:bg-surface-container-high transition-colors font-medium"
          >
            <span className="material-symbols-outlined text-[20px]">logout</span>
            <span className="font-body-md text-left">Log out</span>
          </button>
        </div>
      </nav>
    </aside>
  );
}
