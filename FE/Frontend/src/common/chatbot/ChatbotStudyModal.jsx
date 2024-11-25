import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styles from "./ChatbotModal.module.scss";
import book from "../../assets/bookblue.png";
import chat from "../../assets/chat.png";
import upload from "../../assets/upload.png";
import { NoticeChatbot } from "../../apis/stub/78-80 챗봇/apiTeacherChatBot";
import { FamilyChatbot } from "../../apis/stub/78-80 챗봇/apiTeacherFamilyChatBot";

const ChatbotStudyModal = ({ openModal }) => {
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  // 날짜와 시간을 서버 형식에 맞게 변환하는 함수
  const formatDateTimeForServer = (date) => {
    const yyyy = date.getFullYear();
    const MM = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    const HH = String(date.getHours()).padStart(2, "0");
    const mm = String(date.getMinutes()).padStart(2, "0");
    const ss = String(date.getSeconds()).padStart(2, "0");

    return `${yyyy}-${MM}-${dd}T${HH}:${mm}:${ss}`;
  };

  // 시작 날짜 변경 시 호출되는 함수
  const handleStartDateChange = (date) => {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0); // 자정으로 설정
    setStartDate(start);
  };

  // 종료 날짜 변경 시 호출되는 함수
  const handleEndDateChange = (date) => {
    const end = new Date(date);
    end.setHours(23, 59, 59, 999); // 하루의 끝으로 설정
    setEndDate(end);
  };

  // 엔터 키 입력 시 호출되는 함수
  const handleKeyDown = async (event) => {
    if (event.key === "Enter" && inputText.trim() && startDate && endDate) {
      try {
        let response;

        const formattedStartTime = formatDateTimeForServer(startDate);
        const formattedEndTime = formatDateTimeForServer(endDate);

        if (selectedFile) {
          response = await FamilyChatbot(
            inputText,
            formattedStartTime,
            formattedEndTime,
            selectedFile
          );
        } else {
          response = await NoticeChatbot(
            inputText,
            formattedStartTime,
            formattedEndTime
          );
        }

        setMessages((prevMessages) => [
          ...prevMessages,
          `공지사항 등록: ${response.message}`,
        ]);
      } catch (error) {
        setMessages((prevMessages) => [...prevMessages, "공지사항 등록 실패"]);
      }

      setInputText(""); // 입력 필드를 초기화
      setSelectedFile(null); // 파일 선택 필드를 초기화
    }
  };

  // 파일 선택 시 호출되는 함수
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setInputText((prevText) => `${prevText} [파일: ${file.name}]`); // inputText에 파일 이름 추가
    }
  };

  return (
    <div className={styles.modalContent}>
      <div className={styles.topArray}>
        <h4>SSAM 학습하기</h4>
      </div>
      <hr />
      <div className={styles.chatArray}>
        <div className={styles.chatContent}>
          <div className={styles.messagesContainer}>
            {messages.map((message, index) => (
              <div key={index} className={styles.message}>
                {message}
              </div>
            ))}
          </div>
          <div className={styles.datePickerContainer}>
            <DatePicker
              selected={startDate}
              onChange={handleStartDateChange}
              dateFormat="yyyy/MM/dd"
              placeholderText="시작 날짜"
              className={styles.startDatePicker}
            />
            <DatePicker
              selected={endDate}
              onChange={handleEndDateChange}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate}
              dateFormat="yyyy/MM/dd"
              placeholderText="끝나는 날짜"
              className={styles.endDatePicker}
            />
          </div>
        </div>
        <input
          id="file"
          type="file"
          className={styles.inputFile}
          onChange={handleFileChange}
        />
        <label htmlFor="file">
          <img src={upload} className={styles.uploadImg} alt="Upload" />
        </label>
        <input
          type="text"
          className={`${styles.textInput} ${styles.studyTextInput}`}
          placeholder="공지 내용을 입력하세요"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>
      <div className={styles.chatMenu}>
        <div className={styles.imgBox}>
          <img src={book} className={styles.img} alt="book" />
          <p className={styles.chatTxt}>학습</p>
        </div>
        <div className={styles.imgBox} onClick={openModal}>
          <img src={chat} className={styles.img} alt="chat" />
          <p>대화</p>
        </div>
      </div>
    </div>
  );
};

export default ChatbotStudyModal;
