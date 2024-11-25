// apiBanner.jsx
import axios from "axios";
import { fetchApiUserInitial } from "../20-22 사용자정보/apiStubUserInitial";
const apiUrl = import.meta.env.API_URL;

export const updateClassImage = async (bannerImage) => {
  const token = localStorage.getItem("USER_TOKEN");
  const { boardId } = await fetchApiUserInitial();

  console.log("Token:", token);
  console.log("Board ID:", boardId);
  console.log("Banner Image File:", bannerImage); // 파일 객체가 제대로 전달되는지 확인

  // FormData 객체 생성
  const formData = new FormData();
  formData.append("bannerImage", bannerImage);

  // FormData 확인
  for (let [key, value] of formData.entries()) {
    console.log(`${key}:`, value);
  }

  try {
    // PUT 요청 보내기
    const response = await axios.put(
      `${apiUrl}/v1/classrooms/teachers/banner-img/${boardId}`,
      formData, // FormData를 전송
      {
        headers: {
          Authorization: `${token}`,
        },
      }
    );

    console.log("Response Data:", response.data); // 응답 데이터 확인
    return response.data;
  } catch (error) {
    console.error("Failed to upload image:", error);
    throw error;
  }
};
