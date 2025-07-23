import React from 'react';
import { NavLink } from 'react-router-dom';
import { Bell, Folder, UserPlus } from 'lucide-react';

export default function SidebarMenu() {
  const linkClasses = (isActive: boolean) =>
    `flex items-center space-x-2 px-4 py-2 rounded hover:bg-gray-200 ${
      isActive ? 'bg-gray-300 font-semibold' : ''
    }`;

  return (
    <nav className="w-48 h-full bg-gray-50 border-r">
      <ul className="mt-4">
        <li>
          <NavLink
            to="/camera"
            className={({ isActive }) => linkClasses(isActive)}
          >
            <Bell className="w-5 h-5" />
            <span>Cámara</span>
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/history"
            className={({ isActive }) => linkClasses(isActive)}
          >
            <Folder className="w-5 h-5" />
            <span>Historial</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/register" className={({ isActive }) => linkClasses(isActive)}>
            <UserPlus className="w-5 h-5" />
            <span>Registrar</span>
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}
