import axios from "axios";
const apiUrl = import.meta.env.API_URL;

// 사용자의 현재 프로필 정보를 가져오는 함수
export const getProfile = async () => {
  const token = localStorage.getItem("USER_TOKEN");
  const response = await axios.get(`${apiUrl}/v1/users`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
  });
  return response.data;
};

// 사용자의 프로필 정보를 업데이트하는 함수
export const UpdateProfile = async (updatedData) => {
  const token = localStorage.getItem("USER_TOKEN");

  // FormData 객체 생성
  const formData = new FormData();

  // updatedData에서 필요한 데이터 추가
  formData.append("school", updatedData.school);
  formData.append("selfPhone", updatedData.selfPhone);
  formData.append("profileImage", updatedData.profileImage);

  // 헤더에 토큰만 포함
  const headers = {
    Authorization: token,
  };

  try {
    const response = await axios.put(`${apiUrl}/v1/users`, formData, {
      headers,
    });

    return response.data;
  } catch (error) {
    console.error("Profile update failed:", error);
    throw error;
  }
};

export default UpdateProfile;
