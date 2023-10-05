import { getUnreadMessageCount } from '@/api/user.ts'
import { createPinia, defineStore } from 'pinia'

const pinia = createPinia()

export const useMessageStore = defineStore('message', {
  state: () => ({
    unreadMessageCount: 0,
  }), actions: {
    async getUnreadMessageCount() {
      const isLogin = localStorage.getItem('token')
      if (!isLogin) {
        this.unreadMessageCount = 0
        return
      }
      const resp = await getUnreadMessageCount()
      this.unreadMessageCount = resp.data.data
    },
  },
})

export default pinia
