

import { Router } from "express";
import { issueController } from "./issue.controller";
const router =Router();

router.get('/', issueController.getAllIssues);


// router.get('/:id', );


// router.post('/',);
// router.patch('/:id',);
// router.delete('/:id',);



export const issueRoute =router;