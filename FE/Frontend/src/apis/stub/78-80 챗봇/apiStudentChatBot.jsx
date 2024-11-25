import axios from "axios";
const apiUrl = import.meta.env.API_URL;

export const fetchChatbotResponse = async (userMessage) => {
  const token = localStorage.getItem("USER_TOKEN");

  try {
    console.log("주소는 여기로 보냄:", `${apiUrl}/v1/chatbots/questions`);
    console.log("보내는 메시지:", userMessage);

    // GET 요청에서 쿼리 파라미터를 사용하여 데이터 전송
    const response = await axios({
      method: "get",
      url: `${apiUrl}/v1/chatbots/questions`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`,
      },
      params: { question: userMessage }, // 'question' 쿼리 파라미터로 메시지를 전송
    });

    console.log("받아와줘:", response.data);
    return response.data;
  } catch (error) {
    console.error("요청 실패:", error);
    if (error.response) {
      console.error("응답 데이터:", error.response.data);
      console.error("응답 상태 코드:", error.response.status);
      console.error("응답 헤더:", error.response.headers);
    }
    throw error;
  }
};
