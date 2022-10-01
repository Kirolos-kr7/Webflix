<template>
  <div
    class="fixed top-0 z-40 mt-14 flex h-[95vh] w-screen items-center justify-center bg-wf-300/80"
  >
    <span class="loader" />
  </div>
</template>

<style scoped>
.loader {
  width: 120px;
  height: 80px;
  position: relative;
  transform: scaleX(-1);
  background: linear-gradient(174deg, #0000 49%, #000 50%, #0000 51%);
}
.loader:after,
.loader:before {
  content: '';
  border-radius: 100%;
  width: 35px;
  height: 35px;
  display: block;
  position: absolute;
  border: 4px dashed #fff;
  bottom: 49px;
  transform: rotate(0deg);
  box-sizing: border-box;
  animation: tape 4s linear infinite;
}
.loader:before {
  right: -14px;
  box-shadow: 0 0 0 4px #fff, 0 0 0 34px #000, 0 0 5px 34px #0005;
}
.loader:after {
  left: -13px;
  box-shadow: 0 0 0 4px #fff, 0 0 0 65px #000, 0 0 5px 65px #0005;
}

@keyframes tape {
  0% {
    transform: rotate(0deg) scale(0.4);
  }
  100% {
    transform: rotate(-360deg) scale(0.4);
  }
}
</style>
