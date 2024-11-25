import { NavLink } from "react-router-dom";
import styles from "./TeacherLogin.module.scss";
import { loginUser } from "../../../apis/user";
import useLoginStore from "../../../store/AuthStore";
import round1 from "../../../assets/round1.png";
import round2 from "../../../assets/round2.png";
import round3 from "../../../assets/round3.png";
import google from "../../../assets/google.png";
import Swal from 'sweetalert2'

const TeacherLogin = () => {
  const { username, password, handleChange, setLoggedIn } = useLoginStore(
    (state) => ({
      username: state.username,
      password: state.password,
      handleChange: state.handleChange,
      setLoggedIn: state.setLoggedIn,
    })
  );

  // 폼이 제출될 때 호출된다.
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await loginUser(username, password);
      const token = response.headers.authorization;
      localStorage.setItem("USER_TOKEN", token);
      localStorage.setItem("USER_NAME", username);
      setLoggedIn(true);
      window.location.replace("/teachersubpage");
    } catch (error) {
      console.error("axios 실패", error);
      if (error.response && error.response.status === 401) {
        Swal.fire({
          icon: "error",
          title: "로그인 실패",
          text: "아이디 또는 비밀번호가 잘못되었습니다.",
        });
      } else {
        alert(
          "로그인 실패: " + (error.response?.data?.message || error.message)
        );
      }
    }
  };
    const handleGoogleLogin = () => {
    window.location.href = `${apiUrl}/oauth2/authorization/google`
  };

  // const handleGoogleLogin = async () => {
  //   try {
  //     const userData = await fetchApiUserInitial();
  //     const currentUserId = userData.userId;
      
  //     if (!currentUserId) {
  //       return;
  //     }
  
  //     // state를 JSON 문자열로 변환한 후 Base64로 인코딩
  //     // const state = btoa(JSON.stringify({ userId: currentUserId }));
  //     console.log(`Redirecting to: http://localhost:8081/oauth2/authorization/google?userId=${currentUserId}`);

  //     // window.location.href = `http://localhost:8081/oauth2/authorization/google?userId=${currentUserId}`;
  //   } catch (error) {
  //     console.error('Error fetching user data:', error);
  //   }
  // };

  return (
    <div className={styles.loginArray}>
      <h1 className={styles.loginTitle}>로그인</h1>
      <div className={styles.loginFormArray}>
        <div className={styles.loginBackground}>
          <form onSubmit={handleLogin} className={styles.loginForm}>
            <input
              type="text"
              name="username"
              value={username}
              onChange={handleChange}
              placeholder="아이디"
              required
            />
            <input
              type="password"
              name="password"
              value={password}
              onChange={handleChange}
              placeholder="비밀번호"
              required
            />
            <button type="submit" className={styles.loginBtn}>
              로그인
            </button>
            <div className={styles.loginRoute}>
              <NavLink to="/teacherjoin" className={styles.joinNavLink}>
                <p>회원가입</p>
              </NavLink>
              <p className={styles.searchId}>아이디 / 비밀번호 찾기</p>
            </div>
            <button
              type="button"
              className={styles.googleBtn}
              onClick={handleGoogleLogin}
            >
              <img src={google} className={styles.googleImg} alt="google" />
              <p>구글로 시작하세요</p>
            </button>
          </form>
        </div>
      </div>
      <img src={round1} className={styles.round1} alt="round1" />
      <img src={round2} className={styles.round2} alt="round2" />
      <img src={round3} className={styles.round3} alt="round3" />
    </div>
  );
};

export default TeacherLogin;
