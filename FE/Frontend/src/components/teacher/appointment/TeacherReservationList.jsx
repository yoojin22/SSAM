import { useEffect } from "react";
import PropTypes from "prop-types";
import styles from "./TeacherReservationList.module.scss";
import { FiCalendar } from "react-icons/fi";
import useReservationTimeStore from "../../../store/ReservationTimeStore";
import {
  fetchSetTime,
  fetchClearTime,
} from "../../../apis/stub/55-59 상담/apiReservationTime";
import { fetchApiReservationList } from "../../../apis/stub/55-59 상담/apiStubReservation";
import Swal from "sweetalert2";

const TeacherReservationList = ({ selectedDate }) => {
  // 날짜를 YYYY-MM-DD 형식으로 포맷팅하는 함수
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const formattedDate = formatDate(selectedDate);

  const reservations = useReservationTimeStore(
    (state) => state.reservationsByDate[formattedDate] || []
  );
  const setReservationsForDate = useReservationTimeStore(
    (state) => state.setReservationsForDate
  );
  const toggleAvailabilityForDate = useReservationTimeStore(
    (state) => state.toggleAvailabilityForDate
  );

  // 서버 및 로컬 스토리지에서 예약 상태를 불러오기
  useEffect(() => {
    const fetchReservations = async () => {
      const savedReservations = localStorage.getItem(
        `reservations_${formattedDate}`
      );
      if (savedReservations) {
        setReservationsForDate(formattedDate, JSON.parse(savedReservations));
      } else {
        const serverReservations = await fetchApiReservationList();
        const initialReservations = [
          { time: "14:00 ~ 14:20", available: true },
          { time: "14:30 ~ 14:50", available: true },
          { time: "15:00 ~ 15:20", available: true },
          { time: "15:30 ~ 15:50", available: true },
          { time: "16:00 ~ 16:20", available: true },
          { time: "16:30 ~ 16:50", available: true },
          { time: "17:00 ~ 17:20", available: true },
        ];

        serverReservations.forEach((reservation) => {
          const reservationDate = reservation.startTime.split("T")[0];
          const reservationTime = `${reservation.startTime
            .split("T")[1]
            .slice(0, 5)} ~ ${reservation.endTime.split("T")[1].slice(0, 5)}`;
          const match = initialReservations.find(
            (r) => r.time === reservationTime
          );

          if (reservationDate === formattedDate && match) {
            match.available = reservation.status !== "REJECT";
            match.appointmentId = reservation.appointmentId;
          }
        });

        setReservationsForDate(formattedDate, initialReservations);
        localStorage.setItem(
          `reservations_${formattedDate}`,
          JSON.stringify(initialReservations)
        );
      }
    };

    fetchReservations();
  }, [formattedDate, setReservationsForDate]);

  const handleReservation = async (index) => {
    const reservation = reservations[index];
    const startTime = `${formattedDate}T${reservation.time.split(" ~ ")[0]}:00`;
    const endTime = `${formattedDate}T${reservation.time.split(" ~ ")[1]}:00`;

    try {
      const response = await fetchSetTime(startTime, endTime);
      console.log("예약 성공:", response);

      toggleAvailabilityForDate(formattedDate, index);

      const updatedReservations = reservations.map((reservation, i) =>
        i === index
          ? { ...reservation, available: !reservation.available }
          : reservation
      );
      localStorage.setItem(
        `reservations_${formattedDate}`,
        JSON.stringify(updatedReservations)
      );

      // 성공 메시지 표시
      Swal.fire({
        icon: "success",
        title: "요청 성공",
        html: '<span style="color: red;">신청불가</span> 시간으로 설정되었습니다.',
      });
    } catch (error) {
      console.error("예약 실패:", error);

      // 에러 메시지 표시
      Swal.fire({
        icon: "error",
        title: "요청 실패",
        text: "상담목록을 확인해주세요.",
      });
    }
  };

  const handleClearReservation = async (index) => {
    try {
      const serverReservations = await fetchApiReservationList();
      const reservation = reservations[index];
      const reservationTime = reservation.time.split(" ~ ")[0];

      const matchingReservation = serverReservations.find((res) => {
        const reservationDate = res.startTime.split("T")[0];
        const resTime = res.startTime.split("T")[1].slice(0, 5);
        return reservationDate === formattedDate && resTime === reservationTime;
      });

      if (!matchingReservation || !matchingReservation.appointmentId) {
        console.error("Appointment ID가 없습니다.");
        Swal.fire({
          icon: "error",
          title: "요청 실패",
          text: "상담목록을 확인해주세요.",
        });
        return;
      }

      console.log("reservation찍어보기", matchingReservation);

      const response = await fetchClearTime(matchingReservation.appointmentId);
      console.log("예약 해제 성공:", response);

      toggleAvailabilityForDate(formattedDate, index);

      const updatedReservations = reservations.map((reservation, i) =>
        i === index
          ? { ...reservation, available: !reservation.available }
          : reservation
      );
      localStorage.setItem(
        `reservations_${formattedDate}`,
        JSON.stringify(updatedReservations)
      );

      // 성공 메시지 표시
      Swal.fire({
        icon: "success",
        title: "요청 성공",
        html: '<span style="color: blue;">신청가능</span> 시간으로 설정되었습니다.',
      });
    } catch (error) {
      console.error("예약 해제 실패:", error);

      // 에러 메시지 표시
      Swal.fire({
        icon: "error",
        title: "요청 실패",
        text: "상담목록을 확인해주세요.",
      });
    }
  };

  return (
    <div className={styles.consultationList}>
      <div className={styles.header}>
        <h2>{formattedDate}</h2>
        <FiCalendar className={styles.calendarIcon} />
      </div>
      <div className={styles.table}>
        <div className={styles.tableHeader}>
          <div className={styles.cellHeader}>상담 시간</div>
          <div className={styles.cellHeader}>상담 신청</div>
        </div>
        {reservations.map((reservation, index) => (
          <div className={styles.row} key={index}>
            <div className={styles.consultationBox}>
              <div className={styles.time}>{reservation.time}</div>
              <div className={styles.buttonContainer}>
                <button
                  className={
                    reservation.available
                      ? styles.available
                      : styles.unavailable
                  }
                  onClick={() => {
                    if (reservation.available) {
                      handleReservation(index);
                    } else {
                      handleClearReservation(index);
                    }
                  }}
                >
                  {reservation.available ? "신청 가능" : "신청 불가"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

TeacherReservationList.propTypes = {
  selectedDate: PropTypes.oneOfType([
    PropTypes.instanceOf(Date),
    PropTypes.string,
  ]).isRequired,
};

export default TeacherReservationList;
