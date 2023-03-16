<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'

import VButton from '../components/VButton.vue'
import VError from '../components/VError.vue'
import VInput from '../components/VInput.vue'
import { useStore } from '../store'
import { supabase } from '../supabase'
import VImage from '../components/VImage.vue'
import useHead from '../composables/useHead'

useHead({ title: 'Login to Webflix' })

const isNewUser = ref(false),
  err = ref<any>(''),
  isLoading = ref(false),
  store = useStore(),
  router = useRouter(),
  name = ref(''),
  email = ref(''),
  password = ref('')

watch(isNewUser, () => {
  isNewUser.value
    ? useHead({ title: 'Signin to Webflix' })
    : useHead({ title: 'Login to Webflix' })
})

const login = async () => {
  try {
    err.value = ''
    isLoading.value = true
    const { user, error } = await supabase.auth.signIn({
      email: email.value,
      password: password.value
    })
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

const signup = async () => {
  try {
    err.value = ''
    isLoading.value = true
    const { user, error } = await supabase.auth.signUp(
      {
        email: email.value,
        password: password.value
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

<template>
  <div class="mx-auto w-full max-w-break p-5 pt-24">
    <div
      class="mx-auto mt-8 grid max-w-[800px] items-stretch gap-3 overflow-hidden rounded-md bg-wf-200 md:h-[550px] md:grid-cols-2"
    >
      <div class="my-auto p-5">
        <h1 class="mb-6 text-4xl font-semibold">
          {{ isNewUser ? 'Register' : 'Login' }}
        </h1>
        <VError v-if="err">
          {{ err.message }}
        </VError>
        <form
          @submit.prevent="
            () => {
              isNewUser ? signup() : login()
            }
          "
          class="relative mt-5 flex flex-col gap-3"
        >
          <VInput
            type="text"
            name="name"
            v-model="name"
            @valueChange="((val: string) => name = val)"
            placeholder="Your name"
            class="!w-full"
            v-if="isNewUser"
          />
          <VInput
            type="email"
            v-model="email"
            @valueChange="((val: string) => email = val)"
            name="email"
            placeholder="Your email"
            class="!w-full"
          />
          <VInput
            type="password"
            name="password"
            v-model="password"
            @valueChange="((val: string) => password = val)"
            placeholder="Your password"
            class="!w-full"
          />
          <VButton
            class="self-end outline-none ring-emerald-600 ring-offset-1 ring-offset-wf-300 focus-within:ring"
            :disabled="isLoading"
            >Submit</VButton
          >

          <button
            type="button"
            class="link -mx-1 w-fit rounded-sm px-1 outline-none focus-within:ring"
            @click="isNewUser = !isNewUser"
          >
            {{ isNewUser ? 'Already have an account?' : 'New here?' }}
          </button>
        </form>
      </div>
      <VImage src="/minions.jpg" class="hidden h-[inherit] !w-full md:block" />
    </div>
  </div>
</template>
