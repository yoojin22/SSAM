import { useState, useRef, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import useUserInitialStore from "../../store/UserInitialStore";
import SSAM from "../../assets/SSAM.png";
import styles from "./MainNavbar.module.scss";

const MainNavbar = () => {
  const location = useLocation();
  // Zustand store에서 사용자 초기 데이터 가져오기
  const { userInitialData } = useUserInitialStore((state) => ({
    userInitialData: state.userInitialData,
  }));

  // 밑줄 스타일을 위한 state - React의 방식으로 DOM 조작 대신 상태 관리
  const [underlineStyle, setUnderlineStyle] = useState({});
  // 메뉴 컨테이너에 대한 ref - DOM 요소에 직접 접근하기 위함
  const menuRef = useRef(null);
  // 로고에 대한 ref - 로고 클릭 시 밑줄 위치 조정을 위함
  const logoRef = useRef(null);

  // 사용자 역할에 따른 경로 설정
  const rolePath = userInitialData?.role === "TEACHER" ? "teacher" : "student";

  // 밑줄 위치 업데이트 함수 - DOM 요소의 위치와 크기를 기반으로 스타일 설정
  const updateUnderline = (target) => {
    if (target) {
      const { offsetLeft, offsetWidth } = target;
      setUnderlineStyle({
        left: `${offsetLeft}px`,
        width: `${offsetWidth}px`,
      });
    }
  };

  // location 변경 시 활성 링크에 맞춰 밑줄 업데이트
  useEffect(() => {
    const activeLink = menuRef.current?.querySelector(`.${styles.active}`);
    if (activeLink) {
      // 활성 메뉴 항목이 있으면 해당 위치로 밑줄 이동
      updateUnderline(activeLink);
    } else if (location.pathname === `/${rolePath}subpage`) {
      // 현재 페이지가 로고 페이지(subpage)인 경우 로고 위치로 밑줄 이동
      updateUnderline(logoRef.current);
    }
  }, [location, rolePath]);

  return (
    <div className={styles.navbarArray}>
      {/* 로고 링크 - ref 추가 */}
      <NavLink
        to={`/${rolePath}subpage`}
        className={styles.logoLink}
        ref={logoRef}
      >
        <img src={SSAM} className={styles.logo} alt="Logo" />
      </NavLink>
      {/* 메뉴 컨테이너 */}
      <div className={styles.menuArray} ref={menuRef}>
        {/* 학급정보 링크 */}
        <NavLink
          to={`/${rolePath}classroom`}
          className={({ isActive }) =>
            `${styles.navtxt} ${isActive ? styles.active : ""}`
          }
        >
          <h2>학급정보</h2>
        </NavLink>
        {/* 문의사항 링크 */}
        <NavLink
          to={`/${rolePath}question`}
          className={({ isActive }) =>
            `${styles.navtxt} ${isActive ? styles.active : ""}`
          }
        >
          <h2>문의사항</h2>
        </NavLink>
        {/* 상담예약 링크 */}
        <NavLink
          to={`/${rolePath}reservationmanagement`}
          className={({ isActive }) =>
            `${styles.navtxt} ${isActive ? styles.active : ""}`
          }
        >
          <h2>상담예약</h2>
        </NavLink>
        {/* 동적으로 위치가 변경되는 물결 모양 밑줄 */}
        <div
          className={`${styles.horizontalUnderline} ${styles["horizontalUnderline-wavy"]}`}
          style={underlineStyle}
        ></div>
      </div>
    </div>
  );
};

export default MainNavbar;
