import { Navigate } from "react-router-dom";
import { useAppSelector } from "../../store/hooks";
import { ReactNode } from "react";
import { Spin } from "antd";

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, loading } = useAppSelector((state) => state.auth);
  
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <Spin size="large" />
      </div>
    );
  }
  
  if (!isAuthenticated) {
    console.log("user is not authenticated");
    return <Navigate to="/" replace />;
  }
  return children;
};

export default ProtectedRoute;
