<template>
  <v-container class="mt-4">
    <v-card>
      <v-card-title>
        Enter Job Details
        <v-spacer />
        <v-switch
            v-model="isAdvancedForm"
            label="Advanced Form"
        />
      </v-card-title>
      <v-card-text>
        <template v-if="!isAdvancedForm">
          <v-text-field
              v-model="jobTitle"
              label="Job Title"
              placeholder="Enter the job title"
              outlined
              dense
          />
          <v-select
              v-model="selectedCategory"
              label="Job Category"
              :items="filteredCategories"
              multiple
              chips
              outlined
              dense
              clearable
              :menu-props="{ contentClass: 'category-menu' }"
          >
            <template #prepend-item>
              <v-text-field
                  v-model="categorySearch"
                  label="Search Category"
                  dense
                  outlined
                  clearable
              />
            </template>
          </v-select>
          <v-textarea
              v-model="jobDescription"
              label="Job Description"
              placeholder="Enter a detailed description of the job"
              outlined
              rows="4"
              dense
          />
        </template>

        <template v-else>
          <v-text-field
              v-model="jobTitle"
              label="Job Title"
              placeholder="Enter the job title"
              outlined
              dense
          />
          <v-select
              v-model="selectedCategory"
              label="Job Category"
              :items="filteredCategories"
              multiple
              chips
              outlined
              dense
              clearable
              :menu-props="{ contentClass: 'category-menu' }"
          >
            <template #prepend-item>
              <v-text-field
                  v-model="categorySearch"
                  label="Search Category"
                  dense
                  outlined
                  clearable
              />
            </template>
          </v-select>
          <v-select
              v-if="selectedCategory.length"
              v-model="selectedSubcategories"
              label="Job Subcategory"
              :items="filteredSubcategories"
              multiple
              chips
              outlined
              dense
              clearable
          >
            <template #prepend-item>
              <v-text-field
                  v-model="subcategorySearch"
                  label="Search Subcategory"
                  dense
                  outlined
                  clearable
              />
            </template>
          </v-select>

          <v-textarea
              v-model="jobDescription"
              label="Job Description"
              placeholder="Enter a detailed description of the job"
              outlined
              rows="4"
              dense
          />
          <v-file-input
              v-model="uploadedImages"
              label="Upload Images"
              accept="image/*"
              outlined
              dense
              multiple
          />
          <v-text-field
              v-model="budget"
              label="Budget ($)"
              placeholder="Enter the budget"
              outlined
              dense
              type="number"
              @input="budget = $event.target.value ? Number($event.target.value) : null"
          /> <!-- @input for converting to number -->
        </template>
      </v-card-text>
      <v-card-actions>
        <v-btn
            color="primary"
            @click="submitJob"
        >
          Submit Job
        </v-btn>
      </v-card-actions>
    </v-card>

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
            <div><strong>Title:</strong> {{ selectedJob?.title }}</div>
            <div><strong>Description:</strong> {{ selectedJob?.description }}</div>
            <div><strong>Category:</strong> {{ selectedJob?.categories.join(', ') }}</div>
            <div><strong>Subcategories:</strong> {{ selectedJob?.subcategories.join(', ') }}</div>
            <div><strong>Budget:</strong> ${{ selectedJob?.budget }}</div>
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
  </v-container>
</template>

<script lang="ts" setup>

import {ref, computed, onMounted} from 'vue';
import config from "@/config";
import {useAuth} from "@/composables/useAuth";
import type {Job} from "@/model/Job";
import {useJobServiceStore} from "@/stores/job.store";



const isJobDialogOpen = ref(false);
const selectedJob = ref<Job>();

const viewJobDetails = (job: any) => {
  selectedJob.value = job;
  isJobDialogOpen.value = true;
};

const isAdvancedForm = ref(false);
const jobTitle = ref('');
const jobDescription = ref('');
const selectedCategory = ref<string[]>([]);
const selectedSubcategories = ref<string[]>([]);
const uploadedImages = ref<File[]>([]);
const budget = ref<number | null>(null);
const categories = ref<string[]>(['IT Services', 'Construction Work', 'Cleaning', 'Creative Work']);
const subcategories = ref<Record<string, string[]>>({
  'IT Services': ['Web Development', 'Mobile Applications', 'Server Management'],
  'Construction Work': ['Renovations', 'Construction', 'Painting'],
  'Cleaning': ['Domestic Cleaning', 'Commercial Cleaning', 'Post-renovation Cleaning'],
  'Creative Work': ['Graphic Design', 'Drawing', 'Content Creation']
});
const categorySearch = ref('');
const subcategorySearch = ref('');

// Computed
const filteredCategories = computed(() => {
  return categories.value.filter((category) =>
      category.toLowerCase().includes(categorySearch.value.toLowerCase())
  );
});

const filteredSubcategories = computed(() => {
  const selected = selectedCategory.value;
  if (!selected.length) return [];

  const allSubcategories = selected
      .map((category) => subcategories.value[category] || [])
      .flat();

  return allSubcategories.filter((subcategory) =>
      subcategory.toLowerCase().includes(subcategorySearch.value.toLowerCase())
  );
});

// Methods

onMounted(async () => {
  await fetchData()
})

const jobService = useJobServiceStore()

const submitJob = () => {
  const jobData = {
    id: undefined,
    title: jobTitle.value,
    description: jobDescription.value,
    categories: selectedCategory.value,
    subcategories: selectedSubcategories.value,
    images: uploadedImages.value,
    budget: budget.value || undefined,
  };
  jobs.value.push(jobData)
  jobService.postJob(jobData)
  console.log('Submitted Job:', jobData);
};

const jobs = ref<Array<Job>>([])
const auth = useAuth()

async function fetchData() {
  const response = await auth.unauthorizedRequest(config.backendUrl + "/jobs", "GET")
  jobs.value = response
}
</script>

<style scoped>
.v-card {
  max-width: 600px;
  margin: auto;
}
.category-menu {
  max-height: 300px;
}
</style>
