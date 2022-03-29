import React from 'react';
import { CSSStyle } from './typings';
export declare const getSelectionText: () => string;
export declare const wait: (ms: number) => Promise<void>;
export declare const getSelectionTextAndContainerElement: () => {
    text: string;
    containerElement: HTMLElement;
};
export declare const scaleUp: (element?: HTMLElement | undefined, callback?: Function | undefined) => void;
export declare const scaleDown: (element?: HTMLElement | undefined, callback?: Function | undefined) => void;
export declare const slideRight: (element?: HTMLElement | undefined, callback?: Function | undefined) => void;
export declare const slideLeft: (element?: HTMLElement | undefined, callback?: Function | undefined) => void;
export declare const slideDown: (element: HTMLElement) => void;
export declare const slideUp: (element: HTMLElement, callback: Function) => void;
export declare function isIE(): boolean;
export declare function isEmptyOrSpaces(str: string): boolean;
export declare const cleanHtml: (html: string, indentSplitterCount: number) => string;
export declare const getTextArray: (html: string) => string[];
export declare const elementSize: (el: HTMLElement) => {
    elementHeight: number;
    elementWidth: number;
    rec: DOMRect;
    paddingTop: number;
    paddingBottom: number;
    paddingLeft: number;
    paddingRight: number;
};
export declare const joinStyles: (...style: (CSSStyle | React.CSSProperties | undefined)[]) => React.CSSProperties;
export declare const clearFonts: (el: HTMLElement) => HTMLElement;
export declare const formatText: (cleanText: string, maxCounter: number) => string[];
