import { NavLink } from "react-router-dom";
import styles from "./TeacherSelect.module.scss";
import classroom from "../../../assets/classroom.png";
import question from "../../../assets/question.png";
import appointment from "../../../assets/appointment.png";

const TeacherSelect = () => {
  return (
    <div className={styles.menuArray}>
      <div className={styles.menuBoxArray}>
        <NavLink
          to="/teacherclassroom"
          className={`${styles.menuBox} ${styles.menuBox1}`}
        >
          <div className={styles.menuTxt}>
            <h1>학급 정보</h1>
            <h3>우리 학급을 보여줍니다</h3>
            <div className={styles.imgArray}>
              <img
                src={classroom}
                className={styles.classroomImg}
                alt="classroom"
              />
            </div>
          </div>
        </NavLink>
        <NavLink
          to="/teacherquestion"
          className={`${styles.menuBox} ${styles.menuBox2}`}
        >
          <div className={styles.menuTxt}>
            <h1>문의 사항</h1>
            <h3>문의 사항을 남겨주세요</h3>
            <div className={styles.imgArray}>
              <img
                src={question}
                className={styles.questionImg}
                alt="question"
              />
            </div>
          </div>
        </NavLink>
        <NavLink
          to="/teacherreservationmanagement"
          className={`${styles.menuBox} ${styles.menuBox3}`}
        >
          <div className={styles.menuTxt}>
            <h1>상담 예약</h1>
            <h3>상담 시간을 예약하세요</h3>
            <div className={styles.imgArray}>
              <img
                src={appointment}
                className={styles.appointmentImg}
                alt="appointment"
              />
            </div>
          </div>
        </NavLink>
      </div>

    </div>
  );
};

export default TeacherSelect;
