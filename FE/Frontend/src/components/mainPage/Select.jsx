import { useEffect } from "react";
import styles from "./Select.module.scss";
import teacher from "../../assets/teacher.png";
import parents from "../../assets/parents.png";
import round1 from "../../assets/round1.png";
import round2 from "../../assets/round2.png";
import round3 from "../../assets/round3.png";
import { NavLink } from "react-router-dom"; // 이 부분이 중요합니다.

const Select = () => {
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const round1 = document.querySelector(`.${styles.round1}`);
      const round2 = document.querySelector(`.${styles.round2}`);
      const round3 = document.querySelector(`.${styles.round3}`);

      round1.style.transform = `translateY(${scrollPosition * 0.15}px)`;
      round2.style.transform = `translateY(${scrollPosition * 0.15}px)`;
      round3.style.transform = `translateY(${scrollPosition * 0.15}px)`;
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className={styles.selectArray}>
      <h1 className={styles.mainTxt}>온라인 화상 상담 시스템, SSAM</h1>
      <div className={styles.menuBoxArray}>
        <NavLink
          to="/teacherlogin"
          className={`${styles.menuBox} ${styles.menuBox1}`}
        >
          <div className={styles.menuTxt}>
            <h1>선생님</h1>
            <h3>선생님으로 시작하세요</h3>
            <img src={teacher} className={styles.teacherImg} alt="teacher" />
          </div>
        </NavLink>
        <NavLink
          to="/studentlogin"
          className={`${styles.menuBox} ${styles.menuBox2}`}
        >
          <div className={styles.menuTxt}>
            <h1>학생 / 학부모</h1>
            <h3>학생과 자녀가 있는 학부모</h3>
            <img src={parents} className={styles.parentsImg} alt="student" />
          </div>
        </NavLink>
      </div>
      <img src={round1} className={`${styles.round1}`} alt="round1" />
      <img src={round2} className={`${styles.round2}`} alt="round2" />
      <img src={round3} className={`${styles.round3}`} alt="round3" />
      <p className={styles.scroll}>Scroll ▽</p>
    </div>
  );
};

export default Select;
