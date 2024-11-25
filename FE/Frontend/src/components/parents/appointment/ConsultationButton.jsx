import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import styles from "./ConsultationButton.module.scss";

const ConsultationButton = ({ index, clickedIndex, onClick, isAvailable }) => {
  // 클릭 함수
  const handleClick = () => {
    onClick(index);
  };

  // 버튼 클래스 지정 함수
  const getButtonClasses = () => {
    if (!isAvailable) {
      return styles.unavailable;
    }
    return index === clickedIndex ? `${styles.clicked}` : styles.available;
  };

  const buttonText = isAvailable ? "신청가능" : "신청불가";

  return (
    <>
      <button
        className={getButtonClasses()}
        onClick={handleClick}
        disabled={!isAvailable}
      >
        {buttonText}
      </button>
    </>
  );
};

ConsultationButton.propTypes = {
  index: PropTypes.number.isRequired,
  clickedIndex: PropTypes.number,
  onClick: PropTypes.func.isRequired,
  isAvailable: PropTypes.bool.isRequired,
};

export default ConsultationButton;
