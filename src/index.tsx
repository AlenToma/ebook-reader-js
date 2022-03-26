import _ from 'lodash';
import * as React from 'react';
import { Fragment, useEffect } from "react"
import { BookOptions, Chapter, SelectionResult, FontSettings, BookReader, IState, CSSStyle, Language, IframeSettings } from './typings';
import Dialog from './components/Dialog';
import ReactDOM from 'react-dom';
import { Popover } from "react-text-selection-popover";
import './index.css';
import './fonts.css';
import './select.css';
import Slider from './components/Slider'
import { getSelectionText, wait, getSelectionTextAndContainerElement, elementSize } from './Methods'
import Loader from './components/Loader'
import objectUseState from '@alentoma/usestate'
import Iframe from './components/Iframe'
import BookReaderBase from './abstract';
import DefaultSettings from './defaultSettings';



const tbContentIcons = `<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACMAAAAjCAYAAAAe2bNZAAAABmJLR0QA/wD/AP+gvaeTAAAAiklEQVRYhe3TwQkCMRAF0OdiC57tyAosxPvuwUKswIKEbUS9REgOIntYssh/EEjIIcNkPhHL7Dq+e8SAJ2a8OtViKo9/1gT7cnnCeeUCbriX/QEPXHAtZ8PKBdS6fcMvo/abRjLA36UzEu3Wtga0kmgvks5ItFvbGtBKor1IOiPRbm1rQCuJdvyfN8LGTF05WoI9AAAAAElFTkSuQmCC"/>`
const settingsIcons = `<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACMAAAAjCAYAAAAe2bNZAAAABmJLR0QA/wD/AP+gvaeTAAADqUlEQVRYhdXXy29VVRQG8J+3pbU2qPgaGhOJD8RI1dJQhbEPZKYRJxp8TdVCjMYnCqhoxAGC/gkOBMUqinNigIgIaBRjFKMmjchAbbEPHKx9uYfTc+653DZGv+QMzt5rr/Xttddae23+QzhrBmu7sA7nZsZG8AymZkKqHdyEkziAvTiU/hf+20TgQUyiJ/1fkMjc3a7CWsX8IJaVzF2N7zGa/o/hZ1xbIr8US86UYB23JkNTeEvDA3XsxHu5sY/xfm5sDp4TXjyBFWdKZHlauA2rMYb9WCA88gb+wvrcupfxJzbiclyJfUnXGmxPum5vlchAhsicNNaHw2l8KhF7QsRJFhfh2SQ7KTz7NW5I810ZQv2tkFmEcazNjZ+Dp3BHCzpquBPPozc3tzbpX9QKGRpnXBa87WIQE6IWtYxO7MZ3mDtLRHrxDfZoHH/LuELEyNMVch0idjoq5NaJoJ9fJtCsznSlb2/J/ACGk4HfRBZ9gMUl8geTvommlEvwpkjLItwvgvBzPCKC9VGRZeNYVbCmhm/xUpXhLtyMh7AJn4i0XF0gO5AMbjbdsx3YkuaLUvdF/CEK5mt4QAT1aTH0irhXJkSQvStS8LwChcPCI2VH3CEuzx0FcxdjQ5o7IjL2pCiWp7AVX+LsEgNZQ2PiaJrhMeHZqqDuSXa3cvruTiRDzTAP3ThaIfeD2Nj5FXKjya48mZ5krBl+T4svrZC7TGzseIXcPJkLuE5mRFyCx8SuPxSXYH5nk/gU9yo/gk7ch11JPotLRDbtxE/J3oJk/xRqog+5RwTYsPJsWiyyZUsBoU68jb9xY8HaejbtSHZWJrtVfZXNyuvMqkToCwyJOjMkgnFceCaPep3ZUGW4CAtF2t1WMt8vdjiW5EZFY1XkEcILEyKeCtHZhMyU2GWfiKE89oh2oiZi67jmr4Jrkr7uJjKF6BaF7bDoY2YDvaLR2icqfst4Xbi/b5aI1HG9KA0bW12wTLh7KDc+VzRdK1Q//mq4S2RPvh9ak/QvbYXMoPDKdg13LhF3yVhSdABPml4kLxRd3FcaPfARjSdKtgcebIUM0b2Piab8BZEFu0VjdJV4HYya3ievF33Nq+J1MD+tm0h6tiW9y1slUsctyeC4qJr5VnFXUp7FR6LByqITj4tC2Na7qY5+XFcyt0m0G1kcVV7U+pR3gTPGw8L9+bf2ynYVNit6VTgk7qbPxBHUSR1sV2FV89MMv4qeZQS/4EdxG78jPPT/xj/Lf+MNpkdIUQAAAABJRU5ErkJggg=="/>`


