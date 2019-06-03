import { prop, Typegoose } from 'typegoose'
import { Token } from './token'
import { Webhook } from './webhook'

export class Configuration extends Typegoose {
  @prop({ required: true })
  configurationId?: string

  @prop({ required: true })
  authorization?: Token

  @prop({ required: true })
  webhook?: Webhook
}

export const ConfigurationModel = new Configuration().getModelForClass(
  Configuration
)
