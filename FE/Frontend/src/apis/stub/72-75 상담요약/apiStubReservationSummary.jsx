// 데이터 요청
import axios from "axios";
const apiUrl = import.meta.env.API_URL;

export const fetchApiReservationSummary = async () => {
  const token = localStorage.getItem("USER_TOKEN");
  const response = await axios.get(`${apiUrl}/v1/consults/check`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
  });
  console.log("비디오 토큰", response.data);
  return {
    consultId: response.data.consultId,
    accessCode: response.data.accessCode,
    startTime: response.data.startTime,
    endTime: response.data.endTime,
    studentName: response.data.studentName,
  };
};
