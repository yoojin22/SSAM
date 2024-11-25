import { useState, useEffect } from "react";
import styles from "./TeacherStudent.module.scss";
import { fetchStudentData } from "../../../apis/stub/35-43 학급/apiStubStudents";
import { fetchStudentDetail } from "../../../apis/stub/47-49 학생관리/apiStudentDetail";
import DefaultStudentImage from "../../../assets/student.png";

const TeacherStudent = ({ onSelectStudent }) => {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const loadStudents = async () => {
      try {
        const data = await fetchStudentData();
        setStudents(data.students);
        console.log(data.students); // 학생 데이터를 콘솔에 출력
      } catch (error) {
        console.error("학생 데이터를 불러오는 데 실패했습니다.", error);
      }
    };

    loadStudents();
  }, []);

  const handleStudentClick = async (studentId) => {
    console.log("Selected Student ID:", studentId); // 콘솔에 studentId 출력 근데 배열로 받아짐
    try {
      const studentDetail = await fetchStudentDetail(studentId);
      onSelectStudent(studentDetail);
    } catch (error) {
      console.error("학생 상세 정보를 불러오는 데 실패했습니다.", error);
    }
  };

  return (
    <div className={styles.studentList}>
      {students.map((student) => (
        <div
          className={styles.studentItem}
          key={student.studentId}
          onClick={() => handleStudentClick(student.studentId)}
        >
          <div className={styles.studentPhoto}>
            <img src={student.profileImage || DefaultStudentImage} alt="학생" />
          </div>
          <div className={styles.studentName}>{student.name}</div>
        </div>
      ))}
    </div>
  );
};

export default TeacherStudent;
