import { createContext, useState, useContext, useEffect } from "react";
import {
  fetchApiReservationList,
  fetchApiCancelReservation,
  fetchApiApproveReservation,
} from "../apis/stub/55-59 상담/apiStubReservation";

const ConsultationContext = createContext();

export const useConsultation = () => useContext(ConsultationContext);

export const ConsultationProvider = ({ children }) => {
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchConsultations();
  }, []);

  // 상담 목록 가져오기
  const fetchConsultations = async () => {
    try {
      setLoading(true);
      const data = await fetchApiReservationList();

      // 시작 시간과 예약 ID로 정렬
      const sortedData = data.sort((a, b) => {
        if (a.startTime === b.startTime) {
          // 같은 시간대일 경우 예약 ID를 내림차순으로 정렬 (최신 항목이 먼저)
          return b.appointmentId - a.appointmentId;
        }
        // 시간대가 다를 경우 시작 시간으로 오름차순 정렬
        return new Date(a.startTime) - new Date(b.startTime);
      });

      // 시간대별로 그룹화하고 각 시간대의 최신 항목 선택
      const latestConsultations = sortedData.reduce((acc, current) => {
        const timeSlot = current.startTime;
        if (
          !acc[timeSlot] ||
          current.appointmentId > acc[timeSlot].appointmentId
        ) {
          acc[timeSlot] = current;
        }
        return acc;
      }, {});

      // 객체를 다시 배열로 변환하고 시작 시간으로 재정렬
      const finalConsultations = Object.values(latestConsultations).sort(
        (a, b) => new Date(a.startTime) - new Date(b.startTime)
      );

      setConsultations(finalConsultations);
      setError(null);
    } catch (err) {
      console.error("상담 목록을 가져오는데 실패했습니다:", err);
      setError("상담 목록을 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 승인
  const approveConsultation = async (appointmentId) => {
    try {
      await fetchApiApproveReservation(appointmentId);
      setConsultations(
        consultations.map((c) =>
          c.appointmentId === appointmentId ? { ...c, status: "ACCEPTED" } : c
        )
      );
    } catch (err) {
      console.error("Failed to approve consultation:", err);
      setError("상담 승인에 실패했습니다.");
    }
  };

  // 취소
  const cancelConsultation = async (appointmentId) => {
    try {
      await fetchApiCancelReservation(appointmentId);
      setConsultations(
        consultations.map((c) =>
          c.appointmentId === appointmentId ? { ...c, status: "CANCEL" } : c
        )
      );
    } catch (err) {
      console.error("Failed to cancel consultation:", err);
      setError("상담 취소에 실패했습니다.");
    }
  };

  // 정렬 함수 추가
  const sortConsultations = (field, order) => {
    const sortedConsultations = [...consultations].sort((a, b) => {
      if (order === "asc") {
        return new Date(a[field]) - new Date(b[field]);
      } else {
        return new Date(b[field]) - new Date(a[field]);
      }
    });
    setConsultations(sortedConsultations);
  };

  return (
    <ConsultationContext.Provider
      value={{
        consultations,
        loading,
        error,
        approveConsultation,
        cancelConsultation,
        refreshConsultations: fetchConsultations,
        sortConsultations, // 정렬 함수 추가
      }}
    >
      {children}
    </ConsultationContext.Provider>
  );
};
