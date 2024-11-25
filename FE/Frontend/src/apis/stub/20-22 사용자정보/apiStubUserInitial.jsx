// 데이터 요청
// -> 데이터 저장 경로: store/UserInitialStore
import axios from "axios";
const apiUrl = import.meta.env.API_URL;

export const fetchApiUserInitial = async () => {
  const token = localStorage.getItem("USER_TOKEN");
  const response = await axios.get(`${apiUrl}/v1/users/initial`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
  });
  // console.log(response.data);
  return {
    userId: response.data.userId,
    username: response.data.username,
    name: response.data.name,
    school: response.data.school,
    boardId: response.data.boardId,
    role: response.data.role,
    teacherId: response.data.teacherId,
  };
};
