import { Background, BookOptions, CSSStyle, FontSettings } from './typings'
const backGounds = [
    {
        chapterStyle: { backgroundColor: "rgb(255, 255, 255)", color: "black" },
        name: "Day",
        bodyStyle: { backgroundColor: "rgb(238, 238, 238)" },
    }, {
        chapterStyle: { backgroundColor: "rgb(51, 51, 51)", color: "rgb(162, 162, 163)" },
        name: "Night",
        bodyStyle: { backgroundColor: "rgb(34, 34, 34)" }
    },
    {
        chapterStyle: { backgroundColor: "rgb(246, 237, 212)" },
        name: "Sepia",
        bodyStyle: { backgroundColor: "rgb(224, 216, 176)", color: "black" }
    },
] as Background[]

const fonts = [{
    title: "Cardiff Italic",
    className: "CardiffItalic",
    background: backGounds[0]
}, {
    title: "Droid Serif",
    className: "DroidSerif",
    background: backGounds[0]
}, {
    title: "Free Serif",
    className: "FreeSerif",
    background: backGounds[0]
}, {
    title: "Junicode Bold",
    className: "JunicodeBold",
    background: backGounds[0]
}, {
    title: "List Fcei",
    className: "LISTFCEI",
    background: backGounds[0]
}, {
    title: "Libre Baskerville",
    className: "LibreBaskerville",
    background: backGounds[0]
}, {
    title: "Linux Libertine",
    className: "LinuxLibertine",
    background: backGounds[0]
}, {
    title: "Newathenaunicode",
    className: "Newathenaunicode",
    background: backGounds[0]
}, {
    title: "Open Baskerville",
    className: "OpenBaskerville",
    background: backGounds[0]
}, {
    title: "Oxford",
    className: "Oxford",
    background: backGounds[0]
}, {
    title: "Portland Ldo",
    className: "PortlandLdo",
    background: backGounds[0]
}, {
    title: "Queens Park",
    className: "QueensPark",
    background: backGounds[0]
}, {
    title: "Source Sans Pro",
    className: "SourceSansPro",
    background: backGounds[0]
}, {
    title: "Texgyrebonum Regular",
    className: "TexgyrebonumRegular",
    background: backGounds[0]
}, {
    title: "Theano Didot",
    className: "TheanoDidot",
    background: backGounds[0]
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
        fontsSettings: {
            fontsHeaderText: "Fonts Settings",
            chooseFontLabel: "Font Family",
            fontsIconTitle: "Font Settings",
            fontLineHeightLabel: "Line Height",
            fontSizeLabel: "Font Size",
            marginLeftRightLabel: "Margin",
            backgroundStyleLabel: "Background Style"
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
        background: backGounds
    },



} as BookOptions
