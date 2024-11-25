import { useState, useEffect } from "react";
import { FaTrash, FaPen, FaPlus, FaMinus } from "react-icons/fa";
import { useQuestions } from "../../../store/QuestionStore";
import ParentsDeleteModal from "./ParentsDeleteModal";
import styles from "./ParentsQuestion.module.scss";
import { fetchApiUserInitial } from "../../../apis/stub/20-22 사용자정보/apiStubUserInitial";
import LoadingSpinner from "../../../common/ModernLoading";

const ParentsQuestion = () => {
  const { questions, addQuestion, deleteQuestion, loading } = useQuestions();
  const [userId, setUserId] = useState(null); // 사용자 ID 상태 추가
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [newQuestion, setNewQuestion] = useState("");
  const [questionToDelete, setQuestionToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isInputOpen, setIsInputOpen] = useState(false);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const { userId } = await fetchApiUserInitial();
        setUserId(userId);
      } catch (error) {
        console.error("Failed to fetch user ID:", error);
      }
    };

    fetchUserId();
  }, []);

  const handleDeleteClick = (questionId) => {
    setIsDeleteModalOpen(true);
    setQuestionToDelete(questionId);
  };

  const handleDeleteModalConfirm = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await deleteQuestion(questionToDelete);
      setIsDeleteModalOpen(false);
      setQuestionToDelete(null);
    } catch (err) {
      console.error("Failed to delete question:", err);
      setError("질문 삭제에 실패했습니다. 다시 시도해 주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteModalCancel = () => {
    setIsDeleteModalOpen(false);
    setQuestionToDelete(null);
    setError(null);
  };

  const handleNewQuestionSubmit = async () => {
    if (newQuestion.trim()) {
      setIsLoading(true);
      setError(null);
      try {
        await addQuestion(newQuestion);
        setIsInputOpen(false);
        setNewQuestion("");
      } catch (err) {
        console.error("Failed to add question:", err);
        setError("질문 추가에 실패했습니다. 다시 시도해 주세요.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return dateString.split("T")[0];
  };

  const sortedQuestions = [...questions].sort(
    (a, b) => b.questionId - a.questionId
  );

  // 로딩 상태 처리 수정
  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className={styles.parentsQuestionContainer}>
      <div className={styles.header}>
        <h2>
          다른 사용자의 <span className={styles.highlight}>익명성</span>을
          유지하기 위해 귀하의 실명은{" "}
          <span className={styles.highlight}>교사</span>에게만 표시됩니다.
        </h2>
      </div>
      <div
        className={`${styles.inquireContainer} ${
          isInputOpen ? styles.open : ""
        }`}
      >
        <div
          className={styles.iconCircle}
          onClick={() => setIsInputOpen(!isInputOpen)}
        >
          {isInputOpen ? (
            <FaMinus className={styles.icon} />
          ) : (
            <FaPlus className={styles.icon} />
          )}
        </div>
        <div className={styles.slideContainer}>
          {isInputOpen && (
            <div className={styles.inputContainer}>
              <textarea
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                placeholder="질문을 입력하세요."
                disabled={isLoading}
              />
              <button onClick={handleNewQuestionSubmit} disabled={isLoading}>
                <FaPen className={styles.icon} />
              </button>
            </div>
          )}
        </div>
      </div>
      {error && <p className={styles.errorMessage}>{error}</p>}
      {sortedQuestions.map((item) => (
        <div key={item.questionId} className={styles.qaPair}>
          <div className={styles.questionBox}>
            <div className={styles.info}>
              <div className={styles.authorAndDate}>
                <p className={styles.author}>
                  <strong>궁금이</strong>
                </p>
                <p className={styles.date}>{formatDate(item.contentDate)}</p>
              </div>
              <p className={styles.content}>{item.content}</p>
            </div>
            {userId === item.studentId && ( // userId와 studentId가 같을 때만 FaTrash 아이콘을 렌더링
              <FaTrash
                onClick={() => handleDeleteClick(item.questionId)}
                className={isLoading ? styles.disabledIcon : styles.trashicon}
              />
            )}
          </div>
          {item.answer && (
            <div className={styles.answerBox}>
              <div className={styles.info}>
                <div className={styles.authorAndDate}>
                  <p className={styles.author}>
                    <strong>선생님</strong>
                  </p>
                  <p className={styles.date}>{formatDate(item.answerDate)}</p>
                </div>
                <p className={styles.content}>{item.answer}</p>
              </div>
            </div>
          )}
        </div>
      ))}

      {isDeleteModalOpen && (
        <ParentsDeleteModal
          onConfirm={handleDeleteModalConfirm}
          onCancel={handleDeleteModalCancel}
          isLoading={isLoading}
          error={error}
        />
      )}
    </div>
  );
};

export default ParentsQuestion;
