import { create } from "zustand";

const useLoginStore = create((set) => ({
  username: "",
  password: "",
  isLoggedIn: false,
  setUsername: (username) => set({ username }),
  setPassword: (password) => set({ password }),
  setLoggedIn: (isLoggedIn) => set({ isLoggedIn }),
  handleChange: (e) => {
    const { name, value } = e.target;
    set((state) => ({
      ...state,
      // 구조 분해 할당 (동적 키 처리)
      [name]: value,
    }));
  },
}));

export default useLoginStore;
