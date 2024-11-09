<template>
  <v-app>
    <v-main>
    <BoardView/>
    </v-main>
  </v-app>
</template>

<script>
import BoardView from './views/BoardView.vue'

export default {
  name: 'App',
  components: {
    BoardView
  }
}
</script>