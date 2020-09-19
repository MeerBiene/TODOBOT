//const { MessageEmbed } = require('discord.js');
const Pagination = require('discord-paginationembed');
const { todomodel } = require('../../modules/models/todomodel')

exports.run = async (client, message, args, level) => {

    const conf = await client.getconfig(message.guild.id)
  
    const parser = async (argarr) => {

        


        /**
         *  Supported keywords after "WHERE":
         *  => state= {open|assigned|closed}
         *  => severity= {1|2|3|4|5} [5 is lowest]
         *  => repeating= {true|false}
         *  => title= {"somestring"}
         *  => content= {"somestring"}
         *  => submittedby= {userid|usermention}
         *  => assigned= {userid|usermention}
         *  => category= {"somestring"}
         */


        console.log(argarr);
        let newind;
        if (argarr.includes("WHERE")) {
            newind = argarr.indexOf("WHERE");
            argind = newind + 1;
            
            if (!argarr[argind]) {
                return errormessage(`You didnt give any search criteria afer the \`WHERE\` keyword.`)
            }
            
            let raw = argarr[newind]
            let arg = argarr[argind]
            let parsedarguments = arg.split("=")
            console.log(parsedarguments)

            switch(parsedarguments[0]) {
                case "state":
                    wherequery(argarr, parsedarguments[0], parsedarguments[1])
                break;
                case "severity":
                    wherequery(argarr, parsedarguments[0], parsedarguments[1])
                break;
                case "repeating":
                    wherequery(argarr, parsedarguments[0], parsedarguments[1])
                break;
                case "title":
                    wherequery(argarr, parsedarguments[0], parsedarguments[1])
                break;
                case "content":
                    wherequery(argarr, parsedarguments[0], parsedarguments[1])
                break;
                case "subittedby":
                    wherequery(argarr, parsedarguments[0], parsedarguments[1])
                break;
                case "assigned":
                    wherequery(argarr, parsedarguments[0], parsedarguments[1])
                break;
                case "category":
                    wherequery(argarr, parsedarguments[0], parsedarguments[1])
                break;
                default:
                    errormessage(`
                    This is not a valid query selector. Run \`//help query\` for more information on how to use the query command.
                    `)
                break;
            }


            


        





        }

    }
    
    
    
    const wherequery = async (argarr, key, val) => {

        let limit;

        const lastarg = argarr[argarr.length - 1]
        //console.log(lastarg)
        const patt = /([1-9])\w+/g
        const result = patt.test(lastarg)
        //console.log(result)
        

        let obj = {
            guildid: message.guild.id
        }

        obj[key] = val
        console.log(limit)
        todomodel.find(obj, (err, docs) => {
            
            if (err) {
                errormessage(`Something went wrong when trying to query the database.`)
            }

            if (!docs) return returnerrormessage(`There was nothing found matching your search criteria.`);


            if (result) {
                limit = lastarg
            } else {
                limit = docs.length
            }

            if (docs.length <= 0) {
                return errormessage(`There was nothing found matching your search criteria.`)
            }

            
            
            display(docs, limit)
        }, { limit: limit })
        
    }

    
    

    const display = async (TODOS, limit) => {
        
        let arr = []
        
        for (let i = 0; i < limit; i++) {

            let todo = TODOS[i]

            if (!todo.title) return;

            let obj = {}

            todo.title ? obj.title = todo.title : "empty";
            todo.content ? obj.content = todo.content : obj.content = "empty";
            todo.attachlink ? obj.attachment = todo.attachlink : obj.attachment = "empty";
            todo.category ? obj.category = todo.category : obj.category = "empty";
            todo.processed ? obj.processed = todo.processed : obj.processed = "empty";
            todo.state ? obj.state = todo.state : obj.state = "open";
            obj.timestamp = todo.timestamp;
        
            arr.push(obj)

        }

        

        /**
         * Web:
         * https://discord.com/channels/709541114633519177/710020770369110038/754594372791828521
         *                              {  GUILDID  }      {  CHANNEL  }      { MSG ID }
         * 
         * Client:
         * https://discordapp.com/channels/709541114633519177/710020973746716694/754719857001627740
         * 
         */


        const FieldsEmbed = new Pagination.FieldsEmbed()
            .setArray(arr)
            .setAuthorizedUsers([message.author.id])
            .setChannel(message.channel)
            .setElementsPerPage(1)
            // Initial page on deploy
            .setPage(1)
            .setPageIndicator(true)
            .formatField('Title', i => i.title)
            .formatField('Content', i => i.content)
            .formatField('Attachements', i => i.attachment)
            .formatField('Processed', i => i.processed)
            .formatField('State', i => i.state)
            // Deletes the embed upon awaiting timeout
            .setDeleteOnTimeout(true)
            // Disable built-in navigation emojis, in this case: 🗑 (Delete Embed)
            //.setDisabledNavigationEmojis(['delete'])
            // Set your own customised emojis
            .setFunctionEmojis({
                '🔄': (user, instance) => {

                    const dcbase = "https://discord.com/channels/"
                    const URL = dcbase + message.guild.id + "/" + conf.todochannel + "/" + TODOS[instance.page - 1].todomsg

                    message.channel.send(client.todo(TODOS[instance.page - 1]));
                    message.channel.send(client.embed(`[Original Message](${URL})`))
                    console.log(TODOS[instance.page - 1])
                }
            })
            // Sets whether function emojis should be deployed after navigation emojis
            .setEmojisFunctionAfterNavigation(false);

        FieldsEmbed.embed
            .setColor("BLUE")
            // .setDescription('Test Description')
            .setFooter(`Click the 🔄 reaction to repost the task that you are on right now.`);
        await FieldsEmbed.build();

        // Will not log until the instance finished awaiting user responses
        // (or techinically emitted either `expire` or `finish` event)
        console.log('done');





    }


    
    
    
    const todoquery = async () => {

        const todos = await client.getusertodos(message.author.id)

        

        //console.log(arr)

        


    }


    /**
     * Suggestions query handler here
     */

    const suggestionquery = async () => {
        let index = args.indexOf("T")
        args.splice(index, 1);
        parser(args)
    }

    const errormessage = async (text) => {
        message.channel.send(client.error(text))
    }




















    /**
     *  Command/Query Handler;
     *  Checks if the argument array includes one of the supported query keywords
     *  ( TODOS and SUGGESTIONS) and calls the according function or returns an 
     *  error message with some help on how to use the command. The rest of the 
     *  query parsing is done inside the individual functions.
     */

    args.includes("TODOS") ? todoquery() 
        : args.includes("T") ? suggestionquery() 
        : errormessage(`**This query is not supported at the moment.**\n\ 
        Supported query keywords are \`TODO\` and \`SUGGESTIONS\`. 
        Make sure the letters are all uppercase when trying again.
        For more information on how to use the query command, 
        run the command \`//manual query\`.`)







};



exports.conf = {
    enabled: true,
    guildOnly: true,
    party: false,
    aliases: [],
    permLevel: "User"
};

exports.help = {
    name: "query",
    category: "TODO",
    description: "Query the database for your processed tasks.",
    usage: "query <YOUR QUERY>"
};

exports.manual = (message) => {

}