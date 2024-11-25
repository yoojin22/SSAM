import { useState } from "react";
import PropTypes from "prop-types";
import styles from "./ConsultationCancelModal.module.scss";

const ConsultationCancelModal = ({ onClose, onCancel }) => {
  const [isCancelled, setIsCancelled] = useState(false);

  const handleCancel = () => {
    setIsCancelled(true);
    onCancel();
  };

  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modalContent}>
        <div className={styles.headerArray}>
          <h2>상담 거절</h2>
        </div>
        <div className={styles.content}>
          <p>상담을 거절하시겠습니까?</p>
        </div>
        <div>
          <button className={styles.rejectButton} onClick={handleCancel}>
            거절
          </button>
          {!isCancelled && (
            <button className={styles.cancelButton} onClick={onClose}>
              닫기
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

ConsultationCancelModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default ConsultationCancelModal;
