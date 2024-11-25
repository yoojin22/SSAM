import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { OpenVidu } from "openvidu-browser";
import styles from "./Video.module.scss";
import whitelogo from "../assets/whitelogo.png";
import RECOn from "../assets/RECOn.png";
import RECOff from "../assets/RECOff.png";
import Conversion from "../assets/Conversion.png";
import mikeOn from "../assets/mikeOn.png";
import mikeOff from "../assets/mikeOff.png";
import cameraOn from "../assets/cameraOn.png";
import cameraOff from "../assets/cameraOff.png";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

const apiUrl = import.meta.env.API_URL;

const VideoChatComponent = () => {
  const { accessCode } = useParams();
  const [session, setSession] = useState(null);
  const [token, setToken] = useState(null);
  const [mainStreamManager, setMainStreamManager] = useState(null);
  const [publisher, setPublisher] = useState(null);
  const [subscribers, setSubscribers] = useState([]);
  const [currentVideoDevice, setCurrentVideoDevice] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [formattedDate, setFormattedDate] = useState("");
  const [sttMessages, setSTTMessages] = useState([]);
  const [tmpMessage, setTmpMessage] = useState("");
  const OV = useRef(new OpenVidu());
  const myUserName = useRef(`user_${Math.floor(Math.random() * 1000) + 1}`);
  const subtitleRef = useRef(null);
  const lastTranscriptRef = useRef("");
  const timeoutRef = useRef(null);

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  useEffect(() => {
    if (transcript !== lastTranscriptRef.current) {
      setTmpMessage(transcript);
      lastTranscriptRef.current = transcript;

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        if (transcript === lastTranscriptRef.current && transcript.trim() !== "") {
          sendSTTMessage(transcript);
          resetTranscript();
        }
      }, 1000);
    }
  }, [transcript]);

  useEffect(() => {
    window.addEventListener("beforeunload", onBeforeUnload);
    joinSession();

    return () => {
      window.removeEventListener("beforeunload", onBeforeUnload);
      leaveSession();
      SpeechRecognition.stopListening();
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (session && isMicOn) {
      SpeechRecognition.startListening({ continuous: true, language: 'ko-KR' });
    } else {
      SpeechRecognition.stopListening();
    }
  }, [session, isMicOn]);

  useEffect(() => {
    if (subtitleRef.current) {
      subtitleRef.current.scrollTop = subtitleRef.current.scrollHeight;
    }
  }, [sttMessages]);

  const onBeforeUnload = () => {
    leaveSession();
  };

  const joinSession = async () => {
    const mySession = OV.current.initSession();

    mySession.on("streamCreated", (event) => {
      if (
        event.stream.connection.connectionId !==
        mySession.connection.connectionId
      ) {
        const subscriber = mySession.subscribe(event.stream, undefined);
        setSubscribers((subscribers) => [...subscribers, subscriber]);
      }
    });

    mySession.on("streamDestroyed", (event) => {
      setSubscribers((subscribers) =>
        subscribers.filter((sub) => sub !== event.stream.streamManager)
      );
    });

    mySession.on("exception", (exception) => {
      console.warn(exception);
    });

    try {
      const myToken = await getToken();
      await mySession.connect(myToken.token, {
        clientData: myUserName.current,
      });

      let publisher = await OV.current.initPublisherAsync(undefined, {
        audioSource: undefined,
        videoSource: undefined,
        publishAudio: true,
        publishVideo: true,
        resolution: "1280x660",
        frameRate: 30,
        insertMode: "APPEND",
        mirror: false,
      });
      mySession.publish(publisher);

      const devices = await OV.current.getDevices();
      const videoDevices = devices.filter(
        (device) => device.kind === "videoinput"
      );
      const currentVideoDeviceId = publisher.stream
        .getMediaStream()
        .getVideoTracks()[0]
        .getSettings().deviceId;
      const currentVideoDevice = videoDevices.find(
        (device) => device.deviceId === currentVideoDeviceId
      );
      setToken(myToken);
      setSession(mySession);
      setMainStreamManager(publisher);
      setPublisher(publisher);
      setCurrentVideoDevice(currentVideoDevice);

      const nowdate = new Date().toLocaleString();

      if (myToken && myToken.createdAt) {
        const formatted = new Date(myToken.createdAt).toLocaleString();
        setFormattedDate(formatted);
      } else {
        console.warn("Token or createdAt is undefined");
      }
    } catch (error) {
      console.log(
        "There was an error connecting to the session:",
        error.code,
        error.message
      );
    }
  };

  const leaveSession = async () => {
    if (session) {
      try {
        await axios.delete(`${apiUrl}/v1/video/token`, {
          data: {
            accessCode: accessCode,
            userId: myUserName.current,
          },
        });
      } catch (error) {
        console.error("Error deleting token:", error);
      }
      session.disconnect();
    }
    setSession(null);
    setSubscribers([]);
    setMainStreamManager(null);
    setPublisher(null);
  };

  const switchCamera = async () => {
    try {
      const devices = await OV.current.getDevices();
      const videoDevices = devices.filter(
        (device) => device.kind === "videoinput"
      );

      if (videoDevices && videoDevices.length > 1) {
        const newVideoDevice = videoDevices.filter(
          (device) => device.deviceId !== currentVideoDevice.deviceId
        );

        if (newVideoDevice.length > 0) {
          const newPublisher = OV.current.initPublisher(undefined, {
            videoSource: newVideoDevice[0].deviceId,
            publishAudio: true,
            publishVideo: true,
            mirror: false,
          });

          await session.unpublish(mainStreamManager);
          await session.publish(newPublisher);
          setCurrentVideoDevice(newVideoDevice[0]);
          setMainStreamManager(newPublisher);
          setPublisher(newPublisher);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const toggleRecording = async () => {
    if (!isRecording) {
      try {
        const response = await axios.post(
          `${apiUrl}/v1/video/recording/start`,
          {
            sessionId: session.sessionId,
            outputMode: "COMPOSED",
            hasAudio: true,
            hasVideo: true,
          }
        );
        setIsRecording(true);
      } catch (error) {
        console.error("Error starting recording:", error);
      }
    } else {
      try {
        await axios.post(`${apiUrl}/v1/video/recording/stop`, {
          sessionId: session.sessionId,
        });
        setIsRecording(false);
      } catch (error) {
        console.error("Error stopping recording:", error);
      }
    }
  };

  const toggleCamera = () => {
    if (publisher) {
      publisher.publishVideo(!isCameraOn);
      setIsCameraOn(!isCameraOn);
    }
  };

  const toggleMic = () => {
    if (publisher) {
      publisher.publishAudio(!isMicOn);
      setIsMicOn(!isMicOn);
      if (!isMicOn) {
        SpeechRecognition.startListening({ continuous: true, language: 'ko-KR' });
      } else {
        SpeechRecognition.stopListening();
        resetTranscript();
        setTmpMessage("");
        lastTranscriptRef.current = "";
      }
    }
  };


  const sendChatMessage = () => {
    if (chatInput.trim() !== "" && session) {
      const messageData = {
        message: chatInput,
        from: myUserName.current,
        connectionId: session.connection.connectionId,
      };
      session.signal({
        data: JSON.stringify(messageData),
        type: "chat",
      });
      setChatMessages((prevMessages) => [...prevMessages, messageData]);
      setChatInput("");
    }
  };

  const sendSTTMessage = (text) => {
    if (text.trim() !== "" && session) {
      const messageData = {
        message: text,
        from: myUserName.current,
        connectionId: session.connection.connectionId,
      };
      session.signal({
        data: JSON.stringify(messageData),
        type: "stt",
      });
      setSTTMessages((prevMessages) => {
        const newMessages = [...prevMessages, messageData];
        return newMessages.slice(-5);  // 최대 5개의 메시지만 유지
      });
      setTmpMessage(""); // 임시 메시지 초기화
    }
  };

  useEffect(() => {
    if (session) {
      session.on("signal:chat", (event) => {
        const data = JSON.parse(event.data);
        if (data.connectionId !== session.connection.connectionId) {
          setChatMessages((prevMessages) => [...prevMessages, data]);
        }
      });

      session.on("signal:stt", (event) => {
        const data = JSON.parse(event.data);
        if (data.connectionId !== session.connection.connectionId) {
          setSTTMessages((prevMessages) => {
            const newMessages = [...prevMessages, data];
            return newMessages.slice(-5);  // 최대 5개의 메시지만 유지
          });
        }
      });
    }
  }, [session]);

  const getToken = async () => {
    try {
      const response = await axios.post(`${apiUrl}/v1/video/token`, {
        accessCode: accessCode,
        userId: myUserName.current,
      });
      return response.data;
    } catch (error) {
      console.error("Error getting token:", error);
      throw error;
    }
  };

  if (!browserSupportsSpeechRecognition) {
    console.warn("Browser doesn't support speech recognition.");
  }

  return (
    <div className={styles.videoArray}>
      {session === null ? (
        <h1 className={styles.entering}>화상상담 입장 중...</h1>
      ) : (
        <div className={styles.top}>
          <div className={styles.menubarArray}>
            <div className={styles.menubar}>
              <div className={styles.logoArray}>
                <img src={whitelogo} className={styles.logo} alt="Logo" />
              </div>
  
              <div className={styles.dayArray}>
                <p>{formattedDate}</p>
              </div>
  
              <div className={styles.iconArray}>
                <button className={styles.btnIcon} onClick={toggleRecording}>
                  {isRecording ? (
                    <img src={RECOn} className={styles.imgIcon} alt="Recording On" />
                  ) : (
                    <img src={RECOff} className={styles.imgIcon} alt="Recording Off" />
                  )}
                </button>
  
                <button className={styles.btnIcon} onClick={switchCamera}>
                  <img
                    src={Conversion}
                    className={styles.imgIcon}
                    alt="Switch Camera"
                  />
                </button>
  
                <button className={styles.btnIcon} onClick={toggleCamera}>
                  {isCameraOn ? (
                    <img src={cameraOn} className={styles.imgIcon} alt="Camera On" />
                  ) : (
                    <img src={cameraOff} className={styles.imgIcon} alt="Camera Off" />
                  )}
                </button>
  
                <button className={styles.btnIcon} onClick={toggleMic}>
                  {isMicOn ? (
                    <img src={mikeOn} className={styles.imgIcon} alt="Microphone On" />
                  ) : (
                    <img src={mikeOff} className={styles.imgIcon} alt="Microphone Off" />
                  )}
                </button>
  
                <button
                  className={`${styles.leaveSession} ${styles.btnIcon}`}
                  onClick={leaveSession}
                >
                  <h1>X</h1>
                </button>
              </div>
            </div>
          </div>
  
          <div className={styles.bottom}>
            <div className={styles.screen}>
              {mainStreamManager !== null && (
                <div className={styles.videoItem}>
                  <UserVideoComponent streamManager={mainStreamManager} />
                </div>
              )}
              {subscribers.map((sub) => (
                <div
                  key={sub.stream.connection.connectionId}
                  className={styles.othervideoItem}
                >
                  <UserVideoComponent streamManager={sub} />
                </div>
              ))}
            </div>
  
            <div className={styles.subTitleArray}>
              <div className={styles.subTitle} ref={subtitleRef}>
                {sttMessages.map((msg, index) => (
                  <div key={index}>
                    <strong>{msg.from}:</strong> {msg.message}
                  </div>
                ))}
                {tmpMessage && (
                  <div>
                    <strong>{myUserName.current}:</strong> {tmpMessage}
                  </div>
                )}
              </div>
            </div>
  
            <div className={styles.chatingArray}>
              <div className={styles.chating}>
                {chatMessages.map((msg, index) => (
                  <div
                    key={index}
                    className={`chatMessage ${
                      msg.connectionId === session.connection.connectionId
                        ? "ownMessage"
                        : "otherMessage"
                    }`}
                  >
                    <strong>{msg.from}:</strong> {msg.message}
                  </div>
                ))}
              </div>
              <div className={styles.chatInputArray}>
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
        </div>
      )}
    </div>
  );
};

const UserVideoComponent = ({ streamManager }) => {
    const videoRef = useRef();
  
    useEffect(() => {
      if (streamManager && videoRef.current) {
        streamManager.addVideoElement(videoRef.current);
      }
    }, [streamManager]);
  
    return (
      <div>
        <video autoPlay={true} ref={videoRef} />
      </div>
    );
  };
  
  export default VideoChatComponent;