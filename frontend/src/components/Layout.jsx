import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopNavbar from './TopNavbar';

export default function Layout() {
  const [globalSearch, setGlobalSearch] = useState('');
  const location = useLocation();

  // Clear search whenever the page (route) changes
  useEffect(() => {
    setGlobalSearch('');
  }, [location.pathname]);

  return (
    <>
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 bg-background">
        <TopNavbar globalSearch={globalSearch} setGlobalSearch={setGlobalSearch} />
        <main className="flex-1 overflow-y-auto p-margin-desktop bg-surface-dim">
          <div className="max-w-container-max mx-auto space-y-6">
            <Outlet context={{ globalSearch, setGlobalSearch }} />
          </div>
        </main>
      </div>
    </>
  );
}
