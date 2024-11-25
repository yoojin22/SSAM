import { useEffect, useState } from "react";
import styles from "./Direct.module.scss";
import directimg from "../../assets/directimg.png";

const Direct = () => {
  const [scrollValue, setScrollValue] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const value = window.scrollY;
      setScrollValue(value);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const isVisible = scrollValue >= 1100 && scrollValue <= 2000;

  const txtArrayStyle = {
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? "translateX(0)" : "translateX(-100%)",
    transition: "opacity 1s ease-out, transform 1s ease-out",
  };

  const txtPStyle = {
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? "translateX(0)" : "translateX(-100%)",
    transition: "opacity 1s ease-out 0.2s, transform 1s ease-out 0.2s",
  };

  return (
    <div className={styles.directArray}>
      <div className={styles.txtArray} style={txtArrayStyle}>
        <h3>SSAM</h3>
        <h1>
          비용없이 사용 가능한 <br />
          AI 서비스
        </h1>
        <div className={styles.txtP} style={txtPStyle}>
          <p>상담을 어떻게 해야 할지 걱정되시나요?</p>
          <p>AI가 선생님의 상담을 도와드립니다</p>
        </div>
      </div>
      <div className={styles.imgArray}>
        <img className={styles.img} src={directimg} alt="direct" />
      </div>
      <div className={styles.detailArray}>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
};

export default Direct;
