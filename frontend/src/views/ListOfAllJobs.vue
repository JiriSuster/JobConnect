<script setup lang="ts">
import {onMounted, ref} from "vue";
import type {Job} from "@/model/Job";
import JobList from "@/components/JobList.vue";
import {useJobServiceStore} from "@/stores/job.store";

const jobs = ref<Array<Job>>([])

onMounted(async () => {
  await fetchJobs()
})

const store = useJobServiceStore()
async function fetchJobs() {
  const response = await store.getAllJobs()
  jobs.value = response
}
</script>

<template>
  <JobList :jobs="jobs" :can-be-assigned="true" />
</template>

<style scoped>

</style>