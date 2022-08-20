<script setup>
import { ref } from "@vue/reactivity";
import { useRoute, useRouter } from "vue-router";
import { onMounted, watch } from "@vue/runtime-core";
import { gsap } from "gsap";
import scrollTrigger from "gsap/ScrollTrigger";
import axios from "axios";
import Navbar from "../components/Navbar.vue";
import Recomendations from "./Recomendations.vue";
import Loader from "./Loader.vue";
import VImage from "./VImage.vue";

gsap.registerPlugin(scrollTrigger);

const route = useRoute(),
  router = useRouter(),
  show = ref(null),
  cast = ref(null),
  totalCast = ref(null),
  isLoading = ref(false),
  nowAt = ref(null),
  playingTrailer = ref(false),
  trailer = ref(null),
  props = defineProps(["type"]),
  background = ref(),
  castToShow = ref(0);

onMounted(() => {
  fetchData();
});

watch(route, () => {
  let currPath = route.matched[0].path;
  console.log();
  if (
    route.params.id !== nowAt.value &&
    (currPath === "/movie/:id" || currPath === "/series/:id")
  ) {
    fetchData();
  }
});

// watch(background, () => {
//   if (background.value) {
//     gsap.to(background.value, {
//       y: 500,
//       scrollTrigger: {
//         trigger: "body",
//         start: "top top",
//         end: "bottom top",
//         scrub: true,
//       },
//     });
//   }
// });

const fetchData = async () => {
  show.value = null;
  cast.value = [];
  totalCast.value = [];
  trailer.value = null;
  nowAt.value = route.params.id;
  isLoading.value = true;
  await axios
    .get(
      `https://api.themoviedb.org/3/${props.type}/${route.params.id}?api_key=18cfdbd5b22952a0c5c289fbbf02c827`
    )
    .then((res) => {
      show.value = res.data;
      document.title = `${res.data?.name || res.data?.title} - Webflix`;
      isLoading.value = false;
    })
    .catch((err) => {
      console.error(err);
      router.push("/404");
    });

  let castRes = await axios.get(
    `https://api.themoviedb.org/3/${props.type}/${route.params.id}/credits?api_key=18cfdbd5b22952a0c5c289fbbf02c827`
  );
  totalCast.value = castRes.data.cast;
  incremeantCast();
  cast.value = castRes.data.cast.slice(0, 12);

  let vidRes = await axios.get(
    `https://api.themoviedb.org/3/${props.type}/${route.params.id}/videos?api_key=18cfdbd5b22952a0c5c289fbbf02c827`
  );
  trailer.value = await vidRes.data.results[0];
};

const getMoreCast = () => {
  if (cast.value.length < totalCast.value.length) {
    incremeantCast();
    cast.value = totalCast.value?.slice(0, castToShow.value);
  }
};

const incremeantCast = () => {
  if (totalCast.value.length - cast.value.length < 12)
    castToShow.value += totalCast.value.length - cast.value.length;
  else castToShow.value += 12;
};

const getReleaseDate = (str) => {
  return str?.slice(0, 4);
};

const getLanguage = (str) => {
  return str?.toUpperCase();
};

const getNumebrOf = (n, type) => {
  if (n === 1) return n + " " + type;
  else return n + " " + type + "s";
};

const replaceWithPlaceholder = (gender, e) => {
  if (gender === 1) {
    e.target.src = "/female-placeholder.jpeg";
  } else e.target.src = "/male-placeholder.jpg";
};

const getDuration = (n) => {
  if (n > 360) return "4hrs " + (n - 360) + "min";
  if (n === 360) return "4hrs ";

  if (n > 240) return "3hrs " + (n - 240) + "min";
  if (n === 240) return "3hrs ";

  if (n > 120) return "2hrs " + (n - 120) + "min";
  if (n === 120) return "2hrs ";

  if (n > 60) return "1hr " + (n - 60) + "min";
  if (n === 60) return "1hr ";

  if (n < 60) return n + "mins";
};
</script>

