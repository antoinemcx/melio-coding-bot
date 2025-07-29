module.exports = {
    token: '',
    prefix: 'm!',
    owner: "", //Owner ID
    production: false,

    db: {
        host: 'localhost',
        user: '',
        password: "",
        database: '',
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

    levelingRoles: { // level: ['RoleName', 'RoleID']
        1: ['XXX', '012'],
        5: ['XXX', '012'],
    }
};