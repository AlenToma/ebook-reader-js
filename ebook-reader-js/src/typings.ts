import React from "react";


export type Language = {
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
  }

  chaptersSettings: {
    tableOfContentHeaderText: string;
    tableOfContentIconTitle: string;
  };
}

export type BookParams = {
  text: string;
  value: string;
}

export type Chapter = {
  title: string;
  htmlContent?: string | ((chapter: Chapter) => Promise<string>);
  scrollPosition?: number;
  textToSpeechProgress?: number;
}

export type BookOptions = {
  book: Book,
  cssClass?: string;
  textSelectionMenu?: SelectionMenuProps;
  navigationChapterController?: "Swaper" | "Scroll"
  bookMenu?: BookMenu;
  playerMenu?: PlayerMenu;
  bottomMenu?: BottomMenu;
  textToSpeechMenu?: TextToSpeechMenu;
  fontSettings?: FontSettings;
  language?: Language;
  iframeSettings?: IframeSettings;
}

type ClassName = string | ("CardiffItalic" | "DroidSerif" | "FreeSerif" | "JunicodeBold" | "LibreBaskerville" | "LinuxLibertine" | "LISTFCEI" | "Newathenaunicode" | "OpenBaskerville" | "Oxford" | "PortlandLdo" | "QueensPark" | "SourceSansPro" | "TexgyrebonumRegular" | "TheanoDidot");



export type IframeSettings = {
  cleanHtml?: boolean; // default false
  indentSplitterCount?: number;
  mantainScriptsAfterRendering?: boolean; // false
  maintaineStyleAfterRendering?: boolean; // false
}

export type Background = {
  chapterStyle: React.CSSProperties;
  name: string;
  bodyStyle: React.CSSProperties;
  bookMenuStyle: React.CSSProperties;
  playerStyle: React.CSSProperties;
}

export type FontSettings = {
  fonts?: CSSStyle[];
  fontSizes?: number[];
  lineHeights?: number[];
  marginLeftRight?: number[];
  background?: Background[]; // library default black and white
  lockNavigationChapterController?: boolean; // default false
}

export type TextToSpeechMenu = {
  position?: "Bottom" | "Top" | "None"; // Default Top
  speechHandler: (text: string) => Promise<void>;
  speechHighlightColor?: string;
}

export type BookMenu = {
  position?: "Right" | "Top" | "None"; // Default Right
  chapterButtonDisabled?: boolean; // Default false.
  fontsButtonDisabled?: boolean; // Default false.
  playerButtonDisabled?: boolean; // Default false.
  buttons?: Actions[];
}

export type PlayerMenu = {
  buttons?: Actions[]; // add additional buttons to player menu
}

export type BottomMenu = {
  disabled?: boolean;
}

export type Actions = {
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
  textFormatter?: {
    minTextCounter: number;
    maxTextCounter: number;
    value: number;
    enabled: boolean;
  };
}


export type Book = {
  fonts?: CSSStyle;
  chapters: Chapter[];
  cover?: string;
  title: string;
  showChapterTitle?: boolean;
  bookParams?: BookParams[];
  currentChapterIndex: number;
  startScrollPosition?: number;
}



export type ChapterChangedEvent = {
  isUserAction: boolean;
  chapter: Chapter;
}

export type Events = {
  ScrollEvent?: {
    scrollTop: number;
    event: React.UIEvent<HTMLElement>;
  };

  FontEvent?: {
    font: CSSStyle
  };

  ChapterChangedEvent?: ChapterChangedEvent;

}


export type EventsKey = "OnPlay" | "OnPause" | "onProgressChanged" | "onEnd" | "onChapterChanged" | "onFontsChanged" | "onScroll" | "onChapterClick";

export type BookReader = {
  readonly bookOptions: BookOptions;
  readonly currentChapter?: Chapter;
  readonly currentIndex?: number;
  readonly loadChapter: (index: number) => Promise<void>;
  readonly getText: () => string[];
  readonly on: (event: (eventName: EventsKey, args: Events) => Promise<void>, ...eventNames: EventsKey[]) => EventResult;
  readonly trigger: (eventName: EventsKey, args: Events) => Promise<void>;
  readonly player: Player;
  readonly isLoading: boolean;
}


export type Player = {
  readonly getCurrentText: () => string | undefined;
  readonly isplaying: () => boolean,
  readonly play: (progress: number) => Promise<void>;
  readonly pause: () => Promise<void>;
  readonly next: () => Promise<void>;
  readonly prev: () => Promise<void>;
}

export type EventResult = {
  on: (event: (eventName: EventsKey, args: Events) => Promise<void>, ...eventNames: EventsKey[]) => EventResult;
  remove: () => void;
}

export type EbookEvent = {
  eventName: string;
  event: Function;
}

export interface SelectionResult {
  selectedText: string;
  menuIndex: number;
  rec: DOMRect;
}

export type SelectionMenuItem = {
  text: string;
  icon?: string | React.ReactElement;
}

export type SelectionMenuProps = {
  menus: SelectionMenuItem[],
  click: (result: SelectionResult) => void | Promise<void>;
}

export type IState = {
  viewBookMenu: boolean;
  isLoading: boolean,
  viewPlayer: boolean,
  viewChapters: boolean,
  viewFontSettings: boolean,
  viewBottomMenu: boolean,
  currentChapter: Chapter | undefined,
  currentindex: number,
  textToSpeechProgress: number,
  chapterContent: { html: JSX.Element, index: number, chapter: Chapter }[],
  language: Language,
  fontSettings: FontSettings,
  iframeSettings: IframeSettings,
  fonts: CSSStyle,
  isPrev: boolean,
  navigationChapterController: "Swaper" | "Scroll",
  playableText: string[];
  playing: boolean;
  windowSize: { width: number, height: number },
  userAction: boolean
}





