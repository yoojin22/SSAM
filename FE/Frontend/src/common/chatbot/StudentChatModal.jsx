import { useState } from "react";
import styles from "./StudentChatModal.module.scss";
import { fetchChatbotResponse } from "../../apis/stub/78-80 챗봇/apiStudentChatBot";

const StudentChatModal = ({ closeModal }) => {
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState([]);

  const handleKeyDown = async (event) => {
    if (event.key === "Enter" && inputText.trim()) {
      // 사용자가 입력한 메시지를 UI에 추가
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: inputText, sentByUser: true },
      ]);

      try {
        // API로 메시지를 전송하고 응답을 받아옴
        const response = await fetchChatbotResponse(inputText);

        if (response && response.content) {
          // 서버 응답을 받은 후 처리 (응답 메시지를 화면에 추가)
          setMessages((prevMessages) => [
            ...prevMessages,
            { text: response.content, sentByUser: false }, // 서버로부터 받은 답변 추가
          ]);
        }
      } catch (error) {
        // 에러 처리 부분 제거됨
        console.log("에러그만");
      }

      // 입력 필드 초기화
      setInputText("");
    }
  };

  return (
    <div className={styles.modalContent}>
      <div className={styles.topArray}>
        <h4>SSAM 문의하기</h4>
      </div>
      <hr />
      <div className={styles.chatArray}>
        <div className={styles.chatContent}>
          {messages.map((message, index) => (
            <div
              key={index}
              className={`${styles.message} ${
                message.sentByUser ? styles.sent : styles.received
              }`}
            >
              {message.text}
            </div>
          ))}
        </div>
        <input
          type="text"
          className={`${styles.textInput}`}
          placeholder="채팅을 입력하세요"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>
    </div>
  );
};

export default StudentChatModal;
