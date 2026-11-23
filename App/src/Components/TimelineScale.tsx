import { RulerDimensionLineIcon } from "lucide-react";

interface TimelineScaleProps {
    onHandleTimelineScaleChange: (value: number) => void;
}

const TimelineScale = ({onHandleTimelineScaleChange}: TimelineScaleProps) => {
    return (
        <div className="flex flex-col justify-center items-center gap-4 p-4">
            <RulerDimensionLineIcon color="white"/>
            <input
                type="range"
                id="timeline-range"
                className="h-[10px] w-[50%] cursor-pointer appearance-none rounded-[20px] bg-zinc-400 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:bg-[#1f1f1f] [&::-webkit-slider-thumb]:h-[20px] [&::-webkit-slider-thumb]:w-[20px] [&::-webkit-slider-thumb]:rounded-full [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:bg-[#1f1f1f] [&::-moz-range-thumb]:h-[30px] [&::-moz-range-thumb]:w-[30px] [&::-moz-range-thumb]:rounded-full"
                min="-2"
                max="2"
                step="0.01"
                defaultValue="1"
                onChange={(e) => onHandleTimelineScaleChange(Number(e.currentTarget.value))}
            />
        </div>
    )
}

export default TimelineScale;