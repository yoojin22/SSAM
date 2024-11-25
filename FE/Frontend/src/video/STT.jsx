import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

// Dictaphone 컴포넌트: 음성 인식 기능을 구현하는 React 컴포넌트
const Dictaphone = () => {
  // useSpeechRecognition 훅을 사용하여 음성 인식 관련 상태와 함수를 가져옵니다.
  const {
    transcript,  // 인식된 음성의 텍스트
    listening,   // 현재 음성 인식 중인지 여부
    resetTranscript,  // 인식된 텍스트를 초기화하는 함수
    browserSupportsSpeechRecognition  // 브라우저가 음성 인식을 지원하는지 여부
  } = useSpeechRecognition();

  // 브라우저가 음성 인식을 지원하지 않는 경우 메시지를 표시합니다.
  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }

  // 음성 인식 컨트롤 UI를 렌더링합니다.
  return (
    <div>
      {/* 현재 마이크 상태를 표시합니다. */}
      <p>Microphone: {listening ? 'on' : 'off'}</p>
      {/* 음성 인식 시작 버튼 */}
      <button onClick={SpeechRecognition.startListening}>Start</button>
      {/* 음성 인식 중지 버튼 */}
      <button onClick={SpeechRecognition.stopListening}>Stop</button>
      {/* 인식된 텍스트 초기화 버튼 */}
      <button onClick={resetTranscript}>Reset</button>
      {/* 인식된 텍스트를 표시합니다. */}
      <p>{transcript}</p>
    </div>
  );
};

export default Dictaphone;