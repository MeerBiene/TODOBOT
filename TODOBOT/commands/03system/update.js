const { RichEmbed } = require('discord.js');
const { exec } = require('child_process');
const { format } = require('date-fns')
const fs = require("fs");

exports.run = async (client, message, args) => {


    client.user.setActivity(`Applying an update!`, { type: 2, browser: "DISCORD IOS"  });

    exec("git pull", async (err, out, stderr) => {
        if(!err){
            message.channel.send(client.embed(out))
            let whites = '⬜'
            let reds = '🟥'
            let output = ['🟥'];
            let msg = await message.channel.send(client.embed("Loading . . . . "))
            console.log(out);
           
            const formatted = format(Date.now(), `EEEE yyyy/MM/dd H:m`)
            let update = {
                applied: false,
                requested: message.author.tag,
                requested_id: message.author.id,
                channel: message.channel.id,
                msg: message.id,
                time: `${formatted}`,
                output: out,
                errors: err,
                stderr: stderr
            };
            fs.writeFileSync(`update.json`, JSON.stringify(update));
            msg.edit(client.embed(`Restarting . . . `))
            exec("pm2 restart TODO2", (err, out, stderr) => {
                if(err && stderr !== "") {
                    message.channel.send(client.error(`${err} \n ${stderr}`))
                }
                message.channel.send(client.success(`Update was pulled and applied.`))
            })
        } else {
            message.channel.send(client.embed(`${out} \n\n ${stderr}`))
        }

    })

};


exports.conf = {
    enabled: true,
    guildOnly: true,
    party: false,
    aliases: [],
    permLevel: "root"
};

exports.help = {
    name: "update",
    category: "System",
    description: "Pulls the latest changes from github.",
    usage: "update"
};