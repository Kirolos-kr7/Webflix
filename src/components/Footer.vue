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
            class="-mx-0.5 rounded-sm px-0.5 text-green-300 outline-none transition-colors hover:text-green-400 focus-visible:ring-2"
            href="https://github.com/Kirolos-kr7"
            >Kirolos</a
          ></span
        >
      </h2>
      <ul class="flex justify-center gap-3 md:justify-end">
        <li>
          <router-link
            class="green-link -mx-1 rounded-sm px-1 outline-none focus-visible:ring-2"
            to="/"
            >Trending</router-link
          >
        </li>
        <li>
          <router-link
            class="green-link -mx-1 rounded-sm px-1 outline-none focus-visible:ring-2"
            to="/movies"
            >Movies</router-link
          >
        </li>
        <li>
          <router-link
            class="green-link -mx-1 rounded-sm px-1 outline-none focus-visible:ring-2"
            to="/series"
            >Series</router-link
          >
        </li>
        <li>
          <router-link
            class="green-link -mx-1 rounded-sm px-1 outline-none focus-visible:ring-2"
            to="/genres"
            >Genres</router-link
          >
        </li>
      </ul>
    </div>
  </div>
</template>
