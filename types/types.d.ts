declare interface ZEITUser {
    uid: string
    email: string
    username: string
    name: string
    bio: string
    date: string
    billingChecked: boolean
    avatar: string
    github: boolean
}

declare interface ZEITTeam {
    id: string
    slug: string
    name: string
    creatorId: string
    created: string
    avatar: string
}

declare type ZEITVitals = ZEITUser & ZEITTeam

declare interface RequestScreenshotPayload {
    url?: string
}

declare interface RequestScreenshotResult {
    url?: string
    screenshot?: string
    error?: string
    success: boolean
}
