import axios from "axios";
// 로그인은 qurystring으로 요청 보내야함.
const apiUrl = import.meta.env.API_URL;

// instance를 사용한 axios요청은 main.jsx에서 사용한 default값을 덮어씌운다.
export const axiosInstance = axios.create({
  withCredentials: true,
});

export const loginUser = (username, password) => {
  const queryString = `username=${encodeURIComponent(
    username
  )}&password=${encodeURIComponent(password)}`;
  return axiosInstance.post(`${apiUrl}/v1/auth/login?${queryString}`);
};
