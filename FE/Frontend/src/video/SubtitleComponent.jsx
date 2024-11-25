import { useEffect, useRef, useState } from "react";
import axios from "axios";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import styles from "./Video.module.scss";

const apiUrl = import.meta.env.API_URL;

const SubtitleComponent = ({ showSubtitle, session, profileData, isMicOn }) => {
  const [sttMessages, setSTTMessages] = useState([]);
  const subtitleRef = useRef(null);
  const lastTranscriptRef = useRef("");
  const timeoutRef = useRef(null);
  const { transcript, resetTranscript, browserSupportsSpeechRecognition } =
    useSpeechRecognition();

  useEffect(() => {
    if (session && isMicOn) {
      SpeechRecognition.startListening({ continuous: true, language: "ko-KR" });
    } else {
      SpeechRecognition.stopListening();
    }
  }, [session, isMicOn]);

  useEffect(() => {
    if (subtitleRef.current) {
      subtitleRef.current.scrollTop = subtitleRef.current.scrollHeight;
    }
  }, [sttMessages]);

  useEffect(() => {
    if (transcript !== lastTranscriptRef.current) {
      lastTranscriptRef.current = transcript;

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        if (
          transcript === lastTranscriptRef.current &&
          transcript.trim() !== ""
        ) {
          sendSTTMessage(transcript);
          resetTranscript();
        }
      }, 1000);
    }
  }, [transcript]);

  const sendSTTMessage = async (text) => {
    if (text.trim() !== "" && session) {
      const messageData = {
        message: text,
        from: profileData.name,
        connectionId: session.connection.connectionId,
      };
      try {
        const response = await axios.post(`${apiUrl}/v1/profanity/check`, {
          message: text,
        });
        console.warn(response.data);
        let consecutiveOffensiveCount = 0;

        if (response.data.category === "공격발언") {
          consecutiveOffensiveCount = 1;
          console.warn("공격발언이 1회 감지되었습니다");
        }

        setSTTMessages((prevMessages) => {
          const newMessages = [...prevMessages, messageData];
          const lastFiveMessages = newMessages.slice(-5);

          if (
            prevMessages.length > 0 &&
            prevMessages[prevMessages.length - 1].category === "공격발언"
          ) {
            consecutiveOffensiveCount++;
            console.warn("공격발언이 2회 감지되었습니다");
          }

          if (consecutiveOffensiveCount >= 2) {
            console.warn("연속된 공격발언이 감지되었습니다");
            // 여기서 부모 컴포넌트에 알림을 보낼 수 있습니다.
          }

          return lastFiveMessages;
        });

        session.signal({
          data: JSON.stringify(messageData),
          type: "stt",
        });
      } catch (error) {
        console.error("비속어 확인 중 오류 발생:", error);
      }
    }
  };

  if (!browserSupportsSpeechRecognition) {
    console.warn("Browser doesn't support speech recognition.");
  }

  if (!showSubtitle) return null;

  return (
    <div className={styles.subTitleArray}>
      <div className={styles.subTitle} ref={subtitleRef}>
        {sttMessages.map((msg, index) => (
          <div key={index}>
            <strong>
              {msg.connectionId === session.connection.connectionId
                ? profileData.name === ""
                  ? "익명"
                  : profileData.name
                : "상대방"}{" "}
              :{" "}
            </strong>
            {msg.message}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubtitleComponent;
