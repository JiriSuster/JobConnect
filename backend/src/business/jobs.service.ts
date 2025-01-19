import {JobDto} from "../api/controllers/job/job.dto";
import {Job} from "../persistence/models/job.model";

export const jobsService = {
    async create(data: JobDto) {
        const job = new Job(data)
        await job.save()
        return job
    },

    async getAll() {
        return Job.find();
    }
}