module.exports = (str, end) => {
    process.stdout.clearLine();
    process.stdout.write(str);
    process.stdout.cursorTo(0);
    if (end == true) {
        process.stdout.write("\n");
    }
}