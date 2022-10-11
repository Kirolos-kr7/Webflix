import type { User } from '@supabase/supabase-js'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Toast } from './types'

export const useStore = defineStore('main', () => {
  const user = ref<User | null>()
  const toastList = ref<Toast[]>([])

  const createToast = (
    { msg = '', redirect = '', status = true, id = Date.now(), action = '' },
    timeout: number = 1800
  ) => {
    const toast: Toast = { msg, redirect, status, id, action }
    toastList.value?.push(toast)

    setTimeout(() => removeToast(toast.id), timeout)
  }
  const removeToast = (id: number) => {
    toastList.value = toastList.value?.filter((toast: Toast) => toast.id !== id)
  }

  return { user, toastList, createToast, removeToast }
})
