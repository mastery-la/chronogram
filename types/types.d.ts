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

declare interface URLSnapshot {
    folder: string
    url: string
    host: string
    path: string
}

declare interface ScreenshotPayload {
    url?: string
}

declare interface ScreenshotResult {
    url?: string
    screenshot?: string
    error?: string
    success: boolean
}
