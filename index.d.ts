import sb from 'skyblock.js'

enum Event {
    'Error' = 'ErrorEmitted',
    'Token' = 'TokenEmitted',
    'Result' = 'AuthResult',
    'Profile' = 'ProfileEmitted'
}

export default class SBForumsAuth {
    Event: Event
    
    tokenType: 'uuid' | 'words'
    
    _id: number
    token: string | null
    _interval: number
    cancelled: boolean

    continueAfterVerified: null | ((value: any) => void)
    _continuePromise: Promise

    user: sb.UserInfo | null

    emit: (eventName: string | symbol, ...args: any[]) => boolean

    checkingInterval: NodeJS.Timeout | null

    constructor({ // I should fix this
        id: number,
        interval: number,
        tokenType: string
    })

    async init: () => undefined

    async _check: () => boolean

    async check: () => boolean

    cancel: () => undefined
}