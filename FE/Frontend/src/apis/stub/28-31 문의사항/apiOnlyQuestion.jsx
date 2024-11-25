//src/apis/stub/28-31 문의사항/apiOnlyQuestion.jsx
import axios from "axios";
import { fetchApiUserInitial } from "../20-22 사용자정보/apiStubUserInitial";
const apiUrl = import.meta.env.API_URL;

export const fetchQuestionList = async () => {
  const token = localStorage.getItem("USER_TOKEN");
  const { boardId } = await fetchApiUserInitial();
  const response = await axios.get(
    `${apiUrl}/v1/classrooms/questions/${boardId}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`,
      },
    }
  );
  return response.data;
};
