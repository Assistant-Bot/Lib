const fs = require('fs');
module.exports = function compile(dir, obj) {
    if(fs.existsSync(dir)) {
      if(typeof obj != "object") return false;
      let file = fs.readFileSync(dir).toString();
      for (let i = 0; i < Object.keys(obj).length; i++) {
          let key = Object.keys(obj)[i];
          let val = obj[key];
          if(typeof val == "object") {
              val = JSON.stringify(val);
          }
          file = replaceAll(file, `#(${key})`, val);
      }
      file = replaceAll(file, `GETALLDATA()`, JSON.stringify(obj));
      return file;
      
    } else {
        return false;
    }
}
replaceAll = function(str, search, replacement) {
    var target = str;
    return target.split(search).join(replacement);
};

function enscrypt(page, data) {
    /* Get the code elements */
    let code = (page.toLowerCase().search("<script compile>") != -1) ? page.split('<script compile>')[1].split('\n</script>')[0] : null;
    if(code === null) return page;
    code = replaceAll(code, "removeElement(", "removeElementP(this,");
    code = replaceAll(code, "this", "page");
    try {
        eval(code);
        return page;
    } catch (e) {
        console.log(e);
        return `<h1 color: red;>Something didn't go right</h1>`;
    }
}
function removeElementP(page, element) {
    page = page.replace(page.split(`<${element}>`)[1].split[0], "");
    return page;
}