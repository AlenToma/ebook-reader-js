import { BookOptions, BookReader, Chapter, Player, EbookEvent, EventResult, Events, EventsKey } from "./typings";
import { IContext } from './Context'

export default abstract class BookReaderBase implements BookReader {
    /** @internal */
    protected abstract readonly ___element: JSX.Element;
    loadChapter: (index: number) => Promise<void>;
    currentIndex?: number;
    currentChapter?: Chapter;
    bookOptions: BookOptions;
    isLoading: boolean;
    player: Player;
    private readonly ___events: EbookEvent[];
    private readonly ___context: IContext;
    constructor(options: BookOptions) {
        this.bookOptions = options;
        this.loadChapter = async (index: number) => { };
        this.isLoading = true;
        this.___events = [];
        this.player = {} as Player;
        this.___context = {} as IContext;
    }

    async trigger(eventName: EventsKey | string, args: Events) {
        try {
            const defaultValue = {
                ScrollEvent: {},
                FontEvent:{},
                ChapterChangedEvent: {}
            }
            args = Object.assign(defaultValue, args);
            const e = this.___events.find(x => x.eventName.split(".")[0] === eventName);
            if (e)
                await e.event(e.eventName, args);
        } catch (e) {
            console.error(e);
        }
    }

    on(event: (eventName: EventsKey, args: Events) => void, ...eventNames: EventsKey[]) {
        eventNames.forEach((x: any) => {
            const e = this.___events.find(x => x.eventName == x.toString());
            if (!e)
                this.___events.push({ eventName: x, event: event });

        });

        return {
            on: this.on.bind(this), remove: () => {
                eventNames.forEach(x => {
                    const e = this.___events.findIndex(x => x.eventName == x.toString());
                    if (e)
                        this.___events.splice(e, 1);
                });
            }
        } as EventResult
    }

    getText() {
        return this.___context.state.playableText;
    }


    onStart(context: IContext) {
        console.log("Ebook Started")
        Object.assign(this.___context, context);
        this.player = {
            getCurrentText: () => {
                if (context.state.textToSpeechProgress < context.state.playableText.length)
                    return context.state.playableText[context.state.textToSpeechProgress]
                return undefined;
            },
            isplaying: () => context.state.playing,
            play: (progress) => context.play(progress),
            pause: () => context.pause(),
            next: () => context.playNext(),
            prev: () => context.playPrev()
        }

    }
}

