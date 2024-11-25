import { useState } from "react";
import { NavLink } from "react-router-dom";
import TeacherCalendar from "./TeacherCalendar";
import TeacherReservationList from "./TeacherReservationList";
// import { useApiStubReservationInfo } from "../../../apis/stub/54-57 상담/apiStubReservation";
import styles from "./TeacherReservationManagement.module.scss";

const TeacherReservationManagement = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [availableCount, setAvailableCount] = useState(0);

  // 선택된 날짜를 설정하는 함수
  const handleDateSelect = (date) => {
    setSelectedDate(new Date(date));
  };

  // 사용 가능한 상담 횟수를 설정하는 함수
  const handleAvailableCountChange = (count) => {
    setAvailableCount(count);
  };

  return (
    <div>
      <nav className={styles.container}>
        <NavLink
          to="/teacherreservationmanagement"
          className={({ isActive }) =>
            isActive ? `${styles.navItem} ${styles.active}` : styles.navItem
          }
        >
          예약 관리
        </NavLink>
        <NavLink
          to="/teacherconsultationlist"
          className={({ isActive }) =>
            isActive ? `${styles.navItem} ${styles.active}` : styles.navItem
          }
        >
          상담 목록
        </NavLink>
      </nav>
      <section className={styles.classNavbar}>
        <TeacherCalendar
          onDateSelect={handleDateSelect}
          availableCount={availableCount}
        />
        <TeacherReservationList
          selectedDate={selectedDate}
          onAvailableCountChange={handleAvailableCountChange}
        />
      </section>
    </div>
  );
};

export default TeacherReservationManagement;
