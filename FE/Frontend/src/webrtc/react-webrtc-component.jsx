import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { OpenVidu } from "openvidu-browser";
import "./VideoChatComponent.css"; // 새로운 CSS 파일을 import 합니다
const apiUrl = import.meta.env.API_URL;

const API_BASE_URL = `${apiUrl}/v1/video`; // Spring 백엔드 API 기본 URL
//const API_BASE_URL = 'https://i11e201.p.ssafy.io/api/v1/video';

const VideoChatComponent = () => {
  const [myWebrtcSessionId, setMyWebrtcSessionId] = useState("SessionA");
  const [mySessionId, setMySessionId] = useState("");
  const [myUserName, setMyUserName] = useState(
    `Participant${Math.floor(Math.random() * 100)}`
  );
  const [session, setSession] = useState(null);
  const [mainStreamManager, setMainStreamManager] = useState(null);
  const [publisher, setPublisher] = useState(null);
  const [subscribers, setSubscribers] = useState([]);
  const [currentVideoDevice, setCurrentVideoDevice] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [recordingId, setRecordingId] = useState(null);
  const OV = useRef(new OpenVidu());

  useEffect(() => {
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", onBeforeUnload);
    };
  }, []);

  const onBeforeUnload = () => {
    leaveSession();
  };

  const handleChangeWebrtcSessionId = (e) => {
    setMyWebrtcSessionId(e.target.value);
  };

  const handleChangeUserName = (e) => {
    setMyUserName(e.target.value);
  };

  const joinSession = async () => {
    console.warn("joinSession");
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
      const token = await getToken();
      await mySession.connect(token, { clientData: myUserName });

      // 세션 연결 후 세션 정보 로깅
      setMySessionId(mySession.sessionId);

      let publisher = await OV.current.initPublisherAsync(undefined, {
        audioSource: undefined,
        videoSource: undefined,
        publishAudio: true,
        publishVideo: true,
        resolution: "640x480",
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
      setSession(mySession);
      setMainStreamManager(publisher);
      setPublisher(publisher);
      setCurrentVideoDevice(currentVideoDevice);
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
        await axios.delete(`${API_BASE_URL}/token`, {
          data: {
            sessionId: myWebrtcSessionId,
            userId: myUserName,
            token: session.token,
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
        const response = await axios.post(`${API_BASE_URL}/recording/start`, {
          session: mySessionId,
          outputMode: "COMPOSED",
          hasAudio: true,
          hasVideo: true,
        });
        setRecordingId(response.data.id);
        setIsRecording(true);
      } catch (error) {
        console.error("Error starting recording:", error);
      }
    } else {
      try {
        await axios.post(`${API_BASE_URL}/recording/stop`, {
          recordingId: recordingId,
        });
        setIsRecording(false);
        setRecordingId(null);
      } catch (error) {
        console.error("Error stopping recording:", error);
      }
    }
  };

  const sendChatMessage = () => {
    if (chatInput.trim() !== "" && session) {
      const messageData = {
        message: chatInput,
        from: myUserName,
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

  useEffect(() => {
    if (session) {
      session.on("signal:chat", (event) => {
        const data = JSON.parse(event.data);
        if (data.connectionId !== session.connection.connectionId) {
          setChatMessages((prevMessages) => [...prevMessages, data]);
        }
      });
    }
  }, [session]);

  const getToken = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/token`, {
        webrtcSessionId: myWebrtcSessionId,
        userId: myUserName,
      });
      return response.data.token;
    } catch (error) {
      console.error("Error getting token:", error);
      throw error;
    }
  };

  return (
    <div className="container-fluid p-0">
      {session === null ? (
        <div className="join-container d-flex align-items-center justify-content-center vh-100">
          <div className="join-form-container bg-light p-5 rounded shadow">
            <h2 className="text-center mb-4">Join Video Session</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                joinSession();
              }}
            >
              <div className="mb-3">
                <label htmlFor="userName" className="form-label">
                  Your Name:
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="userName"
                  value={myUserName}
                  onChange={handleChangeUserName}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="sessionId" className="form-label">
                  Session ID:
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="webrtcSessionId"
                  value={myWebrtcSessionId}
                  onChange={handleChangeWebrtcSessionId}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary w-100">
                Join Session
              </button>
            </form>
          </div>
        </div>
      ) : (
        <div className="session-container">
          <div className="session-header bg-dark text-white p-3 d-flex justify-content-between align-items-center">
            <h3 className="m-0">Session: {mySessionId}</h3>
            <div>
              <button
                className="btn btn-outline-light me-2"
                onClick={switchCamera}
              >
                Switch Camera
              </button>
              <button
                className="btn btn-outline-light me-2"
                onClick={toggleRecording}
              >
                {isRecording ? "Stop Recording" : "Start Recording"}
              </button>
              <button className="btn btn-danger" onClick={leaveSession}>
                Leave Session
              </button>
            </div>
          </div>
          <div className="main-container">
            <div className="video-container">
              {mainStreamManager !== null && (
                <div className="video-item">
                  <UserVideoComponent streamManager={mainStreamManager} />
                </div>
              )}
              {subscribers.map((sub) => (
                <div
                  key={sub.stream.connection.connectionId}
                  className="video-item"
                >
                  <UserVideoComponent streamManager={sub} />
                </div>
              ))}
            </div>
            <div className="chat-container">
              <div className="chat-messages">
                {chatMessages.map((msg, index) => (
                  <div
                    key={index}
                    className={`chat-message ${
                      msg.connectionId === session.connection.connectionId
                        ? "own-message"
                        : "other-message"
                    }`}
                  >
                    <strong>{msg.from}:</strong> {msg.message}
                  </div>
                ))}
              </div>
              <div className="chat-input">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && sendChatMessage()}
                  placeholder="Type a message..."
                />
                <button onClick={sendChatMessage}>Send</button>
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
