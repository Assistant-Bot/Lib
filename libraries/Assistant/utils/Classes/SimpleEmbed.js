/**
 * @author: John.#9309
 * @description: Simple Embed Constructor
*/

/**
 * FOR DISCORD.JS FOLLOW THESE STEPS:
 * CRTL + F
 * FIND: return this;
 * REPLACE: return this.embed;
 * RETURN -> SAVE
 */

class SimpleEmbed {
    constructor() {
        this.embed = {};
    }

    /**
     * 
     * @param {String} title - Short, bold text of embed
     * @param {String} description - Large text of embed
     * @param {Boolean} inline - Should discord try to "stack" fields?
     * 
     */

    addField(title, description, inline=false) {
        if (!title) title = 'No title provided';
        if (!description) description = 'No description provided';
        if (title.length >= 256) throw 'You need a shorter title';
        if (description.length >= 1024) throw 'You need a shorter description';

        let temp = {
            name: title,
            value: description,
            inline: inline
        };

        if (!this.embed.fields) this.embed.fields = [];
        this.embed.fields.push(temp);
        return this;
    }

    /**
     * 
     * @param {String} title - Large title of embed (first one)
     * 
     */

    setTitle(title) {
        if (typeof title !== 'string') throw 'Title must be a string';
        if (!title) return this;
        if (title.length >= 256) throw 'You need a shorter title.';
        this.embed.title = title;
        return this;
    }

    /**
     * 
     * @param {String} desc - Large text of embed (first one, not bold)
     * 
     */

    setDescription(desc) {
        //2048 chars
        if (!desc) return this;
        if (desc.length >= 2048) throw 'You need a shorter description';
        this.embed.description = desc;
        return this;
    }

    /**
     * 
     * @param {Number|String} val - Color of the embed
     * 
     */

    setColor(val) {
        if (!this.embed.color) this.embed.color = 0xffffff;
        if (!val) return this;
        if (typeof val === 'number') this.embed.color = val;
        else {
            let str = val.split("#")[1];
            if (!parseInt(`0x${str}`)) throw 'Color must be HEX or INTEGER.';
            else this.embed.color = parseInt(`0x${str}`);
        }
        return this;
    }

    /**
     * @param {String} str - Message 
     */

    setContent(str) {
        this.content = str;
        return this;
    }

    /**
     * 
     * @param {String} url - URL or file directory
     * @param {Number} height - height in px (pixels)
     * @param {Number} width - width in px (pixels)
     * 
     */

    setImage(url, height, width) {
        let temp = {};
        if (!url) throw 'Invalid Image.';
        else temp.url = url;
        if (height && parseInt(height)) temp.height = height;
        if (height && parseInt(width)) temp.width = width;
        this.embed.image = temp;
        return this;
    }

    /**
     * 
     * @param {String} url - URL or file directory
     * @param {Number} height - height in px (pixels)
     * @param {Number} width - width in px (pixels)
     * 
     */

    setVideo(url, height, width) {
        let temp = {};
        if (!url) throw 'Invalid Video.';
        else temp.url = url;
        if (height && parseInt(height)) temp.height = height;
        if (height && parseInt(width)) temp.width = width;
        this.embed.video = temp;
        return this;
    }

    /**
     * 
     * @param {String} url - URL or file directory
     * @param {Number} height - height in px (pixels)
     * @param {Number} width - width in px (pixels)
     * 
     */

    setThumbnail(url, height, width) {
        let temp = {};
        if (!url) throw 'Invalid Image.';
        else temp.url = url;
        if (height && parseInt(height)) temp.height = height;
        if (height && parseInt(width)) temp.width = width;
        this.embed.thumbnail = temp;
        return this;
    }

    /**
     * 
     * @param {Date} date - Javascript new Date() object. Appears left of the footer.
     * 
     */

    setTimestamp(date) {
        if (!date) return this;
        else {
            this.embed.timestamp = date;
            return this;
        }
    }

    /**
     * 
     * @param {String} name - Text on top left
     * @param {String} url - Icon to left
     * @param {String} iconURL - Icon to right
     *  
     */

    setAuthor(name, iconURL, url) {
        let temp = {};
        if (name) temp.name = name;
        if (url) temp.url = url;
        if (iconURL) temp.icon_url = iconURL;
        if (Object.keys(temp).length > 0) this.embed.author = temp;
        return this;
    }

    /**
     * 
     * @param {String} url - URL or File directory
     *  
     */

    setUrl(url) {
        if (!url) return this;
        else {
            this.embed.url = url;
            return this;
        }
    }

    /**
     * 
     * @param {String} text - Text for embed footer
     * @param {String} url - URL or file directory
     *  
     */

    setFooter(text, url) {
        let temp = {};
        if (!text) throw 'You need a text string.';
        if (text.length >= 2048) text = text.split(text[2047][0]);
        if (url) temp.icon_url = url;
        temp.text = text;
        this.embed.footer = temp;
        return this
    }

    /**
     * @returns Boolean
     */

    hasVideo() {
        return (!this.embed.video) ? false : true;
    }

    /**
     * @returns Boolean
     */

    hasTitle() {
        return (!this.embed.title) ? false : true;
    }

    /**
     * @returns Boolean
     */

    hasDescription() {
        return (!this.embed.description) ? false : true;
    }

    /**
     * @returns Boolean
     */

    hasFooter() {
        return (!this.embed.footer) ? false : true;
    }

    /**
     * @returns Boolean
     */

    hasImage() {
        return (!this.embed.image) ? false : true;
    }

    /**
     * @returns Boolean
     */

    hasTimestamp() {
        return (!this.embed.timestamp) ? false : true;
    }

    /**
     * @returns Boolean
     */

    hasAuthor() {
        return (!this.embed.author) ? false : true;
    }

    /**
     * @returns Boolean
     */

    hasFields() {
        return (!this.embed.fields) ? false : true;
    }

    /**
     * @returns Boolean
     */

    hasColor() {
        return (!this.embed.color) ? false : true;
    }

    /**
     * @param {Number} val - Key to check
     * @returns Boolean
     */

    hasField(val) {
        val -= 1;
        if (!this.embed.fields) false;
        else return (!this.embed.fields[val]) ? false : true;
    }
}

module.exports = SimpleEmbed;