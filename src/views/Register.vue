<template>
  <Navbar />

  <div class="mx-auto w-full max-w-break p-5 pt-24">
    <div class="mx-auto mt-20 max-w-[500px] rounded-md bg-wf-200 p-5">
      <h1 class="mb-6 text-4xl font-semibold">Register</h1>
      <VError v-if="err">
        {{ err.message }}
      </VError>
      <form
        @submit.prevent="signup"
        class="relative mt-5 flex flex-col items-end gap-3"
      >
        <VInput
          type="text"
          name="name"
          placeholder="Your name"
          class="!w-full"
        />
        <VInput
          type="email"
          name="email"
          placeholder="Your email"
          class="!w-full"
        />
        <VInput
          type="password"
          name="password"
          placeholder="Your password"
          class="!w-full"
        />
        <VButton :disabled="isLoading">Submit</VButton>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { supabase } from '../supabase'
import Navbar from '../components/Navbar.vue'
import VInput from '../components/VInput.vue'
import VButton from '../components/VButton.vue'
import VError from '../components/VError.vue'
import { useStore } from '../store'
import { useRouter } from 'vue-router'

const err = ref('')
const isLoading = ref(false)
const store = useStore()
const router = useRouter()

const signup = async (e) => {
  let name = e.target.querySelector('[name="name"]').value
  let email = e.target.querySelector('[name="email"]').value
  let password = e.target.querySelector('[name="password"]').value

  try {
    err.value = ''
    isLoading.value = true
    const { user, error } = await supabase.auth.signUp(
      {
        email,
        password
      },
      {
        data: { name }
      }
    )
    if (error) err.value = error
    if (user) {
      store.user = user
      router.push('/')
    }
  } catch (error) {
    err.value = error
  }
  isLoading.value = false
}
</script>
