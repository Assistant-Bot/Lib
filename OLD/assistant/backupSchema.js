const serverBackup = {
    name: "Assistant Testing",
    owner: {User},
    settings: {
        afkChannel: undefined,
        defaultNotifications: 1,
        verficationLevel: 1,
        explicitContent: 2,
        twofa: false,
        icon: this.url
    },
    bans: ['userID1', 'userID2'],
    roles: [
        {
          name: "this is a name",
          permissions: ['ADMIN'],
          id: 011111112,
          color: "#fffffff",
          mentionable: false,
          hoisted: false,
          prioritySpeaker: false,
          members: []
        }
    ],
    TextChannels: [
        {
          name: "General",
          id: 123245678,
          topic: "NO MENTIONING STAFF",
          slowmode: null,
          nsfw: false,
          position: 2,
          permissions: [
              {
                role: 01111111112,
                allowed: ["READ_MESSAGES"],
                denied: []
              },
              {
                member: 217006264570347520,
                perms: ["SPEAK", "MENTION_EVERYONE"]
              }
          ]
        }
    ],
    Categories: [
        {
          name: "Voice Channels",
          children: [12345678],
          perms: [],
          position: 1
        }
    ],
    VoiceChannels: [
        {
          name: "admin",
          id: 09876543234560,
          perms: [],
          bitrate: 64,
          userLimit: null
        }
    ]
};