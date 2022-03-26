import IDOMParser from 'advanced-html-parser'
export const getSelectionText = () => {
    var text = "";
    var w = window as any;
    var doc = document as any;
    if (w.getSelection) {
        {
            text = w.getSelection().toString();
        }
    } else if (doc.selection && doc.selection.type != "Control") {
        text = doc.selection.createRange().text;
    }
    return text;
}

export const wait = (ms: number) => {
    return new Promise<void>((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, ms);
    })
}


export const getSelectionTextAndContainerElement = () => {
    var text = "", containerElement = null;
    var doc = document as any;
    if (typeof window.getSelection != "undefined") {
        var sel = window.getSelection() as any;
        if (sel.rangeCount) {
            var node = sel.getRangeAt(0).commonAncestorContainer;
            containerElement = node.nodeType == 1 ? node : node.parentNode;
            text = sel.toString();
        }
    } else if (typeof doc.selection != "undefined" &&
        doc.selection.type != "Control") {
        var textRange = doc.selection.createRange();
        containerElement = textRange.parentElement();
        text = textRange.text;
    }
    return {
        text: text,
        containerElement: containerElement as HTMLElement
    };
}


export const scaleUp = (element?: HTMLElement, callback?: Function) => {
    if (element) {
        element.style.transition = "transform 0.5s ease-in-out";
        element.style.transform = "scale(1)";
        setTimeout(() => {
            callback?.()
        }, 800);

    }
}

export const scaleDown = (element?: HTMLElement, callback?: Function) => {
    if (element) {
        element.style.transition = "transform 0.5s ease-in-out";
        element.style.transform = "scale(0)";
        setTimeout(() => {
            callback?.()
        }, 600);
    }
}


export const slideRight = (element?: HTMLElement, callback?: Function) => {
    if (element) {
        element.style.left = "0";
        element.style.transition = "left 0.5s ease-in-out";
        setTimeout(() => {
            callback?.()
        }, 800);

    }
}

export const slideLeft = (element?: HTMLElement, callback?: Function) => {
    if (element) {
        element.style.transform = "-1000px";
        element.style.transition = "left 0.5s ease-in-out";
        setTimeout(() => {
            callback?.()
        }, 600);
    }
}



export const slideDown = (element: HTMLElement) => {
    if (element) {
        element.style.top = "50%";
        element.style.transition = "top 0.5s ease-in-out";
    }
}

export const slideUp = (element: HTMLElement, callback: Function) => {
    if (element) {
        element.style.top = "-1000px";
        element.style.transition = "top 0.5s ease-in-out";
        setTimeout(() => {
            callback()
        }, 600);
    }
}

export function isIE() {
    var ua = window.navigator.userAgent;
    var msie = ua.indexOf("MSIE ");

    if (msie > 0) // If Internet Explorer, return version number
    {
        return true;
    }
    else  // If another browser, return 0
    {
        return false;
    }
}

export function isEmptyOrSpaces(str: string) {
    return str === null || str.match(/^ *$/) !== null;
}

export const cleanHtml = (html: string) => {
    var container = document.createElement("div");
    container.innerHTML = html;
    var unwantedData = Array.from(container.querySelectorAll("script, style")).map(x => x.outerHTML).join("\n");
    container.querySelectorAll("script, style").forEach(x => x.remove());
    var text = IDOMParser.parse(container.outerHTML).documentElement.text().split(/\r?\n/).filter(x => !isEmptyOrSpaces(x)).map(x => `<p>${x}</p>`).join("\n");
    return `<div>${unwantedData + text}</div>`

}

export const elementSize = (el: HTMLElement) => {
    var computedStyle = getComputedStyle(el);

    var elementHeight = el.clientHeight;  // height with padding
    var elementWidth = el.clientWidth;   // width with padding

    elementHeight -= parseFloat(computedStyle.paddingTop) + parseFloat(computedStyle.paddingBottom);
    elementWidth -= parseFloat(computedStyle.paddingLeft) + parseFloat(computedStyle.paddingRight);
    var rec = el.getBoundingClientRect();
    return {
        elementHeight,
        elementWidth,
        rec,
        paddingTop: parseFloat(computedStyle.paddingTop.replace(/px|%/gi, "")),
        paddingBottom: parseFloat(computedStyle.paddingBottom.replace(/px|%/gi, "")),
        paddingLeft: parseFloat(computedStyle.paddingLeft.replace(/px|%/gi, "")),
        paddingRight: parseFloat(computedStyle.paddingRight.replace(/px|%/gi, ""))
    }
}

export const clearFonts = (el: HTMLElement) => {
    if (el.style) {
        el.style.fontFamily = "";
        el.style.fontSize = "";
        el.style.lineHeight = "";
        el.style.padding = "";
        el.style.paddingLeft = el.style.paddingRight = "";
        el.style.background = el.style.backgroundColor = "";

    }
    if (el.children && el.children.length > 0)
        for (var x of el.children)
            clearFonts(x as HTMLElement);

    return el;
}