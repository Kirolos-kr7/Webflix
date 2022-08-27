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
    .eq('user_id', store.user.id)

  if (data.length === 0) {
    await supabase
      .from('favourite_shows')
      .insert([{ user_id: store.user.id, shows: [] }])
  }
})
</script>

<template>
  <VTitle title="Favourite" />
</template>
