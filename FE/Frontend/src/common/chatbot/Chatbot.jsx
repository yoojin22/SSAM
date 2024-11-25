import { useState } from "react";
import styles from "./Chatbot.module.scss";
import chatbotImg from "../../assets/chatbot.png";
import ChatbotStudyModal from "./ChatbotStudyModal";
import ChatbotChatModal from "./ChatbotChatModal";

const Chatbot = () => {
  const [isBoxVisible, setIsBoxVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const toggleBoxVisibility = () => {
    setIsBoxVisible(!isBoxVisible);
    if (isBoxVisible) setIsModalVisible(false);
  };

  return (
    <div className={styles.FieldArray}>
      <img
        src={chatbotImg}
        className={styles.ChatbotImg}
        onClick={toggleBoxVisibility}
      />
      {isBoxVisible && (
        <ChatbotStudyModal
          isBoxVisible={isBoxVisible}
          openModal={() => setIsModalVisible(true)} // 채팅 모달 열기
        />
      )}
      {isModalVisible && (
        <ChatbotChatModal
          isVisible={isModalVisible}
          closeModal={() => setIsModalVisible(false)} // 채팅 모달 닫기
        />
      )}
    </div>
  );
};

export default Chatbot;
