import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      
      if (data.success) {
        localStorage.setItem('token', data.token);
        
        const tokenParts = data.token.split('.');
        const payload = JSON.parse(atob(tokenParts[1]));
        const userObj = {
          id: payload.id,
          role: payload.role,
          name: email.split('@')[0], 
        };
        localStorage.setItem('user', JSON.stringify(userObj));
        
        navigate('/');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('Network error connecting to backend.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-background w-full">
      {/* Left Sidebar - Branding & Roles */}
      <div className="hidden lg:flex lg:w-8/17 flex-shrink-0 bg-bg-surface border-r border-border-subtle flex-col p-12 relative">
        <div className="mt-4">
          <h1 className="font-headline-lg text-on-surface flex items-center gap-3 mb-2">
            <span className="material-symbols-outlined text-primary text-[28px]" style={{ fontVariationSettings: "'FILL' 0" }}>
              local_shipping
            </span>
            TransitOps
          </h1>
          <p className="text-text-secondary font-body-lg">Smart Transport Operations Platform</p>
        </div>

        <div className="flex-1 flex flex-col justify-center">
          <h2 className="font-headline-md text-on-surface mb-8">One login, four roles:</h2>
          <ul className="space-y-5">
            <li className="flex items-center gap-4">
              <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0"></span>
              <span className="font-body-md"><span className="text-on-surface">Fleet Manager</span> <span className="text-text-secondary">— Fleet, Maintenance</span></span>
            </li>
            <li className="flex items-center gap-4">
              <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0"></span>
              <span className="font-body-md"><span className="text-on-surface">Dispatcher</span> <span className="text-text-secondary">— Dashboard, Trips</span></span>
            </li>
            <li className="flex items-center gap-4">
              <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0"></span>
              <span className="font-body-md"><span className="text-on-surface">Safety Officer</span> <span className="text-text-secondary">— Drivers, Compliance</span></span>
            </li>
            <li className="flex items-center gap-4">
              <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0"></span>
              <span className="font-body-md"><span className="text-on-surface">Financial Analyst</span> <span className="text-text-secondary">— Fuel & Expenses, Analytics</span></span>
            </li>
          </ul>
        </div>

        <div className="font-label-caps text-text-secondary">
          TRANSITOPS © 2024 • RBAC ENABLED
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex-shrink-0 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-[420px]">
          
          <div className="mb-10">
            <h2 className="font-headline-lg text-on-surface mb-2">Sign in to your account</h2>
            <p className="text-text-secondary font-body-md">Enter your credentials to continue</p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded bg-status-danger/10 border border-status-danger text-status-danger font-body-md">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block font-label-caps text-text-secondary mb-2">EMAIL</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-bg-surface border border-border-subtle rounded py-3 px-4 font-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors placeholder:text-text-secondary/50"
                placeholder="alex@transitops.io"
              />
            </div>
            
            <div>
              <label className="block font-label-caps text-text-secondary mb-2">PASSWORD</label>
              <div className="relative">
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-bg-surface border border-border-subtle rounded py-3 pl-4 pr-12 font-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors placeholder:text-text-secondary/50"
                  placeholder="••••••••"
                />
                <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary hover:text-on-surface transition-colors">
                  <span className="material-symbols-outlined text-[20px]">visibility_off</span>
                </button>
              </div>
            </div>



            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="w-[18px] h-[18px] rounded-[4px] bg-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-[14px] text-on-primary font-bold" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>
                </div>
                <span className="text-text-secondary font-body-md group-hover:text-on-surface transition-colors">Remember me</span>
              </label>
              
              <a href="#" className="text-primary font-body-md hover:underline">Forgot password?</a>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-primary hover:bg-primary-container text-on-primary font-label-caps py-3.5 rounded transition-colors mt-2 disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {loading ? 'SIGNING IN...' : 'SIGN IN'}
              {!loading && <span className="material-symbols-outlined text-[18px]">arrow_forward</span>}
            </button>
          </form>

          <div className="mt-8 text-center font-body-md text-text-secondary">
            Don't have an account? <Link to="/register" className="text-primary hover:underline">Register here</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
