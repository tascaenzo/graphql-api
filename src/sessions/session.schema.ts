import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

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

  @Prop()
  expiredAt: Date;

  @Prop({ default: null })
  deletedAt: Date;
}

export const SessionSchema = SchemaFactory.createForClass(Session);
