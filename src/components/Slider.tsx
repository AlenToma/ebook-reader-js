import React, { useEffect, useRef, useState } from "react"
import { useKeenSlider } from "keen-slider/react"
import TextEmulator from "./TextEmulator"
import "keen-slider/keen-slider.min.css"
import "../index.css"
import { getSelectionText } from '../Methods'

const SliderX = ({ children, changed, index }: { changed: (sl: number) => void, index: number, children: any[], disabled?: boolean }) => {
    const [currentSlide, setCurrentSlide] = React.useState(index)
    const [disabled, setDisabled] = useState(getSelectionText().length > 0)
    const timer = useRef<any>();

    const [sliderRef, slider] = useKeenSlider({
        animationEnded(s: any) {
            setCurrentSlide(s.track.details.rel);
        },
        initial: index,
        mode: "snap",
        disabled: disabled,
        loop: false
    });
    useEffect(() => {
        changed(currentSlide);
    }, [currentSlide])

    useEffect(() => {
        return () => slider.current?.destroy()
    }, [])



    return (
        <div ref={sliderRef} className="keen-slider">
            {children.map((x, idx) => {
                return (
                    <div key={idx} className="keen-slider__slide" onClick={() => {
                        clearTimeout(timer.current)
                        timer.current = setTimeout(() => {
                            setDisabled(getSelectionText().length > 0)
                        }, 100);
                    }}>
                        <div>
                            {x}
                        </div>
                    </div>
                )
            })}
        </div>
    )
}



export default ({ children, onChapterLoad, currentIndex }: { currentIndex: number, onChapterLoad: (currentChapter: number) => Promise<void>, children?: (JSX.Element | null | undefined) }) => {
    const [currentSlide, setCurrentSlide] = React.useState(currentIndex > 0 ? 1 : 0)
    const prevSlider = useRef(currentIndex > 0 ? 1 : 0)
    const prevIndex = useRef(0)
    const [loading, setLoading] = useState(true);

    const loadData = () => {
        var index = currentIndex;
        if (prevSlider.current != currentSlide) {
            if (prevSlider.current > currentSlide)
                index = index - 1;
            else index = index + 1;
        }
        prevSlider.current = index > 0 ? 1 : 0;
        prevIndex.current = index;
        onChapterLoad(index).then(data => {
            setLoading(true)
        });

    }

    React.useEffect(() => {
        loadData();
    }, [currentSlide])


    useEffect(() => {
        setLoading(false);
        // slider.current?.update({ ...dValue }, currentIndex > 0 ? 1 : 0); // this dose not seems to work
    }, [children])

    useEffect(() => {
        if (prevIndex.current != currentIndex) {
            prevSlider.current = currentSlide;
            loadData();
        }

        // slider.current?.update({ ...dValue }, currentIndex > 0 ? 1 : 0); // this dose not seems to work
    }, [currentIndex])


    if (loading)
        return null


    return (
        <SliderX index={currentIndex > 0 ? 1 : 0} changed={(sl) => setCurrentSlide(sl)}>
            {[...Array(currentIndex > 0 ? 3 : 2)].map((x, idx) =>
            (
                (currentIndex > 0 && idx == 1) || (currentIndex == 0 && idx == 0) ? <div key={idx}>{children}</div> : <TextEmulator key={idx} />
            )
            )}
        </SliderX>
    )

}