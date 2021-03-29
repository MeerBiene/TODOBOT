const
    express = require('express'),
    { MessageEmbed } = require('discord.js-light');


class API {
    constructor(client, PORT) {

        this.PORT = PORT;
        this.app = express();
        this.redisClient = client.cache;

        this.app.use(express.json());

        this.app.get('/health', (req, res) => res.json({ healthy: true }));

        this.app.post('/webhook', async (req, res) => {

            // making sure only topgg posts to this endpoint
            if (!req.headers.authorization) return;
            if (req.headers.authorization !== process.env.TOPGG_WEBHOOK_SECRET) return res.sendStatus(403);

            try {
                // set the voting user to cache
                this.redisClient.set(req.body.user, JSON.stringify(req.body));

                // expire after user key after 24 hours
                this.redisClient.expire(req.body.user, 86400000)

                res.sendStatus(200);

                const votingUser = await client.users.fetch(req.body.user);

                const votedEmbed = new MessageEmbed()
                    .setColor('RANDOM')
                    .setDescription(`
                    🥳 **${votingUser}** just voted on **[top.gg](https://top.gg/bot/709541772295929909/vote)** 🎉
                    `)
                
                client.guilds.cache.get(process.env.MOTHER_GUILD).channels.cache.get(process.env.VOTING_WEBHOOK_CHANNEL).send(votedEmbed)

            } catch (e) {
                client.logger.debug(e);
                res.sendStatus(500);
            }
        })

        this.app.listen(PORT, () => {
            client.logger.log({
                module: 'API',
                port: PORT,
                message: 'App is listening on port ' + PORT
            })
        })
    }
}

module.exports = API;