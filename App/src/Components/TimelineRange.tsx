'use strict'

import '../App.css';
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