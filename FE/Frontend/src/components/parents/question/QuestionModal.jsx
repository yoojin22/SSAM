import styles from "./QuestionModal.module.scss";

const QuestionModal = ({ isOpen, onClose, onSubmit, children }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        {children}
        <div className={styles.modalButtons}>
          <button className={styles.submitButton} onClick={onSubmit}>
            등록
          </button>
          <button className={styles.cancelButton} onClick={onClose}>
            취소
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuestionModal;
