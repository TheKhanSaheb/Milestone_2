
import type { IssueStatus, IssueType } from "../../types";
import { issueService } from "./issue.service";
import type{ IIssue, IIssueUpdate } from "./issue.interface";
import sendResponse from "../../utility/sendResponse";
import type { NextFunction, Request, Response } from "express";

const getAllIssues = async(req:Request, res:Response,next:NextFunction)=>
{
    try{

const {sort,type,status}=req.query as
{
    sort?:string;
    type?:IssueType;
    status?:IssueStatus;
}
    const data = await issueService.getAllIssuesFromDB({ sort, type, status });
   sendResponse(res,{statusCode:200,success:true,message:"Issues retrieved successfully",data})



    }
    catch(error){
 next(error)
    }
}



export const issueController = {
    getAllIssues
}






