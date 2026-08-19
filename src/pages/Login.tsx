import { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';

export function Login() {
  const login = useAppStore((state) => state.login);
  const currentUser = useAppStore((state) => state.currentUser);
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  if (currentUser) {
    return <Navigate to={from} replace />;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = login(email);
    if (!success) {
      setError('Usuario no encontrado. Prueba admin@test.com o user@test.com');
    } else {
      navigate(from, { replace: true });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="max-w-md w-full p-8 bg-white rounded-xl shadow-lg border border-slate-200">
        <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">IA-REP Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError('');
              }}
              className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="admin@test.com"
              required
            />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button
            type="submit"
            className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors"
          >
            Acceder
          </button>
        </form>
        <div className="mt-6 text-sm text-slate-500">
          <p>Cuentas de prueba:</p>
          <ul className="list-disc pl-5 mt-2">
            <li>admin@test.com (Todos los permisos)</li>
            <li>user@test.com (Permisos parciales)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
