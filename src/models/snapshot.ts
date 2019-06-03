import { Typegoose, prop } from 'typegoose'

export class Snapshot extends Typegoose {
    @prop({ required: true })
    webpageURL?: string

    @prop({ required: true })
    screenshotURL?: string
}
