import { BookOptions, BookReader, Chapter, Player, EventResult, Events, EventsKey } from "./typings";
import { IContext } from './Context';
export default abstract class BookReaderBase implements BookReader {
    loadChapter: (index: number) => Promise<void>;
    currentIndex?: number;
    currentChapter?: Chapter;
    bookOptions: BookOptions;
    isLoading: boolean;
    player: Player;
    private readonly ___events;
    private readonly ___context;
    constructor(options: BookOptions);
    trigger(eventName: EventsKey | string, args: Events): Promise<void>;
    on(event: (eventName: EventsKey, args: Events) => void, ...eventNames: EventsKey[]): EventResult;
    getText(): string[];
    onStart(context: IContext): void;
}
