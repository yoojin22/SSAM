import axios from "axios";
import { fetchApiUserInitial } from "../20-22 사용자정보/apiStubUserInitial";
const apiUrl = import.meta.env.API_URL;

// GET - 공통api: /classrooms/questions/{board_id}
export const fetchQuestionData = async () => {
  try {
    const token = localStorage.getItem("USER_TOKEN");
    const { boardId } = await fetchApiUserInitial();
    const response = await axios.get(
      `${apiUrl}/v1/classrooms/questions/${boardId}`,
      {
        headers: {
          "Content-Type": "application/json",
          authorization: token,
        },
      }
    );
    console.log("axios-questions-get: ", response.data);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch get question data:", error);
    throw error;
  }
};

// POST - 학생 질문 생성 api: /classrooms/answers/{board_id}
// content 상태를 받아올 방법을 생각하자. -> async의 인자로 content를 바로 넣어버림!!
export const fetchCreateQuestionData = async (content) => {
  try {
    const token = localStorage.getItem("USER_TOKEN");
    const { boardId } = await fetchApiUserInitial();
    const response = await axios.post(
      `${apiUrl}/v1/classrooms/questions/${boardId}`,
      { content }, // content를 key로 사용하고 value는 전달된 문자열로 설정
      {
        headers: {
          "Content-Type": "application/json",
          authorization: token,
        },
      }
    );
    console.log("axios-questions-post: ", response.data);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch post question data:", error);
    throw error;
  }
};

// PUT - 학생 질문 생성 api: /classrooms/answers/{qustion_id}
export const fetchUpdateQuestionData = async (questionId, answer) => {
  try {
    const token = localStorage.getItem("USER_TOKEN");
    const { boardId } = await fetchApiUserInitial();
    const response = await axios.put(
      // qustionId값이 지금 answer내용으로 들어옴
      `${apiUrl}/v1/classrooms/answers/${questionId}`,
      { answer, boardId }, // answer와 boardId를 JSON 형태로 전달
      {
        headers: {
          "Content-Type": "application/json",
          authorization: token,
        },
      }
    );
    console.log("axios-questions-put: ", response.data);
    return response.data;
  } catch (error) {
    console.error("Failed to update put question:", error);
    throw error;
  }
};

// DELETE - 공통api: /classrooms/questions/{questions_id}
export const fetchDeleteQuestionData = async (questionId) => {
  try {
    const token = localStorage.getItem("USER_TOKEN");
    const response = await axios.delete(
      `${apiUrl}/v1/classrooms/questions/${questionId}`,
      {
        headers: {
          "Content-Type": "application/json",
          authorization: token,
        },
      }
    );
    console.log("axios-questions-delete: ", response.data);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch question delete data:", error);
    throw error;
  }
};
