import { defineStore } from 'pinia'

export const useStore = defineStore('main', {
  state: () => ({
    user: null,
    toastList: []
  }),

  actions: {
    createToast({ msg, redirect, status = true }, timeout = 1800) {
      let toast = { msg, redirect, status }
      toast.id = Date.now()
      this.toastList.push(toast)

      setTimeout(() => this.removeToast(toast.id), timeout)
    },
    removeToast(id) {
      this.toastList = this.toastList.filter((toast) => toast.id !== id)
    }
  }
})
