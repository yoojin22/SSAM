// GET, POST
// api: /users
// 연결페이지: teacher/mypage/TeacherUpdate.jsx

import axios from "axios";
const apiUrl = import.meta.env.API_URL;

export const useProfileStore = async () => {
  const token = localStorage.getItem("USER_TOKEN");
  const response = await axios.get(`${apiUrl}/v1/users`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
  });
  return {
    profileImage: response.data.profileImage,
    name: response.data.name,
    birth: response.data.birth,
    school: response.data.school,
    username: response.data.username,
    email: response.data.email,
    selfPhone: response.data.selfPhone,
    otherPhone: response.data.otherPhone,
  };
};

export default useProfileStore;
