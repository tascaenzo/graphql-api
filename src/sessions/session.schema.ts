import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { UserDocument } from 'src/users/users.schema';

export type SessionDocument = Session & Document;

@Schema({ timestamps: true })
export class Session {
  @Prop({ unique: true, required: true })
  token: string;

  @Prop({ unique: true })
  refreshToken: string;

  @Prop({ default: 0 })
  refreshNumber: number;

  @Prop({ required: true })
  ip: string;

  @Prop({ required: true })
  userAgent: string;

  @Prop({ default: null })
  refreshedAt: Date;

  @Prop({ required: true })
  expiredAt: Date;

  @Prop({ default: null })
  deletedAt: Date;

  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'User' })
  user: UserDocument;
}

export const SessionSchema = SchemaFactory.createForClass(Session);
