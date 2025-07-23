import { NavLink } from 'react-router-dom';
import { Camera, Folder, Settings, User } from 'lucide-react';

export default function BottomNavBar() {
  const linkClasses = (isActive: boolean) =>
    `flex flex-col items-center justify-center flex-1 py-2 ${
      isActive ? 'text-blue-500 font-semibold' : 'text-gray-500'
    }`;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-md z-50">
      <ul className="flex justify-around">
        <li>
          <NavLink
            to="/camera"
            className={({ isActive }) => linkClasses(isActive)}
          >
            <Camera className="w-6 h-6 mb-1" />
            <span className="text-xs">Cámara</span>
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/history"
            className={({ isActive }) => linkClasses(isActive)}
          >
            <Folder className="w-6 h-6 mb-1" />
            <span className="text-xs">Historial</span>
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/settings"
            className={({ isActive }) => linkClasses(isActive)}
          >
            <Settings className="w-6 h-6 mb-1" />
            <span className="text-xs">Ajustes</span>
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/user"
            className={({ isActive }) => linkClasses(isActive)}
          >
            <User className="w-6 h-6 mb-1" />
            <span className="text-xs">Usuario</span>
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}
