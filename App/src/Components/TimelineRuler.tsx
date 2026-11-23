import React from "react";

interface TimelineRulerProps {
    timelineScale: number;
}

const DEFAULT_GAP = 20

const TimelineRuler = ({timelineScale}: TimelineRulerProps) => {
    return (
        <div className="min-w-full min-h-full flex flex-col-reverse">
            <div
                style={{
                    "--small-timeline-gap": `${DEFAULT_GAP * timelineScale}px`
                } as React.CSSProperties }
                className={`relative min-w-full min-h-[20%] bg-[repeating-linear-gradient(to_right,var(--color-timeline-ruler)_0px,var(--color-timeline-ruler)_1px,transparent_1px,transparent_var(--small-timeline-gap))]`}>
            
            </div>
            <div
                style={{
                    "--big-timeline-gap": `${DEFAULT_GAP * 4 * timelineScale}px`
                } as React.CSSProperties }
                className={`relative min-w-full min-h-[25%] bg-[repeating-linear-gradient(to_right,var(--color-timeline-ruler)_0px,var(--color-timeline-ruler)_1px,transparent_1px,transparent_var(--big-timeline-gap))]`}>
            
            </div>
        </div>
        
    );
}

export default TimelineRuler;