<script setup lang="ts">
import VImage from './VImage.vue'

defineProps<{ show: any; type: string }>()

const getCompactCurrency = (currency: number) => {
  return new Intl.NumberFormat('us-EN', {
    style: 'currency',
    notation: 'compact',
    currency: 'USD'
  }).format(currency)
}
</script>

<template>
  <div>
    <h2 class="text-3xl font-semibold">Facts</h2>
    <div class="mt-3 grid gap-3">
      <div v-if="show?.status">
        <h3 class="text-lg font-medium">Status</h3>
        <p class="text-sm text-gray-400">{{ show?.status }}</p>
      </div>
      <div v-if="show?.budget">
        <h3 class="text-lg font-medium">Budget</h3>
        <p class="text-sm text-gray-400">
          {{ getCompactCurrency(show?.budget) }}
        </p>
      </div>
      <div v-if="show?.revenue">
        <h3 class="text-lg font-medium">Revenue</h3>
        <p class="text-sm text-gray-400">
          {{ getCompactCurrency(show?.revenue) }}
        </p>
      </div>
      <div v-if="show?.type">
        <h3 class="text-lg font-medium">Type</h3>
        <p class="text-sm text-gray-400">
          {{ show?.type }}
        </p>
      </div>
      <div v-if="show?.genres">
        <h3 class="text-lg font-medium">
          Genre{{ show.genres.length == 1 ? '' : 's' }}
        </h3>
        <p class="flex flex-wrap gap-1 text-sm text-wf-200">
          <router-link
            v-for="{ name, id } in show.genres"
            :key="id"
            class="rounded-sm bg-gray-200 px-0.5 py-[1px] text-xs font-semibold outline-none ring-slate-300 ring-offset-2 ring-offset-slate-800 focus-visible:ring-1"
            :to="`/genre/${type == 'movie' ? 'movies' : 'series'}/${id}`"
          >
            {{ name }}
          </router-link>
        </p>
      </div>
      <div v-if="show?.networks">
        <h3 class="mb-1 text-lg font-medium">
          Network{{ show.networks.length == 1 ? '' : 's' }}
        </h3>
        <p class="flex flex-col gap-3">
          <router-link
            v-for="{ id, logo_path } in show.networks"
            :key="id"
            class="-m-1 w-fit rounded-sm p-1 outline-none ring-offset-1 ring-offset-slate-800 focus-visible:ring-1"
            :to="`/network/${id}`"
          >
            <VImage :src="`https://image.tmdb.org/t/p/h30${logo_path}`" />
          </router-link>
        </p>
      </div>
    </div>
  </div>
</template>
