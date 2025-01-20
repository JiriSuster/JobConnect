<template>
  <v-container class="mt-4">
    <div v-for="(job, index) in jobs" :key="index" class="mb-4">
      <v-card>
        <v-card-title>
          {{ job.title }}
        </v-card-title>
        <v-card-subtitle>
          Category: {{ job.categories.join(', ') }}
        </v-card-subtitle>
        <v-card-actions>
          <v-btn color="primary" @click="viewJobDetails(job)">
            View Details
          </v-btn>
        </v-card-actions>
      </v-card>
    </div>

    <v-dialog v-model="isJobDialogOpen" max-width="600px">
      <v-card>
        <v-card-title>
          Job Details
          <v-spacer/>
          <v-btn icon @click="isJobDialogOpen = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <div v-if="selectedJob?.title"><strong>Title:</strong> {{ selectedJob?.title }}</div>
          <div v-if="selectedJob?.customerEmail"><strong>Customer email:</strong> {{ selectedJob?.customerEmail }}</div>
          <div v-if="selectedJob?.companyEmail"><strong>Assigned company email:</strong> {{ selectedJob?.companyEmail }}</div>
          <div v-if="selectedJob?.description"><strong>Description:</strong> {{ selectedJob?.description }}</div>
          <div v-if="selectedJob?.categories"><strong>Category:</strong> {{ selectedJob?.categories.join(', ') }}</div>
          <div v-if="selectedJob?.subcategories"><strong>Subcategories:</strong> {{ selectedJob?.subcategories.join(', ') }}</div>
          <div v-if="selectedJob?.budget"><strong>Budget:</strong> ${{ selectedJob?.budget }}</div>
          <div v-if="selectedJob?.images && selectedJob.images.length">
            <strong>Images:</strong>
            <v-chip-group>
              <v-chip
                  v-for="(image, index) in selectedJob.images"
                  :key="index"
                  class="ma-1"
              >
                <v-icon left>mdi-file-image</v-icon>
                {{ image.name }}
              </v-chip>
            </v-chip-group>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="isJobDialogOpen = false">
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { Job } from "@/model/Job";

const props = defineProps({
  jobs: {
    type: Array as () => Array<Job>,
    required: true,
  },
});

const isJobDialogOpen = ref(false);
const selectedJob = ref<Job | null>(null);

const viewJobDetails = (job: Job) => {
  selectedJob.value = job;
  isJobDialogOpen.value = true;
};
</script>
