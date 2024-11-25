// src/apis/stub/35-43 학급/apiStubStudents.jsx

import axios from "axios";
import { fetchApiUserInitial } from "../20-22 사용자정보/apiStubUserInitial";
const apiUrl = import.meta.env.API_URL;

export const fetchStudentData = async () => {
  const token = localStorage.getItem("USER_TOKEN");
  const { boardId } = await fetchApiUserInitial();
  const response = await axios.get(`${apiUrl}/v1/classrooms/${boardId}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `${token}`,
    },
  });
  return response.data;
};
