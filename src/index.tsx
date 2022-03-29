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
import { getSelectionText, wait, getSelectionTextAndContainerElement, elementSize, joinStyles, getTextArray } from './Methods'
import Loader from './components/Loader'
import objectUseState from '@alentoma/usestate'
import Iframe from './components/Iframe'
import BookReaderBase from './abstract';
import Icons from './components/Icons';
import Context from './Context'
import defaultSettings from "./defaultSettings";
import { Body } from './components/Body';
import BottomMenu from './components/BottomMenu';
import BookMenu from './components/BookMenu';
import PlayMenu from './components/PlayMenu';

const startScrollPos = 150;
const maxLoadedChapters = 50;
const BookReaderElement = ({ props, selector, DefaultSettings }: { props: BookOptions, selector: BookReader, DefaultSettings: BookOptions }) => {
  const copy = function <T>(item: T) {
    if (item)
      return { ...item };
    else return item;
  }
  const state = objectUseState<IState>({
    isLoading: true,
    viewBookMenu: false,
    viewPlayer: false,
    viewChapters: false,
    viewFontSettings: false,
    viewBottomMenu: false,
    currentChapter: undefined as Chapter | undefined,
    currentindex: props.book.currentChapterIndex || 0,
    textToSpeechProgress: 0,
    chapterContent: [] as { html: JSX.Element, index: number, chapter: Chapter }[],
    language: props.language || copy(DefaultSettings.language || {} as Language),
    fontSettings: props.fontSettings || copy(DefaultSettings.fontSettings || {} as FontSettings),
    iframeSettings: props.iframeSettings || copy(DefaultSettings.iframeSettings || {} as IframeSettings),
    fonts: props.book.fonts || copy(DefaultSettings.book.fonts || {} as CSSStyle),
    isPrev: false,
    navigationChapterController: props.navigationChapterController || "Scroll",
    playableText: [],
    playing: false,
    windowSize: { width: window.document.body.clientWidth, height: window.document.body.clientHeight },
    userAction: false,
  }, false, undefined, 0)

  const play = async (progress: number, doNotTriggerUpdate?: boolean) => {
    if (state.currentChapter) {
      state.textToSpeechProgress = progress;
      state.currentChapter.textToSpeechProgress = progress;
      state.playing = true;
      state.viewPlayer = true;
      if (!doNotTriggerUpdate)
        await selector.trigger("OnPlay", { ChapterChangedEvent: { chapter: state.currentChapter, isUserAction: state.userAction } });
    }
  }

  const pause = async (doNotTriggerUpdate?: boolean) => {
    if (state.playing && state.currentChapter) {
      state.playing = false;
      if (!doNotTriggerUpdate)
        await selector.trigger("OnPause", { ChapterChangedEvent: { chapter: state.currentChapter, isUserAction: state.userAction } });
    }
  }

  const playNext = async (doNotTriggerUpdate?: boolean) => {
    if (state.currentChapter && state.textToSpeechProgress + 1 < state.playableText.length) {
      state.textToSpeechProgress++;
      state.currentChapter.textToSpeechProgress = state.textToSpeechProgress;

      if (!doNotTriggerUpdate)
        selector.trigger("onProgressChanged", { ChapterChangedEvent: { chapter: state.currentChapter, isUserAction: state.userAction } });
    } else if (state.currentChapter && state.textToSpeechProgress == state.playableText.length - 1) {
      if (hasNext()) {
        {
          await selector.trigger("onEnd", { ChapterChangedEvent: { chapter: state.currentChapter, isUserAction: state.userAction } });
          next(); // load next chapter
        }
      } else await pause()
    }
  }

  const playPrev = async (doNotTriggerUpdate?: boolean) => {
    if (state.currentChapter && state.textToSpeechProgress - 1 >= 0) {
      state.textToSpeechProgress--;
      state.currentChapter.textToSpeechProgress = state.textToSpeechProgress;
      if (!doNotTriggerUpdate)
        await selector.trigger("onProgressChanged", { ChapterChangedEvent: { chapter: state.currentChapter, isUserAction: state.userAction } });
    }
  }

  const saveFontSettings = ({ background, fontSize, lineHeight, paddingLeft, className, textFormatter }: CSSStyle) => {
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
    if (className) {
      const font = state.fontSettings.fonts?.find(x => x.className == className);
      fn.className = className;
      if (font && font.title)
        fn.title = font.title;
    }

    if (textFormatter) {
      fn.textFormatter = textFormatter;
    }

    state.fonts = fn;
  }

  const bookdiv = React.useRef(null as HTMLDivElement | null);
  const animateToggleTimer = React.useRef<any>()
  const prevSelection = React.useRef("");
  const popOverTimer = React.useRef<any>();
  const scrollTimer = React.useRef<any>();

  const getFrontPage = () => {
    const image = props.book.cover || "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAAEsCAYAAAB5fY51AAANhklEQVR4nO3daW8bVRuA4ScLpDQtktWmNEAKCASRqkp84v//AVAdh7Qhi50QL+Nt4mW8ZmbeD1V4p26SepkzZx77vj5C8Dkq6p1zjmdZC8MwFABQYN32BABgWgQLgBoEC4AaBAuAGgQLgBoEC4AaBAuAGgQLgBoEC4AaBAuAGgQLgBoEC4AaBAuAGgQLgBoEC4AaBAuAGgQLgBoEC4AaBAuAGgQLgBoEC4AaBAuAGgQLgBoEC4AaBAuAGgQLgBoEC4AaBAuAGgQLgBoEC4AaBAuAGpu2JyAi0mw2JZ/P254GgAe8evVKdnZ2rM4hFcEaj8fS6XRsTwPAA8bjse0psCUEoAfBAqAGwQKgBsECoAbBAqAGwQKgBsECoAbBAqAGwQKgBsECoAbBAqAGwQKgBsECoAbBAqAGwQKgBsECoAbBAqAGwQKgRioekRy39fV1efnype1pAFY5jiO+79ueRqyWNli//vqr7WkAVjWbzaULFltCAGoQLABqECwAahAsAGoQLABqECwAahAsAGoQLABqECwAahAsAGoQLABqECwAahAsAGoQLABqECwAahAsAGoQLABqECwAahAsAGoQLABqECwAahAsAGoQLABqECwAahAsAGoQLABqECwAahAsAGoQLABqbNqeAD4YDAYyHo9lY2NDHj9+bHs6QCoRLAvCMBTXdaXRaEi9XpfhcPjJz2xubkomk5EXL15IJpORzU3+VwH8LUhYuVyWQqFwZ6Sibm5upFarSa1Wk42NDdnb25O9vT3Z2NhIaKZA+hCshHieJ0dHR+J53sz/re/7UigUpFQqyW+//SbPnj0zMEMg/Th0T0Cj0ZC//vprrlhFjUYjyeVycnl5GdPMAF0IlmGO40gulxPf92P7zPPzczk5OYnt8wAtCJZB7XZbjo+PjXx2sViUUqlk5LOBtCJYhozHYzk8PJQgCIyNcXp6Ku1229jnA2lDsAy5vLyU0WhkdIwgCOTs7MzoGMvM5C8TmEGwDBgMBlIsFhMZq9VqSb1eT2SsZXN+fi6dTsf2NDADgmVAqVRK9Lf3v//+m9hYy+L6+lqKxaKUy2XbU8EMCJYB1Wo10fHa7baMx+NEx9TM9305Pj6WMAzFcZxYv8GFWQQrZp7nyWAwSHTMMAylVqslOqZm+Xxe+v2+iHyIl+M4lmeEaRGsmLVaLSvjchYznVar9cn5IttCPQhWzJJeXd26XTHgfkEQyPv37yUMw4/+eafT4fIQJQhWzG5ubqyMyxnW50W3gpNYZelAsLAS2u22XF1d3fvvHcex9ssG0yNYMbP1+JcvvvjCyrga3LcVnPwZDt/Tj2DF7KuvvrIy7tbWlpVxNcjn89Lr9T77c9ybmX4EK2ZPnjyxMu7Tp0+tjJt2n9sKRnmeZ+1bXkyHYMXs6dOnVrZnmUwm8THTbpqt4CRWWelGsGK2trYmz58/T3TM7e1t2d7eTnRMDabdCkbVajW+cU0xgmXA999/L2tra4mN9+rVq8TG0mKWrWAUh+/pRrAM2N7elt3d3UTGevLkibx48SKRsbQIguC/ewXnwbYwvQiWIT/88IPxV3Otra3Jzz//nOhqToN8Pr/Q8/N7vZ5cX1/HOCPEhWAZsrW1Ja9fvzYak59++onD9gnzbgUnceV7OhEsgzKZjPzyyy9GPvubb77h7GrColvBKA7f04lgGfbdd9/J/v6+rK/H90e9t7cn+/v7sX3esri4uFj4VWq3giCQSqUSy2chPgQrAS9fvpTff/9dHj16tNDnbG5uyv7+PudWd+h0OrG/r5HD9/Thzc8J+frrr+WPP/6QYrEoFxcXM91ou76+Lru7u/Ljjz9yz+Ad5rlAdBr9fl9c1+WcMEUIVoLW19dlb29Pdnd3xXVdqVar4rrunfFaW1uTTCYjz549k+fPn3Ov4APi3ApOKpVKBCtFCJYFm5ubsrOzIzs7OyLy4TG90Suyt7a25Msvv7Q1PVVMbAWjGo2GjEYj/n+kBMFKgY2NDW5enoOpreDkGJVKhW9kU4JDdzyo2+2m9oWjl5eXxraCUaVSyWgUMT2ChXv5vi+Hh4dyeHiYumh1u12jW8GowWAgrusmMhYeRrBwr4uLCxkMBtJsNuXvv/9OTbRut4JJzodLHNKBYOFO3W73o1tcGo1GaqJ1eXkp3W430TEbjYYMh8NEx8SnCBbudHJy8kmcGo2GHB0dWY1WklvBqDAMub8wBQgWPlEqle59VHC9XrcWLRtbwahyuczhu2UECx8Zj8eSz+cf/Blb0bKxFYwaDofSbDatjQ+ChQmnp6dTPaUg6Wh5nmdlKziJw3e7CBb+02q1Zno8cL1el3fv3hmPVhiGVreCUc1mUwaDge1prCyCBRH5/7OkZlWr1eTdu3dGz3YuLy+l0+kY+/xZhGHIY2csIlgQEZGrq6uZ3zBzq1arydHRkZFoeZ4nFxcXsX/uIrjy3R6CBen3+1IoFBb6DBMrrTRtBaNGo5E0Gg3b01hJBAtyenoaSxSq1Wqs0UrTVnBSsVi0PYWVRLBWnOM4sa4WqtVqLE9QSONWMOr6+lr6/b7taawcgrXCfN+X8/Pz2D/XcZyFohWGoRwfH6duKxjFle92EKwVdnZ2Zuz+uEWidXV1Je1228Cs4lWpVFId1WVEsFZUt9s1vkJwHGfm1271er3PXmmfFhy+J49graDbb9+S+Gq+UqlMfX1XWr8VfAhXvieLYK2gcrmc6D15lUpF3r9//9mf07IVjHJdl8P3BBGsFTMcDuXs7CzxcT+30tK0FZzEKis5BMuypLc/5+fn4vt+omPeKpfLd0ZL41YwisP35BAsi1zXTfR56Y1GY6abm024K1oat4JR4/FYarWa7WmsBIJlUT6fl2azKblczni0giCQ09NTo2NMq1wuyz///CMiH24L0roVjGJbmAzeS2iJ67r/rSpc15VcLidv3ryR9XUzv0MKhUKqDodv/4Kn+TVis2i1WtLr9eTx48e2p7LUWGFZMrmqcF1XDg4OjPzl7fV6H71QIi1KpZLqreAkVlnmESwLoqurqOvra8lms7Efiqf9Npdl4TgOf86GESwLHjqzabVacnBwEFu0HMe594USiNd4PJZqtWp7GkuNYCXsvtVVVKvVkmw2Kzc3NwuNNR6PU3PQvirYFppFsBI27Tdi7XZbDg4OFopWPp+f6oUSiE+73RbP82xPY2kRrARNs7qKarfbc6+0Wq0Wv+0t4eF+5hCsBM1zvVGn05FsNjvTSikIAjk5OZl5LMSjWq1au5tg2RGshMy6uoqaNVpXV1dWXzi66m5ubjh8N4RgJWTRq7m73e5U0RoMBql+tPCq4GmkZhCsBCyyuorqdrvy9u3bB6N1cnLCdiQF2u12al+goRnBSkCc98p5nidv376V0Wj0yb+r1+s8ATNFWGXFj2AZFtfqKsrzPMlmsx9Fy/d9DtpTxnEcVrsxI1iGmXoSwe1K6/YlEoVCwdgLJTAf3/etP85n2RAsg0ysrqJ6vZ5ks1lpNBqpvLkZXPkeN4JlUBLPeer1epLL5RJ5oQRm1+12l+qJFLYRLENMr66gB6us+BAsQ5bhKZqIR7VaXfhGdnxAsAxgdYWoIAg4fI8JwTKA1RUmsS2MB8GKGasr3MXzPB6kGAOCFTNWV7gPq6zFEawYsbrCQ2q1Gg9UXBDBihGrKzwkCAKpVCq2p6EawYoJqytMgxuiF0OwYsLqCtPo9Xriuq7taahFsGLA6gqzYFs4P4IVA1ZXmAWH7/MjWAtidYVZcfg+P4K1IFZXmAfXZM2HYC2A1RXm1e/3OXyfA8FaAKsrLIJV1uwI1pxYXWFR9Xr9zpeJ4H4Ea06srrCoMAy5kHRGBGsOrK4Ql3K5zOOtZ7BpewIa9ft9+fbbb21PA0tiOBzKo0ePbE9DBYI1B2IF2MGWEIAaBAuAGgQLgBoEC4AaBAuAGgQLgBoEC4AaBAuAGgQLgBoEC4AaBAuAGgQLgBoEC4AaBAuAGgQLgBoEC4AaBAuAGgQLgBpL+YjkMAyl0+nYngZgVRAEtqcQu6UMlu/78ueff9qeBoCYsSUEoAbBAqAGwQKgBsECoAbBAqAGwQKgBsECoAbBAqAGwQKgBsECoAbBAqAGwQKgBsECoAbBAqAGwQKgBsECoAbBAqAGwQKgBsECoAbBAqAGwQKgBsECoAbBAqAGwQKgBsECoAbBAqAGwQKgBsECoAbBAqAGwQKgBsECoAbBAqAGwQKgBsECoAbBAqAGwQKgBsECoAbBAqAGwQKgBsECoAbBAqAGwQKgBsECoAbBAqAGwQKgBsECoAbBAqAGwQKgBsECoAbBAqAGwQKgBsECoAbBAqAGwQKgBsECoAbBAqAGwQKgBsECoAbBAqAGwQKgBsECoAbBAqAGwQKgBsECoAbBAqAGwQKgBsECoAbBAqAGwQKgBsECoMZaGIah7UkAwDRYYQFQg2ABUINgAVCDYAFQg2ABUINgAVCDYAFQg2ABUINgAVCDYAFQg2ABUINgAVCDYAFQg2ABUINgAVCDYAFQg2ABUINgAVCDYAFQg2ABUINgAVCDYAFQg2ABUINgAVCDYAFQg2ABUINgAVCDYAFQg2ABUINgAVCDYAFQg2ABUINgAVDjfwXxayX33T/OAAAAAElFTkSuQmCC";
    return (
      <div className='cover'>
        <img src={image} />
        <div>
          <h2 className="title">{props.book.title}</h2>
          <div className='booksParams' style={{ display: "grid", justifyContent: "center" }}>
            {props.book.bookParams?.map((x, i) => (<p key={i} style={{ margin: "auto 0" }}>{x.text}: {x.value}</p>)) || null}
          </div>
        </div>
      </div>
    )
  }



  const fixScroll = () => {
    try {
      console.log("Here")
      if (state.currentChapter) {
        onWindowSize();
        if (state.navigationChapterController != "Scroll" || state.chapterContent.length === 1) {
          var sc = props.book.startScrollPosition && state.currentChapter.scrollPosition && props.book.startScrollPosition >= state.currentChapter.scrollPosition ? props.book.startScrollPosition : state.currentChapter.scrollPosition;
          if (sc === undefined)
            sc = state.currentChapter.scrollPosition || props.book.startScrollPosition;
          if (state.currentindex > 0 && state.navigationChapterController === "Scroll" && (sc === undefined || sc < startScrollPos))
            sc = startScrollPos;
          if (sc !== undefined) {
            window.scrollTo(0, sc);
          }
        } else if (state.navigationChapterController === "Scroll") {
          if (state.isPrev) {
            var el = document.querySelector(`[data-chapterindex='${state.currentindex}']`) as HTMLElement;
            if (el) {
              var sizeInfo = elementSize(el);
              window.scrollTo(0, (sizeInfo.rec.height + sizeInfo.rec.top) - (state.isPrev ? startScrollPos : 0));
            }
          }
        }

        if (state.isPrev)
          state.isPrev = false;
      }
    } catch (e) {
      console.error(e);
    } finally {
      if (state.isLoading)
        state.isLoading = false;
    }
  }



  const loadChapter = async (index: number) => {
    try {
      if (props.book.chapters.length <= 0 || index >= props.book.chapters.length || index < 0) {
        return;
      }

      state.isLoading = true;
      var chap = props.book.chapters[index];
      var cChapter = state.chapterContent.find(x => x.index == index);
      if (cChapter) {
        state.textToSpeechProgress = chap.textToSpeechProgress || 0
        state.currentChapter = props.book.chapters[index];
        state.currentindex = index;
        state.isLoading = false;
        await wait(100)
        return;
      }


      if (typeof chap.htmlContent !== "string")
        chap.htmlContent = await (chap.htmlContent as (chp: Chapter) => Promise<string>)(chap);

      const iframe = <Iframe onloaded={fixScroll} html={chap.htmlContent} />
      let deletedElements = [] as { index: number }[]
      if (state.navigationChapterController !== "Scroll" || !state.isPrev || state.chapterContent.length == 0) {
        if (state.chapterContent.length >= maxLoadedChapters)
          deletedElements = state.chapterContent.splice(0, maxLoadedChapters / 2);
        state.chapterContent = [...state.chapterContent.filter(x => !deletedElements.find(a => a.index === x.index)), { html: iframe, index, chapter: chap }];
      }
      else {
        if (state.chapterContent.length >= maxLoadedChapters)
          deletedElements = state.chapterContent.splice(maxLoadedChapters / 2, maxLoadedChapters / 2);
        state.chapterContent = [{ html: iframe, index, chapter: chap }, ...state.chapterContent.filter(x => !deletedElements.find(a => a.index === x.index))];
      }
      state.textToSpeechProgress = chap.textToSpeechProgress || 0
      state.currentChapter = chap;
      state.currentindex = index;
      await wait(100);
    } catch (e) {
      console.error(e);
    }
  }

  const bottomReached = () => {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 40) {
      return true;
    }
    return false;
  }

  const topReached = () => {
    if (window.scrollY <= 40) {
      return true;
    }
    return false;
  }



  const next = () => {
    if (!hasNext())
      return;
    if (state.navigationChapterController === "Scroll") {
      if (state.chapterContent.length <= 0)
        return;
      var lastIndex = state.chapterContent[state.chapterContent.length - 1].index;
      if (lastIndex + 1 < props.book.chapters.length) {
        state.currentindex = lastIndex + 1;
      }
    } else state.currentindex++;
  }


  const prev = () => {
    if (!hasPrev())
      return;
    if (state.navigationChapterController === "Scroll") {
      var firstIndex = state.chapterContent[0].index;
      if (firstIndex - 1 >= 0) {
        state.isPrev = true;
        state.currentindex = firstIndex - 1;
      }
    } else state.currentindex--;
  }

  const hasNext = () => {
    if (state.navigationChapterController === "Scroll") {
      if (state.chapterContent.length <= 0)
        return false;
      var lastIndex = state.chapterContent[state.chapterContent.length - 1].index;
      if (lastIndex + 1 < props.book.chapters.length)
        return true;
      return false;
    } else {
      if (state.currentindex + 1 < props.book.chapters.length)
        return true;

      return false;
    }
  }

  const hasPrev = () => {
    if (state.navigationChapterController === "Scroll") {
      if (state.chapterContent.length <= 0)
        return false;
      var firstIndex = state.chapterContent[0].index;
      if (firstIndex - 1 >= 0) {
        return true;
      }

      return false;
    } else {
      if (state.currentindex - 1 >= 0)
        return true;

      return false;
    }
  }

  const goTo = (index: number, userAction?: boolean) => {
    if (state.isLoading)
      return;
    if (index >= props.book.chapters.length || 0 > index)
      return;
    state.userAction = userAction || state.userAction;
    state.chapterContent.splice(0, state.chapterContent.length);
    state.currentindex = index;
  }


  const onScroll = (event: any) => {
    if (state.viewPlayer)
      return;
    clearTimeout(scrollTimer.current);
    if (state.isLoading || state.chapterContent.length <= 0)
      return;
    scrollTimer.current = setTimeout(() => {
      if (state.currentChapter && !state.isLoading) {
        state.currentChapter.scrollPosition = document.documentElement.scrollTop;
        selector.trigger("onScroll", { ScrollEvent: { scrollTop: document.documentElement.scrollTop, event: event } });
      }

      if (state.navigationChapterController === "Scroll" && bottomReached()) {
        next();
      } else if (state.navigationChapterController === "Scroll" && topReached())
        prev();
    }, 500);
  }

  const onWindowSize = () => {
    try {
      state.windowSize = { width: window.document.body.clientWidth, height: window.document.body.clientHeight };
      if (bookdiv.current) {
        var sizeInfo = elementSize(bookdiv.current);
        var options = Array.from(bookdiv.current.querySelectorAll(".options")) as HTMLDivElement[];
        options.forEach(option => {
          const optionSizeInfo = elementSize(option);
          if ((props.bookMenu && option.classList.contains("Top")) || option.classList.contains("Bottom") || option.classList.contains("PlayTop")) {
            option.style.width = (sizeInfo.elementWidth - (optionSizeInfo.paddingLeft + optionSizeInfo.paddingRight)) + "px";
            option.style.left = (sizeInfo.rec.left) + "px"
          }
        })
      }
    } catch (e) {
      console.error(e)
    }
  }

  React.useEffect(() => {
    if (state.__isInitialized) {
      state.chapterContent.splice(0, state.chapterContent.length);
      loadChapter(state.currentindex);
    }
  }, [state.navigationChapterController])

  useEffect(() => {
    if (!state.viewPlayer && state.playing)
      pause();
    onWindowSize();
  }, [state.viewPlayer])

  useEffect(() => {
    if (state.playing)
      pause();
  }, [state.fonts.textFormatter])

  useEffect(() => {
    if (state.__isInitialized)
      selector.trigger("onFontsChanged", { FontEvent: { font: state.fonts } });
  }, [state.fonts])

  const contextValue = { props, state, next, prev, goTo, hasPrev, hasNext, play: play, pause: pause, playNext: playNext, playPrev: playPrev };

  useEffect(() => {
    window.addEventListener("scroll", onScroll);
    window.addEventListener("resize", onWindowSize);
    (selector as any).onStart(contextValue);
    loadChapter(props.book.currentChapterIndex || 0);
    return () => {
      clearTimeout(scrollTimer.current);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onWindowSize);
    }
  }, [])

  useEffect(() => {
    if (state.currentChapter)
      state.textToSpeechProgress = state.currentChapter.textToSpeechProgress || 0;
    if (state.__isInitialized && state.currentChapter) {
      selector.trigger("onChapterChanged", { ChapterChangedEvent: { chapter: state.currentChapter, isUserAction: state.userAction } });
    }

    if (state.userAction)
      state.userAction = false;
  }, [state.currentChapter])

  useEffect(() => {
    if (state.currentChapter && !state.isLoading)
      state.currentChapter.textToSpeechProgress = state.textToSpeechProgress;
  }, [state.textToSpeechProgress])

  useEffect(() => {
    if (state.__isInitialized) {
      loadChapter(state.currentindex);
    }

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

    clearTimeout(animateToggleTimer.current);
    let target = (event.target as HTMLElement)

    const optionsDiv = target.closest(".book");
    const bookMenu = target.closest(".bookMenu")
    const bookContextMenu = document.querySelector(".bookContextMenu");
    if (bookContextMenu || getSelectionText().length)
      return;

    if (prevSelection.current.length > 0) {
      prevSelection.current = "";
      return;
    } else {
      animateToggleTimer.current = setTimeout(() => {
        if (getSelectionText().length > 0) {
          optionsDiv?.querySelectorAll(".options:not(.PlayTop)").forEach(x => x.classList.remove("animate"));
          state.viewBookMenu = false;
          return;
        }
        if (bookMenu)
          return;

        if (optionsDiv) {
          optionsDiv?.querySelectorAll(".options:not(.PlayTop)").forEach(x => x.classList.toggle("animate"));
          state.viewBookMenu = !state.viewBookMenu;
          selector.trigger("onChapterClick", {});
        }
        //prevSelection.current = "";
      }, 500);
    }
  }

  return (
    <Fragment>
      <Context.Provider value={contextValue}>
        <div ref={bookdiv} style={{ ...state.fonts.background?.bodyStyle }} className={"book " + (props.cssClass || "")}>
          {
            props.bottomMenu?.disabled !== true ? (
              <BottomMenu />
            ) : null
          }

          {
            props.bookMenu?.playerButtonDisabled !== true ? (
              <PlayMenu />
            ) : null
          }

          {
            props.bookMenu?.position !== "None" ? (
              <BookMenu saveFontSettings={saveFontSettings} />
            ) : null
          }

          <Loader isLoading={state.isLoading} />
          {
            state.navigationChapterController == "Scroll" && !state.viewPlayer ? (
              <div onContextMenu={(e) => e.preventDefault()} data-current-index={state.currentindex}
                style={joinStyles(state.fonts.background?.chapterStyle, state.fonts, { paddingTop: state.currentindex > 0 && !state.chapterContent.find(x => x.index === 0) ? startScrollPos : undefined, paddingBottom: startScrollPos })}
                className={"chapter-content " + state.fonts.className + " " + props.navigationChapterController} onClick={toggleOptions}>
                <div>
                  {
                    state.chapterContent.map((x, index) => (
                      <div className={index > 0 ? "break" : ""} key={x.index} data-chapterindex={x.index}>
                        {x.index === 0 ? getFrontPage() : null}
                        {
                          props.book.showChapterTitle ? (
                            <h2 className='chapter-title'>{x.chapter.title}</h2>
                          ) : null
                        }
                        {x.html}
                      </div>
                    ))
                  }
                </div>
              </div>
            ) : null}
          {state.navigationChapterController == "Swaper" && !state.viewPlayer ?
            (<Slider currentIndex={state.currentindex} onChapterLoad={async (index) => { state.currentindex = index; }}>
              <div onContextMenu={(e) => e.preventDefault()} data-current-index={state.currentindex} style={joinStyles(state.fonts.background?.chapterStyle, state.fonts)} className={"chapter-content " + state.fonts.className + " " + state.navigationChapterController} onClick={toggleOptions}>
                {state.currentindex === 0 ? getFrontPage() : null}
                <div>
                  {
                    props.book.showChapterTitle ? (
                      <h2 className='chapter-title'>{state.chapterContent.find(x => x.index == state.currentindex)?.chapter.title}</h2>
                    ) : null
                  }
                  {
                    state.chapterContent.find(x => x.index == state.currentindex)?.html
                  }
                </div>
              </div>
            </Slider>) : null
          }

          {
            state.viewPlayer ? (
              <div onContextMenu={(e) => e.preventDefault()} data-current-index={state.currentindex}
                style={joinStyles(state.fonts.background?.chapterStyle, state.fonts)}
                className={"chapter-content vCenter " + state.fonts.className + " " + props.navigationChapterController} onClick={toggleOptions}>
                <div>
                  <div data-chapterindex={state.textToSpeechProgress}>
                    {
                      state.chapterContent.find(x => x.index == state.currentindex)?.html
                    }
                  </div>

                </div>
              </div>
            ) : null
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
                      if (sElement.containerElement.closest(".cover"))
                        return null;

                      return <div ref={(c => {
                        popupref.current = c;
                        fixPosition();
                      })} className={"bookContextMenu " + state.fonts.className} style={style}>
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
        </div>
        <Body></Body>
      </Context.Provider>
    </Fragment >
  )
}

class WebBookReader extends BookReaderBase {
  protected readonly ___element: JSX.Element;
  static DefaultSettings = defaultSettings;
  constructor(options: BookOptions) {
    super(options);
    this.___element = <BookReaderElement props={this.bookOptions} DefaultSettings={{ ...WebBookReader.DefaultSettings }} selector={this} />;
  }

  renderTo(selector: string) {
    ReactDOM.render(this.___element, document.querySelector(selector))
  }
}

class ReactBookReader extends BookReaderBase {
  protected readonly ___element: JSX.Element;
  static DefaultSettings = defaultSettings;
  constructor(options: BookOptions) {
    super(options);
    this.___element = <BookReaderElement props={this.bookOptions} selector={this} DefaultSettings={{ ...ReactBookReader.DefaultSettings }} />;
  }

  render() {
    return this.___element;
  }
}

if (window != undefined) // this is for web
{
  window["BookReader"] = WebBookReader;
}
export default ReactBookReader;