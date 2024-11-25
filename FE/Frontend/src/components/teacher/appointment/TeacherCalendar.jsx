import PropTypes from "prop-types";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import koLocale from "@fullcalendar/core/locales/ko";
import styles from "./TeacherCalendar.module.scss";
import { useState, useEffect, useRef } from "react";
import { fetchApiReservationList } from "../../../apis/stub/55-59 상담/apiStubReservation";

// TeacherCalendar 컴포넌트: 교사용 상담 일정 달력을 표시합니다.
const TeacherCalendar = ({ onDateSelect }) => {
  // 상태 관리
  const [selectedDate, setSelectedDate] = useState(null); // 선택된 날짜
  const [consultations, setConsultations] = useState([]); // 상담 데이터
  const calendarRef = useRef(null); // 달력 참조

  // 컴포넌트 마운트 시 상담 데이터를 가져옵니다.
  useEffect(() => {
    const fetchConsultations = async () => {
      try {
        const data = await fetchApiReservationList();
        setConsultations(data);
      } catch (error) {
        console.error("상담 정보를 가져오는데 실패했습니다:", error);
      }
    };

    fetchConsultations();
  }, []);

  // 날짜 클릭 핸들러: 선택된 날짜를 업데이트하고 부모 컴포넌트에 알립니다.
  const handleDateClick = (info) => {
    setSelectedDate(info.dateStr);
    onDateSelect(info.dateStr);
  };

  // 선택된 날짜에 스타일을 적용합니다.
  useEffect(() => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      const allCells = calendarApi.el.querySelectorAll(".fc-daygrid-day");
      allCells.forEach((cell) => {
        cell.classList.remove(styles.selectedDate);
        if (cell.dataset.date === selectedDate) {
          cell.classList.add(styles.selectedDate);
        }
      });
    }
  }, [selectedDate]);

  // 특정 날짜의 상담 수를 계산합니다.
  const getConsultationsCounts = (date) => {
    // 해당 날짜의 상담만 필터링
    const filteredConsultations = consultations.filter((consultation) => {
      const consultDate = new Date(consultation.startTime);
      consultDate.setHours(0, 0, 0, 0);
      const targetDate = new Date(date);
      targetDate.setHours(0, 0, 0, 0);
      return consultDate.getTime() === targetDate.getTime();
    });

    // APPLY, ACCEPTED, DONE 상태의 상담 수 계산
    const validStatusCount = filteredConsultations.filter((consultation) =>
      ["APPLY", "ACCEPTED", "DONE"].includes(consultation.status)
    ).length;

    // REJECT 상태의 상담 수 계산
    const rejectCount = filteredConsultations.filter(
      (consultation) => consultation.status === "REJECT"
    ).length;

    // 전체 가능 상담 수(7)에서 REJECT 수를 뺀 값
    const totalNonRejectedCount = 7 - rejectCount;

    return { validStatusCount, totalNonRejectedCount };
  };

  return (
    <div className={styles.calendarContainer}>
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        selectable={true}
        dateClick={handleDateClick}
        weekends={false}
        headerToolbar={{
          left: "prev",
          center: "title",
          right: "next",
        }}
        locale={koLocale}
        timeZone="Asia/Seoul"
        // 각 날짜 셀의 내용을 커스터마이즈합니다.
        dayCellContent={(arg) => {
          const { validStatusCount, totalNonRejectedCount } =
            getConsultationsCounts(arg.date);
          return (
            <div className={styles.dateCell}>
              <span className={styles.dayNumber}>{arg.dayNumberText}</span>
              {totalNonRejectedCount > 0 && (
                <span className={styles.additionalNumber}>
                  ({validStatusCount} / {totalNonRejectedCount})
                </span>
              )}
            </div>
          );
        }}
        fixedWeekCount={false}
        height="100%"
      />
    </div>
  );
};

// props 타입 검사
TeacherCalendar.propTypes = {
  onDateSelect: PropTypes.func.isRequired,
};

export default TeacherCalendar;
