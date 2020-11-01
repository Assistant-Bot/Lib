"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/***
 *                    _     _              _
 *      /\           (_)   | |            | |
 *     /  \   ___ ___ _ ___| |_ __ _ _ __ | |_
 *    / /\ \ / __/ __| / __| __/ _` | '_ \| __|
 *   / ____ \\__ \__ \ \__ \ || (_| | | | | |_
 *  /_/    \_\___/___/_|___/\__\__,_|_| |_|\__|
 *
 * Copyright (C) 2020 John Bergman
 *
 * This is private software, you cannot redistribute and/or modify it in any way
 * unless given explicit permission to do so. If you have not been given explicit
 * permission to view or modify this software you should take the appropriate actions
 * to remove this software from your device immediately.
 */
class Embed {
    constructor() {
        this.embed = {};
    }
    /**
     * Creates a field on the embed
     * @param title - Title of field
     * @param description - Description of field
     * @param inline - Whether to inline
     */
    addField(title, description = '', inline = false) {
        title = title.length >= 256 ? title.split('').slice(0, 255).join('') : title;
        description = description.length >= 2048 ? description.split('').slice(0, 2047).join('') : description;
        this.embed.fields = this.embed.fields || [];
        this.embed.fields.push({ name: title, value: description, inline: inline });
        return this;
    }
    /**
     * Sets the main title of the embed
     * @param title - The title of the embed
     */
    setTitle(title) {
        this.embed.title = title.length >= 256 ? title.split('').slice(0, 255).join('') : title;
        return this;
    }
    /**
     * The main description of the embed
     * @param description - The description of the embed;
     */
    setDescription(description) {
        this.embed.description = description.length >= 2048 ? description.split('').slice(0, 2047).join('') : description;
        return this;
    }
    /**
     * Sets the color of the embed
     * @param resolveable - A resolvable hex color or string.
     */
    setColor(resolveable = 0xffffff) {
        if (typeof resolveable === 'string') {
            resolveable = resolveable.replace('#', '');
            if (resolveable.length < 3 || resolveable.length > 10) {
                this.embed.color = 0xffffff;
            }
            else {
                this.embed.color = parseInt('0x' + resolveable);
            }
        }
        else {
            this.embed.color = resolveable;
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
    setAuthor(name, iconUrl, url) {
        this.embed.author = {
            name: name,
            url: url,
            icon_url: iconUrl,
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
