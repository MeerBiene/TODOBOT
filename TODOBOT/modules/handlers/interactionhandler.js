const  
    shortencmd = require('../interactions/shorten'),
    todocmd = require('../interactions/todo'),
    { Colors } = require('../util/colors'),
    Sentry = require('@sentry/node');


module.exports = (client) => {    


    global.interactionhandler = async (interaction) => {

        // refactor, load all interactions in map
        // on init with id => run(), then check
        // name on execution
        switch(interaction.data.name) {
            case "todo":
                try {
                    todocmd.run(client, interaction)
                } catch(e) {
                    Sentry.captureException(e)
                }
            break;
            case "shorten":
                try {
                    shortencmd.run(client, interaction)
                } catch(e) {
                    Sentry.captureException(e)
                }
            break;
        };
        client.logger.cmd(`Received the interaction ${interaction.data.name}`)
    };

    
    


    global.interactionhandler.reply = async (interaction, msg, type = 4) => {
        return client.api.interactions(interaction.id, interaction.token).callback.post({
            data: {
                type,
                data: {
                    content: msg
                }
            }
        })
    };


    global.interactionhandler.embed = {
        default: async (interaction, description, type = 4, color = "BLURPLE") => {
            return client.api.interactions(interaction.id, interaction.token).callback.post({
                data: {
                    type, 
                    data: {
                        embeds: [
                            {
                                description,
                                color: Colors[color]
                            }
                        ]
                    }
                }
                    
            }) 
        },
        success: async (interaction, description, type = 3, color = "GREEN") => {
            return client.api.interactions(interaction.id, interaction.token).callback.post({
                data: {
                    type,
                    data: {
                        embeds: [
                            {
                                title: "✅ Success!",
                                description,
                                color: Colors[color]
                            }
                        ]
                    }
                }
            })
        },
        error: async(interaction, description, type = 4, color = "RED") => {
            return client.api.interactions(interaction.id, interaction.token).callback.post({
                data: {
                    type,
                    data: {
                        embeds: [
                            {
                                title: "❌ Error",
                                description,
                                color: Colors[color]
                            }
                        ]
                    }
                }
            }) 
        }
    };

    

};