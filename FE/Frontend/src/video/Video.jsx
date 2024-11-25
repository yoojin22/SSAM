import axios from 'axios';
import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { OpenVidu } from 'openvidu-browser';
import styles from './Video.module.scss';
import Draggable from 'react-draggable';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

// 분리된 컴포넌트 목록
import ChatComponent from './ChatComponent';
import MenuBarComponent from './MenuBarComponent';
import SubtitleComponent from './SubtitleComponent';

const apiUrl = import.meta.env.API_URL;

const VideoChatComponent = () => {
    const { accessCode } = useParams(); // URL에서 accessCode를 가져옴
    const [session, setSession] = useState(null); // 세션 상태 관리
    const [sessionToken, setSessionToken] = useState(null); // 토큰 상태 관리
    const [mainStreamManager, setMainStreamManager] = useState(null); // 주 스트림 관리
    const [publisher, setPublisher] = useState(null); // 발행자 관리
    const [subscribers, setSubscribers] = useState([]); // 구독자 관리
    const [currentVideoDevice, setCurrentVideoDevice] = useState(null); // 현재 비디오 장치 관리
    const [isRecording, setIsRecording] = useState(false); // 녹화 상태 관리
    const [isCameraOn, setIsCameraOn] = useState(true); // 카메라 상태 관리
    const [isMicOn, setIsMicOn] = useState(true); // 마이크 상태 관리
    const [sttMessages, setSTTMessages] = useState([]); // 음성 인식 메시지 관리
    const OV = useRef(new OpenVidu()); // OpenVidu 인스턴스 생성
    const myUserName = useRef(`user_${Math.floor(Math.random() * 1000) + 1}`); // 사용자 이름 생성
    const subtitleRef = useRef(null); // 자막 컨테이너 참조
    const lastTranscriptRef = useRef(''); // 마지막 음성 인식 결과 참조
    const timeoutRef = useRef(null); // 타임아웃 참조
    const [formattedDate, setFormattedDate] = useState(''); // 포맷된 날짜 관리
    const [profileData, setProfileData] = useState({ name: '' }); // 프로필 데이터 관리
    const [showSubtitle, setShowSubtitle] = useState(true); // subtitle 표시 여부를 관리하는 상태 변수
    const [remainingTime, setRemainingTime] = useState(''); // 남은 시간을 관리하는 상태 변수
    const [isTimerEnded, setIsTimerEnded] = useState(false); // 타이머 종료 여부를 관리하는 상태 변수
    const [profanityDetected, setProfanityDetected] = useState(false); // 필터링
    const { transcript, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();
    const toggleSubTitle = () => {
        setShowSubtitle(!showSubtitle);
    };

    // 사용자 이름 GET
    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('USER_TOKEN');
            try {
                console.log('Fetching profile data with token:', token);
                const response = await axios.get(`${apiUrl}/v1/users`, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `${token}`,
                    },
                });
                const data = {
                    name: response.data.name || '',
                };
                setProfileData(data);
                console.log('가져온 프로필 데이터 : ', data);
            } catch (error) {
                console.error('Failed to fetch profile data:', error);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (transcript !== lastTranscriptRef.current) {
            // setTmpMessage(transcript); // 음성 인식 메시지 상태 업데이트
            lastTranscriptRef.current = transcript;
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current); // 기존 타임아웃 초기화
            }
            timeoutRef.current = setTimeout(() => {
                if (transcript === lastTranscriptRef.current && transcript.trim() !== '') {
                    sendSTTMessage(transcript); // 음성 인식 메시지를 전송
                    resetTranscript(); // 음성 인식 상태 초기화
                }
            }, 1000);
        }
    }, [transcript]);

    useEffect(() => {
        // 페이지를 떠날 때 이벤트 리스너 추가
        window.addEventListener('beforeunload', onBeforeUnload);
        joinSession(); // 세션에 참가
        return () => {
            window.removeEventListener('beforeunload', onBeforeUnload);
            leaveSession(); // 세션을 떠남
            SpeechRecognition.stopListening(); // 음성 인식 중지
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current); // 타임아웃 정리
            }
        };
    }, []);

    useEffect(() => {
        if (session && isMicOn) {
            // 마이크가 켜져 있을 때 음성 인식 시작
            SpeechRecognition.startListening({ continuous: true, language: 'ko-KR' });
        } else {
            // 마이크가 꺼져 있을 때 음성 인식 중지
            SpeechRecognition.stopListening();
        }
    }, [session, isMicOn]);

    // 새로운 자막 컨테이너 스크롤을 아래로 이동
    useEffect(() => {
        if (subtitleRef.current) {
            subtitleRef.current.scrollTop = subtitleRef.current.scrollHeight;
        }
    }, [sttMessages]);

    // 녹화를 시작/중지하는 함수
    const toggleRecording = async () => {
        if (!isRecording) {
            try {
                const response = await axios.post(`${apiUrl}/v1/video/recording/start`, {
                    sessionId: session.sessionId,
                    outputMode: 'COMPOSED',
                    hasAudio: true,
                    hasVideo: true,
                });
                setIsRecording(true);
            } catch (error) {
                console.error('Error starting recording:', error);
            }
        } else {
            try {
                await axios.post(`${apiUrl}/v1/video/recording/stop`, {
                    sessionId: session.sessionId,
                });
                setIsRecording(false);
            } catch (error) {
                console.error('Error stopping recording:', error);
            }
        }
    };

    // 카메라를 켜고 끄는 함수
    const toggleCamera = () => {
        if (publisher) {
            publisher.publishVideo(!isCameraOn);
            setIsCameraOn(!isCameraOn);
        }
    };

    // 마이크를 켜고 끄는 함수
    const toggleMic = () => {
        if (publisher) {
            publisher.publishAudio(!isMicOn);
            setIsMicOn(!isMicOn);
            if (!isMicOn) {
                SpeechRecognition.startListening({
                    continuous: true,
                    language: 'ko-KR',
                });
            } else {
                SpeechRecognition.stopListening();
                resetTranscript();
                // setTmpMessage("");
                lastTranscriptRef.current = '';
            }
        }
    };

    // 페이지를 떠나기 전 세션을 떠나는 함수
    const onBeforeUnload = () => {
        leaveSession();
    };

    // 세션에 참가하는 함수
    const joinSession = async () => {
        const mySession = OV.current.initSession();
        // 새로운 스트림이 생성될 때 이벤트 리스너
        mySession.on('streamCreated', (event) => {
            if (event.stream.connection.connectionId !== mySession.connection.connectionId) {
                const subscriber = mySession.subscribe(event.stream, undefined);
                setSubscribers((subscribers) => [...subscribers, subscriber]);
            }
        });

        // 스트림이 파괴될 때 이벤트 리스너
        mySession.on('streamDestroyed', (event) => {
            setSubscribers((subscribers) => subscribers.filter((sub) => sub !== event.stream.streamManager));
        });

        // 예외가 발생할 때 이벤트 리스너
        mySession.on('exception', (exception) => {
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
                resolution: '16:9',
                frameRate: 30,
                insertMode: 'APPEND',
                mirror: false,
            });
            mySession.publish(publisher);

            const devices = await OV.current.getDevices();
            const videoDevices = devices.filter((device) => device.kind === 'videoinput');
            const currentVideoDeviceId = publisher.stream.getMediaStream().getVideoTracks()[0].getSettings().deviceId;
            const currentVideoDevice = videoDevices.find((device) => device.deviceId === currentVideoDeviceId);
            setSessionToken(myToken); // 토큰 상태 설정
            setSession(mySession); // 세션 상태 설정
            setMainStreamManager(publisher); // 주 스트림 설정
            setPublisher(publisher); // 발행자 설정
            setCurrentVideoDevice(currentVideoDevice); // 현재 비디오 장치 설정

            // 날짜, 시간 들고오기
            if (myToken && myToken.createdAt) {
                const startTime = new Date(myToken.createdAt);
                const formatted = startTime.toLocaleString();
                setFormattedDate(formatted);

                // 시작 시간으로부터 20분 후의 종료 시간 계산
                const endTime = new Date(startTime.getTime() + 20 * 60 * 1000);

                const intervalId = setInterval(() => {
                    const now = new Date();
                    const remainingTime = endTime - now;

                    if (remainingTime > 0) {
                        const minutes = Math.floor(remainingTime / (60 * 1000));
                        const seconds = Math.floor((remainingTime % (60 * 1000)) / 1000);
                        const remainingTimeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
                        setRemainingTime(remainingTimeString);
                    } else {
                        clearInterval(intervalId);
                        setIsTimerEnded(true);
                    }
                }, 1000);

                // 컴포넌트가 언마운트될 때 인터벌을 정리
                return () => clearInterval(intervalId);
            } // 1초마다 업데이트
        } catch (error) {
            console.log('There was an error connecting to the session:', error.code, error.message);
        }
    };

    // 세션을 떠나는 함수
    const leaveSession = async () => {
        if (session) {
            try {
                // 사용자의 역할 정보를 가져오는 GET 요청
                const token = localStorage.getItem('USER_TOKEN');

                // 기존의 토큰 삭제 로직
                await axios.delete(`${apiUrl}/v1/video/token`, {
                    data: {
                        accessCode: accessCode,
                        userId: myUserName.current,
                    },
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `${token}`,
                    },
                });

                const response = await axios.get(`${apiUrl}/v1/users/initial`, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `${token}`,
                    },
                });
                const userRole = response.data.role;

                // 역할에 따른 리다이렉션
                if (userRole === 'TEACHER') {
                    window.location.replace('/teachersubpage');
                } else if (userRole === 'STUDENT') {
                    window.location.replace('/studentsubpage');
                }
            } catch (error) {
                console.error('Error during session leave:', error);
            }
            session.disconnect();
        }
        setSession(null);
        setSubscribers([]);
        setMainStreamManager(null);
        setPublisher(null);
    };

    const sendSTTMessage = async (text) => {
        if (text.trim() !== '' && session) {
            const messageData = {
                message: text,
                from: myUserName.current,
                connectionId: session.connection.connectionId,
            };
            // 욕설 감지 API 호출
            try {
                const response = await axios.post(`${apiUrl}/v1/profanity/check`, {
                    message: text,
                });
                console.warn(response.data);
                let consecutiveOffensiveCount = 0;

                if (response.data.category === '공격발언') {
                    consecutiveOffensiveCount = 1;
                    console.warn('공격발언이 1회 감지되었습니다');
                }

                setSTTMessages((prevMessages) => {
                    const newMessages = [...prevMessages, messageData];
                    const lastFiveMessages = newMessages.slice(-5); // 최대 5개의 메시지만 유지

                    // 이전 상태의 마지막 메시지 (있다면) 확인
                    if (prevMessages.length > 0 && prevMessages[prevMessages.length - 1].category === '공격발언') {
                        consecutiveOffensiveCount++;
                        console.warn('공격발언이 2회 감지되었습니다');
                    }

                    // 두 개 이상의 연속된 공격적 메시지가 감지되면
                    if (consecutiveOffensiveCount >= 1) {
                        setProfanityDetected(true);
                        // 1초 후에 빨간 박스를 제거합니다.
                        setTimeout(() => setProfanityDetected(false), 1000);
                        console.warn('연속된 공격발언이 감지되었습니다');
                    }

                    return lastFiveMessages;
                });

                session.signal({
                    data: JSON.stringify(messageData),
                    type: 'stt',
                });
            } catch (error) {
                console.error('비속어 확인 중 오류 발생:', error);
            }
        }
    };

    // 토큰을 가져오는 함수
    const getToken = async () => {
        const token = localStorage.getItem('USER_TOKEN');
        try {
            const response = await axios.post(
                `${apiUrl}/v1/video/token`,
                {
                    accessCode: accessCode,
                    userId: myUserName.current,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: token,
                    },
                }
            );
            console.warn(response.data);
            return response.data;
        } catch (error) {
            console.error('Error getting token:', error);
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
                <div className={styles.videoChatContainer}>
                    {profanityDetected && (
                        <div className={styles.profanityOverlay}>
                            <h1>부적절한 언어가 감지되었습니다</h1>
                        </div>
                    )}

                    {/* 메뉴바 */}
                    <MenuBarComponent
                        formattedDate={formattedDate}
                        isRecording={isRecording}
                        toggleRecording={toggleRecording}
                        showSubtitle={showSubtitle}
                        toggleSubTitle={toggleSubTitle}
                        isCameraOn={isCameraOn}
                        toggleCamera={toggleCamera}
                        isMicOn={isMicOn}
                        toggleMic={toggleMic}
                        leaveSession={leaveSession}
                        remainingTime={remainingTime}
                        isTimerEnded={isTimerEnded}
                    />

                    {/* 화면 */}
                    <div className={styles.bottom}>
                        <div className={styles.screen}>
                            <div className={`${styles.videoPosition} ${!showSubtitle ? styles.fullHeight : ''}`}>
                                {mainStreamManager !== null && (
                                    <Draggable key={myUserName.current}>
                                        <div className={styles.othervideoItem}>
                                            <UserVideoComponent streamManager={mainStreamManager} />
                                        </div>
                                    </Draggable>
                                )}
                                {subscribers.map((sub) => (
                                    <div className={styles.videoItem}>
                                        <UserVideoComponent streamManager={sub} />
                                    </div>
                                ))}
                            </div>

                            {/* 자막 */}
                            <div>
                                <SubtitleComponent showSubtitle={showSubtitle} sttMessages={sttMessages} session={session} profileData={profileData} />
                            </div>
                        </div>

                        {/* 채팅 */}
                        <ChatComponent session={session} profileData={profileData} />
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
