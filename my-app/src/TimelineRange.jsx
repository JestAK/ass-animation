import './App.css';
import React, {forwardRef, useEffect} from 'react';

const TimelineRange = forwardRef(({onHandleRangeUpdate, videoDuration, videoCurrentTime, MILLISECONDS_PER_SECOND}, ref) => {
    useEffect(() => {
        if (ref?.current && videoDuration > 0) {
            ref.current.value = (videoCurrentTime / videoDuration) * 100;
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