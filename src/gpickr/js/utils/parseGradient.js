let ts = document.createElement('p');

function* matchAll(content, regexp, group = -1) {
    for (let match; (match = regexp.exec(content));) {
        yield ~group ? match[group].trim() : match.map(v => v.trim());
    }
}

function match(content, regexp, group = -1) {
    const match = content.match(regexp);
    return match ? (~group ? match[group] : match) : null;
}

function normalizeGradient(str) {
    ts.style.backgroundImage = str;
    return getComputedStyle(ts).backgroundImage;
}

function parseColor(str) {
    const def = 'rgba(0, 0, 0, 0)';
    ts.style.color = def;

    if (str === def) {
        return str;
    }

    ts.style.color = str;
    const color = getComputedStyle(ts).color;
    return color === def ? null : color;
}

function parseGradient(str) {

    // Validate gradient
    str = normalizeGradient(str);
    if (!str) {
        return null;
    }

    // Resolve gradient type and stop strings
    const [, type, content] = str.match(/^(\w+)-gradient\((.*)\)$/i) || [];
    if (!type || !content) {
        return null;
    }

    const rawstops = [...matchAll(content, /(rgba?\(.*?\)|#?\w+)(.*?)(?=,|$)/ig)];
    const stops = [];
    let modifier = null;

    // Parse raw stop strings
    let lastColor = null;
    for (let i = 0; i < rawstops.length; i++) {
        const [full, rc, rl] = rawstops[i];
        const color = parseColor(rc);
        const locs = rl.split(/\s+/g)
            .map(v => match(v, /^-?(\d*(\.\d+)?)%$/, 1))
            .filter(Boolean)
            .map(Number);

        if (!locs.length && color) {
            stops.push({loc: null, color});
        } else if (locs.length) {
            for (const loc of locs) {
                stops.push({
                    loc,
                    color: color || lastColor
                });
            }
        } else if (!modifier) {
            modifier = full;
        }

        lastColor = color || lastColor;
    }

    if (!stops[stops.length - 1].loc) {
        stops[stops.length - 1].loc = 100;
    }

    // Compute gaps
    for (let i = 0; i < stops.length; i++) {
        const stop = stops[i];

        if (!stop.loc) {
            if (!i) {
                stop.loc = 0;
            } else {
                let divider = 2;
                let j = i + 1;

                for (; (j < stops.length) && !stops[j].loc; j++) {
                    divider++;
                }

                stop.loc = stops[i - 1].loc + (stops[j].loc - stops[i - 1].loc) / divider;
            }
        }
    }

    return {
        str,
        type,
        modifier,
        stops
    };
}

export default str => {

    document.body.appendChild(ts);
    const result = parseGradient(str);
    document.body.removeChild(ts);

    return result;
}
