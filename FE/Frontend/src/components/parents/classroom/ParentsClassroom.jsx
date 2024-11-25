import axios from "axios";
import { useState, useEffect } from "react";
import styles from "./ParentsClassroom.module.scss";
import ClassImage from "../../../assets/background.png";
import LoadingSpinner from "../../../common/ModernLoading"; // 로딩 스피너 컴포넌트 임포트
import { fetchApiUserInitial } from "../../../apis/stub/20-22 사용자정보/apiStubUserInitial";
import { fetchQuestionList } from "../../../apis/stub/28-31 문의사항/apiOnlyQuestion";
import { fetchStudentData } from "../../../apis/stub/35-43 학급/apiStubStudents";
import DefaultStudentImage from "../../../assets/student.png"; // 기본 이미지 경로

const ParentsClassroom = () => {
  const [banner, setBanner] = useState(""); // 학급 배너
  const [notice, setNotice] = useState(""); // 알림 사항
  const [questions, setQuestions] = useState([]); // 문의사항 데이터 추가
  const [students, setStudents] = useState([]); // 학생 데이터 추가
  const [uploadedImageUrl, setUploadedImageUrl] = useState(null); // 업로드된 이미지 URL
  const [isImageLoading, setIsImageLoading] = useState(true); // 이미지 로딩 상태
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

        const classData = response.data;
        setBanner(classData.banner);
        setNotice(classData.notice);
        setUploadedImageUrl(classData.bannerImg); // 배너 이미지 URL 설정
        setIsImageLoading(false); // 이미지 로딩 완료 상태로 설정

        const questionResponse = await fetchQuestionList(); // 문의사항 데이터 가져오기
        setQuestions(questionResponse.slice(0, 3)); // 문의사항 데이터 최대 3개 가져오기

        const studentData = await fetchStudentData(); // 학생 데이터 가져오기
        setStudents(studentData.students || []); // 데이터를 설정, students 필드에서 가져옴
      } catch (error) {
        console.error("데이터 불러오기 실패", error);
        setIsImageLoading(false); // 오류 발생 시 로딩 상태 해제
      }
    };
    classInfoData();
  }, []);

  return (
    <div className={styles.classInfoContainer}>
      <div className={styles.imageContainer}>
        {isImageLoading ? (
          <LoadingSpinner />
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
          <p>{notice}</p>
        </div>
        <div className={styles.classInfoBox}>
          <h2>학급 사항</h2>
          <p>{banner}</p>
        </div>
        <div className={styles.inquiryBox}>
          <h2>문의사항</h2>
          {questions.length > 0 ? (
            questions.map((question, index) => (
              <div
                key={index} // 고유한 key 설정
                className={styles.inquiryItem}
                onClick={() =>
                  (window.location.href =
                    "https://i11e201.p.ssafy.io/studentquestion")
                }
              >
                <div className={styles.inquiryQuestion}>{question.content}</div>
              </div>
            ))
          ) : (
            <p>아직 질문이 없습니다</p>
          )}
        </div>
      </div>
      <div className={styles.studentList}>
        {students.length > 0 ? (
          students.map((student) => (
            <div className={styles.studentItem} key={student.studentId}>
              <div className={styles.studentPhoto}>
                <img
                  src={student.profileImage || DefaultStudentImage}
                  alt={student.name}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = DefaultStudentImage;
                  }}
                />
              </div>
              <div className={styles.studentName}>{student.name}</div>
            </div>
          ))
        ) : (
          <p>학생 정보가 없습니다</p>
        )}
      </div>
    </div>
  );
};

export default ParentsClassroom;
