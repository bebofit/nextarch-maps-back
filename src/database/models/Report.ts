import { Document, model, Schema } from 'mongoose';
import { ReportStatus, ReportType } from '../../common/enums';
import { generateNumber } from '../../common/utils';

interface IReport extends Document {
  type: ReportType;
  status: ReportStatus;
  desc: string;
  user: { id: string; name: string; email: string };
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
  long: number;
  lat: number;
}

const reportSchema = new Schema(
  {
    type: {
      type: String,
      enum: Object.values(ReportType),
      required: true
    },
    desc: {
      type: String,
      required: true
    },
    problem: {
      one: String,
      two: String,
      three: String
    },
    user: { type: { id: String, name: String, email: String }, required: true },
    userInfo: {
      type: {
        mobile: String,
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
    },
    long: {
      type: Number,
      required: true
    },
    lat: {
      type: Number,
      required: true
    },
    uuid: {
      type: Number,
      default: generateNumber()
    }
  },
  {
    timestamps: true,
    discriminatorKey: 'type',
    useNestedStrict: true,
    toJSON: {
      transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.deletedAt;
        delete ret.lock;
        delete ret.__v;
      }
    }
  }
);

// tslint:disable-next-line: variable-name
const Report = model<IReport>('Report', reportSchema);

export { Report, IReport };
