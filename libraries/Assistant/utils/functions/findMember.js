module.exports = (guild, search) => {
    let search2 = search.replace(/[<@!, <@, >]/ig, '');
    if (parseInt(search2)) {
        let poss = guild.members.filter(m => m.id === search2);
        if (poss.length < 1) return false;
        else return poss[0];
    }

    // Searching
    /**
     * m.nickname changed to m.nick (eris)
     */
    search = search.toLowerCase();
    let poss = guild.members.find(m => {
        if (!m.user.username) return false;
        if (m.user.username.toLowerCase().search(search) != -1) return true;
        if (!m.nick || m.nick === null) return false;
        if (m.nick.toLowerCase().search(search) != -1) return true;
        else return false;
    });

    if (!poss) return false;
    //if (poss.size < 1) return false;
    else return poss;//.toArray();
}