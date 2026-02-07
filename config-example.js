module.exports = {
    "token": process.env.BOT_TOKEN, // Do not touch, the value is in .env
    "prefix": "m!",
    "owner": "", // Bot owner's discord ID
    "production": false, // Enables join/leave messages and role assignment

    "db": { // Do not touch, the values are in .env
        "host": process.env.DB_HOST,
        "user": process.env.DB_USER,
        "password": process.env.DB_PASSWORD,
        "database": process.env.DB_NAME
    },
  
    "channels": { // Channels IDs
        "welcome": "",
        "modlogs": "",
        "levelingExcluded": []
    },
    "roles": { // Roles IDs
        "member": "",
        "muted": "",
        "bot": "",
        "partner": ""
    },
  
    "e": { // Emojis IDs
        "v": "",
        "x": "",
        "online": ""
    },

    "levelingRoles": { // level: ["RoleName", "RoleID"]
        "1": ["XXX", "012"],
        "5": ["XXX", "012"]
    },
    "ticketSystem": {
        "emoji": "🎟️", // emoji used to open a ticket
        "createTicketMessage": "", // ID of the message to react on
        "parentCategory": "" // ID of the category to create tickets in
    }
};