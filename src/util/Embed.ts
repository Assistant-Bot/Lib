/***
 *                    _     _              _
 *      /\           (_)   | |            | |
 *     /  \   ___ ___ _ ___| |_ __ _ _ __ | |_
 *    / /\ \ / __/ __| / __| __/ _` | '_ \| __|
 *   / ____ \\__ \__ \ \__ \ || (_| | | | | |_
 *  /_/    \_\___/___/_|___/\__\__,_|_| |_|\__|
 *
 * Copyright (C) 2020 Bavfalcon9
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 3
 * of the License, or (at your option) any later version.
 */
export type ColorResolvable = number | string;
export default class Embed {
    public embed: any;
    public content?: string;

    public constructor() {
        this.embed = {};
    }

    /**
     * Creates a field on the embed
     * @param title - Short, bold text of embed
     * @param description - Large text of embed
     * @param inline - Should discord try to "stack" fields?
     */
    public addField(title: string, description: string, inline: boolean = false): this {
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
     * Sets the main title of the embed
     * @param title - The title of the embed
     */
    public setTitle(title: string): this {
        if (typeof title !== 'string') throw 'Title must be a string';
        if (!title) return this;
        if (title.length >= 256) throw 'You need a shorter title.';
        this.embed.title = title;
        return this;
    }


    /**
     * Sets the main title of the embed
     * @param title - The title of the embed
     */
    public setDescription(description: string): this {
        this.embed.description = description.length >= 2048 ? description.split('').slice(0, 2047).join('') : description;
        return this;
    }

    /**
     * Sets the color of the embed
     * @param resolvable - A resolvable hex color or string.
     */
    public setColor(resolvable: ColorResolvable): this {
        if (typeof resolvable === 'string') {
            resolvable = resolvable.replace('#', '');
            if (resolvable.length < 3 || resolvable.length > 10) {
                this.embed.color = 0xffffff;
            } else {
                this.embed.color = parseInt('0x' + resolvable);
            }
        } else {
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
    public setImage(url: string, height: number, width: number): this {
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
    public setVideo(url: string, height: number, width: number): this {
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
    public setThumbnail(url: string, height: number, width: number): this {
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
    public setTimestamp(date: Date): this {
        this.embed.timestamp = date || Date.now();
        return this;
    }

    /**
     * Sets the author of the embed
     * @param name - Name of author
     * @param iconUrl - Image of author
     * @param url - Link of author
     */
    public setAuthor(name: string, iconUrl?: string, url?: string, proxyurl?: string): this {
        this.embed.author = {
            name: name
		};
		if (iconUrl) {
			this.embed.author.icon_url = iconUrl
		}
		if (url) {
            this.embed.url = url;
		}
		if (proxyurl) {
			this.embed.proxy_icon_url = url;
		}
        return this;
    }

    /**
     * Sets the URL to the title of the embed.
     * @param url
     */
    public setUrl(url: string): this {
        this.embed.url = url;
        return this;
    }

    /**
     * Sets the footer of the embed.
     * @param text - Footer text
     * @param iconUrl - Image
     */
    public setFooter(text: string, iconUrl?: string): this {
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
    public setMessage(message : string): this {
        this.content = message;
        return this;
    }

    public hasVideo(): boolean {
        return !!this.embed.video;
    }

    public hasTitle(): boolean {
        return !!this.embed.title;
    }

    public hasDescription(): boolean {
        return !!this.embed.description;
    }

    public hasFooter(): boolean {
        return !!this.embed.footer;
    }

    public hasImage(): boolean {
        return !!this.embed.image;
    }

    public hasTimestamp(): boolean {
        return !!this.embed.timestamp;
    }

    public hasAuthor(): boolean {
        return !!this.embed.author;
    }

    public hasFields(): boolean {
        return !!this.embed.fields;
    }

    public hasColor(): boolean {
        return !!this.embed.color;
    }

    /**
     * Whether or not
     * @param field - Field to check the existence of.
     */
    public hasField(field : number): boolean {
        field -= 1;
        return !!this.embed ?. fields[field];
    }
}