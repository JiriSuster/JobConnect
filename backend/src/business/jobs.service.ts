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

    async assignCompany(jobId: string, email: string) {
        const job = await Job.findById(jobId);
        if(job.companyEmail == undefined || job.companyEmail == "" || job.companyEmail == email) {
            job.companyEmail = email;
            await job.save();
            return job;
        } else {
            throw new Error(`Company email is already assigned to ${job.companyEmail}`);
        }
    },

    async unassignCompany(jobId: string, email: string) {
        const job = await Job.findById(jobId);
        if(job.companyEmail == email){
            job.companyEmail = undefined;
            await job.save();
            return job;
        }
        else {
            throw new Error(`The provided email: ${email} does not match the company's assigned email: ${job.companyEmail}`);
        }
    },

    async getJobByCustomer(customerEmail: string) {
        return Job.find({"customerEmail" : customerEmail})
    },
    async getJobByCompany(companyEmail: string) {
        return Job.find({"companyEmail" : companyEmail})
    }

}