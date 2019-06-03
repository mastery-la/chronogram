import { Typegoose, prop } from 'typegoose'
import { Snapshot } from './snapshot'

export class Deployment extends Typegoose {
  @prop({ required: true })
  deploymentId?: string

  @prop({ required: true })
  url?: string

  @prop()
  name?: string

  @prop()
  project?: string

  @prop()
  createdAt?: number

  @prop()
  snapshot?: Snapshot
}

export const DeploymentModel = new Deployment().getModelForClass(Deployment)
