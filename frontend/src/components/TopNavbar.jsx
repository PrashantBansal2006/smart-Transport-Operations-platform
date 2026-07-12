import { useLocation } from 'react-router-dom';

export default function TopNavbar({ globalSearch, setGlobalSearch }) {
  const location = useLocation();

  // Per architecture shortcut: read user directly from localStorage
  // (set there by the login API).
  const storedUser = localStorage.getItem('user');
  let user = null;
  if (storedUser) {
    try {
      user = JSON.parse(storedUser);
    } catch (e) {
      console.error("Failed to parse user from localStorage", e);
    }
  }

  // Function to get initials for the avatar
  const getInitials = (name) => {
    return name ? name.charAt(0).toUpperCase() : '?';
  };

  // Dynamic placeholder based on current route
  let searchPlaceholder = "Search...";
  if (location.pathname.includes('drivers')) searchPlaceholder = "Search drivers, IDs...";
  else if (location.pathname.includes('fleet')) searchPlaceholder = "Search vehicles...";
  else if (location.pathname.includes('trips')) searchPlaceholder = "Search trips...";
  else if (location.pathname.includes('maintenance')) searchPlaceholder = "Search service logs...";

  return (
    <header className="bg-surface-container w-full h-16 border-b border-border-subtle flex-shrink-0 flex justify-between items-center px-6 max-w-container-max mx-auto">
      <div className="flex items-center gap-4 w-1/3">
        {/* Search on left per JSON */}
        <div className="relative w-full max-w-md">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary text-[20px]">
            search
          </span>
          <input
            type="text"
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
            className="w-full bg-surface-bright border border-border-subtle rounded-lg py-2 pl-10 pr-4 text-body-md text-on-surface focus:outline-none focus:border-primary transition-colors placeholder:text-text-secondary"
            placeholder={searchPlaceholder}
          />
        </div>
      </div>

      <div className="flex items-center gap-6 justify-end w-1/3">

        {user ? (
          <div className="flex items-center gap-3">
            <div className="flex flex-col items-end">
              <span className="text-body-md font-medium text-on-surface">{user.name}</span>
              <span className="text-label-caps text-primary uppercase tracking-widest">{user.role}</span>
            </div>
            {/* Avatar using the first letter of the user's name */}
            <div className="w-10 h-10 rounded-full border border-border-subtle flex items-center justify-center bg-surface-bright text-on-surface font-headline-md">
              {getInitials(user.name)}
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 bg-primary hover:bg-primary-container text-on-primary text-body-md font-medium rounded-lg transition-all active:scale-95">
              Sign In
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
