import PropTypes from "prop-types";
import styles from "./ConsultationApproveModal.module.scss";

const ConsultationApproveModal = ({ onClose, onApprove }) => {
  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modalContent}>
        <div className={styles.headerArray}>
          <h2>상담 수락</h2>
        </div>
        <div className={styles.content}>
          <p>상담을 수락하시겠습니까?</p>
        </div>
        <div>
          <button className={styles.approveButton} onClick={onApprove}>
            승인
          </button>
          <button className={styles.closeButton} onClick={onClose}>
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

ConsultationApproveModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  onApprove: PropTypes.func.isRequired,
};

export default ConsultationApproveModal;
