import { IDBQueryOptions, IPaginatedData, IDBQuery } from '../../common/types';
import { IReport, IUser } from '../../database/models';
import repository from './repository';

const getReports = (
  options?: IDBQueryOptions
): Promise<IPaginatedData<IReport>> =>
  Promise.all([
    repository.countAll(options),
    repository.findAll(options)
  ]).then(([total, results]) => ({ total, results }));

const getReportsByUser = (
  userId: string,
  options?: IDBQueryOptions
): Promise<IPaginatedData<IReport>> =>
  Promise.all([
    repository.countReportsByUser(userId, options),
    repository.findReportsByUser(userId, options)
  ]).then(([total, results]) => ({ total, results }));

const getReportById = (
  id: string,
  options?: IDBQueryOptions
): IDBQuery<IReport> => repository.findById(id, options);

const createReport = (body: any, user: IUser): Promise<IReport> =>
  repository.createReport(body, user);

const updateReport = (
  id: string,
  options?: IDBQueryOptions
): IDBQuery<IReport> => repository.findByIdAndUpdate(id, options);

const softDeleteReport = (
  id: string,
  options?: IDBQueryOptions
): Promise<boolean> => repository.deleteById(id, options);

export {
  getReportById,
  getReportsByUser,
  getReports,
  createReport,
  updateReport,
  softDeleteReport
};
