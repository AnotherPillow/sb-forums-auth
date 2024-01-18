const sbfa = require('./index')
const readline = require('readline');

/**
 * 
 * @param {string} query 
 * @returns {Promise<string>}
 * @returns 
 */
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

;(async () => {
    const auth = new sbfa({
        id: parseInt(await getInput('What is your forums ID? ')), // 103887
        interval: -1,
        tokenType: 'words'
    })
    const { Event } = auth;
    
    
    auth.on(Event.Error, (error) => {
        console.log('An error has occured!', error)
    })

    auth.on(Event.Profile, async (user) => {
        console.log(`Is this the right user (y/n)?
    ${user.username}
      -> ${user.title}
    Joined: ${user.joined}
    Messages: ${user.messageCount}
        `)

        const query = await getInput('> ');

        if (query.toLowerCase().startsWith('n')) {
            auth.cancel();
            console.log('Cancelled.');
        } else {
            auth.continueAfterVerified()
        }

        auth.on(Event.Token, async (token) => {
            console.log(`Please add the following string to your profile description:
            ${token}`)

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