import { create } from 'zustand'

const useUsernameStore = create((set) => ({
  username: null,
  setUsername: (username) => set(() => ({ username: username })),
  removeUsername: () => set({ username: null }),
}))

export {useUsernameStore}