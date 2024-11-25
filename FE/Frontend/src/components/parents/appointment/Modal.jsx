import PropTypes from "prop-types";
import styles from "./Modal.module.scss";

const Modal = ({ show, onClose }) => {
  if (!show) {
    return null;
  }

  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modalContent}>
        <h3>예약되었습니다.</h3>
        <div className={styles.buttonContainer}>
          <button
            className={`${styles.button} ${styles.reservationButton}`}
            onClick={onClose}
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
};

Modal.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default Modal;
