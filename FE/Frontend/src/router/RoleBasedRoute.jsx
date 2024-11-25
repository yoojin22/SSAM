// RoleBasedRoute.jsx
import { Navigate, Outlet } from "react-router-dom";
import PropTypes from "prop-types";
import useUserInitialStore from "../store/UserInitialStore";
import { useEffect, useState } from "react";
import { fetchApiUserInitial } from "../apis/stub/20-22 사용자정보/apiStubUserInitial";

const RoleBasedRoute = ({ allowedRoles }) => {
  const { userInitialData, setUserInitialData } = useUserInitialStore(
    (state) => ({
      userInitialData: state.userInitialData,
      setUserInitialData: state.setUserInitialData,
    })
  );

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserData = async () => {
      if (!userInitialData) {
        try {
          const data = await fetchApiUserInitial();
          setUserInitialData(data);
        } catch (error) {
          console.error("Failed to fetch user data:", error);
        }
      }
      setLoading(false);
    };

    loadUserData();
  }, [userInitialData, setUserInitialData]);

  if (loading) {
    return <div></div>;
  }

  return userInitialData && allowedRoles.includes(userInitialData.role) ? (
    <Outlet />
  ) : (
    <Navigate to="/" replace />
  );
};

RoleBasedRoute.propTypes = {
  allowedRoles: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default RoleBasedRoute;
