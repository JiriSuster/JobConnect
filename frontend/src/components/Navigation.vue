<script setup lang="ts">

</script>

<template>
  <v-card color="#dadada">
    <v-row align="center">
      <v-col cols="auto align-center ml-2">
        <router-link :to="{name: '/'}">
          <v-avatar size="40">
            <v-img src="https://cdn-icons-png.freepik.com/256/7028/7028016.png" />
          </v-avatar>
        </router-link>
      </v-col>
      <v-col>
        <v-tabs
          align-tabs="end"
          color="black"
        >
          <v-tab :to="{name: '/'}" :value="1">My jobs</v-tab>

        </v-tabs>
      </v-col>
    </v-row>
  </v-card>
</template>

<style scoped>

</style>
