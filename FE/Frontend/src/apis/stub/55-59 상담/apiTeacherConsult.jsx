// src/apis/stub/55-59 상담/apiTeacherConsult.jsx
import axios from "axios";
import { fetchApiUserInitial } from "../20-22 사용자정보/apiStubUserInitial";

const apiUrl = import.meta.env.API_URL;

export const fetchTeacherConsult = async () => {
  const token = localStorage.getItem("USER_TOKEN");

  // teacherId를 가져오기 위해 사용자 초기 데이터를 가져옵니다
  const userInitial = await fetchApiUserInitial();
  const teacherId = userInitial.teacherId;

  const response = await axios.get(`${apiUrl}/v1/consults/${teacherId}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `${token}`,
    },
  });

  return response.data;
};
