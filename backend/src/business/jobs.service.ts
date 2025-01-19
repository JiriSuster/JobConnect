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
    },

    async getById(id: string) {
        return Job.findById(id);
    },

    async update(id: string, data: JobDto) {
        return Job.findByIdAndUpdate(id, data, {new: true});
    },

    async delete(id: string) {
        return Job.findByIdAndDelete(id);
    },

    async assignCompany(jobId: string, companyEmail: string) {
        const job = await Job.findById(jobId);
        job.companyEmail = companyEmail;
        await job.save();
        return job;
    }

}