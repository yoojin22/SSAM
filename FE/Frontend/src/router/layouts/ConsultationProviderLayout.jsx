import { Outlet } from "react-router-dom";
import { ConsultationProvider } from "../../store/ConsultationStore";

const ConsultationProviderLayout = () => {
  return (
    <ConsultationProvider>
      <Outlet />
    </ConsultationProvider>
  );
};

export default ConsultationProviderLayout;
