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
              @input="budget = $event.target.value ? Number($event.target.value) : undefined"
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
  </v-container>
</template>

<script lang="ts" setup>

import {ref, computed, onMounted} from 'vue';
import config from "@/config";
import {useAuth} from "@/composables/useAuth";
import type {Job} from "@/model/Job";
import {useJobServiceStore} from "@/stores/job.store";

const isAdvancedForm = ref(false);
const jobTitle = ref('');
const jobDescription = ref('');
const selectedCategory = ref<string[]>([]);
const selectedSubcategories = ref<string[] | undefined>(undefined);
const uploadedImages = ref<File[] | undefined>(undefined);
const budget = ref<number | undefined>(undefined);
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


const jobService = useJobServiceStore()

const submitJob = () => {
  const jobData = {
    _id: undefined,
    state: "waiting",
    customerEmail: auth.getUserEmail(),
    companyEmail: undefined,
    title: jobTitle.value,
    description: jobDescription.value,
    categories: selectedCategory.value,
    subcategories: selectedSubcategories.value || undefined,
    images: uploadedImages.value || undefined,
    budget: budget.value || undefined,
  };
  jobService.postJob(jobData)
  console.log('Submitted Job:', jobData);
};

const auth = useAuth()
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
