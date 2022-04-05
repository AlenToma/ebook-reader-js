import IDOMParser from 'advanced-html-parser'
import React from 'react';
import { CSSStyle } from './typings';
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
        }, 502);

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

export const cleanHtml = (html: string, indentSplitterCount: number) => {
    var container = document.createElement("div");
    container.innerHTML = html;

    var unwantedData = Array.from(container.querySelectorAll("script, style")).map(x => x.outerHTML).join("\n");
    container.querySelectorAll("script, style").forEach(x => x.remove());
    var text = IDOMParser.parse(container.outerHTML).documentElement.text().split(/\r?\n/).filter(x => !isEmptyOrSpaces(x)).map(x => `<p style='padding-bottom:${indentSplitterCount * 5}px'>${x}</p>`).join("\n");
    return `<div>${unwantedData + text}</div>`
}

export const getTextArray = (html: string) => {
    var container = document.createElement("div");
    container.innerHTML = html;
    container.querySelectorAll("script, style, input").forEach(x => x.remove());
    return IDOMParser.parse(container.outerHTML).documentElement.text().split(/\r?\n/).filter(x => !isEmptyOrSpaces(x));
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

export const joinStyles = (...style: (CSSStyle | React.CSSProperties | undefined)[]) => {
    var result = {} as CSSStyle;
    style.map(x => {
        if (x !== undefined) {
            var st = { ...x } as any;
            delete st.background;
            delete st.className;
            delete st.title;
            result = Object.assign(result, st);
        }
    });
    return result as React.CSSProperties;
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

export const formatText = function (cleanText: string, maxCounter: number) {
    var container = document.createElement("div");
    container.innerHTML = cleanText;
    container.querySelectorAll("script, style, input").forEach(x => x.remove());
    
    var txt =  IDOMParser.parse(container.outerHTML).documentElement.text();
    var txtArray = [] as string[];
    var str = '';
  
    txt = txt
      .replace(/(?=&)(.*?)(;)/g, '')
      .replace(/[;]/g, '')
      .trim();
    var foundSeperator = false;
    var index = 0;
    var addedSpace = false;
  
    const trimStart = () => {
      str = str.trim();
      while (
        str.startsWith('.') ||
        str.startsWith(',') ||
        str.startsWith('!') ||
        str.startsWith('”')
      )
        str = str.substring(1).trim();
      return str;
    };
  
    const getNext = () => {
      var r = '';
      index++;
      if (txt.length > index) r = txt[index];
      if (r == '\r' || r == '\n' || r == '"') r = 'a';
      return r;
    };
    var pValue = '';
  
    for (var x of txt) {
      if (x == '.' && str.trim().endsWith('.') || (x == "…" && isEmptyOrSpaces(str))) {
        continue
      };
  
      if (isEmptyOrSpaces(str) && (x == '.' || x == '?' || x == '!' || x == ',' || x == ":"))
        continue;
  
      if (x !== '\r' && x !== '\n' && x !== '"') {
        if (!addedSpace || x != ' ') {
          str += x;
        }
        addedSpace = false;
      } else if (x == '\r' || x == '\n') str = str.trim() + " "
  
      var next = getNext();
      if ((x == '.' || x == '?' || x == '!' || x == ',' || x == "”" || x == ":") && /[\p{L}|\p{N}]/giu.test(next)) {
        if ((x !== ',' && x !== '.') || (!/[\p{N}]/giu.test(pValue) || !/[\p{N}]/giu.test(next))) {
          str = str.trim() + " "
          addedSpace = true;
        }
      }
      var r = undefined;
      const seperatorsWords = [/chapter /gmi, /:/gmi, /level /gmi, / hp /gmi, /[0-9]\/[0-9]/gmi, /[0-9]\-[0-9]/gmi, /[0-9]\,[0-9]/gmi, /([ ]+[mr|Mrs|Ms|Miss]+[\.]).*/gmi, /\[|\(|\)|\]/gmi]
      if (str != "" && (r = seperatorsWords.find(a => a.test(str)))) {
        foundSeperator = true;
      }
  
      const reset = () => {
        foundSeperator = false;
        str = '';
        addedSpace = false;
        pValue = '';
      }
  
  
      if ((str.length >= maxCounter && ((x == '.' && next != '”') || (pValue == '.' && x == '”'))) || (foundSeperator === true && (x == '\r' || x == '\n'))
      ) {
        txtArray.push(trimStart());
        reset();
      } else pValue = x;
    }
    if (str.length > 0) {
      txtArray.push(trimStart());
    }
  
    return txtArray.filter(x => x !== undefined && !isEmptyOrSpaces(x));
  }