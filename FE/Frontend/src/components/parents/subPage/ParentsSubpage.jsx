import EnterCode from "./EnterCode";
import SubpageImg2 from "../../../assets/SSAM_main.png";
import Light from "../../../assets/Light.gif";
import Arrow from "../../../assets/arrow1.png";

import ParentsSelect from "./ParentsSelect";
import styles from "./ParentsSubpage.module.scss";

const ParentsSubpage = () => {
  const redirectToYouTube = () => {
    window.location.href = "https://www.youtube.com";
  };
  return (
    <>
      <div className={styles.subPageContainer}>
        {/* 배경 이미지 */}
        <div className={styles.imageContainer}>
          {/* 슬로건 추가 */}
          <div className={styles.slogan}>
            <h1>함께 지키는 존중</h1>
            <h1>함께 만드는 교육</h1>
            <br />
            <h3>함께하는 프로젝트 Ep.1</h3>
          </div>
          {/* 영상 보러가기 버튼 */}
          <div className={styles.videoLink} onClick={redirectToYouTube}>
            <span>영상 보러가기</span>
            <img src={Arrow} className={styles.arrowIcon} alt="Arrow" />
          </div>
          <img
            src={SubpageImg2}
            className={styles.subpageImg}
            alt="SubpageImg"
          />
          {/* Light 이미지 추가 */}
          <img src={Light} className={styles.lightImg} alt="Light" />
        </div>
        {/* EnterCode 컴포넌트를 포함하는 컨테이너 */}
        <div className={styles.enterCodeContainer}>
          <EnterCode />
        </div>
      </div>
      <ParentsSelect />
    </>
  );
};

export default ParentsSubpage;