<template>
  <div class="flex flex-col">
    <Navbar />

    <Loader v-if="isLoading" />

    <div v-else>
      <div
        class="relative min-h-screen overflow-hidden bg-[#032c37]"
        v-if="show !== null"
      >
        <VImage
          ref="background"
          v-if="show.backdrop_path"
          class="object-cover overflow-hidden z-0 min-h-[65vh] xs:min-h-[75vh] md:!min-h-screen max-h-screen translate-x-0 md:translate-x-40 lg:translate-x-60 xl:translate-x-72 2xl:translate-x-80 absolute top-0"
          :src="`https://image.tmdb.org/t/p/original/${show.backdrop_path}`"
        />
        <div
          ref="overlay"
          class="overlay absolute z-10 top-0 left-0 p-3 w-full h-full transition-opacity max-h-screen pointer-events-none"
        ></div>

        <div class="max-w-break mx-auto relative mt-[50vh]">
          <div
            class="relative z-10 mt-[50vh] flex flex-col justify-end md:justify-center min-h-[50vh] md:absolute bottom-8 md:bottom-auto md:top-1/2 md:-translate-y-1/2 md:mt-auto mx-8 md:mx-16 lg:mx-32 md:max-w-[48%] lg:max-w-[38%]"
          >
            <em
              ><h3 class="text-gray-400">
                {{ show.tagline }}
              </h3></em
            >
            <h2
              class="text-5xl font-semibold mt-3 break-words"
              style="hyphens: auto"
              :class="
                show.name?.length > 40 || show.title?.length > 40
                  ? '!text-4xl '
                  : ''
              "
            >
              {{ show.name || show.title }}
            </h2>
            <p class="mt-4 flex items-center flex-wrap" v-if="type === 'movie'">
              <span>
                {{ getReleaseDate(show?.release_date) }}
              </span>
              <span class="rounded-full w-1 h-1 mx-1.5 bg-white inline-block">
              </span>
              <span>
                {{ getDuration(show?.runtime) }}
              </span>
              <span
                class="rounded-full w-1 h-1 mx-1.5 bg-white inline-block"
              ></span>
              <span>
                {{ getLanguage(show?.original_language) }}
              </span>
            </p>
            <p class="mt-4 flex items-center flex-wrap" v-else>
              <span>
                {{ getReleaseDate(show?.first_air_date) }}
              </span>
              <span class="rounded-full w-1 h-1 mx-1.5 bg-white inline-block">
              </span>
              <span>
                {{ getNumebrOf(show?.number_of_seasons, "Season") }}
              </span>
              <span
                class="rounded-full w-1 h-1 mx-1.5 bg-white inline-block"
              ></span>
              <span>
                {{ getNumebrOf(show?.number_of_episodes, "Episode") }}
              </span>
              <span
                class="rounded-full w-1 h-1 mx-1.5 bg-white inline-block"
              ></span>
              <span>
                {{ getLanguage(show?.original_language) }}
              </span>
            </p>
            <p class="text-gray-300 mt-2">
              {{ show?.overview }}
            </p>
            <button
              @click="playingTrailer = true"
              class="relative mt-6 flex items-center gap-x-2 font-extralight text-sm w-max bg-darkblue-100 hover:bg-darkblue-100/75 transition-colors px-3 py-1 rounded-sm"
            >
              <svg
                class="w-5 h-5 text-gray-400 cursor-pointer"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                  clip-rule="evenodd"
                ></path>
              </svg>
              <span>Play Trailer</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div
      class="grid md:grid-cols-4 gap-x-5 px-5 py-10 w-full max-w-break mx-auto"
    >
      <div class="col-span-3 order-2 md:order-1" v-if="cast?.length > 0">
        <h2 class="text-3xl font-semibold">Cast</h2>
        <div class="!relative">
          <div
            class="flex gap-x-3 mt-4 overflow-x-auto pb-2 max-w-[calc(100vw-2.5rem)]"
          >
            <div
              v-for="member in cast"
              :key="member.cast_id"
              class="max-w-[9rem] min-w-[9rem] bg-darkblue-200 rounded-md overflow-hidden"
            >
              <router-link :to="`/person/${member.id}`">
                <VImage
                  v-if="member.profile_path"
                  class="w-36 h-52 object-cover hover:opacity-75 transition-opacity"
                  :src="`https://image.tmdb.org/t/p/w200/${member.profile_path}`"
                  :alt="member.name"
                />
                <VImage
                  v-else
                  class="w-36 h-52 object-cover"
                  :src="
                    member.gender === 1
                      ? '/female-placeholder.jpeg'
                      : '/male-placeholder.jpg'
                  "
                  :alt="member.name"
                />
              </router-link>
              <div class="p-2">
                <router-link
                  :to="`/person/${member.id}`"
                  class="font-semibold block hover:text-gray-400"
                  >{{ member.name }}</router-link
                >
                <span class="text-green-400">AS</span>
                <h4 class="text-gray-400">{{ member.character }}</h4>
              </div>
            </div>
            <button
              v-if="cast?.length < totalCast?.length"
              @click="getMoreCast()"
              class="bg-darkblue-200 rounded-md px-10 hover:bg-darkblue-200/60 transition-colors relative"
            >
              <span
                class="absolute rotate-90 -translate-x-1/2 -translate-y-1/2 text-5xl font-black text-darkblue-300"
                >More</span
              >
            </button>
          </div>
        </div>
      </div>
      <div class="order-1 md:order-2 mb-8">
        <h2 class="text-3xl font-semibold">Facts</h2>
        <div class="grid gap-3 mt-3">
          <div v-if="show?.status">
            <h3 class="text-lg font-medium">Status</h3>
            <p class="text-gray-400 text-sm">{{ show?.status }}</p>
          </div>
          <div v-if="show?.budget">
            <h3 class="text-lg font-medium">Budget</h3>
            <p class="text-gray-400 text-sm">
              {{
                new Intl.NumberFormat("us-EN", {
                  style: "currency",
                  currency: "USD",
                }).format(show?.budget)
              }}
            </p>
          </div>
          <div v-if="show?.revenue">
            <h3 class="text-lg font-medium">Revenue</h3>
            <p class="text-gray-400 text-sm">
              {{
                new Intl.NumberFormat("us-EN", {
                  style: "currency",
                  currency: "USD",
                }).format(show?.revenue)
              }}
            </p>
          </div>

          <div v-if="show?.type">
            <h3 class="text-lg font-medium">Type</h3>
            <p class="text-gray-400 text-sm">
              {{ show?.type }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <Recomendations :type="type"/>
  </div>

  <transition name="fade">
    <div
      v-if="playingTrailer"
      @click="playingTrailer = false"
      class="fixed inset-0 w-full h-screen bg-darkblue-300/80 backdrop-blur-lg z-30"
    >
      <div v-if="trailer?.site === 'YouTube'">
        <div
          class="absolute inset-1/2 -translate-x-1/2 -translate-y-1/2 w-9/12 pb-[56.25%] xl:h-[600px] xl:pb-0"
        >
          <iframe
            class="w-full h-full absolute top-1/2 left-0 -translate-y-1/2"
            style="aspect-ratio: 16/9"
            :src="`https://www.youtube.com/embed/${trailer?.key}`"
            title="YouTube video player"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          ></iframe>
        </div>
      </div>
    </div>
  </transition>
</template>

<style>
.overlay {
  background: linear-gradient(to left, transparent, rgb(3 44 55) 75%);
}

@media screen and (max-width: 768px) {
  .overlay {
    background: linear-gradient(to bottom, transparent, rgb(3 44 55) 75%);
  }
}

@media screen and (max-width: 450px) {
  .overlay {
    background: linear-gradient(to bottom, transparent, rgb(3 44 55) 60%);
  }
}
</style>
