import { Routes, Route, useLocation } from "react-router-dom";
import MainPage from "../components/mainPage/MainPage";
import Chatbot from "../common/chatbot/Chatbot.jsx";
import StudentChatbot from "../common/chatbot/StudentChatbot.jsx"; // 학생용 챗봇 추가
import SubNavbar from "../common/navigation/SubNavbar.jsx";
import MainNavbar from "../common/navigation/MainNavbar.jsx";
import Video from "../video/Video.jsx";
import STT from "../video/STT.jsx";
import VideoSTT from "../video/Video-STT.jsx";
import OAuthResponse from "../common/OAuthResponse.jsx";

// Teacher components
import TeacherJoin from "../components/teacher/join/TeacherJoin";
import TeacherLogin from "../components/teacher/login/TeacherLogin";
import TeacherUpdate from "../components/teacher/myPage/TeacherUpdate";
import TeacherSubpage from "../components/teacher/subPage/TeacherSubpage";
import TeacherPasswordChange from "../components/teacher/myPage/TeacherPasswordChange";
import TeacherQuestion from "../components/teacher/question/TeacherQuestion";
import TeacherReservationManagement from "../components/teacher/appointment/TeacherReservationManagement";
import TeacherConsultationList from "../components/teacher/appointment/TeacherConsultationList";
import TeacherClassroom from "../components/teacher/classroom/TeacherClassroom";
import TeacherAuthorization from "../components/teacher/classroom/TeacherAuthorization";
import TeacherStudentDetail from "../components/teacher/classroom/TeacherStudentDetail";

// Parents components
import ParentsJoin from "../components/parents/join/ParentsJoin";
import ParentsLogin from "../components/parents/login/ParentsLogin";
import ParentsUpdate from "../components/parents/myPage/ParentsUpdate";
import ParentsSubpage from "../components/parents/subPage/ParentsSubpage";
import ParentsPasswordChange from "../components/parents/myPage/ParentsPasswordChange";
import ParentsQuestion from "../components/parents/question/ParentsQuestion";
import ParentsClassroom from "../components/parents/classroom/ParentsClassroom";
import ParentsReservationPage from "../components/parents/appointment/ParentsReservationPage";

// Layout component
import QuestionProviderLayout from "./layouts/QuestionProviderLayout.jsx";
import ConsultationProviderLayout from "./layouts/ConsultationProviderLayout";

// Webrtc components
import WebrtcPage from "../webrtc/react-webrtc-component";

// Import the HOC
import RoleBasedRoute from "./RoleBasedRoute.jsx";

import VideoEntry from "../video/VideoEntry.jsx"; // 상담 참가 입장 화면
import useUserInitialStore from "../store/UserInitialStore"; // 사용자 데이터 가져오기 위한 hook

const AppRouter = () => {
  const location = useLocation();
  const { userInitialData } = useUserInitialStore((state) => ({
    userInitialData: state.userInitialData,
  }));

  const hideChatbotOnRoutes = [
    "/",
    "/teacherlogin",
    "/teacherjoin",
    "/studentlogin",
    "/studentjoin",
    "/video/123456",
  ];
  const showChatbot = !hideChatbotOnRoutes.includes(location.pathname);

  const hideNavbarOnRoutes = ["/video/123456"];
  const showNavbar = !hideNavbarOnRoutes.includes(location.pathname);

  return (
    <div>
      {showNavbar && (
        <div className="navbarArray">
          <MainNavbar />
          <SubNavbar />
        </div>
      )}
      <div>
        <Routes>
          {/* 로그인 없이 이용 가능한 페이지 */}
          <Route path="/" element={<MainPage />} />
          <Route path="/teacherlogin" element={<TeacherLogin />} />
          <Route path="/teacherjoin" element={<TeacherJoin />} />
          <Route path="/studentlogin" element={<ParentsLogin />} />
          <Route path="/studentjoin" element={<ParentsJoin />} />
          <Route
            path="/auth/oauth-response/:token"
            element={<OAuthResponse />}
          />

          {/* 선생님 */}
          <Route element={<RoleBasedRoute allowedRoles={["TEACHER"]} />}>
            <Route path="/teachersubpage" element={<TeacherSubpage />} />
            <Route path="/teacherupdate" element={<TeacherUpdate />} />
            <Route
              path="/teacherpasswordchange"
              element={<TeacherPasswordChange />}
            />
            <Route
              path="/teacherauthorization"
              element={<TeacherAuthorization />}
            />
            <Route
              path="/teacherreservationmanagement"
              element={<TeacherReservationManagement />}
            />

            <Route
              path="/teacherclassroom/student"
              element={<TeacherStudentDetail />}
            />
            <Route path="/teacherclassroom" element={<TeacherClassroom />} />
          </Route>

          {/* 선생님 layouts */}
          <Route element={<QuestionProviderLayout />}>
            <Route element={<RoleBasedRoute allowedRoles={["TEACHER"]} />}>
              <Route path="/teacherquestion" element={<TeacherQuestion />} />
            </Route>
          </Route>
          <Route element={<ConsultationProviderLayout />}>
            <Route
              path="/teacherconsultationlist"
              element={<TeacherConsultationList />}
            />
          </Route>

          {/* 학생 / 학부모 */}
          <Route element={<RoleBasedRoute allowedRoles={["STUDENT"]} />}>
            <Route path="/studentsubpage" element={<ParentsSubpage />} />
            <Route path="/studentupdate" element={<ParentsUpdate />} />
            <Route
              path="/studentpasswordchange"
              element={<ParentsPasswordChange />}
            />
            <Route path="/studentclassroom" element={<ParentsClassroom />} />
            <Route
              path="/studentreservationmanagement"
              element={<ParentsReservationPage />}
            />
          </Route>

          {/* 학생 / 학부모 layouts */}
          <Route element={<QuestionProviderLayout />}>
            <Route element={<RoleBasedRoute allowedRoles={["STUDENT"]} />}>
              <Route path="/studentquestion" element={<ParentsQuestion />} />
            </Route>
          </Route>

          {/* Video Route */}
          <Route path="/video/:accessCode" element={<Video />} />

          <Route path="/stt" element={<STT />} />
          <Route path="/video-stt/:accessCode" element={<VideoSTT />} />
          {/* WebRTC Route */}
          <Route path="/webrtc" element={<WebrtcPage />} />

          {/* VideoEntry Route */}
          <Route path="/entry/:accessCode" element={<VideoEntry />} />
        </Routes>
      </div>

      {/* Chatbot */}
      {showChatbot && userInitialData && (
        <>
          {userInitialData.role === "TEACHER" && <Chatbot />}
          {userInitialData.role === "STUDENT" && <StudentChatbot />}
        </>
      )}
    </div>
  );
};

export default AppRouter;
