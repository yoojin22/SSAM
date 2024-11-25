import { create } from "zustand";
import axios from "axios";
import { fetchApiUserInitial } from "../apis/stub/20-22 사용자정보/apiStubUserInitial";

const apiUrl = import.meta.env.API_URL;

export const AppointmentStatus = {
  APPLY: "APPLY",
  ACCEPTED: "ACCEPTED",
  DONE: "DONE",
  CANCEL: "CANCEL",
  REJECT: "REJECT",
};

export const AppointmentTopic = {
  FRIEND: "FRIEND",
  BULLYING: "BULLYING",
  SCORE: "SCORE",
  CAREER: "CAREER",
  ATTITUDE: "ATTITUDE",
  OTHER: "OTHER",
};

const useTeacherCalendarStore = create((set) => ({
  consultations: [
    { time: "14:00 ~ 14:20", status: null },
    { time: "14:30 ~ 14:50", status: null },
    { time: "15:00 ~ 15:20", status: null },
    { time: "15:30 ~ 15:50", status: null },
    { time: "16:00 ~ 16:20", status: null },
    { time: "16:30 ~ 16:50", status: null },
    { time: "17:00 ~ 17:20", status: null },
  ],
  currentDate: new Date().toISOString().split("T")[0], // 현재 날짜 추가
  setConsultations: (consultations) => set({ consultations }),
  setSelectedTopic: (topic) => set({ selectedTopic: topic }),
  setCurrentDate: (date) => set({ currentDate: date }),
  // 상담 가능 상태
  isAvailable: (status) =>
    status === null || status === AppointmentStatus.CANCEL,

  fetchReservations: async () => {
    try {
      const token = localStorage.getItem("USER_TOKEN");
      const { teacherId } = await fetchApiUserInitial();
      const response = await axios.get(`${apiUrl}/v1/consults/${teacherId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });
      console.log("Received reservations:", response.data);

      set((state) => {
        console.log("Current consultations:", state.consultations);
        console.log("Current date:", state.currentDate);

        // 예약 정보를 시간과 appointment_id로 정렬
        const sortedReservations = response.data.sort((a, b) => {
          if (a.startTime === b.startTime) {
            return b.appointmentId - a.appointmentId; // appointment_id가 큰 것이 최신
          }
          return new Date(b.startTime) - new Date(a.startTime);
        });

        const updatedConsultations = state.consultations.map((consultation) => {
          const [startTime, endTime] = consultation.time.split(" ~ ");
          // 동일한 시간대의 예약 중 첫 번째(최신) 항목 찾기
          const matchingReservation = sortedReservations.find((reservation) => {
            const reservationDate = reservation.startTime.split("T")[0];
            const reservationStartTime = reservation.startTime
              .split("T")[1]
              .substring(0, 5);
            const reservationEndTime = reservation.endTime
              .split("T")[1]
              .substring(0, 5);
            return (
              reservationDate === state.currentDate &&
              reservationStartTime === startTime &&
              reservationEndTime === endTime
            );
          });

          console.log(`Consultation time: ${consultation.time}`);
          console.log(`Matching reservation:`, matchingReservation);

          const updatedConsultation = {
            ...consultation,
            appointmentId: matchingReservation
              ? matchingReservation.appointmentId
              : null,
            status: matchingReservation ? matchingReservation.status : null,
            topic: matchingReservation ? matchingReservation.topic : null,
            description: matchingReservation
              ? matchingReservation.description
              : null,
            studentId: matchingReservation
              ? matchingReservation.studentId
              : null,
          };

          console.log(`Updated consultation:`, updatedConsultation);
          return updatedConsultation;
        });

        console.log("Updated consultations:", updatedConsultations);
        return { consultations: updatedConsultations };
      });
    } catch (error) {
      console.error("Failed to fetch reservations:", error);
    }
  },
}));

export default useTeacherCalendarStore;
