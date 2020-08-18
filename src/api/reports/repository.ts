import { Model } from 'mongoose';
import { BaseDBRepository } from '../../common/classes';
import { IReport, Report } from '../../database/models';

class ReportRepository extends BaseDBRepository<IReport> {
  constructor(protected model: Model<IReport>) {
    super(model);
  }
}

export default new ReportRepository(Report);
