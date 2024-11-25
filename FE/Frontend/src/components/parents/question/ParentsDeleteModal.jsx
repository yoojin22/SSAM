import React from 'react';
import styles from './ParentsDeleteModal.module.scss';
import { BsExclamationTriangle } from 'react-icons/bs';

const ParentsDeleteModal = ({ onConfirm, onCancel }) => {
  return (
    <div className={styles.parentsDeleteModalOverlay} onClick={onCancel}>
      <div className={styles.parentsDeleteModalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.parentsDeleteModalHeader}>
          <BsExclamationTriangle className={styles.parentsDeleteModalIcon} />
        </div>
        <h2>질문을 삭제하시겠습니까?</h2>
        <div className={styles.parentsDeleteModalButtons}>
          <button onClick={onConfirm}>확인</button>
          <button onClick={onCancel}>취소</button>
        </div>
      </div>
    </div>
  );
};

export default ParentsDeleteModal;
