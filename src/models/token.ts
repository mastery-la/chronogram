import { prop, Typegoose } from 'typegoose'

export class Token extends Typegoose {
    @prop({ required: true })
    access_token?: string

    @prop()
    userId?: string

    @prop()
    teamId?: string
}

export const TokenModel = new Token().getModelForClass(Token)
