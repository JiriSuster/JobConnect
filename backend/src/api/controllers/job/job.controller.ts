import 'reflect-metadata';
import {JobDto} from "./job.dto";
import {Request, Response} from 'express';
import {validateBody} from "../../../middleware/validation.middleware";
import {jobsService} from "../../../business/jobs.service";

export class JobController {

    async getAll(req: Request, res: Response) {
        const jobs = await jobsService.getAll()
        res.status(200).send(jobs)
    }

    async create(req: Request, res: Response) {
        const dto = await validateBody(req, JobDto)
        const job = await jobsService.create(dto)
        res.status(201).send(job)
    }

}
