import React, {forwardRef} from 'react';

interface VideoBlockProps {
    onHandleTimeUpdate: React.ReactEventHandler<HTMLVideoElement>;
    onLoadedMetadata: React.ReactEventHandler<HTMLVideoElement>;
    videoSource: string | null;
}

const VideoBlock = forwardRef<HTMLVideoElement, VideoBlockProps>(({ onHandleTimeUpdate, onLoadedMetadata, videoSource }, ref) => {

    return (
        <div>
            {videoSource ? (
                <video
                    ref={ref}
                    id="video"
                    className="my-[50px] h-auto max-w-[1000px]"
                    onTimeUpdate={onHandleTimeUpdate}
                    onLoadedMetadata={onLoadedMetadata}
                >
                    <source src={videoSource} type="video/mp4"/>
                    <source src={videoSource} type="video/mkv"/>
                    <source src={videoSource} type="video/mov"/>
                    <source src={videoSource} type="video/webp"/>
                    <source src={videoSource} type="video/avi"/>
                    Your browser does not support the video tag.
                </video>
            ) : (
                <div id="no-video" className="flex aspect-video w-[1000px] items-center justify-center bg-[#696969] text-[30px] font-bold text-[#2a2a2a]">
                    NO VIDEO
                </div>
            )}
        </div>
    );
});

export default VideoBlock;