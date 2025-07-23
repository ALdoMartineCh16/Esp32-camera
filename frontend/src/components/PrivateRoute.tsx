import { Navigate } from 'react-router-dom';

type Props = {
  isAuthenticated: boolean;
  children: React.ReactNode;
};

export default function PrivateRoute({ isAuthenticated, children }: Props) {
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}
