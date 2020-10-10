import { Model } from 'mongoose';
import { BaseDBRepository } from '../../common/classes';
import { IReport, Report, IUser } from '../../database/models';
import { IDBQueryOptions, IDBQuery } from '../../common/types';

class ReportRepository extends BaseDBRepository<IReport> {
  constructor(protected model: Model<IReport>) {
    super(model);
  }

  createReport(
    body: any,
    user: IUser,
    options?: IDBQueryOptions
  ): Promise<IReport> {
    body.user = { id: user.id, name: user.name, email: user.email };
    return super.create(body, options);
  }

  countReportsByUser(
    userId: string,
    options?: IDBQueryOptions
  ): Promise<number> {
    return super.count({ 'user.id': userId }, options);
  }

  findReportsByUser(
    userId: string,
    options?: IDBQueryOptions
  ): IDBQuery<IReport> {
    return super.find({ 'user.id': userId }, options);
  }
}

export default new ReportRepository(Report);
