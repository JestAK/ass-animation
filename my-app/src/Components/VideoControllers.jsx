import '../App.css';
import React from "react";

const VideoControllers = ({video, videoDuration, videoCurrentTime, MILLISECONDS_PER_SECOND, onHandlePlay, onHandlePause, onHandleControllerInputUpdate}) => {

    return(
        <div id="controllers">
            <button id="stop-button" onClick={() => {onHandlePause()}}>STOP
            </button>
            <button id="play-button" onClick={() => {onHandlePlay()}}>PLAY
            </button>
            <button id="plus-5sec-button" onClick={() => {
                video.current.currentTime = video.current.currentTime + 5
            }}>+ 5 SEC
            </button>
            <button id="minus-5sec-button" onClick={() => {
                video.current.currentTime = video.current.currentTime - 5}}>- 5 SEC</button>
            <input
                type="number"
                min="0"
                max={videoDuration || 0}
                step={1/MILLISECONDS_PER_SECOND}
                value={videoCurrentTime.toFixed(3)}
                onChange={(e) => {
                    onHandleControllerInputUpdate(Number(e.target.value))
                }}
            />
        </div>
    )
}

export default VideoControllers;
