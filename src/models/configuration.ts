import { prop, Typegoose, Ref, arrayProp } from 'typegoose'
import { Token } from './token'
import { Webhook } from './webhook'
import { Deployment } from './deployment'

export class Configuration extends Typegoose {
  @prop({ required: true })
  configurationId?: string

  @prop({ required: true })
  token?: Token

  @prop({ required: true })
  webhook?: Webhook

  @arrayProp({ itemsRef: Deployment })
  deployments?: Ref<Deployment>[]
}

export const ConfigurationModel = new Configuration().getModelForClass(
  Configuration
)
