import styles from "./ModernLoading.module.scss";

const LoadingSpinner = () => {
  return (
    <div className={styles.loadingContainer}>
      <div className={styles.spinner}></div>
      <span className={styles.loadingText}>Loading...</span>
    </div>
  );
};

export default LoadingSpinner;
