import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { WebView } from 'react-native-webview'
import jsonData from './single/novelData.json'
import EbookReader, { EbookEventsOptions } from './EbookReader';
import { BookOptions, CSSStyle, Book, BookParams, Chapter, ChapterChangedEvent } from 'ebook-reader-js/dist/typings'

async function sleep(ms?: number) {
    return new Promise<void>((resolve) => {
        setTimeout(() => {
            resolve();
        }, ms || 500);
    })
}


const json = jsonData as any;

const chapters = json.chapters.map((x: any, index: number) => { return { title: x.title, htmlContent: "", scrollPosition: 0, id: index } });

export default function App() {
    const bookReader = useRef(null as EbookEventsOptions | null);
    const timer = useRef<any>();
    const [size, setSize] = useState({ width: Dimensions.get("window").width, height: Dimensions.get("window").height })
    const [bookOption] = useState({
        bookMenu: {
            position: "Top"
        },
        iframeSettings: {
            cleanHtml: true,
            indentSplitterCount: 3
        },
        navigationChapterController: "Scroll",
        book: {
            showChapterTitle: true,
            startScrollPosition: 0,
            title: json.title,
            currentChapterIndex: 0,
            chapters: chapters,
            bookParams: [{
                text: "Author",
                value: "Alen Toma"
            }, {
                text: "Chapters",
                value: chapters.length
            }]
        }
    } as BookOptions)


    const play = async () => {
        if (bookReader.current) {
            console.log("isPlaying", await bookReader.current.isplaying())
            if (!(await bookReader.current.isplaying()))
                return;
            clearTimeout(timer.current);
            timer.current = setTimeout(async () => {

                var txt = await bookReader.current?.getCurrentText();
                console.info("playing", txt);
                await sleep(1000);
                bookReader.current?.playNext();
                play();
            }, 1000);
        }
    }

    useEffect(() => {
        const resize = (event: any) => {
            setSize({ width: Dimensions.get("window").width, height: Dimensions.get("window").height })
        }
        var wEvent = Dimensions.addEventListener("change", resize)

        return () => wEvent?.remove?.();
    }, [])

    return (
        <View style={styles.container} renderToHardwareTextureAndroid={true}>
            <EbookReader ref={bookReader} options={
                {
                    options: bookOption,
                    onPlay: play,
                    onEnd: (chapter: Chapter) => clearTimeout(timer.current),
                    onPause: () => clearTimeout(timer.current),
                    onProgressChanged: (chapter: Chapter) => console.log("onProgressChanged"),
                    onChapterChanged: (event) => console.log("onChapterChanged"),
                    onFontsChanged: (event) => console.log("onFontsChanged"),
                    onScroll: (event) => console.log("onScroll"),
                    onChapterRequest: (chapter: any) => {

                        return json.chapters[chapter.id].htmlBody
                    },
                }
            } />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});