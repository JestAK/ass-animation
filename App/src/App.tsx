import type { AnimationObject, AnimatedProperties, Keyframe, NumericValue, RenderFrame, TextElement } from "./types";
import type { DraggableData, DraggableEvent } from "react-draggable";
import {animate, type JSAnimation} from "animejs";
import TextInspector from "./Components/TextInspector";
import VideoBlock from "./Components/VideoBlock";
import TimelineRange from "./Components/TimelineRange";
import VideoControllers from "./Components/VideoControllers";
import React, { useEffect, useRef, useState } from "react";
import DraggableText from "./Components/DraggableText";
import ASSGenerator from "./Modules/ASSGenerator";
import { Button } from "./Components/ui/button";
import TimelineScale from "./Components/TimelineScale";
import TimelineRuler from "./Components/TimelineRuler";

function App() {
    // All parameters of text object
    class TextObject {
        id: number;
        posX: number;
        posY: number;
        content: string;
        keyframes: Keyframe[];
        textColor: string;
        fontSize: NumericValue;
        scaleX: number;
        scaleY: number;
        rotateX: number;
        rotateY: number;
        rotateZ: number;
        strokeThickness: NumericValue;
        strokeColor: string;
        opacity: NumericValue;

        constructor() {
            this.id = textIdCounter;
            this.posX = 0;
            this.posY = 0;
            this.content = `Text ID - ${textIdCounter}`;
            this.keyframes = [];
            this.textColor = "#ffffff";
            this.fontSize = 20;
            this.scaleX = 1;
            this.scaleY = 1;
            this.rotateX = 0;
            this.rotateY = 0;
            this.rotateZ = 0;
            this.strokeThickness = 0;
            this.strokeColor = "#000000";
            this.opacity = 1;
            setTextIdCounter(textIdCounter + 1);
        }
    }

    //initialise variables
    const MILLISECONDS_PER_SECOND = 1000;
    const VIDEO_FPS = 10;
    const video = useRef<HTMLVideoElement>(null);
    const [videoSource, setVideoSource] = useState<string | null>(null);
    const [videoCurrentTime, setVideoCurrentTime] = useState(0);
    const videoDuration = useRef(0);
    const timelineRange = useRef<HTMLInputElement>(null);
    const [textElements, setTextElements] = useState<TextElement[]>([]);
    const textElementsRef = useRef(textElements);
    const [textIdCounter, setTextIdCounter] = useState(0);
    const [isHidden, setIsHidden] = useState(true);
    const [selectedTextObject, setSelectedTextObject] = useState<TextElement>({} as TextElement);
    const [animations, setAnimations] = useState<AnimationObject[]>([]);
    const [animationTimeline, setAnimationTimeline] = useState<JSAnimation[]>([]);
    const fileInput = useRef<HTMLInputElement>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isRendering, setIsRender] = useState(false);
    const tempDownloadLink = useRef<HTMLAnchorElement>(null);
    const framesData = useRef<RenderFrame[]>([]);
    const [videoIsLoading, setVideoIsLoading] = useState(false);
    const [timelineScale, setTimelineScale] = useState(1)

    useEffect(() => {
        textElementsRef.current = textElements;
    }, [textElements]);

    useEffect(() => {
        if (isRendering) {
            collectingRenderData();
        }
    }, [videoCurrentTime, isRendering]);

    useEffect(() => {
        const newTimeline: JSAnimation[] = [];

        if (animations) {
            animations.forEach((animateObj) => {
                // Wrapper to get React variables, which is out of Anime.js scope
                const wrapper = () => {
                    changeTextObjectProperties(
                        animateObj.animeElementId,
                        animateObj.target,
                        textElementsRef.current,
                    );
                };

                newTimeline.push(
                    animate(animateObj.target, {
                        // @ts-expect-error Existing undefined animeObj reference intentionally preserved.
                        keyframes: animeObj.keyframes,
                        ease: "linear",
                        autoplay: false,
                        onUpdate: wrapper,
                    }),
                );
            });

            setAnimationTimeline(newTimeline);
        }
    }, [animations]);

    // Adding new text object
    const addText = (newTextElement: TextElement) => {
        const newTextElements = [...textElements];
        newTextElements.push(newTextElement);
        setTextElements(newTextElements);
    };

    // Hidden flag for TextInspector
    const onHandleIsHiddenChange = (newValue: boolean) => {
        setIsHidden(newValue);
    };

    const onHandleTextElementsChange = (newValue: TextElement[]) => {
        setTextElements(newValue);
    };

    // Getting pointer to text object
    const getSelectedTextObject = (id: number) => {
        const foundObject = textElements.find((obj) => obj.id === id);

        if (!foundObject) {
            alert(`Object not found with id: ${id}`);
        } else {
            setSelectedTextObject(foundObject);
        }
    };

    // Updates text object position
    const handleTextPosChange = (event: DraggableEvent, data: DraggableData, id: number) => {
        const index = textElements.findIndex((element) => element.id === id);
        const newTextElements = [...textElements];
        newTextElements[index].posX = data.x;
        newTextElements[index].posY = data.y;

        setTextElements(newTextElements);
    };

    const onHandleTimeUpdate = () => {
        if (video.current) {
            const currentTime = video.current.currentTime;

            animationTimeline.forEach((animation) => {
                animation.seek(currentTime * MILLISECONDS_PER_SECOND);
            });
            setVideoCurrentTime(currentTime);
        }
    };

    const onHandleRangeUpdate = () => {
        if (timelineRange.current && video.current) {
            onHandlePause();
            const newTime =
                ((timelineRange.current.value as unknown as number) / 100) * videoDuration.current;
            setVideoCurrentTime(newTime);
            video.current.currentTime = newTime;
            animationTimeline.forEach((animation) => {
                animation.seek(newTime * MILLISECONDS_PER_SECOND);
            });
        }
    };

    const onHandlePlay = () => {
        if (video.current) {
            video.current.play();
            animationTimeline.forEach((animation) => {
                animation.play();
            });
        }
    };

    const onHandlePause = () => {
        if (video.current) {
            video.current.pause();
            animationTimeline.forEach((animation) => {
                animation.pause();
            });
        }
    };

    const onHandleControllerInputUpdate = (newTime: number) => {
        if (video.current) {
            setVideoCurrentTime(newTime);
            video.current.currentTime = newTime;
        }
    };

    const updateAnimationObjectKeyframes = (textElementIndex: number) => {
        const textElement = textElements[textElementIndex];
        const id = textElement.id;
        const keyframes = textElement.keyframes;
        const newAnimations = [...animations];
        let animationIndex = newAnimations.findIndex(
            (animation) => animation.animeElementId === id,
        );
        if (animationIndex !== -1) {
            newAnimations[animationIndex].keyframes = keyframes;
        } else {
            newAnimations.push({
                target: {
                    translateX: 0, //Some default value
                    translateY: 0, //Some default value
                    fontSize: 16, //Some default value
                    scaleX: 1, //Some default value
                    scaleY: 1, //Some default value
                    rotateX: 0, //Some default value
                    rotateY: 0, //Some default value
                    rotateZ: 0, //Some default value
                    opacity: 1, //Some default value
                    textColor: "#ffffff", //Some default value
                    strokeColor: "#000000", //Some default value
                    strokeThickness: 3, //Some default value
                },
                animeElementId: id,
                keyframes: keyframes,
                delay: 0,
                ease: "linear",
            });
        }

        animationIndex = newAnimations.findIndex(
            (animation) => animation.animeElementId === id,
        );

        // Re-calculate duration for each animation's keyframe
        newAnimations[animationIndex].keyframes.forEach((keyframe, index) => {
            if (index === 0) {
                keyframe.duration = (keyframe.timeKF as unknown as number) * MILLISECONDS_PER_SECOND;
            } else {
                keyframe.duration =
                    ((keyframe.timeKF as unknown as number) -
                        (newAnimations[animationIndex].keyframes[index - 1]
                            .timeKF as unknown as number)) *
                    MILLISECONDS_PER_SECOND;
            }
        });

        setAnimations(newAnimations);
    };

    const getPropertyByPropName = <K extends keyof AnimatedProperties>(properties: AnimatedProperties, propName: K): AnimatedProperties[K] => {
        return properties[propName];
    };

    const toHEX = (x: number) => {
        const hex = Math.round(x).toString(16);
        return hex.length === 1 ? "0" + hex : hex;
    };

    const rgbaToHEX = (color: string) => {
        const values = color.match(
            /rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)/,
        );

        const r = parseInt(values![1], 10);
        const g = parseInt(values![2], 10);
        const b = parseInt(values![3], 10);

        return `#${toHEX(r)}${toHEX(g)}${toHEX(b)}`;
    };

    const changeTextObjectProperties = (
        textElementId: number,
        properties: AnimatedProperties,
        latestTextElements: TextElement[],
    ) => {
        const index = textElements.findIndex(
            (element) => element.id === textElementId,
        );
        const newTextElements = [...latestTextElements];

        const translateX = getPropertyByPropName(properties, "translateX");
        const translateY = getPropertyByPropName(properties, "translateY");
        const fontSize = getPropertyByPropName(properties, "fontSize");
        const scaleX = getPropertyByPropName(properties, "scaleX");
        const scaleY = getPropertyByPropName(properties, "scaleY");
        const rotateX = getPropertyByPropName(properties, "rotateX");
        const rotateY = getPropertyByPropName(properties, "rotateY");
        const rotateZ = getPropertyByPropName(properties, "rotateZ");
        const opacity = getPropertyByPropName(properties, "opacity");
        const textColor = rgbaToHEX(
            getPropertyByPropName(properties, "textColor"),
        );
        const strokeColor = rgbaToHEX(
            getPropertyByPropName(properties, "strokeColor"),
        );
        const strokeThickness = getPropertyByPropName(
            properties,
            "strokeThickness",
        );

        newTextElements[index].posX = translateX;
        newTextElements[index].posY = translateY;
        newTextElements[index].fontSize = fontSize;
        newTextElements[index].scaleX = scaleX;
        newTextElements[index].scaleY = scaleY;
        newTextElements[index].rotateX = rotateX;
        newTextElements[index].rotateY = rotateY;
        newTextElements[index].rotateZ = rotateZ;
        newTextElements[index].opacity = opacity;
        newTextElements[index].textColor = textColor;
        newTextElements[index].strokeColor = strokeColor;
        newTextElements[index].strokeThickness = strokeThickness;

        setTextElements(newTextElements);
    };

    const onHandleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files![0];
        if (!file) return;

        setVideoIsLoading(true)
        if (file) {
            const fileURL = URL.createObjectURL(file);
            setVideoSource(fileURL);
            setVideoIsLoading(false)
        }
    };

    const convertTime = (timeInSeconds: number) => {
        const milliseconds = ((timeInSeconds % 1).toFixed(3) as unknown as number) * 1000;
        const seconds = Math.floor(timeInSeconds % 60);
        const minutes = Math.floor(timeInSeconds / 60);
        const hours = Math.floor(timeInSeconds / 3600);

        return `${hours}:${minutes}:${seconds}.${milliseconds}`;
    };

    const changeAnimationProgress = (newTime: number) => {
        animationTimeline.forEach((animation) => {
            animation.seek(newTime * MILLISECONDS_PER_SECOND);
        });
        setVideoCurrentTime(newTime);
    };

    const collectingRenderData = () => {
        setIsLoading(true);

        const timeStep = 1 / VIDEO_FPS;

        const nextRenderTime =
            Number((videoCurrentTime + timeStep).toFixed(3)) >=
            Number(videoDuration.current.toFixed(3))
                ? videoDuration.current
                : Number((videoCurrentTime + timeStep).toFixed(3)); //Operations for correct float calculation

        // Using for instead of forEach, because of eslint warning
        for (let i = 0; i < textElements.length; i++) {
            const textElement = textElements[i];

            framesData.current.push({
                id: textElement.id,
                startTime: convertTime(videoCurrentTime),
                endTime: convertTime(nextRenderTime),
                content: textElement.content,
                posX: textElement.posX,
                posY: textElement.posY,
                fontSize: textElement.fontSize,
                rotateX: 360 - textElement.rotateX,
                rotateY: 360 - textElement.rotateY,
                rotateZ: 360 - textElement.rotateZ,
                scaleX: textElement.scaleX,
                scaleY: textElement.scaleY,
                opacity: toHEX((1 - (textElement.opacity as number)) * 255).toUpperCase(),
                textColor: [
                    textElement.textColor.slice(-2).toUpperCase(),
                    textElement.textColor.slice(-4, -2).toUpperCase(),
                    textElement.textColor.slice(-6, -4).toUpperCase(),
                ].join(""), // Convert RGB to BGR
                strokeColor: [
                    textElement.strokeColor.slice(-2).toUpperCase(),
                    textElement.strokeColor.slice(-4, -2).toUpperCase(),
                    textElement.strokeColor.slice(-6, -4).toUpperCase(),
                ].join(""), // Convert RGB to BGR
                strokeThickness: textElement.strokeThickness,
            });
        }

        if (Number(videoCurrentTime) === Number(videoDuration.current)) {
            setIsRender(false);
            if (framesData.current) {
                const downloadBlob = ASSGenerator(
                    video.current!,
                    framesData.current,
                );
                tempDownloadLink.current!.href =
                    URL.createObjectURL(downloadBlob);
                tempDownloadLink.current!.download = "ass-animation.ass";
            } else {
                alert("There is no subtitles");
            }
        } else {
            changeAnimationProgress(nextRenderTime);
        }
    };

    const onHandleDownload = () => {
        tempDownloadLink.current!.click();
        setIsLoading(false);
    };

    const onHandleTimelineScaleChange = (newScale: number) => {
        const normalizedScale = 2 ** newScale;
        setTimelineScale(normalizedScale)
    }

    return (
        <>
            <div
                id="loading-downloading"
                className={`absolute z-[1000] flex h-full w-full flex-col items-center justify-center bg-[rgba(47,47,47,0.94)] font-normal text-white ${isRendering || isLoading ? "visible" : "invisible"}`}
            >
                <div
                    id="loading"
                    className={isRendering && isLoading ? "visible" : "invisible"}
                >
                    <p>Wait for render ends and get your .ass file</p>
                </div>
                <Button onClick={() => {onHandleDownload();}}>DOWNLOAD</Button>
                <a
                    id="temp-download-link"
                    className="hidden"
                    ref={tempDownloadLink}
                ></a>
            </div>

            <div className={`absolute z-[1000] flex h-full w-full flex-col items-center justify-center bg-[rgba(47,47,47,0.94)] font-normal text-white ${videoIsLoading ? "visible" : "invisible"}`}>Video is Loading...</div>


            <div className="flex flex-col gap-1 absolute max-w-xs p-4">
                <Button disabled={!videoSource} onClick={() => {addText(new TextObject())}}>Add Text</Button>
                <Button onClick={() => fileInput.current!.click()}>Choose Video</Button>
                <Button onClick={() => {
                    setIsRender(true);
                    changeAnimationProgress(0);
                }}>
                    Render subtitles
                </Button>
            </div>
            <input
                type="file"
                accept="video/*"
                onChange={onHandleFileChange}
                ref={fileInput}
                className="hidden"
            />
            <div id="viewport" className="flex min-h-[630px] grow-[10] items-center justify-center bg-[#333333]">
                <VideoBlock
                    ref={video}
                    onHandleTimeUpdate={onHandleTimeUpdate}
                    onLoadedMetadata={() => {
                        videoDuration.current = video.current!.duration;
                    }}
                    videoSource={videoSource}
                />

                {/*Drawing all text objects*/}
                {textElements.map((textElement) => (
                    <DraggableText
                        key={textElement.id}
                        textElement={textElement}
                        onDrag={(event, data) => {
                            handleTextPosChange(event, data, textElement.id);
                            getSelectedTextObject(textElement.id);
                        }}
                        onInspect={() => {
                            getSelectedTextObject(textElement.id);
                            setIsHidden(false);
                        }}
                    />
                ))}

                <TextInspector
                    TextObject={selectedTextObject}
                    isHidden={isHidden}
                    onHandleIsHiddenChange={onHandleIsHiddenChange}
                    textElements={textElements}
                    onHandleTextElementsChange={onHandleTextElementsChange}
                    videoCurrentTime={videoCurrentTime}
                    updateAnimationObjectKeyframes={
                        updateAnimationObjectKeyframes
                    }
                />
            </div>
            <VideoControllers
                video={video}
                videoDuration={videoDuration.current}
                videoCurrentTime={videoCurrentTime}
                MILLISECONDS_PER_SECOND={MILLISECONDS_PER_SECOND}
                onHandlePlay={onHandlePlay}
                onHandlePause={onHandlePause}
                onHandleControllerInputUpdate={onHandleControllerInputUpdate}
            />
            <div className="grid grid-cols-[1fr_9fr] grid-rows-[1fr_9fr] divide-x-2 divide-y-2 divide-zinc-700 min-h-[300px]">
                <div className="justify-center items-center">
                    <TimelineScale 
                        onHandleTimelineScaleChange={onHandleTimelineScaleChange}
                    />
                </div>
                <div className="flex min-h-full">
                    <TimelineRuler 
                        timelineScale={timelineScale}
                    />
                </div>
                <div className="bg-green-500">3</div>
                <div className="bg-white">4</div>
            </div>
            {/* <div id="timeline" className="flex min-h-[160px] grow-[3] flex-col items-center bg-[#262626] pt-[5px]">
                <TimelineRange
                    ref={timelineRange}
                    onHandleRangeUpdate={onHandleRangeUpdate}
                    videoDuration={videoDuration.current}
                    videoCurrentTime={videoCurrentTime}
                    MILLISECONDS_PER_SECOND={MILLISECONDS_PER_SECOND}
                />
                {textElements.map((textElement) => (
                    <div className="my-[2px] flex min-h-[30px] w-full flex-row content-center bg-[#3f3f3f]" key={textElement.id}>
                        <div
                            className="flex min-h-full w-[5%] cursor-pointer items-center justify-center border-r-2 border-r-solid border-r-[#505050] bg-[#3f3f3f] font-medium text-[#bbbbbb]"
                            onClick={() => {
                                getSelectedTextObject(textElement.id);
                                setIsHidden(false);
                            }}
                        >
                            ID: {textElement.id}
                        </div>
                        <div className="relative my-[2px] flex min-h-full w-[90%] items-center justify-center rounded-[3px] bg-[#2f2f2f]">
                            <div
                                className="absolute left-0 z-[9] h-full w-0 max-w-full rounded-[3px] bg-[#c9d4e1]"
                                style={{
                                    width: `${(videoCurrentTime / videoDuration.current) * 100}%`,
                                }}
                            ></div>
                            {textElement.keyframes.map((keyframe) => (
                                <div
                                    className="absolute z-10 flex aspect-square h-[70%] max-w-full -translate-x-1/2 cursor-pointer items-center justify-center rounded-full bg-[#3498db] text-[10px] font-semibold text-white hover:after:absolute hover:after:-top-[30px] hover:after:left-1/2 hover:after:z-[1] hover:after:block hover:after:-translate-x-1/2 hover:after:border hover:after:border-solid hover:after:border-black hover:after:bg-[#181818] hover:after:p-[5px] hover:after:content-[attr(hint)]"
                                    key={keyframe.timeKF}
                                    {...{ hint: keyframe.timeKF }}
                                    style={{
                                        left: `${((keyframe.timeKF as unknown as number) / videoDuration.current) * 100}%`,
                                    }}
                                >
                                    KF
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div> */}
        </>
    );
}

export default App;
