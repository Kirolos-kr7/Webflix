<template>
  <div class="relative bg-wf-200 py-8 px-6 text-lg">
    <div class="grid items-center gap-3 sm:grid-cols-2">
      <h2
        class="clear -mb-2 text-center font-bebasNeue text-6xl sm:text-left md:text-7xl"
      >
        WEBFLIX
        <span class="text-lg">
          by
          <a
            class="text-green-300 transition-colors hover:text-green-400"
            href="https://github.com/Kirolos-kr7"
            >Kirolos</a
          ></span
        >
      </h2>
      <ul class="flex justify-center gap-3 md:justify-end">
        <li><router-link class="green-link" to="/">Trending</router-link></li>
        <li>
          <router-link class="green-link" to="/movies">Movies</router-link>
        </li>
        <li>
          <router-link class="green-link" to="/series">Series</router-link>
        </li>
        <li>
          <router-link class="green-link" to="/genres">Genres</router-link>
        </li>
      </ul>
    </div>
  </div>
</template>
