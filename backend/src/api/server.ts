import {homepageController} from "./controllers/homepage/homepage.controller";
import {apiErrorHandler} from "../middleware/error.middleware";
import express = require('express');
import cors = require('cors');
import {hasAnyRole, oAuthModel} from "../middleware/auth.middleware";
import {JobController} from "./controllers/job/job.controller";
import {loggingService} from "../middleware/logging.middleware";
const ExpresOAuthServer = require('@node-oauth/express-oauth-server');

export const server = express()

// Allow CORS for process.env.CORS_ORIGIN
server.use(cors({
    origin: process.env.CORS_ORIGIN
}))
console.log('Allowed CORS for', process.env.CORS_ORIGIN)

// Security
const auth = new ExpresOAuthServer({ model: oAuthModel });

// Middleware to parse JSON and URL-encoded data
server.use(express.json());
server.use(express.urlencoded({ extended: true }))

// Homepage
server.get('/', homepageController.homepage)

//Job
const jobController = new JobController()
server.get('/jobs/company',[auth.authenticate(), hasAnyRole("COMPANY")],jobController.getByCompany)
server.get('/jobs/customer',[auth.authenticate(), hasAnyRole("CUSTOMER")],jobController.getByCustomer)
server.post('/jobs',[auth.authenticate(), hasAnyRole("CUSTOMER")], jobController.create)
server.get('/jobs',[auth.authenticate(), hasAnyRole("COMPANY")],jobController.getAll)
server.put('/jobs/assign/:id',[auth.authenticate(),hasAnyRole("COMPANY")], jobController.assignCompanyToJob)
server.put('/jobs/unassign/:id',[auth.authenticate(),hasAnyRole("COMPANY")], jobController.unassignCompanyFromJob)
server.get('/jobs/:id',[auth.authenticate(),hasAnyRole("COMPANY","CUSTOMER")], jobController.getById)
server.put('/jobs/:id',[auth.authenticate(),hasAnyRole("CUSTOMER")], jobController.update)
server.delete('/jobs/:id',[auth.authenticate(),hasAnyRole("CUSTOMER")], jobController.delete)




// Middleware: Error handling
server.use(apiErrorHandler)