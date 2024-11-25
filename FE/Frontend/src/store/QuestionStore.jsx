import { createContext, useState, useContext, useEffect } from "react";
import PropTypes from "prop-types";
import {
  fetchQuestionData,
  fetchCreateQuestionData,
  fetchUpdateQuestionData,
  fetchDeleteQuestionData,
} from "../apis/stub/28-31 문의사항/apiStubQuestion";
import { fetchApiUserInitial } from "../apis/stub/20-22 사용자정보/apiStubUserInitial";

const QuestionStore = createContext();

export const useQuestions = () => useContext(QuestionStore);

export const QuestionProvider = ({ children }) => {
  // Context를 통해 넘겨주기 위해 상태관리해야함
  const [questions, setQuestions] = useState([]);
  const [boardId, setBoardId] = useState(null);
  const [loading, setLoading] = useState(true); // 로딩 상태 추가
  const token = localStorage.getItem("USER_TOKEN");

  const fetchQuestions = async () => {
    setLoading(true); // 로딩 시작
    try {
      const { boardId } = await fetchApiUserInitial();
      if (!boardId) {
        throw new Error("Failed to get boardId from fetchApiUserInitial");
      }
      setBoardId(boardId);
      const data = await fetchQuestionData(boardId);
      // 날짜를 기준으로 내림차순 정렬
      const sortedData = Array.isArray(data)
        ? data.sort((a, b) => new Date(b.contentDate) - new Date(a.contentDate))
        : [data];
      setQuestions(sortedData);
    } catch (error) {
      console.error("Failed to fetch question data:", error);
    } finally {
      setLoading(false); // 로딩 종료
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [token]); // token을 종속성 배열에 추가

  const addQuestion = async (newContent) => {
    try {
      const newQuestion = await fetchCreateQuestionData(newContent);
      setQuestions([newQuestion, ...questions]); // 새 질문을 배열의 맨 앞에 추가
    } catch (error) {
      console.error("Failed to create question:", error);
    }
  };

  const updateQuestion = async (questionId, updatedAnswer) => {
    try {
      const updatedQuestion = await fetchUpdateQuestionData(
        questionId,
        updatedAnswer
      );
      // 로컬 상태 업데이트
      setQuestions(
        questions
          .map((question) =>
            question.questionId === questionId ? updatedQuestion : question
          )
          .sort((a, b) => new Date(b.contentDate) - new Date(a.contentDate)) // 업데이트 후 재정렬
      );
    } catch (error) {
      console.error("Failed to update question:", error);
    }
  };

  const deleteQuestion = async (questionId) => {
    try {
      await fetchDeleteQuestionData(questionId);
      setQuestions(
        questions.filter((question) => question.questionId !== questionId)
      );
    } catch (error) {
      console.error("Failed to delete question:", error);
    }
  };

  return (
    <QuestionStore.Provider
      value={{
        questions,
        boardId,
        loading,
        addQuestion,
        updateQuestion,
        deleteQuestion,
      }}
    >
      {children}
    </QuestionStore.Provider>
  );
};

QuestionProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default QuestionProvider;