const BookReaderElement = ({ props, selector }: { props: BookOptions, selector: BookReader }) => {
  const copy = function <T>(item: T) {
    if (item)
      return { ...item };
    else return item;
  }
  const state = objectUseState({
    isLoading: true,
    viewChapters: false,
    viewFontSettings: false,
    currentChapter: undefined as Chapter | undefined,
    currentindex: props.book.currentChapterIndex || 0,
    chapterContent: [] as { html: JSX.Element, index: number }[],
    language: props.language || copy(DefaultSettings.language || {} as Language),
    fontSettings: props.fontSettings || copy(DefaultSettings.fontSettings || {} as FontSettings),
    iframeSettings: props.iframeSettings || copy(DefaultSettings.iframeSettings || {} as IframeSettings),
    fonts: props.book.fonts || copy(DefaultSettings.book.fonts || {} as CSSStyle)
  }, false, undefined, 0)


  const saveFontSettings = ({ background, fontSize, lineHeight, paddingLeft, className }: CSSStyle) => {
    var fn = { ...state.fonts };

    if (background)
      fn.background = background;

    if (fontSize)
      fn.fontSize = fontSize;

    if (lineHeight)
      fn.lineHeight = lineHeight;
    if (paddingLeft) {
      fn.paddingLeft = fn.paddingRight = paddingLeft;
    }
    if (className)
      fn.className = className;

    state.fonts = fn;
  }

  const bookdiv = React.useRef(null as HTMLDivElement | null);
  const animateToggleTimer = React.useRef<any>()
  const prevSelection = React.useRef("");
  const chapterRef = React.useRef(null as HTMLDivElement | null);
  const popOverTimer = React.useRef<any>();
  const scrollTimer = React.useRef<any>();

  const getFrontPage = () => {
    const image = props.book.cover || "data:image/png;base64,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";
    return (
      <div className='cover'>
        <img src={image} />
        <div>
          <h2 className="title">{props.book.title}</h2>
          {props.book.bookParams?.map(x => (<p style={{ margin: "auto" }}>${x.text}: ${x.value}</p>)) || null}
        </div>
      </div>
    )
  }

  const fixScroll = () => {
    if (state.currentChapter) {
      onWindowSize();
      var sc = props.book.startScrollPosition && state.currentChapter.scrollPosition && props.book.startScrollPosition >= state.currentChapter.scrollPosition ? props.book.startScrollPosition : state.currentChapter.scrollPosition;
      if (sc === undefined)
        sc = state.currentChapter.scrollPosition || props.book.startScrollPosition;
      if (sc !== undefined) {
        window.scrollTo(0, sc);
      }
    }
  }


  const loadChapter = async (index: number) => {
    if (props.book.chapters.length <= 0 || index >= props.book.chapters.length || index < 0) {
      return;
    }
    chapterRef.current = null;

    state.isLoading = true;
    var cChapter = state.chapterContent.find(x => x.index == index);
    if (cChapter) {
      if (props.book.onChapterChange)
        await props.book.onChapterChange(props.book.chapters[index], state.currentChapter);

      state.currentChapter = props.book.chapters[index];
      state.currentindex = index;
      state.isLoading = false;
      await wait(100)
      return;
    }
    var chap = props.book.chapters[index];
    if (typeof chap.htmlContent !== "string")
      chap.htmlContent = await (chap.htmlContent as (chp: Chapter) => Promise<string>)(chap);
    const iframe = <Iframe onloaded={fixScroll} iframeSettings={props.iframeSettings} html={chap.htmlContent} />
    state.isLoading = false;
    state.chapterContent = [...state.chapterContent, { html: iframe, index }];
    state.currentChapter = chap;
    state.currentindex = index;
    if (props.book.onChapterChange)
      await props.book.onChapterChange(chap, state.currentChapter);

    await wait(100)

  }

  const onScroll = (event: any) => {
    clearTimeout(scrollTimer.current);
    scrollTimer.current = setTimeout(() => {
      if (state.currentChapter && !state.isLoading) {
        state.currentChapter.scrollPosition = document.documentElement.scrollTop;
        if (props.onScroll)
          props.onScroll(document.documentElement.scrollTop, event);
      }

    }, 500);
  }

  const onWindowSize = () => {
    if (bookdiv.current) {
      var sizeInfo = elementSize(bookdiv.current);
      var option = bookdiv.current.querySelector(".options") as HTMLDivElement;
      if (option) {
        const optionSizeInfo = elementSize(option);

        if (props.bookMenu && props.bookMenu.position === "Top") {
          option.style.width = (sizeInfo.elementWidth - (optionSizeInfo.paddingLeft + optionSizeInfo.paddingRight)) + "px";
          option.style.left = (sizeInfo.rec.left + (optionSizeInfo.paddingLeft + optionSizeInfo.paddingRight)) + "px"
        }
      }
    }
  }



  useEffect(() => {
    window.addEventListener("scroll", onScroll);
    window.addEventListener("resize", onWindowSize);
    loadChapter(props.book.currentChapterIndex || 0);
    return () => {
      clearTimeout(scrollTimer.current);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onWindowSize);
    }
  }, [])


  useEffect(() => {
    (selector as any).update(state, loadChapter);
  }, [state.isLoading, state.currentindex, state.currentChapter])

  useEffect(() => {
    if (state.__isInitialized)
      loadChapter(state.currentindex);
  }, [state.currentindex])

  useEffect(() => {
    onWindowSize();
  }, [bookdiv.current])

  useEffect(() => {
    if (state.fonts.background)
      for (const key in state.fonts.background.bodyStyle)
        document.body.style[key] = state.fonts.background.bodyStyle[key];
  }, [state.fonts])


  useEffect(() => {
    if (state.viewChapters) {
      const chList = document.querySelector(".chapterList");
      if (chList && chList.parentElement && chList.children.length > 0) {
        var rec = chList.children[state.currentindex].getBoundingClientRect();
        chList.parentElement.scrollTop = rec.height * state.currentindex;
      }
    }
  }, [state.viewChapters])


  const toggleOptions = (event: any) => {
    const optionsDiv = (event.target as HTMLElement).closest(".book");
    const bookMenu = (event.target as HTMLElement).closest(".bookMenu")
    clearTimeout(animateToggleTimer.current);
    if (prevSelection.current.length >= 1) {
      if (getSelectionText().length <= 0)
        prevSelection.current = "";

      return;
    }
    animateToggleTimer.current = setTimeout(() => {
      if (getSelectionText().length > 1) {
        optionsDiv?.querySelector(".options")?.classList.remove("animate");
        return;
      }
      if (bookMenu)
        return;

      if (optionsDiv) {
        optionsDiv.querySelector(".options")?.classList.toggle("animate");
      }
      prevSelection.current = "";
    }, 200);
  }

  const validChapterStyle = (style: CSSStyle) => {
    var st = { ...style };
    delete st.background;
    delete st.className;
    delete st.title;
    return st as React.CSSProperties;
  }

  return (
    <Fragment>
      <div ref={bookdiv} style={{ ...state.fonts.background?.bodyStyle }} className={"book " + (props.cssClass || "")}>
        <Loader isLoading={state.isLoading} />
        {
          props.nextChapterController == "Scroll" ? (
            <div ref={chapterRef} onContextMenu={(e) => e.preventDefault()} data-current-index={state.currentindex} style={Object.assign({ ...state.fonts.background?.chapterStyle }, validChapterStyle(state.fonts))} className={"chapter-content " + state.fonts.className} onClick={toggleOptions}>
              {state.currentindex === 0 ? getFrontPage() : null}
              <div>
                {state.chapterContent.find(x => x.index == state.currentindex)?.html}
              </div>
            </div>
          ) : (<Slider currentIndex={state.currentindex} onChapterLoad={async (index) => { state.currentindex = index; }}>
            <div ref={chapterRef} onContextMenu={(e) => e.preventDefault()} data-current-index={state.currentindex} style={Object.assign({ ...state.fonts.background?.chapterStyle }, validChapterStyle(state.fonts))} className={"chapter-content " + state.fonts.className} onClick={toggleOptions}>
              {state.currentindex === 0 ? getFrontPage() : null}
              <div>
                {state.chapterContent.find(x => x.index == state.currentindex)?.html}
              </div>
            </div>
          </Slider>)
        }
        {
          props.textSelectionMenu && props.textSelectionMenu.menus.length > 0 ? (
            <Popover
              render={
                ({ clientRect, isCollapsed, textContent }) => {
                  try {
                    if (clientRect == null || isCollapsed || !textContent || textContent.length <= 0) {
                      return null
                    }
                    prevSelection.current = textContent || "";
                    var row = "";
                    var column = "";
                    if (props.textSelectionMenu) {
                      props.textSelectionMenu.menus.forEach((_, i) => {
                        if (i % 3 === 0)
                          row += " 1fr";
                      });

                      if (props.textSelectionMenu.menus.length >= 3)
                        column = "1fr 1fr 1fr";
                      else column = props.textSelectionMenu.menus.map(() => "1fr").join(" ");
                    }
                    var left = document.documentElement.scrollLeft + (clientRect.left + clientRect.width / 2);

                    const style = {
                      position: "absolute",
                      left: left,
                      top: document.documentElement.scrollTop + (clientRect.top - 40),
                      marginLeft: -75,
                      gridTemplateColumns: column,
                      gridTemplateRows: row
                    } as React.CSSProperties
                    const popupref = React.useRef(null as HTMLDivElement | null)
                    const fixPosition = () => {
                      if (popupref.current) {
                        var pos = popupref.current.getBoundingClientRect();
                        if (pos.left + pos.width > window.outerWidth) {
                          popupref.current.style.left = "unset";
                          popupref.current.style.right = "6px";
                        }
                      }
                    }
                    React.useEffect(() => {
                      fixPosition();
                    }, [popupref.current])

                    React.useEffect(() => {
                      fixPosition();
                    }, [])
                    var sElement = getSelectionTextAndContainerElement();

                    if (!sElement || !sElement.containerElement)
                      return null;
                    else if (!sElement.containerElement.classList.contains("chapter-content") && !sElement.containerElement.closest(".chapter-content"))
                      return null;
                    else if (sElement.containerElement.closest(".cover"))
                      return null;

                    return <div ref={(c => {
                      popupref.current = c;
                      fixPosition();
                    })} className='bookContextMenu' style={style}>
                      {
                        props.textSelectionMenu?.menus.map((x, i) => (
                          <a key={i} href="#" onClick={() => {
                            var result = {
                              selectedText: textContent,
                              rec: clientRect,
                              menuIndex: i
                            } as SelectionResult
                            if (props.textSelectionMenu?.click)
                              props.textSelectionMenu.click(result);
                          }}>
                            {
                              x.icon && typeof x.icon === "string" ? (<img src={x.icon} />) : null
                            }
                            {
                              x.icon && typeof x.icon !== "string" ? (x.icon) : null
                            }
                            {x.text}
                          </a>
                        ))
                      }
                    </div>
                  } catch (e) {
                    console.log(e)
                    // alert("Error")
                    return null;
                  }
                }
              }
            />
          ) : null
        }
        {
          props.bookMenu?.position !== "None" ? (
            <div className={"options " + (props.bookMenu && props.bookMenu.position ? props.bookMenu.position : "Right")}>
              <div style={props.bookMenu && props.bookMenu.position == "Top" ? {
                minWidth: (props.bookMenu.chapterButtonDisabled !== true ? 35 : 0) + (props.bookMenu.fontsButtonDisabled !== true ? 35 : 0) + ((props.bookMenu.buttons || [])?.length * 35)
              } : undefined}>
                {
                  !props.bookMenu || props.bookMenu.chapterButtonDisabled !== true ? (
                    <a onClick={() => state.viewChapters = true} title={state.language?.chaptersSettings?.tableOfContentIconTitle} dangerouslySetInnerHTML={{ __html: tbContentIcons }}></a>
                  ) : null
                }

                {
                  !props.bookMenu || props.bookMenu.fontsButtonDisabled !== true ? (
                    <a onClick={() => state.viewFontSettings = true} title={state.language?.fontsSettings?.fontsIconTitle} dangerouslySetInnerHTML={{ __html: settingsIcons }}></a>
                  ) : null
                }

                {
                  props.bookMenu && props.bookMenu.buttons ? (
                    props.bookMenu.buttons.map((x, index) => (<a className={x.className} onClick={x.action} title={x.title}> {
                      typeof x.icon === "string" ? <img src={x.icon} /> : x.icon
                    } </a>))
                  ) : null
                }
              </div>
            </div>
          ) : null}
      </div>

      {
        state.viewChapters ? (
          <Dialog onclose={() => state.viewChapters = false} title={state.language?.chaptersSettings?.tableOfContentHeaderText}>
            <div className='list chapterList'>
              {props.book.chapters.map((x, i) => (
                <a key={i} className={state.currentindex == i ? "selected" : ""} onClick={() => loadChapter(i)}>{x.title}</a>
              ))}
            </div>
          </Dialog>
        ) : null
      }

      {
        state.viewFontSettings ? (
          <Dialog onclose={() => state.viewFontSettings = false} title={state.language?.fontsSettings?.fontsHeaderText}>
            <div className='form fontSettings'>
              <div>
                <label>{state.language?.fontsSettings.chooseFontLabel}:</label>
                <select className='select-css' value={state.fonts.className} onChange={e => {
                  if (state.fontSettings?.fonts && state.fontSettings?.fonts.length > 0)
                    saveFontSettings({ className: e.target.value });
                }}>
                  {
                    state.fontSettings?.fonts?.map((x, index) => (
                      <option value={x.className} key={index}>{x.title}</option>
                    ))
                  }
                </select>
              </div>


              <div>
                <label>{state.language?.fontsSettings.fontLineHeightLabel}:</label>
                <select className='select-css' value={state.fonts.lineHeight} onChange={x => saveFontSettings({ lineHeight: parseFloat(x.target.value) })}>
                  {
                    state.fontSettings?.lineHeights?.map((x, index) => (
                      <option value={x} key={index}>{(x * 100)}%</option>
                    ))
                  }
                </select>
              </div>

              <div>
                <label>{state.language?.fontsSettings.fontSizeLabel}:</label>
                <select className='select-css' value={state.fonts.fontSize} onChange={x => saveFontSettings({ fontSize: parseInt(x.target.value) })}>
                  {
                    state.fontSettings?.fontSizes?.map((x, index) => (
                      <option value={x} key={index}>{x}</option>
                    ))
                  }
                </select>
              </div>

              <div>
                <label>{state.language?.fontsSettings.marginLeftRightLabel}:</label>
                <select className='select-css' value={state.fonts.paddingLeft} onChange={x => saveFontSettings({ paddingLeft: parseInt(x.target.value) })}>
                  {
                    state.fontSettings?.marginLeftRight?.map((x, index) => (
                      <option value={x} key={index}>{(x)}</option>
                    ))
                  }
                </select>
              </div>

              <div>
                <label>{state.language?.fontsSettings.backgroundStyleLabel}:</label>
                <div className='fontBackground'>
                  {
                    state.fontSettings?.background?.map((x, index) => (
                      <a className={(state.fonts.background?.name === x.name ? "selected" : "")} onClick={() => saveFontSettings({ background: x })} style={{ background: x.chapterStyle.background, backgroundColor: x.chapterStyle.backgroundColor, color: x.chapterStyle.color }}> {x.name} </a>
                    ))
                  }
                </div>
              </div>
            </div>
          </Dialog>
        ) : null
      }
    </Fragment >
  )
}


class WebBookReader extends BookReaderBase {
  protected readonly ___element: JSX.Element;
  constructor(options: BookOptions) {
    super(options);
    this.___element = <BookReaderElement props={this.bookOptions} selector={this} />;
  }

  renderTo(selector: string) {
    ReactDOM.render(this.___element, document.querySelector(selector))
  }
}

class ReactBookReader extends BookReaderBase {
  protected readonly ___element: JSX.Element;
  constructor(options: BookOptions) {
    super(options);
    this.___element = <BookReaderElement props={this.bookOptions} selector={this} />;
  }

  render() {
    return this.___element;
  }
}

if (window != undefined) // this is for web
  (window as any).BookReader = function (options: BookOptions) {
    return new WebBookReader(options);
  }

export default ReactBookReader;