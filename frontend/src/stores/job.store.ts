import {defineStore} from "pinia";
import {ref} from "vue";
import {useAuth} from "@/composables/useAuth";
import config from "@/config";
import type {Job} from "@/model/Job";




export const useJobServiceStore = defineStore('job', () => {
    const isLoading = ref(true)
    const auth = useAuth()


    function getJobsRequest(){
        return auth.authorizedRequest(config.backendUrl + "/jobs","GET")
    }


    async function getJobs() : Promise<[Job]> {
        isLoading.value = true
        return getJobsRequest().then(value => {
            const JobsData = value.data;
            isLoading.value = false
            return JobsData;
        });
    }

    async function postJob(job: Job) {
        return auth.authorizedRequest(config.backendUrl + "/jobs","POST", {data: job})
    }

    return {getJobs,isLoading, postJob}

})

