import { useState, useEffect } from "react";
import { FaTrash, FaEdit, FaSave } from "react-icons/fa";
import { useQuestions } from "../../../store/QuestionStore";
import TeacherDeleteModal from "./TeacherDeleteModal";
import styles from "./TeacherQuestion.module.scss";
import LoadingSpinner from "../../../common/ModernLoading";

const TeacherQuestion = () => {
  const { questions, updateQuestion, deleteQuestion, loading } = useQuestions();
  const [editingQuestionId, setEditingQuestionId] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [questionToDelete, setQuestionToDelete] = useState(null);
  const [newAnswer, setNewAnswer] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("USER_TOKEN");
    if (!token) {
      console.error("컴포넌트 : No token found, redirecting to login...");
      return;
    }
  }, []);

  const handleEditClick = (questionId, currentAnswer) => {
    setEditingQuestionId(questionId);
    setNewAnswer(currentAnswer || "");
  };

  const handleSaveClick = async (questionId) => {
    try {
      await updateQuestion(questionId, newAnswer);
      setEditingQuestionId(null);
      setNewAnswer("");
    } catch (error) {
      console.error("Failed to update question:", error);
    }
  };

  const handleDeleteClick = (questionId) => {
    setIsDeleteModalOpen(true);
    setQuestionToDelete(questionId);
  };

  const handleDeleteModalConfirm = async () => {
    try {
      await deleteQuestion(questionToDelete);
      setIsDeleteModalOpen(false);
      setQuestionToDelete(null);
    } catch (error) {
      console.error("Failed to delete question:", error);
    }
  };

  const handleDeleteModalCancel = () => {
    setIsDeleteModalOpen(false);
    setQuestionToDelete(null);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return dateString.split("T")[0];
  };

  // 로딩 상태 처리 수정
  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <LoadingSpinner />
      </div>
    );
  }

  // 질문이 없을 때 처리
  if (questions.length === 0) {
    return <div className={styles.noQuestions}>질문이 없습니다.</div>;
  }

  return (
    <div className={styles.teacherQuestionContainer}>
      {/* 헤더 추가 */}
      <div className={styles.header}>
        <h2>
          다른 사용자의 <span className={styles.highlight}>익명성</span>을
          유지하기 위해 질문자의 실명은{" "}
          <span className={styles.highlight}>교사</span>에게만 표시됩니다.
        </h2>
      </div>

      {questions.map((item) => (
        <div key={item.questionId} className={styles.qaPair}>
          <div className={styles.boxContainer}>
            <div className={styles.questionBox}>
              <div className={styles.authorAndDate}>
                <p className={styles.author}>{item.studentName}</p>
                <p className={styles.date}>{formatDate(item.contentDate)}</p>
              </div>
              <p className={styles.question}>{item.content}</p>
              <FaTrash
                className={styles.iconTrash}
                onClick={() => handleDeleteClick(item.questionId)}
              />
            </div>
            <div className={`${styles.answerBox}`}>
              {editingQuestionId === item.questionId ? (
                <>
                  <input
                    type="text"
                    value={newAnswer}
                    onChange={(e) => setNewAnswer(e.target.value)}
                    className={styles.inputField}
                    placeholder="답변을 입력하세요"
                  />
                  <FaSave
                    className={styles.icon}
                    onClick={() => handleSaveClick(item.questionId)}
                  />
                </>
              ) : (
                <>
                  <div className={styles.authorAndDate}>
                    <p className={styles.author}>선생님</p>
                    <p className={styles.date}>{formatDate(item.answerDate)}</p>
                  </div>
                  <p className={styles.answer}>
                    {item.answer ? item.answer : ""}
                  </p>
                  <FaEdit
                    className={styles.icon}
                    onClick={() =>
                      handleEditClick(item.questionId, item.answer)
                    }
                  />
                </>
              )}
            </div>
          </div>
        </div>
      ))}
      {isDeleteModalOpen && (
        <TeacherDeleteModal
          onConfirm={handleDeleteModalConfirm}
          onCancel={handleDeleteModalCancel}
        />
      )}
    </div>
  );
};

export default TeacherQuestion;
