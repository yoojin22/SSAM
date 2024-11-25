import styles from "./TeacherRejectModal.module.scss";

const TeacherRejectModal = ({ request, onClose, onReject }) => {
  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modalContent}>
        <div className={styles.headerArray}>
          <h2>승인 거절</h2>
        </div>
        <div className={styles.content}>
          <p>
            {request.name} 학생의 요청을 <br />
            거절하시겠습니까?
          </p>
          </div>
          <div>
            <button className={styles.rejectButton} onClick={onReject}>
              거절
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
