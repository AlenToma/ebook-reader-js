import React from "react";
export declare type Language = {
    fontsSettings: {
        fontsHeaderText: string;
        chooseFontLabel: string;
        fontsIconTitle: string;
        fontLineHeightLabel: string;
        fontSizeLabel: string;
        marginLeftRightLabel: string;
        backgroundStyleLabel: string;
        navigationChapterControllerLabel: string;
        textFormaterEnabledLabel: string;
        textFormaterValueLabel: string;
    };
    player: {
        playerIconTitle: string;
        playTitle: string;
        pauseTitle: string;
        nextTitle: string;
        prevTitle: string;
    };
    chaptersSettings: {
        tableOfContentHeaderText: string;
        tableOfContentIconTitle: string;
    };
};
export declare type BookParams = {
    text: string;
    value: string;
};
export declare type Chapter = {
    title: string;
    htmlContent?: string | ((chapter: Chapter) => Promise<string>);
    scrollPosition?: number;
    textToSpeechProgress?: number;
};
export declare type BookOptions = {
    book: Book;
    cssClass?: string;
    textSelectionMenu?: SelectionMenuProps;
    navigationChapterController?: "Swaper" | "Scroll";
    bookMenu?: BookMenu;
    playerMenu?: PlayerMenu;
    bottomMenu?: BottomMenu;
    textToSpeechMenu?: TextToSpeechMenu;
    fontSettings?: FontSettings;
    language?: Language;
    iframeSettings?: IframeSettings;
};
declare type ClassName = string | ("CardiffItalic" | "DroidSerif" | "FreeSerif" | "JunicodeBold" | "LibreBaskerville" | "LinuxLibertine" | "LISTFCEI" | "Newathenaunicode" | "OpenBaskerville" | "Oxford" | "PortlandLdo" | "QueensPark" | "SourceSansPro" | "TexgyrebonumRegular" | "TheanoDidot");
export declare type IframeSettings = {
    cleanHtml?: boolean;
    indentSplitterCount?: number;
    mantainScriptsAfterRendering?: boolean;
    maintaineStyleAfterRendering?: boolean;
};
export declare type Background = {
    chapterStyle: React.CSSProperties;
    name: string;
    bodyStyle: React.CSSProperties;
    bookMenuStyle: React.CSSProperties;
    playerStyle: React.CSSProperties;
};
export declare type FontSettings = {
    fonts?: CSSStyle[];
    fontSizes?: number[];
    lineHeights?: number[];
    marginLeftRight?: number[];
    background?: Background[];
    lockNavigationChapterController?: boolean;
};
export declare type TextToSpeechMenu = {
    position?: "Bottom" | "Top" | "None";
    speechHandler: (text: string) => Promise<void>;
    speechHighlightColor?: string;
};
export declare type BookMenu = {
    position?: "Right" | "Top" | "None";
    chapterButtonDisabled?: boolean;
    fontsButtonDisabled?: boolean;
    playerButtonDisabled?: boolean;
    buttons?: Actions[];
};
export declare type PlayerMenu = {
    buttons?: Actions[];
};
export declare type BottomMenu = {
    disabled?: boolean;
};
export declare type Actions = {
    icon: string | JSX.Element;
    action: () => void;
    title?: string;
    className?: string;
};
export interface CSSStyle extends Omit<React.CSSProperties, "background" | "lineHeight" | "paddingLeft" | "paddingRight" | "fontSize"> {
    background?: Background;
    title?: string;
    lineHeight?: number;
    paddingLeft?: number;
    fontSize?: number;
    paddingRight?: number;
    className?: ClassName;
    textFormatter?: {
        minTextCounter: number;
        maxTextCounter: number;
        value: number;
        enabled: boolean;
    };
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
};
export declare type ChapterChangedEvent = {
    isUserAction: boolean;
    chapter: Chapter;
};
export declare type Events = {
    ScrollEvent?: {
        scrollTop: number;
        event: React.UIEvent<HTMLElement>;
    };
    FontEvent?: {
        font: CSSStyle;
    };
    ChapterChangedEvent?: ChapterChangedEvent;
};
export declare type EventsKey = "OnPlay" | "OnPause" | "onProgressChanged" | "onEnd" | "onChapterChanged" | "onFontsChanged" | "onScroll" | "onChapterClick";
export declare type BookReader = {
    readonly bookOptions: BookOptions;
    readonly currentChapter?: Chapter;
    readonly currentIndex?: number;
    readonly loadChapter: (index: number) => Promise<void>;
    readonly getText: () => string[];
    readonly on: (event: (eventName: EventsKey, args: Events) => Promise<void>, ...eventNames: EventsKey[]) => EventResult;
    readonly trigger: (eventName: EventsKey, args: Events) => Promise<void>;
    readonly player: Player;
    readonly isLoading: boolean;
};
export declare type Player = {
    readonly getCurrentText: () => string | undefined;
    readonly isplaying: () => boolean;
    readonly play: (progress: number) => Promise<void>;
    readonly pause: () => Promise<void>;
    readonly next: () => Promise<void>;
    readonly prev: () => Promise<void>;
};
export declare type EventResult = {
    on: (event: (eventName: EventsKey, args: Events) => Promise<void>, ...eventNames: EventsKey[]) => EventResult;
    remove: () => void;
};
export declare type EbookEvent = {
    eventName: string;
    event: Function;
};
export interface SelectionResult {
    selectedText: string;
    menuIndex: number;
    rec: DOMRect;
}
export declare type SelectionMenuItem = {
    text: string;
    icon?: string | React.ReactElement;
};
export declare type SelectionMenuProps = {
    menus: SelectionMenuItem[];
    click: (result: SelectionResult) => void | Promise<void>;
};
export declare type IState = {
    viewBookMenu: boolean;
    isLoading: boolean;
    viewPlayer: boolean;
    viewChapters: boolean;
    viewFontSettings: boolean;
    viewBottomMenu: boolean;
    currentChapter: Chapter | undefined;
    currentindex: number;
    textToSpeechProgress: number;
    chapterContent: {
        html: JSX.Element;
        index: number;
        chapter: Chapter;
    }[];
    language: Language;
    fontSettings: FontSettings;
    iframeSettings: IframeSettings;
    fonts: CSSStyle;
    isPrev: boolean;
    navigationChapterController: "Swaper" | "Scroll";
    playableText: string[];
    playing: boolean;
    windowSize: {
        width: number;
        height: number;
    };
    userAction: boolean;
};
export {};
