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
            <template #append-item>
              <v-list-item
                  v-if="showAddCategory"
                  @click="addCustomCategory"
                  class="add-new-item"
              >
                <v-icon left>mdi-plus</v-icon>
                Add "{{ categorySearch }}"
              </v-list-item>
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
            <template #append-item>
              <v-list-item
                  v-if="showAddCategory"
                  @click="addCustomCategory"
                  class="add-new-item"
              >
                <v-icon left>mdi-plus</v-icon>
                Add "{{ categorySearch }}"
              </v-list-item>
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
            <template #append-item>
              <v-list-item
                  v-if="showAddSubcategory"
                  @click="addCustomSubcategory"
                  class="add-new-item"
              >
                <v-icon left>mdi-plus</v-icon>
                Add "{{ subcategorySearch }}"
              </v-list-item>
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
          />
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
import { ref, computed, onMounted, watch } from 'vue';
import { useAuth } from "@/composables/useAuth";
import { useJobServiceStore } from "@/stores/job.store";
import { useCategoryService } from "@/stores/category.store";

const isAdvancedForm = ref(false);
const jobTitle = ref('');
const jobDescription = ref('');
const selectedCategory = ref<string[]>([]);
const selectedSubcategories = ref<string[]>([]);
const uploadedImages = ref<File[]>([]);
const budget = ref<number>();
const categories = ref<{ _id: string; name: string }[]>([]);
const subcategories = ref<Record<string, string[]>>({});
const categorySearch = ref('');
const subcategorySearch = ref('');

const showAddCategory = computed(() => {
  const search = categorySearch.value.trim().toLowerCase();
  return search !== '' &&
      !categories.value.some(c => c.name.toLowerCase() === search);
});

function addCustomCategory() {
  const newCategory = categorySearch.value.trim();
  if (newCategory && !selectedCategory.value.includes(newCategory)) {
    selectedCategory.value = [...selectedCategory.value, newCategory];
  }
  categorySearch.value = '';
}


const showAddSubcategory = computed(() => {
  const search = subcategorySearch.value.trim().toLowerCase();
  return search !== '' &&
      !filteredSubcategories.value.some(s => s.toLowerCase() === search);
});

function addCustomSubcategory() {
  const newSub = subcategorySearch.value.trim();
  if (newSub && !selectedSubcategories.value.includes(newSub)) {
    selectedSubcategories.value = [...selectedSubcategories.value, newSub];
  }
  subcategorySearch.value = '';
}

const filteredCategories = computed(() => {
  return categories.value
      .filter((category) =>
          category.name.toLowerCase().includes(categorySearch.value.toLowerCase())
      )
      .map((category) => category.name);
});

const filteredSubcategories = computed(() => {
  const selectedIds = selectedCategoryIds.value;
  if (!selectedIds.length) return [];

  const uniqueSubcategories = new Set<string>();
  selectedIds.forEach((id) => {
    (subcategories.value[id] || []).forEach((sub) => uniqueSubcategories.add(sub));
  });

  return Array.from(uniqueSubcategories).filter((subcategory) =>
      subcategory.toLowerCase().includes(subcategorySearch.value.toLowerCase())
  );
});


const selectedCategoryIds = computed(() => {
  return selectedCategory.value
      .map((name) =>
          categories.value.find((category) => category.name === name)?._id
      )
      .filter(Boolean) as string[];
});

const jobService = useJobServiceStore()
const categoryService = useCategoryService()

const submitJob = async () => {
  const jobData = {
    _id: undefined,
    state: "waiting",
    customerEmail: auth.getUserEmail(),
    companyEmail: undefined,
    title: jobTitle.value,
    description: jobDescription.value,
    categories: selectedCategory.value,
    subcategories: selectedSubcategories.value,
    images: undefined,
    budget: budget.value,
  };

  try {
    const jobResponse = await jobService.postJob(jobData);
    console.log('Submitted Job:', jobResponse);

    const jobId = jobResponse._id;

    if (uploadedImages.value.length > 0) {
      const formData = new FormData();
      uploadedImages.value.forEach((image) => {
        formData.append('photos', image);
      });

      const imageResponse = await jobService.postImages(jobId, formData);
      console.log('Uploaded Images:', imageResponse);
    }

    resetForm();

  } catch (error) {
    console.error('Error submitting job or uploading images:', error);
  }
};

function resetForm() {
  jobTitle.value = '';
  jobDescription.value = '';
  selectedCategory.value = [];
  selectedSubcategories.value = [];
  uploadedImages.value = [];
  budget.value = undefined;
  categorySearch.value = '';
  subcategorySearch.value = '';
}

async function fetchCategories() {
  const response = await categoryService.getCategories();
  categories.value = response.map((category: { _id: string; name: string }) => ({
    _id: category._id,
    name: category.name,
  }));
}


async function fetchSubcategories() {
  const response = await categoryService.getSubcategories(selectedCategoryIds.value);



  subcategories.value = response.reduce((acc: Record<string, string[]>, subcategory: { _id: string; name: string; categories: string[] }) => {
    subcategory.categories.forEach((categoryId) => {
      if (!acc[categoryId]) {
        acc[categoryId] = [];
      }
      acc[categoryId].push(subcategory.name);
    });
    return acc;
  }, {});
}


onMounted(()=>{
  fetchCategories()
})

watch(selectedCategory, (newValue) => {
  if (newValue.length) {
    fetchSubcategories();
  } else {
    subcategories.value = {};
  }
});

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
