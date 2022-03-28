import 'react-app-polyfill/ie11'
import React, { useEffect, useRef } from 'react'
import data from './temp/jsonData.json'

import BookReader from 'ebook-reader-js'
import 'ebook-reader-js/dist/index.css'

const App = () => {
  const chapters = (data as any).chapters.map((x: any) => { return { title: x.title, htmlContent: x.htmlBody, scrollPosition: 0 } });
  const timer = useRef<any>();
  var bookReader = useRef(new BookReader({
    textSelectionMenu: {
      menus: [
        {
          text: "Copy"
        },
        {
          text: "Share"
        }],
      click: (result: any) => {
        alert(result.selectedText);
      }
    },
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
      title: "Re-Birth Of A Genius. Creator/Destroyer",
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
  }));

  const wait = (ms?: number) => {
    return new Promise<void>((resolve) => setTimeout(() => {
      resolve()
    }, ms || 1000))

  }

  const play = () => {
    if (!bookReader.current.player.isplaying())
      return;
    clearTimeout(timer.current);
    timer.current = setTimeout(async () => {
      var txt = bookReader.current.player.getCurrentText();
      console.info("playing", txt);
      await wait(1000);
      bookReader.current.player.next();
      play();
    }, 1000);
  }

  useEffect(() => {
    const event = bookReader.current.on(async (eventName, event) => {
      console.log(eventName, event)
      if (bookReader.current.player.isplaying() && eventName === "onChapterChanged" && event.ChapterChangedEvent?.isUserAction) {
        bookReader.current.player.pause();
      }
    }, "onChapterChanged", "onFontsChanged" , "onScroll");

    const playerEvent = bookReader.current.on(async (eventName, event) => {
      console.log(eventName, event.ChapterChangedEvent?.chapter)
      switch (eventName) {
        case "OnPlay":
          play();
          break;

        case "onEnd":
        case "OnPause":
          clearTimeout(timer.current);

          break;

      }
    }, "OnPause", "OnPlay", "onEnd", "onProgressChanged")
    //  bookReader.current.player.play(5);

    return () => {
      event.remove();
      playerEvent.remove();
    }
  }, [])

  return bookReader.current.render();

}

export default App
