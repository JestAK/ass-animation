'use strict'

import { Button } from "../Components/ui/button";
import { Input } from "../Components/ui/input";
import React from "react";
import { FooBar } from "./foo-bar";

interface VideoControllersProps {
    video: React.RefObject<HTMLVideoElement | null>;
    videoDuration: number;
    videoCurrentTime: number;
    MILLISECONDS_PER_SECOND: number;
    onHandlePlay: () => void;
    onHandlePause: () => void;
    onHandleControllerInputUpdate: (time: number) => void;
}

const VideoControllers = ({video, videoDuration, videoCurrentTime, MILLISECONDS_PER_SECOND, onHandlePlay, onHandlePause, onHandleControllerInputUpdate}: VideoControllersProps) => {

    return(
        <div id="controllers" className="flex min-h-[75px] grow items-center justify-center bg-[#1c1c1c]">
            <div className="max-w-[30%] flex gap-4 *:bg-zinc-600">
                <Button><FooBar/></Button>
                <Button onClick={() => {video.current!.currentTime = video.current!.currentTime + 5}}>+5 s</Button>
                <Button onClick={() => {video.current!.currentTime = video.current!.currentTime - 5}}>-5 s</Button>
                <Input
                    className="max-w-xs text-white"
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
        </div>
    );
};

export default VideoControllers;
