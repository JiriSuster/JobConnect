import { homepageController } from "./controllers/homepage/homepage.controller";
import { apiErrorHandler } from "../middleware/error.middleware";
import express = require('express');
import cors = require('cors');
import { hasAnyRole, oAuthModel } from "../middleware/auth.middleware";
import { JobController } from "./controllers/job/job.controller";
import { loggingService } from "../middleware/logging.middleware";
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
server.use(express.urlencoded({ extended: true }));

// Security: Authentication middleware
server.use(auth.authenticate()); // Ensure authentication happens first

// Use the loggingService middleware after authentication
server.use(loggingService);

// Homepage
server.get('/', homepageController.homepage);

// Job routes
const jobController = new JobController();
server.get('/jobs/company', [hasAnyRole("COMPANY")], jobController.getByCompany);
server.get('/jobs/customer', [hasAnyRole("CUSTOMER")], jobController.getByCustomer);
server.post('/jobs', [hasAnyRole("CUSTOMER")], jobController.create);
server.get('/jobs', [hasAnyRole("COMPANY")], jobController.getAllWaiting);
server.put('/jobs/assign/:id', [hasAnyRole("COMPANY")], jobController.assignCompanyToJob);
server.put('/jobs/unassign/:id', [hasAnyRole("COMPANY")], jobController.unassignCompanyFromJob);
server.get('/jobs/:id', [hasAnyRole("COMPANY", "CUSTOMER")], jobController.getById);
server.put('/jobs/:id', [hasAnyRole("CUSTOMER")], jobController.update);
server.delete('/jobs/:id', [hasAnyRole("CUSTOMER")], jobController.delete);

// Middleware: Error handling
server.use(apiErrorHandler);
