// 선생님 비밀번호 변경 페이지 컴포넌트
import { NavLink } from "react-router-dom";
import styles from "./ParentsPasswordChange.module.scss";

const ParentsPasswordChange = () => {
  return (
    <div className={styles.Container}>
      <div className={styles.menuNavbar}>
        <NavLink to="/studentupdate" className={styles.updateItem}>
          회원정보 수정
        </NavLink>
        <div className={styles.changeItem}>비밀번호 변경</div>
      </div>
      <div className={styles.formArray}>
        <div className={styles.passwordFormArray}>
          <h2 className={styles.formTxt}>
            새로 사용할 비밀번호를 입력해주세요
          </h2>
          <hr />
          <div className={styles.passwordForm}>
            <div className={styles.inputForm}>
              <h3>현재 비밀번호</h3>
              <input
                type="text"
                placeholder="Password"
                className={styles.inputTxtForm}
              />
            </div>
            <div className={styles.inputForm}>
              <h3>새 비밀번호</h3>
              <input
                type="text"
                placeholder="Password"
                className={styles.inputTxtForm}
              />
              <h5>8~20자의 영문, 숫자, 특수문자를 사용하세요.</h5>
            </div>
            <div className={styles.inputForm}>
              <h3>새 비밀번호 확인</h3>
              <input
                type="text"
                placeholder="Password"
                className={styles.inputTxtForm}
              />
            </div>
            <div className={styles.formBtnArray}>
              <button className={styles.saveBtn}>저장</button>
              <button className={styles.deleteBtn}>취소</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentsPasswordChange;
