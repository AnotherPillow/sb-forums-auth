# sb forums auth

A package to confirm users' skyblock forums accounts.

## installation

1. `npm install sb-forums-auth`

## usage

See an example in [`example.js`](./example.js)

Or,

```js
const sbfa = require('./index')

(async () => {
    function getInput(query) {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });

        return new Promise(resolve => rl.question(query, ans => {
            rl.close();
            resolve(ans);
        }))
    }
    const auth = new sbfa({
        id: 103887 // change this !!
        interval: -1, // positive milliseconds to check automatically
        tokenType: 'words' // words or uuid
    })
    const { Event } = auth;

    auth.on(Event.Error, (error) => console.log('An error has occured!', error))
    auth.on(Event.Profile, async (user) => {

        console.log(`Please see your profile of ${user.username}`)
        
        auth.continueAfterVerified()

        auth.on(Event.Token, async (token) => {
            console.log(`Please add the following string to your profile description: ${token}`)

            await getInput(`Press enter once you have added it to your profile!`);

            const success = await auth.check();

            if (success) 
                console.log(`Successfully confirmed!`)
            else 
                console.log(`Failed to confirm, try again later.`);
        })

        auth.on(Event.Result, (user) => {
            console.log('confirmed user: ', user)
        })

    })

    await auth.init()
})()
```
