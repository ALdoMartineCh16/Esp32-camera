type Props = {
  onLogout: () => void;
  username: string;
};

export default function UserPage({ onLogout, username }: Props) {
  return (
    <div className="p-4 pt-6">
      <h1 className="text-xl font-bold mb-4">Perfil de Usuario</h1>
      <p className="mb-6 text-gray-700">Usuario: <strong>{username}</strong></p>

      <button
        onClick={onLogout}
        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
      >
        Cerrar sesión
      </button>
    </div>
  );
}
