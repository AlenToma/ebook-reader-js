import React, { Children, useEffect, useRef } from "react";
import ReactDOM from "react-dom";


export default React.forwardRef(({ children }: { children: any }, ref: React.MutableRefObject<HTMLElement>) => {
    const el = useRef(document.createElement('div'));
    useEffect(() => {
        const portal = document.getElementById('Book-Reader-Portel') as HTMLDivElement;
        portal.appendChild(el.current);
        if (ref)
            ref.current = el.current;
        return () => {

            portal.removeChild(el.current);
        };

    }, [children]);

    return ReactDOM.createPortal(children, el.current);

})

export const Body = () => <div id="Book-Reader-Portel"></div>