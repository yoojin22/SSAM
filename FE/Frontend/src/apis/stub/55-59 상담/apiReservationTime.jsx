// src/apis/stub/55-59 상담/apiReservationTime.jsx

import axios from "axios";
import { fetchApiUserInitial } from "../20-22 사용자정보/apiStubUserInitial";
const apiUrl = import.meta.env.API_URL;

export const fetchSetTime = async (startTime, endTime) => {
  const token = localStorage.getItem("USER_TOKEN");
  const { userId } = await fetchApiUserInitial();

  console.log("Request body:", { topic: "ATTITUDE", startTime, endTime });
  console.log("Authorization token:", token);

  const response = await axios.post(
    `${apiUrl}/v1/consults/${userId}`,
    {
      topic: "ATTITUDE",
      startTime: startTime,
      endTime: endTime,
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`,
      },
    }
  );
  return response.data;
};

// 상담 시간을 다시 신청 가능 상태로 변경하는 함수
export const fetchClearTime = async (appointmentId) => {
  const token = localStorage.getItem("USER_TOKEN");

  const response = await axios.put(
    `${apiUrl}/v1/consults/${appointmentId}`, // URL에 appointmentId 포함
    {}, // PUT 요청의 body가 필요하지 않다면 빈 객체를 전달
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`,
      },
    }
  );
  return response.data;
};
