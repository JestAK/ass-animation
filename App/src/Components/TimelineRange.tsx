import React, {forwardRef, useEffect} from 'react';

interface TimelineRangeProps {
    onHandleRangeUpdate: React.FormEventHandler<HTMLInputElement>;
    videoDuration: number;
    videoCurrentTime: number;
    MILLISECONDS_PER_SECOND: number;
}

const TimelineRange = forwardRef<HTMLInputElement, TimelineRangeProps>(({onHandleRangeUpdate, videoDuration, videoCurrentTime, MILLISECONDS_PER_SECOND}, ref) => {
    useEffect(() => {
        if ((ref as React.RefObject<HTMLInputElement | null>)?.current && videoDuration > 0) {
            (ref as React.RefObject<HTMLInputElement>).current.value = ((videoCurrentTime / videoDuration) * 100) as unknown as string;
        }
    }, [videoCurrentTime, videoDuration, ref]);

    return (
        <input
            type="range"
            id="timeline-range"
            className="mb-[20px] h-[20px] w-[90%] cursor-pointer appearance-none rounded-[20px] bg-[#333333] [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:bg-[#1f1f1f] [&::-webkit-slider-thumb]:h-[30px] [&::-webkit-slider-thumb]:w-[30px] [&::-webkit-slider-thumb]:rounded-full [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:bg-[#1f1f1f] [&::-moz-range-thumb]:h-[30px] [&::-moz-range-thumb]:w-[30px] [&::-moz-range-thumb]:rounded-full"
            ref={ref}
            min="0"
            max="100"
            step="0.01"
            defaultValue="0"
            onInput={onHandleRangeUpdate}
        />
    );
});

export default TimelineRange;