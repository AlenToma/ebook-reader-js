/// <reference types="react" />
import "keen-slider/keen-slider.min.css";
import "../index.css";
declare const _default: ({ children, onChapterLoad, currentIndex }: {
    currentIndex: number;
    onChapterLoad: (currentChapter: number) => Promise<void>;
    children?: (JSX.Element | null | undefined);
}) => JSX.Element | null;
export default _default;
