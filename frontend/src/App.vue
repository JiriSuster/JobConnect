<template>
  <v-app>
    <header>
      <navigation></navigation>
    </header>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">

import Navigation from "@/components/Navigation.vue"
</script>
