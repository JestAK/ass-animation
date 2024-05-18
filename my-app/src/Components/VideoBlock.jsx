import '../App.css';
import React, {forwardRef} from 'react';

const VideoBlock = forwardRef(({ onHandleTimeUpdate, onLoadedMetadata, videoSource }, ref) => {

    return (
        <div>
            {videoSource ? (
                <video
                    ref={ref}
                    id="video"
                    onTimeUpdate={onHandleTimeUpdate}
                    onLoadedMetadata={onLoadedMetadata}
                    width="1300"
                >
                    <source src={videoSource} type="video/mp4"/>
                    <source src={videoSource} type="video/mkv"/>
                    <source src={videoSource} type="video/mov"/>
                    <source src={videoSource} type="video/webp"/>
                    <source src={videoSource} type="video/avi"/>
                    Your browser does not support the video tag.
                </video>
            ) : (
                <div id="no-video">
                    NO VIDEO? :(
                </div>
            )}
        </div>
    );
});

export default VideoBlock;