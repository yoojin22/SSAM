import { create } from "zustand";
import { persist } from "zustand/middleware";

const useTokenStore = create(
  persist(
    (set) => ({
      accessToken: null,
      setAccessToken: (accessToken) => set({ accessToken }),
    }),
    {
      name: "userStorage",
      getStorage: () => localStorage,
    }
  )
);

export default useTokenStore;
``;
