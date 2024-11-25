import { useEffect, useState } from "react";
import styles from "./Explan.module.scss";
import explanimg from "../../assets/explan.png";

const Explan = () => {
  const [scrollValue, setScrollValue] = useState(0);

  // 스크롤 이벤트를 감지하여 scrollValue 상태를 업데이트
  useEffect(() => {
    const handleScroll = () => {
      const value = window.scrollY;
      setScrollValue(value);
      console.log("scroll", value);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // scrollValue가 500~1200이면 slide 애니메이션을 적용
  const txtArrayStyle = {
    animation:
      scrollValue >= 500 && scrollValue <= 1100
        ? `${styles.slide} 1s ease-out forwards`
        : `${styles.disappear} 1s ease-out forwards`,
  };

  const txtPStyle = {
    animation:
      scrollValue >= 500 && scrollValue <= 1100
        ? `${styles.slide} 1.5s ease-out forwards`
        : `${styles.disappear} 1.5s ease-out forwards`,
  };

  return (
    <div className={styles.explanArray}>
      <div className={styles.imgArray}>
        <img src={explanimg} className={styles.img} alt="Explanation" />
      </div>
      <div className={styles.txtArray} style={txtArrayStyle}>
        <h3>SSAM</h3>
        <h1>새로 만나는 화상상담</h1>
        <div className={styles.txtP} style={txtPStyle}>
          <p>AI를 활용한 스마트 화상상담 서비스로</p>
          <p>선생님들의 상담에 도움을 드립니다</p>
        </div>
      </div>
    </div>
  );
};

export default Explan;
