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
export declare type ColorResolvable = number | string;
export default class Embed {
    embed: any;
    content?: string;
    constructor();
    /**
     * Creates a field on the embed
     * @param title - Short, bold text of embed
     * @param description - Large text of embed
     * @param inline - Should discord try to "stack" fields?
     */
    addField(title: string, description: string, inline?: boolean): this;
    /**
     * Sets the main title of the embed
     * @param title - The title of the embed
     */
    setTitle(title: string): this;
    /**
     * Sets the main title of the embed
     * @param title - The title of the embed
     */
    setDescription(description: string): this;
    /**
     * Sets the color of the embed
     * @param resolvable - A resolvable hex color or string.
     */
    setColor(resolvable: ColorResolvable): this;
    /**
     * Sets the image for the embed.
     * @param url - Url of the image
     * @param height - Height of the image
     * @param width - Width of the image
     */
    setImage(url: string, height: number, width: number): this;
    /**
     * Sets the video for the embed.
     * @param url - Url of the video
     * @param height - Height of the video
     * @param width - Width of the video
     */
    setVideo(url: string, height: number, width: number): this;
    /**
     * Sets the thumbnail for the embed.
     * @param url - Url of the thumbnail
     * @param height - Height of the thumbnail
     * @param width - Width of the thumbnail
     */
    setThumbnail(url: string, height: number, width: number): this;
    /**
     * Sets the timestamp on the embed
     * @param date - Date of timestamp
     */
    setTimestamp(date: Date): this;
    /**
     * Sets the author of the embed
     * @param name - Name of author
     * @param iconUrl - Image of author
     * @param url - Link of author
     */
    setAuthor(name: string, iconUrl?: string, url?: string, proxyurl?: string): this;
    /**
     * Sets the URL to the title of the embed.
     * @param url
     */
    setUrl(url: string): this;
    /**
     * Sets the footer of the embed.
     * @param text - Footer text
     * @param iconUrl - Image
     */
    setFooter(text: string, iconUrl?: string): this;
    /**
     * The content of the message
     * @param message - Message
     */
    setMessage(message: string): this;
    hasVideo(): boolean;
    hasTitle(): boolean;
    hasDescription(): boolean;
    hasFooter(): boolean;
    hasImage(): boolean;
    hasTimestamp(): boolean;
    hasAuthor(): boolean;
    hasFields(): boolean;
    hasColor(): boolean;
    /**
     * Whether or not
     * @param field - Field to check the existence of.
     */
    hasField(field: number): boolean;
}
