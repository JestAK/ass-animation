'use strict'

import anime from "animejs";
import TextInspector from "./Components/TextInspector";
import VideoBlock from "./Components/VideoBlock";
import TimelineRange from "./Components/TimelineRange";
import VideoControllers from "./Components/VideoControllers";
import './App.css';
import React, {useEffect, useRef, useState} from "react";
import Draggable from "react-draggable";
import svg from "./Assets/loading.svg";
import ASSGenerator from "./Modules/ASSGenerator";

function App() {

    // All parameters of text object
    class TextObject {
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
    const video = useRef(null);
    const [videoSource, setVideoSource] = useState(null);
    const [videoCurrentTime, setVideoCurrentTime] = useState(0);
    const videoDuration = useRef(0);
    const timelineRange = useRef(null);
    const [textElements, setTextElements] = useState([]);
    const textElementsRef = useRef(textElements);
    const [textIdCounter, setTextIdCounter] = useState(0);
    const [isHidden, setIsHidden] = useState(true);
    const [selectedTextObject, setSelectedTextObject] = useState({});
    const [animations, setAnimations] = useState([]);
    const [animationTimeline, setAnimationTimeline] = useState([]);
    const [isDraggable, setIsDraggable] = useState(false);
    const fileInput = useRef(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isRendering, setIsRender] = useState(false);
    const tempDownloadLink = useRef(null);
    const framesData = useRef([]);

    useEffect(() => {
        textElementsRef.current = textElements;
    }, [textElements]);

    useEffect(() => {
        if (isRendering){
            collectingRenderData();
        }
    }, [videoCurrentTime, isRendering]);

    useEffect(() => {
        const newTimeline = [];

        if (animations){
            animations.forEach((animeObj) => {

                // Wrapper to get React variables, which is out of Anime.js scope
                const wrapper = (anim) => {
                    changeTextObjectProperties(animeObj.animeElementId, anim.animations, textElementsRef.current);
                };

                newTimeline.push(anime({
                    targets: animeObj.target,
                    keyframes: animeObj.keyframes,
                    easing: "linear",
                    autoplay: false,
                    update: wrapper
                }));
            })

            setAnimationTimeline(newTimeline);
        }
    }, [animations]);

    // Adding new text object
    const addText = (newTextElement) => {
        const newTextElements = [...textElements];
        newTextElements.push(newTextElement);
        setTextElements(newTextElements);
    };

    // Hidden flag for TextInspector
    const onHandleIsHiddenChange = (newValue) => {
        setIsHidden(newValue);
    };

    const onHandleTextElementsChange = (newValue) => {
        setTextElements(newValue);
    };

    // Getting pointer to text object
    const getSelectedTextObject = (id) => {
        const foundObject = textElements.find(obj => obj.id === id);

        if (!foundObject) {
            alert(`Object not found with id: ${id}`);
        } else {
            setSelectedTextObject(foundObject);
        }
    };

    // Updates text object position
    const handleTextPosChange = (event, data, id) => {
        const index = textElements.findIndex((element) => element.id === id);
        const newTextElements = [...textElements];
        newTextElements[index].posX = data.x;
        newTextElements[index].posY = data.y;

        setTextElements(newTextElements);
    };

    const onHandleTimeUpdate = () => {
        if (video.current) {
            const currentTime = video.current.currentTime;

            animationTimeline.forEach(animation => {
                animation.seek(currentTime * MILLISECONDS_PER_SECOND);
            });
            setVideoCurrentTime(currentTime);
        }
    };

    const onHandleRangeUpdate = () => {
        if (timelineRange.current && video.current) {
            onHandlePause();
            const newTime = (timelineRange.current.value / 100) * videoDuration.current;
            setVideoCurrentTime(newTime);
            video.current.currentTime = newTime;
            animationTimeline.forEach(animation => {
                animation.seek(newTime * MILLISECONDS_PER_SECOND);
            });
        }
    };

    const onHandlePlay = () => {
        if (video.current){
            video.current.play();
            animationTimeline.forEach(animation => {
                animation.play();
            });
        }
    };

    const onHandlePause = () => {
        if (video.current){
            video.current.pause();
            animationTimeline.forEach(animation => {
                animation.pause();
            });
        }
    };

    const onHandleControllerInputUpdate = (newTime) => {
        if (video.current){
            setVideoCurrentTime(newTime);
            video.current.currentTime = newTime;
        }
    };

    const updateAnimationObjectKeyframes = (textElementIndex) => {
        const textElement = textElements[textElementIndex];
        const id = textElement.id;
        const keyframes = textElement.keyframes;
        const newAnimations = [...animations];
        let animationIndex = newAnimations.findIndex((animation) => animation.animeElementId === id);
        if (animationIndex !== -1){
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
                    strokeThickness: 3 //Some default value
                },
                animeElementId: id,
                keyframes: keyframes,
                delay: 0,
                easing: "linear"
            });
        }

        animationIndex = newAnimations.findIndex((animation) => animation.animeElementId === id);


        // Re-calculate duration for each animation's keyframe
        newAnimations[animationIndex].keyframes.forEach((keyframe, index) => {
            if (index === 0){
                keyframe.duration = keyframe.timeKF * MILLISECONDS_PER_SECOND;
            } else {
                keyframe.duration = (keyframe.timeKF - newAnimations[animationIndex].keyframes[index - 1].timeKF) * MILLISECONDS_PER_SECOND;
            }
        });

        setAnimations(newAnimations);
    };

    const getPropertyByPropName = (properties, propName) => {
        const propIndex = properties.findIndex((property) => property.property === propName);
        return properties[propIndex]?.currentValue;
    };

    const toHEX = (x) => {
        const hex = Math.round(x).toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    };

    const rgbaToHEX = (color) => {
        const values = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)/);

        const r = parseInt(values[1], 10);
        const g = parseInt(values[2], 10);
        const b = parseInt(values[3], 10);

        return `#${toHEX(r)}${toHEX(g)}${toHEX(b)}`;
    };

    const changeTextObjectProperties = (textElementId, properties, latestTextElements) => {

        const index = textElements.findIndex((element) => element.id === textElementId);
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
        const textColor = rgbaToHEX(getPropertyByPropName(properties, "textColor"));
        const strokeColor = rgbaToHEX(getPropertyByPropName(properties, "strokeColor"));
        const strokeThickness = getPropertyByPropName(properties, "strokeThickness");

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

    const onHandleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const fileURL = URL.createObjectURL(file);
            setVideoSource(fileURL);
        }
    };

    const convertTime = (timeInSeconds) => {

        const milliseconds = (timeInSeconds % 1).toFixed(3) * 1000;
        const seconds = Math.floor(timeInSeconds % 60);
        const minutes = Math.floor(timeInSeconds / 60);
        const hours = Math.floor(timeInSeconds / 3600);

        return `${hours}:${minutes}:${seconds}.${milliseconds}`;
    };

    const changeAnimationProgress = (newTime) => {
        animationTimeline.forEach(animation => {
            animation.seek(newTime * MILLISECONDS_PER_SECOND);
        });
        setVideoCurrentTime(newTime);
    };

    const collectingRenderData = () => {
        setIsLoading(true);

        const timeStep = 1 / VIDEO_FPS;

        const nextRenderTime = Number((videoCurrentTime + timeStep).toFixed(3)) >= Number(videoDuration.current.toFixed(3)) ? videoDuration.current : Number((videoCurrentTime + timeStep).toFixed(3)); //Operations for correct float calculation

        // Using for instead of forEach, because of eslint warning
        for (let i = 0; i < textElements.length; i++){
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
                opacity: toHEX((1 - textElement.opacity) * 255).toUpperCase(),
                textColor: [textElement.textColor.slice(-2).toUpperCase(), textElement.textColor.slice(-4, -2).toUpperCase(), textElement.textColor.slice(-6, -4).toUpperCase()].join(""), // Convert RGB to BGR
                strokeColor: [textElement.strokeColor.slice(-2).toUpperCase(), textElement.strokeColor.slice(-4, -2).toUpperCase(), textElement.strokeColor.slice(-6, -4).toUpperCase()].join(""), // Convert RGB to BGR
                strokeThickness: textElement.strokeThickness,
            });
        }

        if (Number(videoCurrentTime) === Number(videoDuration.current)){
            setIsRender(false);
            if (framesData.current){
                const downloadBlob = ASSGenerator(video.current, framesData.current);
                tempDownloadLink.current.href = URL.createObjectURL(downloadBlob);
                tempDownloadLink.current.download = "ass-animation.ass";
            } else {
                alert("There is no subtitles");
            }
        } else {
            changeAnimationProgress(nextRenderTime);
        }
    };

    const onHandleDownload = () => {
        tempDownloadLink.current.click();
        setIsLoading(false);
    };


  return (
      <>
          <div
              id="loading-downloading"
              style={{
                  visibility: isRendering || isLoading ? 'visible' : 'hidden'
              }}
          >
              <div
                  id="loading"
                  style={{
                      visibility: isRendering && isLoading ? 'visible' : 'hidden'
                  }}>
                  <img src={svg} alt="loading circle"/>
                  <p>Wait for render ends and get your .ass file</p>
              </div>
              <button
                  id="download-button"
                  style={{visibility: !isRendering && isLoading ? 'visible' : 'hidden'}}
                  onClick={() => {onHandleDownload()}}
              >DOWNLOAD</button>
              <a
                  id="temp-download-link"
                  style={{display: "none"}}
                  ref={tempDownloadLink}
              ></a>
          </div>

        <button
            id="add-text"
            className="main-button"
            disabled={!videoSource}
            onClick={() => {addText(new TextObject())}}>Add Text</button>
          <input
              type="file"
              accept="video/*"
              onChange={onHandleFileChange}
              ref={fileInput}
              style={{display: "none"}}
          />
          <button id="choose-video" className="main-button" onClick={() => fileInput.current.click()}>Choose Video</button>
          <button id="render-ass" className="main-button" onClick={() => {
              setIsRender(true)
              changeAnimationProgress(0)
          }}>Render subtitles</button>
          <div id="viewport">
              <div className="centers"></div>
              <VideoBlock ref = {video}
                          onHandleTimeUpdate = {onHandleTimeUpdate}
                          onLoadedMetadata={() => {
                              videoDuration.current = video.current.duration
                          }}
                          videoSource={videoSource}
              />

              {/*Drawing all text objects*/}
              {textElements.map((textElement) => (
                  <Draggable
                      bounds="#viewport"
                      key={textElement.id}
                      defaultPosition={{x: 500, y: 500}}
                      position={{ x: textElement.posX, y: textElement.posY }}
                      disabled={!isDraggable}
                      onDrag={(event, data) => {
                          handleTextPosChange(event, data, textElement.id)
                          getSelectedTextObject(textElement.id)
                      }}
                  >
                      <div className="draggable-wrapper"
                           id={`text-wrapper-${textElement.id}`}
                           style={{
                               position: "absolute",
                           }}
                      >
                          <pre style={{
                              color: textElement.textColor,
                              fontSize: `${textElement.fontSize}px`,
                              WebkitTextStrokeWidth: `${textElement.strokeThickness}px`,
                              WebkitTextStrokeColor: textElement.strokeColor,
                              transform: `scaleX(${textElement.scaleX}) scaleY(${textElement.scaleY}) rotateX(${textElement.rotateX}deg) rotateY(${textElement.rotateY}deg) rotateZ(${textElement.rotateZ}deg)`,
                              opacity: textElement.opacity,
                          }}
                               onMouseEnter={() => {setIsDraggable(true)}}
                               onMouseLeave={() => {setIsDraggable(false)}}
                               className="subtitle-text"
                               onDoubleClick={() => {
                                   getSelectedTextObject(textElement.id)
                                   setIsHidden(false)
                               }}>
                                    {textElement.content}
                          </pre>
                      </div>
                  </Draggable>
              ))}

              <TextInspector TextObject={selectedTextObject}
                             isHidden={isHidden}
                             onHandleIsHiddenChange={onHandleIsHiddenChange}
                             textElements={textElements}
                             onHandleTextElementsChange={onHandleTextElementsChange}
                             videoCurrentTime={videoCurrentTime}
                             updateAnimationObjectKeyframes={updateAnimationObjectKeyframes}
              />
          </div>
            <VideoControllers video={video}
                              videoDuration={videoDuration.current}
                              videoCurrentTime={videoCurrentTime}
                              MILLISECONDS_PER_SECOND={MILLISECONDS_PER_SECOND}
                              onHandlePlay={onHandlePlay}
                              onHandlePause={onHandlePause}
                              onHandleControllerInputUpdate={onHandleControllerInputUpdate}
            />
        <div id="timeline">
            <TimelineRange ref={timelineRange}
                           onHandleRangeUpdate={onHandleRangeUpdate}
                           videoDuration={videoDuration.current}
                           videoCurrentTime={videoCurrentTime}
                           MILLISECONDS_PER_SECOND={MILLISECONDS_PER_SECOND}
            />
            {textElements.map((textElement) => (
                <div className="text-track" key={textElement.id}>
                    <div className="text-track-id" onClick={() => {
                        getSelectedTextObject(textElement.id)
                        setIsHidden(false)
                    }}>ID: {textElement.id}</div>
                    <div className="text-track-keyframe-area">
                        <div
                            className="text-track-keyframe-area-progress"
                            style={{
                                width: `${(videoCurrentTime/videoDuration.current) * 100}%`,
                            }}
                        ></div>
                        {textElement.keyframes.map((keyframe) => (
                            <div
                                className="text-track-keyframe-area-point"
                                key={keyframe.timeKF}
                                hint={keyframe.timeKF}
                                style={{
                                    left: `${(keyframe.timeKF/videoDuration.current) * 100}%`,
                                }}
                            >
                                KF
                            </div>
                        ))}
                    </div>
                </div>
            ))}

        </div>
      </>
  );
}

export default App;
