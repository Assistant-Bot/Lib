module.exports = (json) => {
    if (!json) return 'None';

    let permissions = Object.keys(json);
    let perms = [];

    for (let i = 0; i < permissions.length; i++) {
        let perm = permissions[i];
        let hasPerm = json[i];

        if (!hasPerm) return;
        else {
            perm = perm.split(/(?=[A-Z])/).join(' ').title();
            perms.push(perm);
        }
    }

    if (perms.length === 0) return 'None';
    
    return perms.join(', ');
}