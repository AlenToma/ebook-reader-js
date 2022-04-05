import { Background, BookOptions, CSSStyle, FontSettings } from './typings'
const backGounds = [
    {
        chapterStyle: { backgroundColor: "#fff", color: "black" },
        name: "Day",
        bodyStyle: { backgroundColor: "rgb(238, 238, 238)" },
        bookMenuStyle: { backgroundColor: "#000", color: "#fff" },
        playerStyle: { backgroundColor: "#000", color: "#fff" },
    }, {
        chapterStyle: { backgroundColor: "rgb(51, 51, 51)", color: "rgb(162, 162, 163)" },
        name: "Night",
        bodyStyle: { backgroundColor: "rgb(34, 34, 34)" },
        bookMenuStyle: { backgroundColor: "#000", color: "#fff" },
        playerStyle: { backgroundColor: "#000", color: "#fff" },
    },
    {
        chapterStyle: { backgroundColor: "rgb(246, 237, 212)", color: "black" },
        name: "Sepia",
        bodyStyle: { backgroundColor: "rgb(224, 216, 176)" },
        bookMenuStyle: { backgroundColor: "#000", color: "#fff" },
        playerStyle: { backgroundColor: "#000", color: "#fff" },
    },
    {
        chapterStyle: { backgroundColor: "#D5D8DC", color: "#2b2b2b" },
        name: "Dark blue",
        bodyStyle: { backgroundColor: "rgb(240 243 247)" },
        bookMenuStyle: { backgroundColor: "#000", color: "#fff" },
        playerStyle: { backgroundColor: "#000", color: "#fff" },
    },
    {
        chapterStyle: { backgroundColor: "#FAFAC8", color: "#2b2b2b" },
        name: "Dark yellow",
        bodyStyle: { backgroundColor: "rgb(230 230 220)" },
        bookMenuStyle: { backgroundColor: "#000", color: "#fff" },
        playerStyle: { backgroundColor: "#000", color: "#fff" },
    },
    {
        chapterStyle: { backgroundColor: "#EFEFAB", color: "#2b2b2b" },
        name: "Wood grain",
        bodyStyle: { backgroundColor: "rgb(235 235 208)" },
        bookMenuStyle: { backgroundColor: "#000", color: "#fff" },
        playerStyle: { backgroundColor: "#000", color: "#fff" },
    },
] as Background[]

const textFormatter = {
    minTextCounter: 100,
    maxTextCounter: 800,
    value: 100,
    enabled: false
}

const fonts = [{
    title: "Cardiff Italic",
    className: "CardiffItalic",
    background: backGounds[0],
    textFormatter
}, {
    title: "Droid Serif",
    className: "DroidSerif",
    background: backGounds[0],
    textFormatter
}, {
    title: "Free Serif",
    className: "FreeSerif",
    background: backGounds[0],
    textFormatter
}, {
    title: "Junicode Bold",
    className: "JunicodeBold",
    background: backGounds[0],
    textFormatter
}, {
    title: "List Fcei",
    className: "LISTFCEI",
    background: backGounds[0],
    textFormatter
}, {
    title: "Libre Baskerville",
    className: "LibreBaskerville",
    background: backGounds[0],
    textFormatter
}, {
    title: "Linux Libertine",
    className: "LinuxLibertine",
    background: backGounds[0],
    textFormatter
}, {
    title: "Newathenaunicode",
    className: "Newathenaunicode",
    background: backGounds[0],
    textFormatter
}, {
    title: "Open Baskerville",
    className: "OpenBaskerville",
    background: backGounds[0],
    textFormatter
}, {
    title: "Oxford",
    className: "Oxford",
    background: backGounds[0],
    textFormatter
}, {
    title: "Portland Ldo",
    className: "PortlandLdo",
    background: backGounds[0],
    textFormatter
}, {
    title: "Queens Park",
    className: "QueensPark",
    background: backGounds[0],
    textFormatter
}, {
    title: "Source Sans Pro",
    className: "SourceSansPro",
    background: backGounds[0],
    textFormatter
}, {
    title: "Texgyrebonum Regular",
    className: "TexgyrebonumRegular",
    background: backGounds[0],
    textFormatter
}, {
    title: "Theano Didot",
    className: "TheanoDidot",
    background: backGounds[0],
    textFormatter
}] as CSSStyle[]



export default {
    book: {
        fonts: Object.assign({ ...fonts[12] }, {
            fontSize: 18,
            lineHeight: 1.2,
            paddingLeft: 14,
            paddingRight: 14,
            textAlign: "left",
        })
    },
    language: {
        player: {
            playerIconTitle: "Listen to what you read",
            playTitle: "Play",
            pauseTitle: "Pause",
            nextTitle: "PlayNext",
            prevTitle: "PlayPrev"
        },
        fontsSettings: {
            fontsHeaderText: "Fonts Settings",
            chooseFontLabel: "Font Family",
            fontsIconTitle: "Font Settings",
            fontLineHeightLabel: "Line Height",
            fontSizeLabel: "Font Size",
            marginLeftRightLabel: "Margin",
            backgroundStyleLabel: "Background Style",
            navigationChapterControllerLabel: "Navigation Controller",
            textFormaterEnabledLabel: "Use EbookJs sentence builder",
            textFormaterValueLabel: "Sentence builder min character"
        },
        chaptersSettings: {
            tableOfContentHeaderText: "Table Of Content",
            tableOfContentIconTitle: "Table Of Content"
        }
    },
    iframeSettings: {
        cleanHtml: false
    },
    fontSettings: {
        fontSizes: [14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40],
        lineHeights: [1.2, 1.4, 1.6, 1.8, 2.0],
        marginLeftRight: [10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40],
        fonts: fonts,
        background: backGounds,
    },



} as BookOptions
