import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// api
import axios from "axios";
import { fetchApiUserInitial } from "../../../apis/stub/20-22 사용자정보/apiStubUserInitial";
// import { fetchApiReservationList } from "../../../apis/stub/55-59 상담/apiStubReservation";
import { fetchApiReservationSummary } from "../../../apis/stub/72-75 상담요약/apiStubReservationSummary";
const apiUrl = import.meta.env.API_URL;
// style, modal
import styles from "./EnterCode.module.scss";
import ClassEnterModal from "./ClassEnterModal";

const EnterCode = () => {
  const [isClassModalOpen, setIsClassModalOpen] = useState(false);
  const [boardId, setBoardId] = useState(null);
  const [profileData, setProfileData] = useState({
    name: "",
    school: "",
  });
  const [classroomData, setClassroomData] = useState({
    grade: "",
    classroom: "",
  });
  const [hasAcceptedConsultation, setHasAcceptedConsultation] = useState(false);
  const [acceptedTeacherName, setAcceptedTeacherName] = useState("");
  const [consultationDate, setConsultationDate] = useState("");
  const [consultationTime, setConsultationTime] = useState("");
  const [consultAccessCode, setCosultAccessCode] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await fetchApiUserInitial();
        setBoardId(userData.boardId);
        setProfileData({
          name: userData.name,
          school: userData.school,
        });

        if (userData.boardId) {
          const classroomResponse = await axios.get(
            `${apiUrl}/v1/classrooms/${userData.boardId}`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: localStorage.getItem("USER_TOKEN"),
              },
            }
          );
          setClassroomData({
            grade: classroomResponse.data.grade,
            classroom: classroomResponse.data.classroom,
          });
        }

        // 상담 정보 가져오기
        const acceptedConsultation = await fetchApiReservationSummary();

        if (acceptedConsultation && acceptedConsultation.accessCode) {
          setHasAcceptedConsultation(true);
          setCosultAccessCode(acceptedConsultation.accessCode);
          // 상담 시간 처리
          const startTime = new Date(acceptedConsultation.startTime);
          const endTime = new Date(acceptedConsultation.endTime);

          // 날짜 포맷팅
          const formattedDate = `${
            startTime.getMonth() + 1
          }월 ${startTime.getDate()}일`;
          setConsultationDate(formattedDate);

          // 시간 포맷팅
          const formattedTime = `${String(startTime.getHours()).padStart(
            2,
            "0"
          )}:${String(startTime.getMinutes()).padStart(2, "0")} ~ ${String(
            endTime.getHours()
          ).padStart(2, "0")}:${String(endTime.getMinutes()).padStart(2, "0")}`;
          setConsultationTime(formattedTime);
        } else {
          setHasAcceptedConsultation(false);
          setAcceptedTeacherName("");
          setConsultationDate("");
          setConsultationTime("");
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };
    fetchData();
  }, []);

  const toggleClassModal = () => {
    setIsClassModalOpen(!isClassModalOpen);
  };

  const handleConsultationStart = () => {
    navigate(`/entry/${consultAccessCode}`);
  };

  return (
    <div className={styles.EnterArray}>
      <div className={styles.welcomeBox}>
        <h3>
          {profileData.name} 님<br /> 환영합니다!
        </h3>
      </div>

      {!boardId ? (
        <div className={styles.codeBox}>
          <h3>
            선생님께 받은
            <br /> 초대코드로
            <br /> 학급을 등록하세요.
          </h3>
          <button className={styles.classBtn} onClick={toggleClassModal}>
            초대코드 입력하기
          </button>
          {isClassModalOpen && <ClassEnterModal />}
        </div>
      ) : (
        <div className={styles.codeBox}>
          {profileData.school && <h3>{profileData.school}</h3>}
          {classroomData.grade && classroomData.classroom && (
            <h3>
              {classroomData.grade}학년 {classroomData.classroom}반
            </h3>
          )}
        </div>
      )}

      <div className={styles.codeBox}>
        <h3>
          {hasAcceptedConsultation ? (
            <>
              예정된 상담
              <br />
              <span style={{ color: "orange" }}>{consultationDate}</span>
              <br />
              <span style={{ color: "orange" }}>{consultationTime}</span>
            </>
          ) : (
            "상담이 없습니다"
          )}
        </h3>
        {hasAcceptedConsultation && (
          <button className={styles.classBtn} onClick={handleConsultationStart}>
            상담 시작하기
          </button>
        )}
      </div>
    </div>
  );
};

export default EnterCode;
