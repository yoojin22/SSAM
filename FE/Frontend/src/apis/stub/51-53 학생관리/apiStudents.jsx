import axios from "axios";
const apiUrl = import.meta.env.API_URL;

// 학생 리스트를 가져오는 API 호출 함수
export const fetchApiStudentsList = async () => {
  const token = localStorage.getItem("USER_TOKEN");
  if (!token) {
    throw new Error("No authentication token found.");
  }
  // console.log("USER_TOKEN:", token); // Add this line to log the token

  const response = await axios.get(
    `${apiUrl}/v1/classrooms/teachers/students`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`, // Bearer 없이 토큰만 전송
      },
    }
  );
  return response.data; // 응답 데이터 반환
};

// 학생 승인 API 호출 함수
export const approveStudentApi = async (studentId) => {
  const token = localStorage.getItem("USER_TOKEN");
  if (!token) {
    throw new Error("No authentication token found.");
  }
  // console.log(`Approving student with ID: ${studentId}`); // studentId 로그 출력
  // console.log("USER_TOKEN:", token); // Add this line to log the token

  const response = await axios.put(
    `${apiUrl}/v1/classrooms/teachers/students/${studentId}/approve`,
    null,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`, // Bearer 없이 토큰만 전송
      },
    }
  );
  // console.log("API 응답:", response.data); // 응답 데이터 콘솔에 출력
  return response.data;
};

// 학생 거절 API 호출 함수
export const rejectStudentApi = async (studentId) => {
  const token = localStorage.getItem("USER_TOKEN");
  if (!token) {
    throw new Error("No authentication token found.");
  }
  console.log(`Rejecting student with ID: ${studentId}`); // studentId 로그 출력
  console.log("USER_TOKEN:", token); // Add this line to log the token

  const response = await axios.put(
    `${apiUrl}/v1/classrooms/teachers/students/${studentId}/reject`,
    null,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`, // Bearer 없이 토큰만 전송
      },
    }
  );
  // console.log("API 응답:", response.data); // 응답 데이터 콘솔에 출력
  return response.data;
};
