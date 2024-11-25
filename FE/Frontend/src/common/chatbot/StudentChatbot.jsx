import { useState } from "react";
import styles from "./Chatbot.module.scss";
import chatbotImg from "../../assets/chatbot.png";
import StudentChatModal from "./StudentChatModal"; // StudentChatModal만 사용

const StudentChatbot = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const toggleModalVisibility = () => {
    setIsModalVisible(!isModalVisible); // 클릭 시 모달의 가시성 토글
  };

  return (
    <div className={styles.FieldArray}>
      <img
        src={chatbotImg}
        className={styles.ChatbotImg}
        onClick={toggleModalVisibility}
      />
      {isModalVisible && (
        <StudentChatModal
          isVisible={isModalVisible}
          closeModal={() => setIsModalVisible(false)} // 채팅 모달 닫기
        />
      )}
    </div>
  );
};

export default StudentChatbot;
