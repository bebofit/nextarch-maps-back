import { IDBQueryOptions, IPaginatedData, IDBQuery } from '../../common/types';
import { IReport } from '../../database/models';
import repository from './repository';

const getReports = (
  options?: IDBQueryOptions
): Promise<IPaginatedData<IReport>> =>
  Promise.all([
    repository.countAll(options),
    repository.findAll(options)
  ]).then(([total, results]) => ({ total, results }));

const getReportById = (
  id: string,
  options?: IDBQueryOptions
): IDBQuery<IReport> => repository.findById(id, options);

const createReport = (body: any): Promise<IReport> => repository.create(body);

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
  getReports,
  createReport,
  updateReport,
  softDeleteReport
};
