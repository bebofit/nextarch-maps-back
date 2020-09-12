import { addDays } from 'date-fns';
import { Response } from 'express';
import { CREATED, NOT_FOUND, NO_CONTENT, OK } from 'http-status';
import { Language } from '../../common/enums';
// import { emailsService } from '../../common/services';
import { IRequest } from '../../common/types';
import {
  extractPaginationOptions,
  genToken,
  validateBody,
  validateDBId
} from '../../common/utils';
import * as reportsService from './service';
import * as usersService from '../users/service';
import * as reportsValidations from './validations';

async function getReports(req: IRequest, res: Response): Promise<any> {
  const paginationOptions = extractPaginationOptions(req.query);
  const data = await reportsService.getReports(paginationOptions);
  res.status(OK).json({
    data
  });
}

async function getReportsByUser(req: IRequest, res: Response): Promise<any> {
  const paginationOptions = extractPaginationOptions(req.query);
  const { userId } = req.authInfo;
  const data = await reportsService.getReportsByUser(userId, paginationOptions);
  res.status(OK).json({
    data
  });
}

async function getReportById(req: IRequest, res: Response): Promise<any> {
  const reportId = req.params.reportId;
  validateDBId(reportId);
  const report = await reportsService.getReportById(reportId);
  if (!report) {
    throw { statusCode: NOT_FOUND };
  }
  res.status(OK).json({
    data: report
  });
}

async function createReport(req: IRequest, res: Response): Promise<any> {
  const body = validateBody(req.body, reportsValidations.CREATE);
  const { userId } = req.authInfo;
  const user = await usersService.getUserById(userId);
  const report = await reportsService.createReport(body, user);
  res.status(CREATED).json({
    data: report
  });
}

async function updateReport(req: IRequest, res: Response): Promise<any> {
  const reportId = req.params.reportId;
  validateDBId(reportId);
  const body = validateBody(req.body, reportsValidations.UPDATE);
  const report = await reportsService.updateReport(reportId, body);
  if (!report) {
    throw { statusCode: NOT_FOUND };
  }
  res.status(OK).json({
    data: report
  });
}

async function softDeleteReport(req: IRequest, res: Response): Promise<any> {
  const reportId = req.params.reportId;
  validateDBId(reportId);
  const isDeleted = await reportsService.softDeleteReport(reportId);
  if (!isDeleted) {
    throw { statusCode: NOT_FOUND };
  }
  res.status(NO_CONTENT).send();
}

export {
  getReports,
  getReportById,
  getReportsByUser,
  createReport,
  updateReport,
  softDeleteReport
};
