import { Document, model, Schema } from 'mongoose';
import { ReportStatus, ReportType } from '../../common/enums';

interface IReport extends Document {
  type: ReportType;
  status: ReportStatus;
  desc: string;
  userInfo: {
    mobile: string;
    name: string;
    email: string;
    nId: string;
  };
  address: {
    street: string;
    building: string;
    city: string;
  };
}

const reportSchema = new Schema({
  type: {
    type: String,
    enum: Object.values(ReportType),
    required: true
  },
  desc: {
    type: String,
    required: true
  },
  userInfo: {
    type: {
      mobile: String,
      name: String,
      email: String,
      nId: String
    },
    required: true
  },
  address: {
    type: {
      street: String,
      building: String,
      city: String
    },
    required: true
  },
  status: {
    type: String,
    enum: Object.values(ReportStatus),
    default: ReportStatus.Received
  }
});

// tslint:disable-next-line: variable-name
const Report = model<IReport>('Report', reportSchema);

export { Report, IReport };
