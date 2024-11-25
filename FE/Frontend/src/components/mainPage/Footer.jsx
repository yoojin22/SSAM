import styles from "./Footer.module.scss";
import git from "../../assets/git.png";
import youtube from "../../assets/youtube.png";

const Footer = () => {
  return (
    <div className={styles.footerArray}>
      <div className={styles.img}>
        <a href="https://github.com" target="_blank">
          <img src={git} className={styles.gitImg} />
        </a>
        <a href="https://www.youtube.com" target="_blank">
          <img src={youtube} className={styles.youtubeImg} />
        </a>
      </div>
      <div className={styles.txt}>
        <p>Home | 개인 정보 처리 방침 | 고객센터</p>
      </div>
      <div className={styles.intro}>
        <p>SSAFY 2학기 공통 프로젝트 SSAM</p>
        <p>Copyright © 2024 All rights reserved</p>
      </div>
    </div>
  );
};
export default Footer;
