import styles from "./Video.module.scss";
import whitelogo from "../assets/whitelogo.png";
import RECOn from "../assets/RECOn.png";
import RECOff from "../assets/RECOff.png";
import mikeOn from "../assets/mikeOn.png";
import mikeOff from "../assets/mikeOff.png";
import cameraOn from "../assets/cameraOn.png";
import cameraOff from "../assets/cameraOff.png";
import subtitleOn from "../assets/subtitleOn.png";
import subtitleOff from "../assets/subtitleOff.png";

const MenuBarComponent = ({
  formattedDate,
  isRecording,
  toggleRecording,
  showSubtitle,
  toggleSubTitle,
  isCameraOn,
  toggleCamera,
  isMicOn,
  toggleMic,
  leaveSession,
  remainingTime,
  isTimerEnded,
}) => {
  return (
    <div className={styles.menubarArray}>
      <div className={styles.top}>
        <div className={styles.menubar}>
          <div className={styles.logoArray}>
            <img src={whitelogo} className={styles.logo} alt="Logo" />
          </div>
          <div className={styles.dayArray}>
            <p>{formattedDate.slice(0, 11)}</p>
          </div>
          <div className={styles.iconArray}>
            <button className={styles.btnIcon} onClick={toggleRecording}>
              {isRecording ? (
                <img
                  src={RECOn}
                  className={styles.imgIcon}
                  alt="Recording On"
                />
              ) : (
                <img
                  src={RECOff}
                  className={styles.imgIcon}
                  alt="Recording Off"
                />
              )}
            </button>
            <button className={styles.btnIcon} onClick={toggleSubTitle}>
              {showSubtitle ? (
                <img
                  src={subtitleOff}
                  className={styles.imgIcon}
                  alt="subtitleOff"
                />
              ) : (
                <img
                  src={subtitleOn}
                  className={styles.imgIcon}
                  alt="subtitleOn"
                />
              )}
            </button>
            <button className={styles.btnIcon} onClick={toggleCamera}>
              {isCameraOn ? (
                <img
                  src={cameraOn}
                  className={styles.imgIcon}
                  alt="Camera On"
                />
              ) : (
                <img
                  src={cameraOff}
                  className={styles.imgIcon}
                  alt="Camera Off"
                />
              )}
            </button>
            <button className={styles.btnIcon} onClick={toggleMic}>
              {isMicOn ? (
                <img
                  src={mikeOn}
                  className={styles.imgIcon}
                  alt="Microphone On"
                />
              ) : (
                <img
                  src={mikeOff}
                  className={styles.imgIcon}
                  alt="Microphone Off"
                />
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
      <div className={styles.timeArray}>
        <div className={styles.time}>
          <p>시작 시간 : {formattedDate.slice(13, 20)}</p>
          {!isTimerEnded ? (
            <p>남은 시간 : {remainingTime}</p>
          ) : (
            <p>상담 시간 종료</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MenuBarComponent;
