module.exports = {
    token: "",
    prefix: "m!",
    owner: "", // Bot owner's discord ID
    production: false, // Enables join/leave messages and role assignment

    db: {
        host: "localhost",
        user: "",
        password: "",
        database: ""
    },
  
    channels: { // Channels IDs
        welcome: "",
        modlogs: "",
        levelingExcluded: [],
    },
    roles: { // Roles IDs
        member: "",
        muted: "",
        bot: "",
        partner: ""
    },
  
    e: { // Emojis IDs
        v: "",
        x: "",
        online: "",
    },

    levelingRoles: { // level: ["RoleName", "RoleID"]
        1: ["XXX", "012"],
        5: ["XXX", "012"]
    },
    ticketSystem: {
        emoji: "🎟️", // emoji used to open a ticket
        createTicketMessage: "", // ID of the message to react on
        parentCategory: "" // ID of the category to create tickets in
    }
};