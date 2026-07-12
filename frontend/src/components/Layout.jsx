import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopNavbar from './TopNavbar';

export default function Layout() {
  return (
    <>
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 bg-background">
        <TopNavbar />
        <main className="flex-1 overflow-y-auto p-margin-desktop bg-surface-dim">
          <div className="max-w-container-max mx-auto space-y-6">
            <Outlet />
          </div>
        </main>
      </div>
    </>
  );
}
