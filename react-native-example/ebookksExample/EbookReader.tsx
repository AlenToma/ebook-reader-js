import * as React from 'react'
import { useEffect, useState, useRef } from 'react'
import { View, Dimensions } from 'react-native';
import { WebView } from 'react-native-webview';
import { BookOptions, CSSStyle, Book, BookParams, Chapter, ChapterChangedEvent } from 'ebook-reader-js/dist/typings'
import html from './single/htm'
import jsInjection from './single/jsStart'

interface Options {
    options: BookOptions;
    onPlay: () => void;
    onPause: () => void;
    onProgressChanged: (chapter: Chapter) => void;
    onEnd: (chapter: Chapter) => void;
    onChapterChanged: (event: ChapterChangedEvent) => void;
    onFontsChanged: (font: CSSStyle) => void;
    onScroll: (event: {
        scrollTop: number;
        event: React.UIEvent<HTMLElement>;
    }) => void;
    onChapterClick?: () => void;
    onChapterRequest: (event: Chapter) => Promise<string>;
}


export interface EbookEventsOptions {
    play: (progress: number) => void;
    pause: () => void;
    playNext: () => void;
    PlayPrev: () => void;
    isplaying: () => Promise<boolean>;
    getCurrentText: () => Promise<string>;
}

interface JSData {
    type: "LOG" |
    "ERROR" |
    "NovelData" |
    "OnPlay" |
    "Play" |
    "Pause" |
    "OnPause" |
    "PlayNext" |
    "PlayPrev" |
    "onProgressChanged" |
    "onEnd" |
    "onChapterChanged" |
    "onFontsChanged" |
    "onScroll" |
    "onChapterClick" |
    "onChapterRequest" |
    "RequestedChapter" |
    "RequestCurrentText" |
    "RequestIsPlaying"
    data: any
}

const requestedData = new Map();

function get(type: string) {
    let data = undefined;
    if (requestedData.has(type)) {
        data = requestedData.get(type)
        requestedData.delete(type);
    }
    return data;
}

async function sleep(ms?: number) {
    return new Promise<void>((resolve) => {
        setTimeout(() => {
            resolve();
        }, ms || 500);
    })
}

export default React.forwardRef(({ options }: { options: Options }, ref: React.Ref<EbookEventsOptions>) => {
    const webview = useRef(null as WebView | null)
    const [size, setSize] = useState({ width: Dimensions.get("window").width, height: Dimensions.get("window").height })

    const postMessage = async (item: JSData) => {
        if (webview.current) {
            await webview.current.postMessage(JSON.stringify(item));
        }
    }
    const play = (progress: number) => {
        postMessage({ data: progress, type: "Play" });
    }

    const pause = () => {
        postMessage({ data: undefined, type: "Pause" });
    }

    const playNext = () => {
        postMessage({ data: undefined, type: "PlayNext" });
    }

    const playPrev = () => {
        postMessage({ data: undefined, type: "PlayNext" });
    }

    const getCurrentText = async () => {
        postMessage({ data: undefined, type: "RequestCurrentText" });
        while (!requestedData.has("RequestCurrentText"))
            await sleep(100);
        return get("RequestCurrentText");
    }

    const isplaying = async () => {
        postMessage({ data: undefined, type: "RequestIsPlaying" });
        while (!requestedData.has("RequestIsPlaying"))
            await sleep(100);
        return get("RequestIsPlaying");
    }


    const onMessage = async (data: JSData) => {
        switch (data.type) {
            case "NovelData":
                await postMessage({ data: options.options, type: "NovelData" })
                break;
            case "LOG":
                console.log(data.data);
                break;
            case "ERROR":
                console.error(data.data);
                break;
            case "onChapterChanged":
                options.onChapterChanged(data.data);
                break;
            case "OnPlay":
                options.onPlay();
                break
            case "OnPause":
                options.onPause();
                break;
            case 'onEnd':
                options.onEnd(data.data);
                break;
            case "onChapterRequest":
                postMessage({ data: await options.onChapterRequest(data.data), type: "RequestedChapter" });
                break;
            case "onProgressChanged":
                options.onProgressChanged(data.data);
                break;
            case "onFontsChanged":
                options.onFontsChanged(data.data);
                break;
            case "onScroll":
                options.onScroll(data.data);
                break;
            case "RequestCurrentText":
            case "RequestIsPlaying":
                requestedData.set(data.type, data.data);
                break;
            default:
                console.log("Not Assinged", data);
        }
    }

    useEffect(() => {
        const resize = (event: any) => {
            setSize({ width: Dimensions.get("window").width, height: Dimensions.get("window").height })
        }
        var wEvent = Dimensions.addEventListener("change", resize)
        if (ref) {
            (ref as any).current = {
                play,
                pause,
                playNext,
                playPrev,
                isplaying,
                getCurrentText
            };
        }
        return () => wEvent?.remove?.();
    }, [])

    return (
        <View style={{ flex: 1 }} renderToHardwareTextureAndroid={true}>
            <WebView ref={(c) => {
                webview.current = c;
            }} style={{ width: size.width, height: size.height }} source={{ html: html }} onError={(e) => console.log(e)} javaScriptEnabled={true} injectedJavaScript={jsInjection}
                onMessage={(event) => {
                    var message = JSON.parse(event.nativeEvent.data) as JSData;
                    onMessage(message);
                }} />
        </View>
    )
})

