const Group = require('../../utils/grouper');

class Pager {
    constructor(data, perpage) {
        if((data instanceof Array) == false) {
            throw "Parameter must be a datavalue of an object.";
        }
        
        if(!perpage || isNaN(perpage) == true) this.amt = 10;
        else this.amt = perpage;
        this.data = data;
        this.lastPrev = null;
        this.currentPage = 1;
        //this.pages = new Number();
    }

    error(t) {
        throw t;
    }

    getPages() {
        let pages = new Group(this.data, this.amt).getGrouping();
        return pages;
    };
    getCurrentPage() {
        return this.lastPrev;
    }
    getPrevPage() {
        if(this.lastPrev == null) {
            return this.getPage(1);
        }
        let p = this.lastPrev - 1;
        if(p <= 0) return this.getPage(1);
        else return this.getPage(p);
    }

    getNextPage() {
        if(this.lastPrev == null) {
            return this.getPage(1);
        }
        return this.getPage(this.lastPrev + 1);
    }

    getPreviousPage() {return this.getPrevPage()};

    getPage(num) {
        this.lastPrev = num;
        num = num - 1;
        if(isNaN(num) == true) return this.error("Page must be a number");
        else {
           let page = this.getPages()[num];
           if(page === undefined) return this.error("Page does not exist");
           return page;
        }
    }

    removePage(num) {
        if(isNaN(num) == true) return this.error("Page must be a number");
        else {
           let page = this.getPages()[num];
           if(page === undefined) return this.error("Page does not exist");

           for (let i = 0; i < page.length; i++) {
                let val = page[i]
                if(this.data[val] != undefined) this.data = this.data.splice(this.data.indexOf(val));
           }
           return this.data;
        }
    }

    insertData(data) {
        if((data instanceof Array) == false) return this.error("Parameter 1 must be an array.");
        this.data = this.data.concat(data);
        return this.data;
    }

    getTotalPages() {
        return new Group(this.data, this.amt).getGrouping().length;
    }
}

module.exports = Pager;