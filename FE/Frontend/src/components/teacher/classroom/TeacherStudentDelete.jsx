import styles from "./TeacherStudentDelete.module.scss";

const TeacherRejectModal = ({ onClose, onReject }) => {
  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modalContent}>
        <div className={styles.headerArray}>
          <h2>학생 삭제</h2>
        </div>
        <div className={styles.content}>
          <p>학생을 삭제하시겠습니까?</p>
        </div>
        <div>
          <button className={styles.rejectButton} onClick={onReject}>
            삭제
          </button>
          <button className={styles.cancelButton} onClick={onClose}>
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeacherRejectModal;
