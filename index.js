const sb = require('skyblock.js')
const { EventEmitter } = require('node:events');
const { v4: uuidv4 } = require('uuid');

const Event = {
    'Error': 'ErrorEmitted',
    'Token': 'TokenEmitted',
    'Result': 'AuthResult',
    'Profile': 'ProfileEmitted'
}

module.exports = class SBForumsAuth extends EventEmitter {
    /**
     * @type {typeof Event}
     */
    Event = Event;

    /**
     * @type {'uuid' | 'words'}
     */
    tokenType = 'uuid'

    _id = 1;
    token = null;
    _interval = -1;
    cancelled = false;
    
    continueAfterVerified = null
    _continuePromise = new Promise(resolve => this.continueAfterVerified = resolve)
    
    
    /**
     * @type {sb.UserInfo | null}
     */
    user = null;

    /**
     * @type {(eventName: string | symbol, ...args: any[]): boolean}
     */
    emit(eventName, ...args) {
        if (this.cancelled) return;
        super.emit(eventName, ...args)
    }

    /**
     * @type {NodeJS.Timeout} setInterval() return type
     */
    checkingInterval = null

    /**
     * 
     * @param {{
            id: number,
            interval: number,
            tokenType: 'uuid' | 'words',
     * }} Set interval to -1 to enable manual checking. 
     */
    constructor({
        id = 1,
        interval = 30000,
        tokenType = 'uuid'

    }) {
        super()
        this._id = id;
        this._interval = interval;
        this.tokenType = tokenType;
    }

    startCheckInterval() {
        if (this.interval > 0)
            this.checkingInterval = setInterval(this._check, this.interval)
    }

    async init() {

        const rw = await import('random-words')



        this.user = await sb.forumsUserInfo(this._id)

        
        this.token = 
            this.tokenType == 'uuid' ? 
                `auth-${uuidv4()}` :
                `auth-${rw.generate({ exactly: 10, minLength: 4}).join('-').toLowerCase()}`
        
        // console.log(this.user, this.token)
        
        if (this.user.error) return this.emit(this.Event.Error, this.user.error)
        
        this.emit(this.Event.Profile, this.user)
        
        await this._continuePromise;
        this.emit(this.Event.Token, this.token)
        


        if (this.interval > 0) 
            this.startCheckInterval()
        
    }

    async _check() {
        const newProfile = await sb.forumsUserInfo(this._id)
        if (this.user.error) return this.emit(this.Event.Error, this.user.error)

        return (newProfile.description ?? '').includes(this.token)

        // this.emit('result', { ... })
    }

    /**
     * Checks manually for updated
     */
    async check() {
        const conf = await this._check();
        if (conf) this.emit(this.Event.Result, this.user)
        return conf
    }

    cancel() {
        this.cancelled = true;
    }
}