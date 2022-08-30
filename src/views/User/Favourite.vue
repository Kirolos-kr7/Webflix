<script setup>
import { onMounted } from 'vue'
import VTitle from '../../components/VTitle.vue'
import { useStore } from '../../store'
import { supabase } from '../../supabase'

const store = useStore()
onMounted(async () => {
  let { data } = await supabase
    .from('favourite_shows')
    .select()
    .eq('user', store.user.id)

  console.log(data)
})
</script>

<template>
  <VTitle title="Favourite" />
</template>
