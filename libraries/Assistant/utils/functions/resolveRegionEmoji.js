module.exports = (region) => {
    const flag = region.split('-')[0];
    const regionEmojis = {
        unknown: { flag: '<:flag_unknown:649136487757250571>', text: 'Unknown' },
        us: { flag: '<:flag_us:649132787684868096>', text: 'United States' },
        india: { flag: '<:flag_india:649132789140160523>', text: 'India' },
        japan: { flag: '<:flag_japan:649132787625885715>', text: 'Japan' },
        eu: { flag: '<:flag_europe:649132787605176321>', text: 'European Union' },
        singapore: { flag: '<:flag_singapore:649132787605045248>', text: 'Singapore' },
        southafrica: { flag: '<:flag_southafrica:649132787596787720>', text: 'South Africa' },
        sydney: { flag: '<:flag_sydney:649132787466633227>', text: 'Sydney' },
        russia: { flag: '<:flag_russia:649132787261243404>', text: 'Russia' },
        brazil: { flag: '<:flag_brazil:649132787227426818>', text: 'Brazil' },
        /* EU */
        amsterdam: this.eu,
        london: this.eu,
        frankfurt: this.eu,
        /* India */
        dubai: this.india
    }
    return (!regionEmojis[flag]) ? regionEmojis['unknown'] : regionEmojis[flag];
}