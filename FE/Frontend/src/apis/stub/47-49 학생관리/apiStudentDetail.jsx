// src/apis/stub/47-49 학생관리/apiStudentDetail.jsx
import axios from "axios";
const apiUrl = import.meta.env.API_URL;

export const fetchStudentDetail = async (studentId) => {
  const token = localStorage.getItem("USER_TOKEN");
  const response = await axios
    .get(`${apiUrl}/v1/classrooms/teachers/students/${studentId}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`,
      },
    })
    .then(console.log(studentId));
  console.log(response);
  return response.data;
};
