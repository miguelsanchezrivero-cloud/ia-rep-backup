import { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import type { Permission, User } from '../types';
import { Shield, User as UserIcon, Check } from 'lucide-react';

const ALL_PERMISSIONS: { id: Permission; label: string }[] = [
  { id: 'all', label: 'Acceso Total' },
  { id: 'view_dashboard', label: 'Ver Dashboard' },
  { id: 'view_governance', label: 'Ver Gobernanza' },
  { id: 'view_avatars', label: 'Ver Avatares' },
  { id: 'view_products', label: 'Ver Productos' },
  { id: 'view_campaigns', label: 'Ver Campañas' },
  { id: 'view_crm', label: 'Ver CRM' },
  { id: 'view_analytics', label: 'Ver Analítica' },
  { id: 'view_credits', label: 'Ver Créditos' },
  { id: 'view_academy', label: 'Ver Academia' },
  { id: 'view_territory', label: 'Ver Territorio' },
  { id: 'view_visit', label: 'Ver Visitas' },
  { id: 'view_campaign_test', label: 'Ver Pruebas de Campaña' },
  { id: 'view_settings', label: 'Ver Configuración' },
  { id: 'manage_users', label: 'Gestionar Usuarios' },
];

export function Users() {
  const users = useAppStore((state) => state.users);
  const updateUserPermissions = useAppStore((state) => state.updateUserPermissions);
  const currentUser = useAppStore((state) => state.currentUser);

  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const handleTogglePermission = (permission: Permission) => {
    if (!selectedUser) return;

    let newPermissions = [...selectedUser.permissions];
    if (newPermissions.includes(permission)) {
      newPermissions = newPermissions.filter((p) => p !== permission);
    } else {
      newPermissions.push(permission);
    }

    // Special logic for 'all' permission
    if (permission === 'all' && newPermissions.includes('all')) {
      newPermissions = ['all'];
    } else if (permission !== 'all' && newPermissions.includes('all')) {
      newPermissions = newPermissions.filter((p) => p !== 'all');
    }

    updateUserPermissions(selectedUser.id, newPermissions);
    setSelectedUser({ ...selectedUser, permissions: newPermissions });
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Gestión de Usuarios</h1>
        <p className="text-slate-500 mt-1">Administra los permisos de acceso para los usuarios del sistema.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* User List */}
        <div className="col-span-1 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-slate-50">
            <h2 className="font-semibold text-slate-800 flex items-center gap-2">
              <UserIcon className="w-5 h-5 text-indigo-500" />
              Usuarios
            </h2>
          </div>
          <div className="divide-y divide-slate-100">
            {users.map((user) => (
              <button
                key={user.id}
                onClick={() => setSelectedUser(user)}
                className={`w-full text-left p-4 hover:bg-slate-50 transition-colors ${
                  selectedUser?.id === user.id ? 'bg-indigo-50/50 border-l-4 border-indigo-500' : 'border-l-4 border-transparent'
                }`}
              >
                <div className="font-medium text-slate-900">{user.name} {user.id === currentUser?.id ? '(Tú)' : ''}</div>
                <div className="text-sm text-slate-500">{user.email}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Permissions Panel */}
        <div className="col-span-1 md:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          {selectedUser ? (
            <>
              <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
                <h2 className="font-semibold text-slate-800 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-indigo-500" />
                  Permisos: {selectedUser.name}
                </h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {ALL_PERMISSIONS.map(({ id, label }) => {
                    const hasPermission = selectedUser.permissions.includes('all') || selectedUser.permissions.includes(id);
                    const isAllSelected = selectedUser.permissions.includes('all');
                    const isReadOnly = isAllSelected && id !== 'all';

                    return (
                      <label
                        key={id}
                        className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                          hasPermission ? 'bg-indigo-50 border-indigo-200' : 'border-slate-200 hover:bg-slate-50'
                        } ${isReadOnly ? 'opacity-60 cursor-not-allowed' : ''}`}
                      >
                        <div className="relative flex items-center pt-1">
                          <input
                            type="checkbox"
                            className="sr-only"
                            checked={hasPermission}
                            disabled={isReadOnly}
                            onChange={() => handleTogglePermission(id)}
                          />
                          <div
                            className={`w-5 h-5 rounded border flex items-center justify-center ${
                              hasPermission ? 'bg-indigo-600 border-indigo-600' : 'border-slate-300 bg-white'
                            }`}
                          >
                            {hasPermission && <Check className="w-3.5 h-3.5 text-white" />}
                          </div>
                        </div>
                        <div>
                          <p className={`font-medium ${hasPermission ? 'text-indigo-900' : 'text-slate-700'}`}>
                            {label}
                          </p>
                          <p className="text-xs text-slate-500 mt-0.5">
                            {id === 'all' ? 'Concede acceso total al sistema' : `Permite acceso a ${label.replace('Ver ', '').replace('Gestionar ', '')}`}
                          </p>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-12 text-slate-400">
              <Shield className="w-16 h-16 mb-4 text-slate-200" />
              <p className="text-lg">Selecciona un usuario para gestionar sus permisos</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
