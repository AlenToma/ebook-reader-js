import React, { useRef } from 'react'
import data from './temp/jsonData.json'

import BookReader from 'ebook-reader-js'
import 'ebook-reader-js/dist/index.css'
import objectUseState from '@alentoma/usestate'

const App = () => {
  var bookReader = useRef(new BookReader({
    onScroll: () => {
      //console.info("scrollTop", scrollTop, event);
    },
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
    book: {
      startScrollPosition: 0,
      title: "Re-Birth Of A Genius. Creator/Destroyer",
      currentChapterIndex: 0,
      chapters: (data as any).chapters.map((x: any) => { return { title: x.title, htmlContent: x.htmlBody, scrollPosition: 0 } })
    }
  }));


  return bookReader.current.render();

}

export default App
