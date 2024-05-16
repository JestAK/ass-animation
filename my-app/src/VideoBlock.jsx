import './App.css';
import React, {forwardRef} from 'react';

const VideoBlock = forwardRef(({ onHandleTimeUpdate, onLoadedMetadata }, ref) => {

    return (
        <video
            ref={ref}
            id="video"
            onTimeUpdate={onHandleTimeUpdate}
            onLoadedMetadata={onLoadedMetadata}
            width="600"
        >
            <source src={require('./prikolyas.mp4')} type="video/mp4"/>
            Your browser does not support the video tag.
        </video>
    );
});

export default VideoBlock;