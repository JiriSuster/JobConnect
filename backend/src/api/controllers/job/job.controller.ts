import 'reflect-metadata';
import {JobDto} from "./job.dto";
import {Request, Response} from 'express';
import {validateBody, validateParams} from "../../../middleware/validation.middleware";
import {jobsService} from "../../../business/jobs.service";
import {IdParam} from "../../../types/base.dto";

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

    async getById(req: Request, res: Response) {
        const {id} = await validateParams(req, IdParam)
        const job = await jobsService.getById(id)

        if (job === null) {
            res.status(404).send()
            return
        }

        res.status(200).send(job)
    }

    async update(req: Request, res: Response) {
        const { id } = await validateParams(req, IdParam)
        const dto = await validateBody(req, JobDto)
        const existingJob = await jobsService.getById(id)

        if (existingJob === null) {
            res.status(404).send()
            return
        }

        const job = await jobsService.update(id, dto)
        res.status(202).send(job)
    }

    async delete(req: Request, res: Response) {
        const { id } = await validateParams(req, IdParam)
        await jobsService.delete(id)
        res.status(204).send()
    }

    async assignCompanyToJob(req: Request, res: Response) {
        const { id } = await validateParams(req, IdParam)
        await jobsService.assignCompany(id,"example@example.com")
        res.status(204).send()
    }




}
