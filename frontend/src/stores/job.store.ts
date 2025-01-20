import { defineStore } from "pinia";
import { ref } from "vue";
import { useAuth } from "@/composables/useAuth";
import config from "@/config";
import type { Job } from "@/model/Job";

export const useJobServiceStore = defineStore('job', () => {
    const isLoading = ref(true);
    const auth = useAuth();
    const baseUrl = `${config.backendUrl}/jobs`;

    // Fetch all jobs
    async function getAllJobs() {
        return auth.authorizedRequest(`${baseUrl}/`, "GET");
    }

    // Post a new job
    async function postJob(job: Job) {
        return auth.authorizedRequest(`${baseUrl}/`, "POST", { data: job });
    }

    // Fetch jobs based on a specific role
    async function getMyJobs(role: string) {
        return auth.authorizedRequest(`${baseUrl}/${role.toLowerCase()}`, "GET");
    }

    return { isLoading, getAllJobs, postJob, getMyJobs };
});
