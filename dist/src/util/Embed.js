"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Embed {
    constructor() {
        this.embed = {};
    }
    /**
     * Creates a field on the embed
     * @param title - Short, bold text of embed
     * @param description - Large text of embed
     * @param inline - Should discord try to "stack" fields?
     */
    addField(title, description, inline = false) {
        if (!title)
            title = 'No title provided';
        if (!description)
            description = 'No description provided';
        if (title.length >= 256)
            throw 'You need a shorter title';
        if (description.length >= 1024)
            throw 'You need a shorter description';
        let temp = {
            name: title,
            value: description,
            inline: inline
        };
        if (!this.embed.fields)
            this.embed.fields = [];
        this.embed.fields.push(temp);
        return this;
    }
    /**
     * Sets the main title of the embed
     * @param title - The title of the embed
     */
    setTitle(title) {
        if (typeof title !== 'string')
            throw 'Title must be a string';
        if (!title)
            return this;
        if (title.length >= 256)
            throw 'You need a shorter title.';
        this.embed.title = title;
        return this;
    }
    /**
     * Sets the main title of the embed
     * @param title - The title of the embed
     */
    setDescription(description) {
        this.embed.description = description.length >= 2048 ? description.split('').slice(0, 2047).join('') : description;
        return this;
    }
    /**
     * Sets the color of the embed
     * @param resolvable - A resolvable hex color or string.
     */
    setColor(resolvable) {
        if (typeof resolvable === 'string') {
            resolvable = resolvable.replace('#', '');
            if (resolvable.length < 3 || resolvable.length > 10) {
                this.embed.color = 0xffffff;
            }
            else {
                this.embed.color = parseInt('0x' + resolvable);
            }
        }
        else {
            this.embed.color = resolvable;
        }
        return this;
    }
    /**
     * Sets the image for the embed.
     * @param url - Url of the image
     * @param height - Height of the image
     * @param width - Width of the image
     */
    setImage(url, height, width) {
        this.embed.image = {
            url: url,
            height: height,
            width: width
        };
        return this;
    }
    /**
     * Sets the video for the embed.
     * @param url - Url of the video
     * @param height - Height of the video
     * @param width - Width of the video
     */
    setVideo(url, height, width) {
        this.embed.video = {
            url: url,
            height: height,
            width: width
        };
        return this;
    }
    /**
     * Sets the thumbnail for the embed.
     * @param url - Url of the thumbnail
     * @param height - Height of the thumbnail
     * @param width - Width of the thumbnail
     */
    setThumbnail(url, height, width) {
        this.embed.thumbnail = {
            url: url,
            height: height,
            width: width
        };
        return this;
    }
    /**
     * Sets the timestamp on the embed
     * @param date - Date of timestamp
     */
    setTimestamp(date) {
        this.embed.timestamp = date || Date.now();
        return this;
    }
    /**
     * Sets the author of the embed
     * @param name - Name of author
     * @param iconUrl - Image of author
     * @param url - Link of author
     */
    setAuthor(name, iconUrl, url, proxyurl) {
        this.embed.author = {
            name: name,
            url: url,
            icon_url: iconUrl,
            proxy_icon_url: proxyurl
        };
        return this;
    }
    /**
     * Sets the URL to the title of the embed.
     * @param url
     */
    setUrl(url) {
        this.embed.url = url;
        return this;
    }
    /**
     * Sets the footer of the embed.
     * @param text - Footer text
     * @param iconUrl - Image
     */
    setFooter(text, iconUrl) {
        this.embed.footer = {
            text: text.length > 2048 ? text.split('').slice(0, 2047).join('') : text,
            icon_url: iconUrl
        };
        return this;
    }
    /**
     * The content of the message
     * @param message - Message
     */
    setMessage(message) {
        this.content = message;
        return this;
    }
    hasVideo() {
        return !!this.embed.video;
    }
    hasTitle() {
        return !!this.embed.title;
    }
    hasDescription() {
        return !!this.embed.description;
    }
    hasFooter() {
        return !!this.embed.footer;
    }
    hasImage() {
        return !!this.embed.image;
    }
    hasTimestamp() {
        return !!this.embed.timestamp;
    }
    hasAuthor() {
        return !!this.embed.author;
    }
    hasFields() {
        return !!this.embed.fields;
    }
    hasColor() {
        return !!this.embed.color;
    }
    /**
     * Whether or not
     * @param field - Field to check the existence of.
     */
    hasField(field) {
        field -= 1;
        return !!this.embed?.fields[field];
    }
}
exports.default = Embed;
