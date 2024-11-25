import { Outlet } from "react-router-dom";
import { QuestionProvider } from "../../store/QuestionStore";

const QuestionProviderLayout = () => {
  return (
    <QuestionProvider>
      <Outlet />
    </QuestionProvider>
  );
};

export default QuestionProviderLayout;
