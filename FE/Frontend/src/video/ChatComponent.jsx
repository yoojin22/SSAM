import { useRef, useEffect, useState } from "react";
import styles from "./Video.module.scss";

const ChatComponent = ({ session, profileData }) => {
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  useEffect(() => {
    if (session) {
      session.on("signal:chat", (event) => {
        const data = JSON.parse(event.data);
        setChatMessages((prevMessages) => [
          ...prevMessages,
          {
            ...data,
            from:
              data.connectionId === session.connection.connectionId
                ? data.from // 본인 메시지의 경우 원래 이름 유지
                : "상대방", // 다른 사람의 메시지는 '상대방'으로 표시
          },
        ]);
      });
    }
  }, [session]);

  const sendChatMessage = () => {
    if (chatInput.trim() !== "" && session) {
      const messageData = {
        message: chatInput,
        from: profileData.name,
        connectionId: session.connection.connectionId,
      };
      session.signal({
        data: JSON.stringify(messageData),
        type: "chat",
      });
      setChatInput("");
    }
  };

  return (
    <div className={styles.right}>
      <div className={styles.chatingArray}>
        <div className={styles.chatContainer}>
          <div className={styles.chating} ref={chatContainerRef}>
            {chatMessages.map((msg, index) => (
              <div
                key={index}
                className={`${styles.chatMessage} ${
                  msg.connectionId === session.connection.connectionId
                    ? styles.ownMessage
                    : styles.otherMessage
                }`}
              >
                <strong>
                  {msg.connectionId === session.connection.connectionId
                    ? profileData.name
                    : "상대방"}{" "}
                  :{" "}
                </strong>
                {msg.message}
              </div>
            ))}
          </div>
          <input
            type="text"
            value={chatInput}
            className={styles.chatForm}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && sendChatMessage()}
            placeholder="채팅을 입력해주세요"
          />
        </div>
      </div>
    </div>
  );
};

export default ChatComponent;
