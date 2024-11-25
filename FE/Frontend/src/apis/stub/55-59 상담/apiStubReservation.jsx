//src/apis/stub/55-59 상담/apiStubReservation.jsx
// 데이터 요청
import axios from "axios";
import { fetchApiUserInitial } from "../20-22 사용자정보/apiStubUserInitial";
const apiUrl = import.meta.env.API_URL;

// 선생님 - 상담확인
export const fetchApiReservationList = async () => {
  const token = localStorage.getItem("USER_TOKEN");
  const { teacherId } = await fetchApiUserInitial();
  const response = await axios.get(`${apiUrl}/v1/consults/${teacherId}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
  });
  console.log("상담확인", response.data);
  return response.data; // 응답 데이터 반환
};

// 학생 - 상담신청
export const fetchApiRequestReservation = async (
  topic,
  description,
  startTime,
  endTime
) => {
  const token = localStorage.getItem("USER_TOKEN");
  const { teacherId } = await fetchApiUserInitial();
  console.log("Sending reservation request:", {
    topic,
    description,
    startTime,
    endTime,
  });
  const response = await axios.post(
    `${apiUrl}/v1/consults/${teacherId}`,
    {
      topic,
      description,
      // ISO 8601 형식 ("YYYY-MM-DDTHH:mm:ss")
      startTime,
      endTime,
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`,
      },
    }
  );
  return response.data; // 응답 데이터 반환
};

// 선생님, 학생 - 상담 취소
export const fetchApiCancelReservation = async (appointmentId) => {
  const token = localStorage.getItem("USER_TOKEN");
  const response = await axios.put(
    `${apiUrl}/v1/consults/${appointmentId}`,
    {},
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    }
  );
  return response.data;
};

// 선생님 - 상담 승인
export const fetchApiApproveReservation = async (appointmentId) => {
  const token = localStorage.getItem("USER_TOKEN");
  const response = await axios.put(
    `${apiUrl}/v1/consults/${appointmentId}/approve`,
    {},
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    }
  );
  return response.data;
};
