<template>
  <header
    class="relative grid min-h-screen place-content-center px-3"
    style="
      background: url(/banner.jpg) center center no-repeat;
      animation: zoom 120s infinite;
    "
  >
    <div
      class="overlay absolute top-0 left-0 h-full w-full"
      style="background-image: radial-gradient(#032c3763, #032c37dc)"
    ></div>
    <div class="relative mx-auto -translate-y-8 text-center">
      <h2 class="text-5xl font-extrabold">
        All the shows you like<br />
        and much more.
      </h2>
      <p class="mt-2 text-lg text-[#7ffdc8]">
        Totally free, No subsciption needed.
      </p>

      <a href="/"><button class="main-btn">Start Watching</button></a>
    </div>
  </header>
</template>

<style>
@keyframes zoom {
  0%,
  100% {
    background-size: auto 120%;
  }
  50% {
    background-size: auto 150%;
  }
}
</style>
