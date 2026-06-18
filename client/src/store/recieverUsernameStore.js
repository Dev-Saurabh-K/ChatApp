import { create } from 'zustand'

const useRecieverUsernameStore = create((set) => ({
  recieverusername: null,
  setRecieveUsername: (recieverusername) => set(() => ({ recieverusername: recieverusername })),
  removeRecieveUsername: () => set({ recieverusername: null }),
}))

export {useRecieverUsernameStore}