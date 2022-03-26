import React, { Dispatch, SetStateAction } from "react";
declare type ClientRect = Record<keyof Omit<DOMRect, "toJSON">, number>;


export declare type Language = {
  fontsSettings: {
    fontsHeaderText: string;
    chooseFontLabel: string;
    fontsIconTitle: string;
    fontLineHeightLabel: string;
    fontSizeLabel: string;
    marginLeftRightLabel: string;
    backgroundStyleLabel: string;
  };

  chaptersSettings: {
    tableOfContentHeaderText: string;
    tableOfContentIconTitle: string;
  };
}

export declare type BookParams = {
  text: string;
  value: string;
}

export declare type Chapter = {
  title: string;
  htmlContent?: string | ((chapter: Chapter) => Promise<string>);
  scrollPosition?: number;
  textToSpeechProgress?: number;
}

export declare type BookOptions = {
  book: Book,
  onScroll?: (scrollTop: number, event: React.UIEvent<HTMLElement>) => void;
  cssClass?: string;
  textSelectionMenu?: SelectionMenuProps;
  nextChapterController?: "Swaper" | "Scroll";
  bookMenu?: BookMenu;
  textToSpeechMenu?: TextToSpeechMenu;
  fontSettings?: FontSettings;
  language?: Language;
  iframeSettings?: IframeSettings;
}

declare type ClassName = string | ("CardiffItalic" | "DroidSerif" | "FreeSerif" | "JunicodeBold" | "LibreBaskerville" | "LinuxLibertine" | "LISTFCEI" | "Newathenaunicode" | "OpenBaskerville" | "Oxford" | "PortlandLdo" | "QueensPark" | "SourceSansPro" | "TexgyrebonumRegular" | "TheanoDidot");



export declare type IframeSettings = {
  cleanHtml?: boolean; // default false
  mantainScriptsAfterRendering?: boolean; // false
  maintaineStyleAfterRendering?: boolean; // false
}

export declare type Background = {
  chapterStyle: React.CSSProperties;
  name: string;
  bodyStyle: React.CSSProperties;
}

export declare type FontSettings = {
  fonts?: CSSStyle[];
  fontSizes?: number[];
  lineHeights?: number[];
  marginLeftRight?: number[];
  background?: Background[]; // library default black and white
}

export declare type TextToSpeechMenu = {
  position?: "Bottom" | "Top" | "None"; // Default Top
  speechHandler: (text: string) => Promise<void>;
  speechHighlightColor?: string;
}

export declare type BookMenu = {
  position?: "Right" | "Top" | "None"; // Default Right
  chapterButtonDisabled?: boolean; // Default false
  fontsButtonDisabled?: boolean; // Default false
  buttons?: Actions[];
}

export declare type Actions = {
  icon: string | JSX.Element;
  action: () => void;
  title?: string;
  className?: string;
}


export interface CSSStyle extends Omit<React.CSSProperties, "background" | "lineHeight" | "paddingLeft" | "paddingRight" | "fontSize"> {
  background?: Background,
  title?: string;
  lineHeight?: number;
  paddingLeft?: number;
  fontSize?: number;
  paddingRight?: number;
  className?: ClassName;
}

export declare type Book = {
  fonts?: CSSStyle;
  chapters: Chapter[];
  cover?: string;
  title: string;
  showChapterTitle?: boolean;
  bookParams?: BookParams[];
  currentChapterIndex: number;
  startScrollPosition?: number;
  onChapterChange?: (currentChapter: Chapter, prevChapter?: Chapter) => Promise<void>;
}

export declare type BookReader = {
  readonly bookOptions: BookOptions;
  readonly currentChapter?: Chapter;
  readonly currentIndex?: number;
  readonly loadChapter: (index: number) => Promise<void>;
  readonly isLoading: boolean;
}

export interface SelectionResult {
  selectedText: string;
  menuIndex: number;
  rec: ClientRect;
}

export declare type SelectionMenuItem = {
  text: string;
  icon?: string | React.ReactElement;
}

export declare type SelectionMenuProps = {
  menus: SelectionMenuItem[],
  click: (result: SelectionResult) => void | Promise<void>;
}

export type IState = {
  isLoading: boolean,
  viewChapters: boolean;
  currentChapter?: Chapter;
  chapterContent: { html: JSX.Element, index: number }[];
  currentindex: number,
  fonts: CSSStyle;
}