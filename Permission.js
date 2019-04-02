class Permission {
    constructor(type) {
        if((type instanceof Function)) {
            this.type = 'function';
        } else {
            this.type = type;
        }
    }
}