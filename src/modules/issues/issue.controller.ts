import type { IssueStatus, IssueType } from "../../types";
import { issueService } from "./issue.service";
import type { IIssueUpdate } from "./issue.interface";
import sendResponse from "../../utility/sendResponse";
import type { NextFunction, Request, Response } from "express";
import type { JwtPayload } from "jsonwebtoken";

import {
  USER_ROLE,
  ISSUE_STATUS,
  ISSUE_TYPE
} from "../../types";

const getAllIssues = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  try {

    const { sort, type, status } = req.query as {
      sort?: string;
      type?: IssueType;
      status?: IssueStatus;
    };

    const filters: {
      sort?: string;
      type?: IssueType;
      status?: IssueStatus;
    } = {};

    if (sort) {
      filters.sort = sort;
    }

    if (type) {
      filters.type = type;
    }

    if (status) {
      filters.status = status;
    }

    const data = await issueService.getAllIssuesFromDB(filters);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Issues retrieved successfully",
      data
    });

  } catch (error) {

    next(error);

  }
};

const getSingleIssue = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  const id = req.params.id as string;

  try {

    const data = await issueService.getSingleIssueFromDB(id);

    if (!data) {

      sendResponse(res, {
        statusCode: 404,
        success: false,
        message: "Issue not found"
      });

      return;
    }

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Issue retrieved successfully",
      data
    });

  } catch (error) {

    next(error);

  }

};

const createIssue = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  try {

    const { title, description, type } = req.body as {
      title: string;
      description: string;
      type: IssueType;
    };

    if (!title || !description || !type) {

      sendResponse(res, {
        statusCode: 400,
        success: false,
        message: "title, description, and type are required"
      });

      return;
    }

    if (title.length > 150) {

      sendResponse(res, {
        statusCode: 400,
        success: false,
        message: "title must be 150 characters or fewer"
      });

      return;
    }

    if (description.length < 20) {

      sendResponse(res, {
        statusCode: 400,
        success: false,
        message: "description must be at least 20 characters"
      });

      return;
    }

    if (
      ![
        ISSUE_TYPE.bug,
        ISSUE_TYPE.feature_request
      ].includes(type)
    ) {

      sendResponse(res, {
        statusCode: 400,
        success: false,
        message: "type must be bug or feature_request"
      });

      return;
    }

    const reporter_id = (req.user as JwtPayload).id as number;

    if (!reporter_id || typeof reporter_id !== "number") {

      sendResponse(res, {
        statusCode: 400,
        success: false,
        message: "valid reporter_id is required"
      });

      return;
    }

    const data = await issueService.createIssueIntoDB({
      title,
      description,
      type,
      reporter_id
    });

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Issue created successfully",
      data
    });

  } catch (error) {

    next(error);

  }
};

const updateIssue = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  try {

    const id = req.params.id as string;

    const requestingUser = req.user as JwtPayload;

    const existing = await issueService.getSingleIssueFromDB(id);

    if (!existing) {

      sendResponse(res, {
        statusCode: 404,
        success: false,
        message: "Issue not found"
      });

      return;
    }

    // contributor restrictions
    if (requestingUser.role === USER_ROLE.contributor) {

      if (
        (existing.reporter as { id: number } | null)?.id !==
        requestingUser.id
      ) {

        sendResponse(res, {
          statusCode: 403,
          success: false,
          message: "Forbidden — you can only edit your own issues"
        });

        return;
      }

      if (existing.status !== ISSUE_STATUS.open) {

        sendResponse(res, {
          statusCode: 409,
          success: false,
          message: "Cannot edit — issue is no longer opened"
        });

        return;
      }
    }

    const {
      title,
      description,
      type,
      status
    } = req.body as IIssueUpdate;

    const updatePayload: IIssueUpdate = {};

    if (title !== undefined) {
      updatePayload.title = title;
    }

    if (description !== undefined) {
      updatePayload.description = description;
    }

    if (type !== undefined) {
      updatePayload.type = type;
    }

    // maintainer can update status
    if (
      requestingUser.role === USER_ROLE.maintainer &&
      status !== undefined
    ) {
      updatePayload.status = status;
    }

    const data = await issueService.updateIssueInDB(
      id,
      updatePayload
    );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Issue updated successfully",
      data
    });

  } catch (error) {

    next(error);

  }
};

const deleteIssue = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  try {

    const id = req.params.id as string;

    const deleted = await issueService.deleteIssueFromDB(id);

    if (deleted === 0) {

      sendResponse(res, {
        statusCode: 404,
        success: false,
        message: "Issue not found"
      });

      return;
    }

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Issue deleted successfully"
    });

  } catch (error) {

    next(error);

  }
};

export const issueController = {
  getAllIssues,
  getSingleIssue,
  createIssue,
  updateIssue,
  deleteIssue
};