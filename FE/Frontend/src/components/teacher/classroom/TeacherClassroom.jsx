import axios from "axios";
import { NavLink } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faSave } from "@fortawesome/free-solid-svg-icons";
import styles from "./TeacherClassroom.module.scss";
import ClassImage from "../../../assets/resized.png";
import whiteshare from "../../../assets/whiteshare.png";
import TeacherStudent from "./TeacherStudent";
import TeacherStudentDetail from "./TeacherStudentDetail";
import { fetchApiUserInitial } from "../../../apis/stub/20-22 사용자정보/apiStubUserInitial";
import { fetchQuestionList } from "../../../apis/stub/28-31 문의사항/apiOnlyQuestion";
import { updateClassImage } from "../../../apis/stub/35-43 학급/apiBanner";
import LoadingSpinner from "../../../common/ModernLoading";

const TeacherClassroom = () => {
  const [banner, setBanner] = useState(""); // 학급 배너
  const [notice, setNotice] = useState(""); // 알림 사항
  const [isEditing, setIsEditing] = useState(false); // 공지사항 편집
  const [noticeContent, setNoticeContent] = useState(""); // 공지사항 내용
  const [classInfo, setClassInfo] = useState(""); // 배너 정보 내용
  const [isEditingInfo, setIsEditingInfo] = useState(false); // 배너 정보 편집 상태
  const [selectedStudentId, setSelectedStudentId] = useState(null); // 선택된 학생 ID
  const [uploadedImageUrl, setUploadedImageUrl] = useState(null); // 업로드된 이미지 URL
  const [isImageLoading, setIsImageLoading] = useState(true); // 이미지 로딩 상태
  const [questions, setQuestions] = useState([]); // 문의사항 데이터 추가
  const noticeTextRef = useRef(null); // 공지사항 텍스트 영역 참조
  const bannerTextRef = useRef(null); // 배너 정보 텍스트 영역 참조
  const apiUrl = import.meta.env.API_URL;

  // 학급 전체 데이터 불러오기
  useEffect(() => {
    const classInfoData = async () => {
      try {
        const token = localStorage.getItem("USER_TOKEN");
        const { boardId } = await fetchApiUserInitial();
        const response = await axios.get(`${apiUrl}/v1/classrooms/${boardId}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
          },
        });

        setBanner(response.data.banner); // 학급 배너 상태 업데이트
        setNotice(response.data.notice); // 알림 사항 상태 업데이트
        setUploadedImageUrl(response.data.bannerImg); // 배너 이미지 URL 설정
        setIsImageLoading(false); // 이미지 로딩 완료 상태로 설정

        const questionResponse = await fetchQuestionList(); // 문의사항 데이터 가져오기
        setQuestions(questionResponse.slice(0, 3)); // 문의사항 데이터 최대 3개 가져오기
        console.log("문의사항 데이터:", questionResponse); // 문의사항 데이터 콘솔 출력
      } catch (error) {
        console.error("데이터 불러오기 실패", error);
        setIsImageLoading(false); // 오류 발생 시 로딩 상태 해제
      }
    };
    classInfoData();
  }, []);

  // 공지사항 업데이트 처리 함수
  const noticeUpdate = async () => {
    try {
      const token = localStorage.getItem("USER_TOKEN");
      const { boardId } = await fetchApiUserInitial();
      await axios.put(
        `${apiUrl}/v1/classrooms/teachers/notice/${boardId}`,
        { notice: noticeContent },
        {
          headers: {
            "Content-Type": "application/json",
            authorization: `${token}`,
          },
        }
      );
      setIsEditing(false);
      location.reload();
    } catch (error) {
      console.error("Failed to save banner content:", error);
    }
  };

  // 배너 정보 업데이트 처리 함수
  const bannerUpdate = async () => {
    try {
      const token = localStorage.getItem("USER_TOKEN");
      const { boardId } = await fetchApiUserInitial();
      await axios.put(
        `${apiUrl}/v1/classrooms/teachers/banner/${boardId}`,
        { banner: classInfo },
        {
          headers: {
            "Content-Type": "application/json",
            authorization: `${token}`,
          },
        }
      );
      setIsEditingInfo(false);
      location.reload();
    } catch (error) {
      console.error("Failed to save class info:", error);
    }
  };

  // 알림 버튼 클릭 핸들러
  const noticeEditClick = () => {
    setIsEditing(true);
    setNoticeContent(notice); // 기존 공지사항을 편집할 때 편집 영역에 표시
  };

  // 공지사항 내용 변경 핸들러
  const noticeContentChange = (e) => {
    setNoticeContent(e.target.value);
  };

  // 배너 편집 클릭 핸들러
  const bannerEditInfoClick = () => {
    setIsEditingInfo(true);
    setClassInfo(banner); // 기존 배너 정보를 편집할 때 편집 영역에 표시
  };

  // 배너 변경 핸들러
  const bannerInfoChange = (e) => {
    setClassInfo(e.target.value);
  };

  // 이미지 업로드 처리 함수
  const handleImageUpload = async (e) => {
    const file = e.target.files[0]; // 선택된 파일 객체를 가져옴
    if (file) {
      try {
        setIsImageLoading(true); // 이미지 업로드 시작 시 로딩 상태로 설정
        await updateClassImage(file); // 파일 객체를 그대로 전달
        // 이미지 URL을 업로드된 이미지로 업데이트
        setUploadedImageUrl(URL.createObjectURL(file));
        setIsImageLoading(false); // 이미지 로딩 완료 상태로 설정
      } catch (error) {
        console.error("Failed to upload image:", error);
        setIsImageLoading(false); // 오류 발생 시 로딩 상태 해제
      }
    } else {
      console.error("No file selected.");
    }
  };

  return (
    <div className={styles.classInfoContainer}>
      <div className={styles.classNavbar}>
        <NavLink
          to="/teacherclassroom"
          className={`${styles.navItem} ${
            selectedStudentId === null ? styles.active : styles.altActive
          }`}
          onClick={() => setSelectedStudentId(null)}
        >
          학급 관리
        </NavLink>
        <NavLink to="/teacherauthorization" className={styles.navItem}>
          승인 관리
        </NavLink>
      </div>
      <div className={styles.imageContainer}>
        <input
          type="file"
          id="file"
          className={styles.inputFileForm}
          onChange={handleImageUpload} // 파일 선택 시 이미지 업로드
        />
        <label htmlFor="file">
          <img src={whiteshare} className={styles.inputFile} />
        </label>
        {isImageLoading ? (
          <div className={styles.loadingContainer}>
            <LoadingSpinner /> {/* 로딩 스피너 표시 */}
          </div>
        ) : (
          <img
            src={uploadedImageUrl || ClassImage} // bannerImg URL 우선 적용
            alt="Class Management"
            className={styles.classImage}
          />
        )}
      </div>
      <div className={styles.infoBoxes}>
        <div className={styles.noticeBox}>
          <h2>알림 사항</h2>
          {isEditing ? (
            <FontAwesomeIcon
              icon={faSave}
              onClick={noticeUpdate}
              className={styles.editIcon}
            />
          ) : (
            <FontAwesomeIcon
              icon={faEdit}
              onClick={noticeEditClick}
              className={styles.editIcon}
            />
          )}
          {isEditing ? (
            <div className={styles.editBox}>
              <textarea
                ref={noticeTextRef}
                value={noticeContent}
                onChange={noticeContentChange}
                className={styles.editTextarea}
              />
            </div>
          ) : (
            <p>{notice}</p>
          )}
        </div>

        <div className={styles.classInfoBox}>
          <h2>학급 사항</h2>
          {isEditingInfo ? (
            <FontAwesomeIcon
              icon={faSave}
              onClick={bannerUpdate}
              className={styles.editIcon}
            />
          ) : (
            <FontAwesomeIcon
              icon={faEdit}
              onClick={bannerEditInfoClick}
              className={styles.editIcon}
            />
          )}
          {isEditingInfo ? (
            <div className={styles.editBox}>
              <textarea
                ref={bannerTextRef}
                value={classInfo}
                onChange={bannerInfoChange}
                className={styles.editTextarea}
              />
            </div>
          ) : (
            <p>{banner}</p>
          )}
        </div>

        <div className={styles.inquiryBox}>
          <h2>문의사항</h2>
          {questions.length > 0 ? (
            questions.map((question, index) => (
              <div
                key={index}
                className={styles.inquiryItem}
                onClick={() =>
                  (window.location.href =
                    "https://i11e201.p.ssafy.io/teacherquestion")
                }
              >
                <div className={styles.inquiryQuestion}>
                  ❗ {question.content}
                </div>
              </div>
            ))
          ) : (
            <p>아직 질문이 없습니다</p>
          )}
        </div>
      </div>
      {selectedStudentId === null ? (
        <TeacherStudent onSelectStudent={setSelectedStudentId} />
      ) : (
        <TeacherStudentDetail
          studentId={selectedStudentId}
          onBack={() => setSelectedStudentId(null)}
        />
      )}
    </div>
  );
};

export default TeacherClassroom;
