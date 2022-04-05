import * as React from 'react'
import { BookOptions, IState } from './typings';

export declare type IContext = {
    props: BookOptions,
    state: IState,
    next: () => void,
    prev: () => void;
    goTo: (index: number, userAction?: boolean) => void;
    hasPrev: () => boolean;
    hasNext: () => boolean;

    play:(progress: number, doNotTriggerUpdate?: boolean)=> Promise<void>;
    pause:(doNotTriggerUpdate?: boolean)=> Promise<void>;
    playNext:(doNotTriggerUpdate?: boolean)=> Promise<void>;
    playPrev:(doNotTriggerUpdate?: boolean)=> Promise<void>;
}

export default React.createContext({} as IContext);