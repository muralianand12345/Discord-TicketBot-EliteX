# Discord_TicketBot
Advanced Ticket Bot | Discordjs@13 | slash command | components | interactions

# config.json

    {
    "ownerID": "", Owner ID [ \@Murali ] => to find id 
    "clientId": "", Bot's Application/Client ID


    "parentOpened": "", Location where ticket need to placed first 
    "parentOOC": "", OOC Tickets (Category)
    "parentBugs": "", Bugs Tickets (Category)
    "parentOthers": "", Others Tickets (Category)
    "parentSupporters": "", Supporters Tickets (Category)
    "parentPlanned": "", Planned Tickets (Category)
    "parentCharacter": "", Character Tickets (Category)

    "announceChannel":"", Announcement (VoiceProcess/Server Annoucement) Text Channel
    "DateNTime":"false", true if you want date and time , false if you dont want
    
    "dateChannel":"", Voice Channel works good
    "TIMEZONE":"Asia/Kolkata",  IST
    "FORMATDate":"DD MMMM YYYY", check https://momentjs.com/docs/#/displaying/ for more info on this
    "UPDATE_INTERVAL":"600000", API min req is 10mins, so you can't change below 10 mins i.e 600000

    "roleSupport": "", Ticket Support Role ID


    "logsTicket": "", Text Channel where your ticket logs should be saved
    "errorLog": "", Text Channel where all your errors and command logs should be displayed ( btw don't forget to replace your id in the error commands )
    
    "ticketChannel": "", Text Channel where your ticket interaction will be sent
    "TagMember": "everyone", Change this according to your needs

    "footerText": "" Your embed footer here
    }


---------------------------------------------

# ENV
TOKEN= <your beautiful discord bot>

---------------------------------------------

# Versions 

Discord - version 13.2.0
Node - version 16.13.1

---------------------------------------------

# Installation 

`npm i` => **INSTALLS ALL NECESSARY PACKAGES**
`node for-text.js` => **SENDS MESSAGES IN THE CHANNEL** (OPTIONAL) Note: Change the values before running the command
`node deploy-commands.js` =>  **FOR SLASH COMMANDS** (IGNORE IF YOU DONT WANT / SLASH COMMANDS)
`node index.js` => **RUN BOT**

---------------------------------------------

# Any Queries 

! Murali Anand#5615

:)

Note: This Bot uses HastBin For Text Logs
