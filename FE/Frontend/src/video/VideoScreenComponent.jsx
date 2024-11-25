import styles from "./Video.module.scss";
import Draggable from "react-draggable";
import SubtitleComponent from './SubtitleComponent';

const VideoScreenComponent = ({ 
  showSubtitle,
  mainStreamManager,
  subscribers,
  sttMessages,
  session,
  profileData,
  UserVideoComponent
}) => {
  return (
    <div className={styles.screen}>
      <div className={`${styles.videoPosition} ${!showSubtitle ? styles.fullHeight : ""}`}>
        {mainStreamManager !== null && (
          <div className={styles.videoItem}>
            <UserVideoComponent streamManager={mainStreamManager} />
          </div>
        )}
        {subscribers.map((sub) => (
          <Draggable key={sub.stream.connection.connectionId}>
            <div className={styles.othervideoItem}>
              <UserVideoComponent streamManager={sub} />
            </div>
          </Draggable>
        ))}
      </div>
      <SubtitleComponent
        showSubtitle={showSubtitle}
        sttMessages={sttMessages}
        session={session}
        profileData={profileData}
      />
    </div>
  );
};

export default VideoScreenComponent;