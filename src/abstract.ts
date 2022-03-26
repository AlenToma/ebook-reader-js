import { BookOptions, BookReader, Chapter, IState } from "./typings";

export default abstract class BookReaderBase implements BookReader {
    protected abstract readonly ___element: JSX.Element;
    loadChapter: (index: number) => Promise<void>;
    currentIndex?: number;
    currentChapter?: Chapter;
    bookOptions: BookOptions;
    isLoading: boolean;
    constructor(options: BookOptions) {
        this.bookOptions = options;
        this.loadChapter = async (index: number) => { };
        this.isLoading = true;
    }

    update(state: IState, loadChapter: (index: number) => Promise<void>) {
        this.isLoading = state.isLoading;
        this.currentIndex = state.currentindex;
        this.currentChapter = state.currentChapter;
        this.loadChapter = loadChapter;
    }
}

