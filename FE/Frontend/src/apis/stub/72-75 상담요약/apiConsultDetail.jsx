import axios from "axios";
const apiUrl = import.meta.env.API_URL;

export const fetchConsultDetail = async (consultId) => {
  if (!consultId) {
    console.error("Invalid consultId:", consultId); // Consult ID가 없을 때 로그 출력
    throw new Error("Invalid consultId");
  }

  const token = localStorage.getItem("USER_TOKEN");
  console.log("Fetching consult detail with ID:", consultId); // 요청 전 consultId 로그 출력

  try {
    const response = await axios.get(
      `${apiUrl}/v1/consults/teachers/${consultId}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
      }
    );
    console.log("API 요청 성공:", response.data); // 요청 성공 시 데이터 로그 출력
    return response.data;
  } catch (error) {
    console.error("API 요청 실패:", error.response || error.message); // 실패 시 에러 로그 출력
    throw error;
  }
};
