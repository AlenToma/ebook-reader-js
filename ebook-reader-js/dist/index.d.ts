/// <reference types="react" />
import { BookOptions } from './typings';
import './index.css';
import './fonts.css';
import './select.css';
import BookReaderBase from './abstract';
declare class ReactBookReader extends BookReaderBase {
    protected readonly ___element: JSX.Element;
    static DefaultSettings: BookOptions;
    constructor(options: BookOptions);
    render(): JSX.Element;
}
export default ReactBookReader;
