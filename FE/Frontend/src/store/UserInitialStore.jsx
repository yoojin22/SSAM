// 데이터 저장
import { create } from "zustand";

const useUserInitialStore = create((set) => ({
  userInitialData: null,
  setUserInitialData: (data) => set({ userInitialData: data }),
}));

export default useUserInitialStore;
