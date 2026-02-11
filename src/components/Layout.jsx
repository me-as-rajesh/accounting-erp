import { Link, NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Layout() {
  const { logout, user } = useAuth();

  return (
    <div>
      <header className="topbar">
        <div className="topbar-inner">
          <Link className="brand" to="/dashboard">Accounting ERP</Link>
          <nav className="nav">
            <NavLink to="/dashboard">Dashboard</NavLink>
            <NavLink to="/companies">Companies</NavLink>
            <NavLink to="/groups">Groups</NavLink>
            <NavLink to="/ledgers">Ledgers</NavLink>
            <NavLink to="/vouchers">Vouchers</NavLink>
            <NavLink to="/reports/trial">Trial</NavLink>
            <NavLink to="/reports/pl">P&L</NavLink>
            <NavLink to="/reports/bs">B/S</NavLink>
            <NavLink to="/reports/ledger">Ledger</NavLink>
          </nav>
          <div className="userbox">
            <span className="muted">{user?.fullName}</span>
            <button className="btn" onClick={logout}>Logout</button>
          </div>
        </div>
      </header>

      <main className="container">
        <Outlet />
      </main>
    </div>
  );
}
