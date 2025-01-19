import {homepageController} from "./controllers/homepage/homepage.controller";
import {apiErrorHandler} from "../middleware/error.middleware";
import express = require('express');
import cors = require('cors');
import {hasAnyRole, oAuthModel} from "../middleware/auth.middleware";
import {JobController} from "./controllers/job/job.controller";
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
server.post('/jobs', jobController.create)
server.get('/jobs',jobController.getAll)


// Middleware: Error handling
server.use(apiErrorHandler)