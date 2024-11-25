// src/apis/stub/47-49 학생관리/apiStudentDelete.jsx
import axios from "axios";
const apiUrl = import.meta.env.API_URL;

export const fetchStudentDelete = async (studentId) => {
  const token = localStorage.getItem("USER_TOKEN");
  const response = await axios.delete(
    `${apiUrl}/v1/classrooms/teachers/students/${studentId}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`,
      },
    }
  );
  return response.data;
};
