import axios from "axios";
const apiUrl = import.meta.env.API_URL;

export const FamilyChatbot = async (content, startTime, endTime, imageFile) => {
  const token = localStorage.getItem("USER_TOKEN");

  // 폼 데이터 생성
  const formData = new FormData();
  formData.append("content", content);
  formData.append("startTime", startTime);
  formData.append("endTime", endTime);
  formData.append("image", imageFile); // 이미지 파일 추가

  // 디버깅 정보 콘솔에 출력
  console.log("폼 데이터:", content, startTime, endTime, imageFile);
  console.log(
    "폼 데이터 내용 확인:",
    formData.get("content"),
    formData.get("startTime"),
    formData.get("endTime"),
    formData.get("image")
  );

  try {
    console.log(
      "주소는 여기로 보냄:",
      `${apiUrl}/v1/chatbots/teachers/imageupload`
    );

    const response = await axios.post(
      `${apiUrl}/v1/chatbots/teachers/imageupload`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `${token}`,
        },
      }
    );

    console.log("받아온 응답:", response.data);
    return response.data;
  } catch (error) {
    if (error.response) {
      // 서버로부터의 응답이 있는 경우
      console.error("요청 실패 - 응답 데이터:", error.response.data);
      console.error("요청 실패 - 상태 코드:", error.response.status);
      console.error("요청 실패 - 헤더:", error.response.headers);
    } else if (error.request) {
      // 요청이 만들어졌지만, 응답을 받지 못한 경우
      console.error("요청 실패 - 요청 데이터:", error.request);
    } else {
      // 요청을 설정하면서 발생한 에러
      console.error("요청 실패 - 에러 메시지:", error.message);
    }
    throw error;
  }
};
