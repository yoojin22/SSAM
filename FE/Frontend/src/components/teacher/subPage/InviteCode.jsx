import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// api
import axios from "axios";
import { fetchApiUserInitial } from "../../../apis/stub/20-22 사용자정보/apiStubUserInitial";
// import { fetchApiReservationList } from "../../../apis/stub/55-59 상담/apiStubReservation";
import { fetchApiReservationSummary } from "../../../apis/stub/72-75 상담요약/apiStubReservationSummary";
const apiUrl = import.meta.env.API_URL; // API URL 가져오기
// style, modal, icon
import styles from "./InviteCode.module.scss";
import ClassProduceModal from "./ClassProduceModal";
import Swal from "sweetalert2";
import { FiCopy } from "react-icons/fi";
import { FiCheck } from "react-icons/fi";

const InviteCode = () => {
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태를 관리
  const [classInfo, setClassInfo] = useState(null); // 클래스 정보 상태 관리
  const [isCopied, setIsCopied] = useState(false); // 복사 상태를 관리
  const [hasAcceptedConsultation, setHasAcceptedConsultation] = useState(false); // 수락된 상담 여부 상태 관리
  const [acceptedStudentName, setAcceptedStudentName] = useState(""); // 상담자 이름
  const [consultationTime, setConsultationTime] = useState(""); // 상담 예정 시간
  const [consultAccessCode, setCosultAccessCode] = useState("");

  // 상담 목록 가져오기
  const fetchConsultations = async () => {
    const acceptedConsultation = await fetchApiReservationSummary();
    console.log(acceptedConsultation);
    // const acceptedConsultation = data.find(
    //   (consultation) => consultation.status === "ACCEPTED"
    // );

    if (acceptedConsultation && acceptedConsultation.accessCode) {
      setHasAcceptedConsultation(true);
      setAcceptedStudentName(acceptedConsultation.studentName);
      setCosultAccessCode(acceptedConsultation.accessCode);
      // 상담 시간 처리
      const startTime = new Date(acceptedConsultation.startTime);
      const endTime = new Date(acceptedConsultation.endTime);
      const formattedTime = `${startTime.getHours()}:${String(
        startTime.getMinutes()
      ).padStart(2, "0")} ~ ${endTime.getHours()}:${String(
        endTime.getMinutes()
      ).padStart(2, "0")}`;
      setConsultationTime(formattedTime);
    } else {
      setHasAcceptedConsultation(false);
      setAcceptedStudentName("");
      setConsultationTime("");
    }
  };

  useEffect(() => {
    fetchConsultations();
  }, []);

  // 모달 토글 함수
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const navigate = useNavigate(); // useNavigate 훅을 사용해 navigate 정의

  const handleConsultationStart = () => {
    navigate(`/video/${consultAccessCode}`);
  };

  // 사용자 프로필 정보를 불러오는 훅
  const useProfile = () => {
    const [profileData, setProfileData] = useState({
      name: "",
    });

    useEffect(() => {
      const fetchData = async () => {
        const token = localStorage.getItem("USER_TOKEN");
        try {
          const response = await axios.get(`${apiUrl}/v1/users`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: token,
            },
          });
          setProfileData({
            name: response.data.name,
          });
        } catch (error) {
          console.error("데이터를 가져오지 못했습니다:", error);
        }
      };
      fetchData();
    }, []);

    return profileData;
  };

  const profile = useProfile();

  // 클래스 정보를 불러오는 효과
  useEffect(() => {
    const fetchClassInfo = async () => {
      try {
        const token = localStorage.getItem("USER_TOKEN");
        const { boardId } = await fetchApiUserInitial();
        const response = await axios.get(`${apiUrl}/v1/classrooms/${boardId}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        });
        setClassInfo(response.data);
      } catch (error) {
        console.error("클래스 정보를 가져오지 못했습니다:", error);
      }
    };
    fetchClassInfo();
  }, []);

  // 클래스 정보 업데이트 함수
  const updateClassInfo = async () => {
    const { boardId } = await fetchApiUserInitial();
    const token = localStorage.getItem("USER_TOKEN");
    const response = await axios.get(`${apiUrl}/v1/classrooms/${boardId}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });
    setClassInfo(response.data);
  };

  // 클래스 삭제 함수
  const classDelete = async () => {
    const token = localStorage.getItem("USER_TOKEN");
    const { boardId } = await fetchApiUserInitial();
    const result = await Swal.fire({
      title: "정말 삭제하시겠습니까?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`${apiUrl}/v1/classrooms/teachers/${boardId}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        });
        Swal.fire({
          title: "삭제됨!",
          text: "학급이 삭제되었습니다.",
          icon: "success",
        });
        setClassInfo(null);
      } catch (error) {
        console.error("학급 삭제 실패:", error);
        Swal.fire({
          title: "삭제 실패",
          text: "학급 삭제에 실패했습니다.",
          icon: "error",
        });
      }
    }
  };

  // PIN 코드 재발급 함수
  const rePin = async () => {
    const token = localStorage.getItem("USER_TOKEN");
    const { boardId } = await fetchApiUserInitial();
    await axios.put(
      `${apiUrl}/v1/classrooms/teachers/pin/${boardId}`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      }
    );
    Swal.fire("PIN이 재발급되었습니다").then((isConfirm) => {
      if (isConfirm) {
        updateClassInfo();
      }
    });
  };

  // 클립보드로 복사하는 함수
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 3000);
    });
  };

  return (
    <div className={styles.inviteArray}>
      <div className={styles.welcomeBox}>
        <h3>
          {profile.name} 선생님
          <br /> 환영합니다!
        </h3>
      </div>

      {/* Scheduled Consultation Section */}
      <div className={styles.codeBox}>
        <h3>
          {hasAcceptedConsultation ? (
            <>
              <span style={{ marginBottom: "10px", display: "inline-block" }}>
                예정된 상담
              </span>
              <br />
              <span style={{ color: "orange" }}>{consultationTime}</span>
              <br />
              <span style={{ color: "orange" }}>{acceptedStudentName} </span>
              학생/학부모
            </>
          ) : (
            "상담이 없습니다."
          )}
        </h3>
        {hasAcceptedConsultation && (
          <button className={styles.classBtn} onClick={handleConsultationStart}>
            <p>상담 시작하기</p>
          </button>
        )}
      </div>

      {/* Invite Code Section */}
      <div className={styles.coreBox}>
        {classInfo && classInfo.pin ? (
          <>
            <div className={styles.copyButton}>
              <span>
                <h3>초대 코드</h3>
              </span>
              <button onClick={() => copyToClipboard(classInfo.pin)}>
                <span>{classInfo.pin} </span>
                {isCopied ? (
                  <>
                    <FiCheck /> 성공!
                  </>
                ) : (
                  <>
                    <FiCopy /> 복사
                  </>
                )}
              </button>
            </div>
            <div className={styles.btnArray}>
              <button className={styles.pinBtn} onClick={rePin}>
                PIN 재발급
              </button>
              <button className={styles.deleteBtn} onClick={classDelete}>
                학급 삭제
              </button>
            </div>
          </>
        ) : (
          <>
            <h5 className={styles.classOpen}>
              학급 만들기를 통해 <br />
              초대코드를 생성하세요.
            </h5>
            <button className={styles.classBtn} onClick={toggleModal}>
              학급 생성
            </button>
          </>
        )}
        {isModalOpen && <ClassProduceModal onClassCreated={updateClassInfo} />}
      </div>
    </div>
  );
};

export default InviteCode;
