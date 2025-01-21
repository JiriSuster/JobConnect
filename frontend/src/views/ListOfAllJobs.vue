<script setup lang="ts">
import { onMounted, ref } from "vue";
import type { Job } from "@/model/Job";
import JobList from "@/components/JobList.vue";
import { useJobServiceStore } from "@/stores/job.store";
import config from "@/config";
import { useAuth } from "@/composables/useAuth";

const auth = useAuth();
const jobs = ref<Array<Job>>([]);
const searchText = ref("");
const isLoading = ref(false);

const selectedFields = ref<Array<string>>(["title", "description"]);

const availableFields = [
  { name: "Title", value: "title" },
  { name: "Description", value: "description" },
  { name: "Categories", value: "categories" },
  { name: "Subcategories", value: "subcategories" },
];

onMounted(async () => {
  await fetchJobs();
});

const store = useJobServiceStore();

async function fetchJobs() {
  isLoading.value = true;
  const response = await store.getAllJobs();
  jobs.value = response;
  isLoading.value = false;
}

async function search() {
  isLoading.value = true;
  const response = await auth.authorizedRequest(
      `${config.backendUrl}/jobs/search`,
      "POST",
      {
        data: {
          text: searchText.value,
          fields: selectedFields.value,
        },
      }
  );
  jobs.value = response;
  isLoading.value = false;
}
</script>

<template>
  <v-container>

    <v-row class="mb-4">
      <v-col cols="12" md="6">
        <v-text-field
            v-model="searchText"
            label="Search Text"
            placeholder="Enter search text"
            outlined
            dense
            clearable
        />
      </v-col>

      <v-col cols="12" md="6">
        <v-select
            v-model="selectedFields"
            :items="availableFields"
            item-title="name"
            item-value="value"
            label="Select Fields"
            outlined
            dense
            multiple
            clearable
        />
      </v-col>
    </v-row>

    <v-row>
      <v-col class="d-flex justify-end">
        <v-btn
            :loading="isLoading"
            :disabled="selectedFields.length === 0"
            @click="search"
            color="primary"
            rounded
        >
          Search
        </v-btn>
      </v-col>
    </v-row>

    <v-divider class="my-4"></v-divider>

    <JobList
        :jobs="jobs"
        :can-be-assigned="true"
        @refetch-jobs="searchText.length ? search() : fetchJobs()"
    />
  </v-container>
</template>

<style scoped>
</style>
