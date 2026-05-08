///////********* How to use it zustand ********/////////
/*
1. Set token after login:
        useAuthStore.getState().setToken(access_token);
    OR inside component:
        const setToken = useAuthStore((s) => s.setToken);
        setToken(access_token);

2. Read token:
    const token = useAuthStore((s) => s.accessToken);
3. Logout:
    useAuthStore.getState().logout();

*/

import { create } from "zustand";
import { persist } from "zustand/middleware";

type User = {
  id: string;
  email: string;
  role: string;
};

type AuthState = {
  user: User | null;
  accessToken: string | null;
  hydrated: boolean;

  setUser: (user: User) => void;
  setToken: (token: string) => void;
  setHydrated: (v: boolean) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      hydrated: false,

      setUser: (user) => set({ user }),
      setToken: (token) => set({ accessToken: token }),
      setHydrated: (v) => set({ hydrated: v }),

      logout: () =>
        set({
          user: null,
          accessToken: null,
        }),
    }),
    {
      name: "auth-storage",
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    }
  )
);