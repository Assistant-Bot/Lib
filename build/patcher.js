const path = require('path');
const Util = require('./util.js');
const writeto = Util.writeto;
const Loader = Util.loader;
const current = require('./patch-version.json').version;
const LoaderOptions = {
    ext: ['txt']
};
const fs = require('fs');
const token = "trgAHOAV1fj3OjVn-aC0mF2Sqigyzn7-oHOPQKL7giPctYEH_SzUHDjswaZ3ScK4ZcuIJp5ziXpzP_IPLYy_aTQd-7Tsd0uwqgKx";

function updateString(str) {
    str = str.replace('{PARENT}', path.resolve(__dirname, '../'));
    str = str.replace('{NODE_MODULES}', path.resolve(__dirname, '../node_modules'));
    str = str.replace('{PATCH_DIR}', path.resolve(__dirname, './patches'));
    return str;
}
function fsErr(e) {
    return;
}
async function update() {
    writeto('[PATCHER]: Attempting to update.');
    const request = require('superagent');

    try {
        let re = await request.get('https://bot.versai.pro/patches').set('Authorization', token);
        let version;
        if (!re.body) return writeto('[PATCHER]: Failed to update, response invalid', true);
        if (re.body.error) return writeto('[PATCHER]: Failed to update, invalid token saved.', true);
        if (re.body.version) version = re.body.version;
        else return writeto('[PATCHER]: Failed to update, response invalid', true);
        if (current === version) return writeto('[PATCHER]: Already up to date!', true);
        else {
            writeto('[PATCHER]: Getting updates from version: ' + current + ' to version: ' + version);
            let res = await request.get('https://bot.versai.pro/patches/' + version).set('Authorization', token);
            if (!res.body) return writeto('[PATCHER]: Failed to get updates for: v' + version, true);
            if (res.body.error) return writeto('[PATCHER]: Failed to update to version: ' + version + ' due to invalid token.', true);
            if (res.body.files) {
                writeto('[PATCHER]: Applying updates for version: ' + version, true);
                let cfiles = Util.getFiles('./patches');
                let changed = 0;
                await res.body.files.forEach(patch => {
                    let name = patch[0];
                    let content = patch[1];
                    changed++;
                    try { fs.writeFile('./patches/' + name, content, 'utf8', fsErr); } catch (e) {return;}
                });

                let removed = 0;
                await cfiles.forEach(patch => {
                    let poss = res.body.files.map((p) => p[0]);
                    try {
                        if (!poss.includes(patch)) fs.unlinkSync(path.resolve(__dirname, 'patches/' + patch));
                        removed++;
                    } catch (e) {
                        return;
                    }
                });

                fs.writeFile('./patch-version.json', `{ "version": ${version} }`, fsErr);

                return console.log('[PATCHER]: Finished applying updates for version: ' + version);
            } else {
                return console.log('[PATCHER]: Failed to get updates for: v' + version);
            }
        }
    } catch (e) {
        //console.log(e);
        return writeto('[PATCHER]: Failed to update, error occurred', true);
    }
}

async function mainProcess() {
    try {
        Loader(__dirname + '/patches', async (patch) => {
            patch = patch.patch;
            if (!patch) return console.log('[PATCHER]: Tried to load a invalid patch.');
            if (!patch.name) return console.log('[PATCHER]: Tried to load a invalid patch.');
            if (!patch.file) return console.log('[PATCHER]: Tried to load patch: ' + patch.name + ' but missing patch target file.');
            if (!patch.content) return console.log('[PATCHER]: Tried to load patch: ' + patch.name + ' but missing patch file.');
            if (patch.explicit) {
                console.log('[PATCHER]: Patch: ' + patch.name + ' tried to use a explicit check (IGNORE).');
            }
            if (patch.scripts) {
                writeto('- Patch: ' + patch.name + ' has scripts, loading.');
                for (let x = 0; x < patch.scripts.length; x++) {
                    try {
                        let script = updateString(patch.scripts[x]);
                        let amount = patch.scripts.length;

                        await Util.rcmd(script);
                        if (x == patch.scripts.length - 1) {
                            writeto(`- Patch: ${patch.name} has loaded scripts...`, true);
                        } else {
                            writeto(`- Patch: ${patch.name} ran script! [${x}/${amount}]`);
                        }
                        continue;
                    } catch (e) {
                        continue;
                    }
                }
            }

            writeto(`- Patch: ${patch.name} is now loading.`);

            // read patch
            const patched = (fs.existsSync(updateString(patch.content))) ? Util.readFile(updateString(patch.content)) : false;
            const target = (fs.existsSync(updateString(patch.file))) ? updateString(patch.file) : false;

            if (patched == false || target == false) {
                writeto(`- Patch: ${patch.name} failed to load: Invalid patch file or target patch directory`, true);
                return;
            } else {
                writeto(`- Patch: ${patch.name} is now running.`);
                try {
                    const data = await patched;
                    fs.writeFileSync(target, data, 'utf8');
                    writeto(`- Patch: "${patch.name}" completed.`, true);
                } catch (e) {
                    writeto(`- Patch: ${patch.name} encountered error when patching.`, true);
                }
            }
        }, LoaderOptions);
        
    } catch (e) {
        console.log('[PATCHER]: Patcher encountered error, unknown patches loaded.');
    }
}


//if (process.argv.length > 0) {
//    return console.log('[PATCHER]: I have not implemented update checking, check github.');
//} else {
setTimeout(async () => {
    await update();
    console.log('[PATCHER]: Attempting to load patches.');
    await mainProcess();
}, 1000);
//}