<template>
  <v-container class="mt-4">
    <v-card>
      <v-card-title>Enter Job Details</v-card-title>
      <v-card-text>
        <!-- Job Title -->
        <v-text-field
          v-model="jobTitle"
          label="Job Title"
          placeholder="Enter the job title"
          outlined
          dense
        />

        <!-- Category -->
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

        <!-- Subcategory -->
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

        <!-- Description -->
        <v-textarea
          v-model="jobDescription"
          label="Job Description"
          placeholder="Enter a detailed description of the job"
          outlined
          rows="4"
          dense
        />
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
import { ref, computed } from 'vue';

// Data
const jobTitle = ref('');
const jobDescription = ref('');
const selectedCategory = ref<string[]>([]);
const selectedSubcategories = ref<string[]>([]);
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
const submitJob = () => {
  const jobData = {
    title: jobTitle.value,
    description: jobDescription.value,
    categories: selectedCategory.value,
    subcategories: selectedSubcategories.value
  };

  console.log('Submitted Job:', jobData);
};
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
