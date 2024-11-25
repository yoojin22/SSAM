import { useState } from "react";
import axios from "axios";
import styles from "./ClassProduceModal.module.scss";
const apiUrl = import.meta.env.API_URL;

const ClassProduceModal = () => {
  const [showModal, setShowModal] = useState(true);
  const [grade, setGrade] = useState("");
  const [classroom, setClassroom] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);

  const classClose = () => {
    setShowModal(false);
  };

  const classCreate = async () => {
    try {
      const token = localStorage.getItem("USER_TOKEN");
      const response = await axios.post(
        `${apiUrl}/v1/classrooms/teachers`,
        { grade, classroom },
        {
          headers: {
            "Content-Type": "application/json",
            authorization: `${token}`,
          },
        }
      );
      console.log(response.data);
      // 성공적으로 학급이 생성되면, 확인 메시지 모달로 전환
      setShowConfirmation(true);
    } catch (error) {
      console.error("Error posting data", error);
    }
  };

  // 성공 메시지 및 재로그인 유도
  const renderConfirmationModal = () => (
    <div className={styles.modalArray}>
      <div className={styles.headerArray}>
        <p>학급 생성 완료!</p>
      </div>
      <div className={styles.reLoginTxt}>
        <p>변경 사항을 반영하기 위해</p>
        <p>재로그인 해주시길 바랍니다</p>
      </div>
      <div className={styles.buttonContainer}>
        <button
          onClick={classClose}
          className={`${styles.button} ${styles.approveButton}`}
        >
          확인
        </button>
      </div>
    </div>
  );

  if (!showModal) {
    return null;
  }

  return (
    <div className={styles.produceArray}>
      {showConfirmation ? (
        renderConfirmationModal()
      ) : (
        <div className={styles.modalArray}>
          <div className={styles.headerArray}>
            <p>우리 학급 생성하기</p>
          </div>
          <div className={styles.classInput}>
            <p>학년</p>
            <input
              type="text"
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
            />
            <p>반</p>
            <input
              type="text"
              value={classroom}
              onChange={(e) => setClassroom(e.target.value)}
            />
          </div>
          <div className={styles.buttonContainer}>
            <button
              onClick={classCreate}
              className={`${styles.button} ${styles.approveButton}`}
            >
              생성
            </button>
            <button
              onClick={classClose}
              className={`${styles.button} ${styles.cancelButton}`}
            >
              취소
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassProduceModal;
