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
        captcha: "",
        modlogs: "",
        levelingExcluded: [],
    },

    roles: { // Roles IDs
        member: "",
        bot: "",
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