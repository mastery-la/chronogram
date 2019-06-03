import { prop, Typegoose } from 'typegoose'

export class Webhook extends Typegoose {
    @prop({ required: true })
    id?: string

    @prop()
    name?: string

    @prop({ required: true })
    url?: string

    @prop()
    createdAt?: number
}

export const WebhookModel = new Webhook().getModelForClass(Webhook)
