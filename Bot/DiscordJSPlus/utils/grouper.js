class Group {
    constructor(data, increment) {
        this.data = data;
        this.increment = increment;
    }

    getGrouping(data) {
        if(!data) data = this.data;
        if(isNaN(this.increment) == true) throw "Second parameter must be a number"; 
        if(data instanceof Array) {
            let Groups = [];
            for (let i = 0; i < data.length; i++) {
                let index = parseInt((i / parseInt(this.increment)).toString().split(".")[0]);
                if(!Groups[index]) Groups[index] = [];
                Groups[index].push(data[i]);
            }
            return Groups;
        } else throw 'Data must be an array.';
    }
}

module.exports = Group;
