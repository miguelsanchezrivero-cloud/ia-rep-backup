import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import type { Permission } from '../types';

interface ProtectedRouteProps {
  requiredPermission?: Permission;
}

export function ProtectedRoute({ requiredPermission }: ProtectedRouteProps) {
  const currentUser = useAppStore((state) => state.currentUser);
  const location = useLocation();

  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredPermission) {
    const hasPermission = currentUser.permissions.includes('all') || currentUser.permissions.includes(requiredPermission);
    if (!hasPermission) {
      return (
        <div className="p-8 text-center">
          <h2 className="text-2xl font-bold text-slate-800">Acceso Denegado</h2>
          <p className="text-slate-600 mt-2">No tienes permiso para ver esta página.</p>
        </div>
      );
    }
  }

  return <Outlet />;
}
