module.exports = (guild, search) => {
    if (parseInt(search)) {
        let poss = guild.members.filter(m => m.id === search);
        if (poss.size < 1) return false;
        else return poss;
    }

    // Searching
    search = search.toLowerCase();
    let poss = guild.members.find(m => {
        (!m.user.username || m.user.username === null) ? false : m.user.username.toLowerCase().search(search) != -1 ||
        (!m.nickname || m.nickname === null) ? false : m.nickname.toLowerCase().search(search) != -1
    });
    if (!poss) return false;
    if (poss.size < 1) return false;
    else return poss.toArray();
}