<script setup>
import axios from 'axios'
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Loader from '../components/Loader.vue'
import Navbar from '../components/Navbar.vue'
import VImage from '../components/VImage.vue'

const person = ref(null),
  credits = ref(null),
  route = useRoute(),
  nowAt = ref(null),
  isLoading = ref(false),
  router = useRouter()

onMounted(async () => {
  fetchData()
})

watch(route, () => {
  let currPath = '/' + route.path.split('/')[1]
  if (route.params.id !== nowAt.value && currPath === '/person') {
    fetchData()
  }
})

const fetchData = async () => {
  isLoading.value = true
  if (route.params.id) {
    nowAt.value = route.params.id
    await axios
      .get(
        `https://api.themoviedb.org/3/person/${route.params.id}?api_key=18cfdbd5b22952a0c5c289fbbf02c827`
      )
      .then((res) => {
        person.value = res.data
      })
      .catch((err) => {
        console.error(err)
        router.push('/404')
      })
    await axios
      .get(
        `https://api.themoviedb.org/3/person/${route.params.id}/combined_credits?api_key=18cfdbd5b22952a0c5c289fbbf02c827`
      )
      .then((res) => {
        credits.value = res.data.cast
        credits.value.sort((a, b) => {
          if (a.popularity < b.popularity) return 1
          else return -1
        })
      })
  }
  isLoading.value = false
}

const clacAge = (age) => {
  let birthAt = new Date(age)
  let now = new Date()
  return `${now.getFullYear() - birthAt.getFullYear()} Years Old`
}
</script>

<template>
  <Navbar />

  <Loader v-if="isLoading" />

  <div class="mx-auto w-full max-w-break p-5 pt-24">
    <div v-if="person" class="grid md:grid-cols-[350px,auto]">
      <div class="flex flex-col md:px-3">
        <VImage
          v-if="person.profile_path"
          class="mx-auto rounded-md object-cover xs:max-w-[300px] md:mx-px"
          :src="`https://image.tmdb.org/t/p/w500/${person.profile_path}`"
        />
        <h1 class="mt-5 text-4xl font-semibold md:hidden">
          {{ person.name }}
        </h1>
        <div>
          <h2 class="mt-5 text-xl font-medium">Personal Information</h2>
          <div class="mt-3 grid gap-3">
            <div>
              <h3>Known For</h3>
              <p class="text-sm text-gray-400">
                {{ person.known_for_department }}
              </p>
            </div>
            <div>
              <h3>Gender</h3>
              <p class="text-sm text-gray-400">
                {{ person.gender == 2 ? 'Male' : 'Female' }}
              </p>
            </div>
            <div>
              <h3>Birthday</h3>
              <p class="text-sm text-gray-400">
                {{ person.birthday + ` (${clacAge(person.birthday)})` }}
              </p>
            </div>
            <div>
              <h3>Place of Birth</h3>
              <p class="text-sm text-gray-400">{{ person.place_of_birth }}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="flex flex-1 flex-col py-2 md:px-3">
        <h1 class="hidden text-4xl font-semibold md:block">
          {{ person.name }}
        </h1>
        <div v-if="person.biography">
          <h2 class="mt-5 text-xl font-medium">Biography</h2>
          <p class="mt-2 text-gray-400">
            {{ person.biography }}
          </p>
        </div>
        <div v-if="credits?.length > 0">
          <h2 class="mt-5 text-xl font-medium">Known For</h2>
          <div class="mt-3 flex gap-x-3 overflow-x-auto pb-2">
            <router-link
              class="flex-shrink-0"
              v-for="credit in credits?.slice(0, 12)"
              :key="credit.id"
              :to="
                credit.media_type === 'person'
                  ? `/person/${credit.id}`
                  : credit.media_type === 'movie'
                  ? `/movie/${credit.id}`
                  : credit.media_type === 'tv'
                  ? `/series/${credit.id}`
                  : '/404'
              "
            >
              <VImage
                v-if="credit.poster_path"
                class="w-36 rounded-md object-cover hover:opacity-70"
                :src="`https://image.tmdb.org/t/p/w150_and_h225_bestv2/${credit.poster_path}`"
              />
              <VImage
                v-else
                class="w-36 rounded-md object-cover hover:opacity-70"
                src="/broken.png"
              />
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
