import anime from "animejs";
import TextInspector from "./TextInspector";
import VideoBlock from "./VideoBlock";
import TimelineRange from "./TimelineRange";
import VideoControllers from "./VideoControllers";
import './App.css';
import React, {useEffect, useRef, useState} from "react";
import Draggable from "react-draggable";

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
            this.strokeThickness = 3;
            this.strokeColor = "#000000";
            setTextIdCounter(textIdCounter + 1);
        }
    }

    //initialise variables
    const MILLISECONDS_PER_SECOND = 1000;
    const video = useRef(null);
    const [videoCurrentTime, setVideoCurrentTime] = useState(0);
    const [videoDuration, setVideoDuration] = useState(0);
    const timelineRange = useRef(null);
    const [textElements, setTextElements] = useState([]);
    const [textIdCounter, setTextIdCounter] = useState(0);
    const [isHidden, setIsHidden] = useState(true);
    const [selectedTextObject, setSelectedTextObject] = useState({});
    const [animations, setAnimations] = useState([])
    const [animationTimeline, setAnimationTimeline] = useState([])
    const [isDraggable, setIsDraggable] = useState(false)

    //get video and timeline-range
    useEffect(() => {
        if (video.current) {
            setVideoDuration(video.current.duration);
        }
    }, [video.current?.duration]);

    useEffect(() => {
        const newTimeline = [...animationTimeline]

        console.log(animations)

        if (animations){
            animations.forEach((animeObj) => {
                const targetId = animeObj.target.match(/\d+/)[0]
                newTimeline.push(anime({
                    targets: animeObj.target,
                    keyframes: animeObj.keyframes,
                    change: function(anim) {
                        console.log(anim.animations)
                        changeTextObjectProperties(targetId, anim.animations)
                    }
                }));
            })

            setAnimationTimeline(newTimeline)
        }
        console.log("TEMP TIMELINE:")
        console.log(newTimeline)

        console.log("TIMELINE:")
        console.log(animationTimeline)
    }, [animations]);

    // Adding new text object
    const addText = (newTextElement) => {
        const newTextElements = [...textElements];
        newTextElements.push(newTextElement);
        setTextElements(newTextElements);
        console.log(animationTimeline)
    };

    // Hidden flag for TextInspector
    const onHandleIsHiddenChange = (newValue) => {
        setIsHidden(newValue)
    }

    const onHandleTextElementsChange = (newValue) => {
        setTextElements(newValue)
    }

    // Getting pointer to text object
    const getSelectedTextObject = (id) => {
        const foundObject = textElements.find(obj => obj.id === id);

        if (!foundObject) {
            alert(`Object not found with id: ${id}`);
        } else {
            setSelectedTextObject(foundObject)
        }
    }

    // Updates text object position
    const handleTextPosChange = (event, data, id) => {
        const index = textElements.findIndex((element) => element.id === id);
        const newTextElements = [...textElements];
        console.log(data)
        newTextElements[index].posX = data.x
        newTextElements[index].posY = data.y
        console.log(newTextElements[index].posX)
        console.log(data)

        setTextElements(newTextElements);
    }

    const onHandleTimeUpdate = () => {
        if (video.current) {
            const currentTime = video.current.currentTime;

            // animationTimeline.seek((currentTime / videoDuration) * animationTimeline.duration);
            animationTimeline.forEach(animation => {
                animation.seek(currentTime * MILLISECONDS_PER_SECOND); // Convert to milliseconds for Anime.js
            });
            setVideoCurrentTime(currentTime);
        }
    }

    const onHandleRangeUpdate = () => {
        if (timelineRange.current && video.current) {
            const newTime = (timelineRange.current.value / 100) * video.current.duration;
            setVideoCurrentTime(newTime);
            video.current.currentTime = newTime;
            animationTimeline.forEach(animation => {
                animation.seek(newTime * MILLISECONDS_PER_SECOND); // Convert to milliseconds for Anime.js
            });
            // animationTimeline.seek((newTime / videoDuration) * animationTimeline.duration);
        }
    };

    const onHandlePlay = () => {
        if (video.current){
            video.current.play()
            animationTimeline.forEach(animation => {
                animation.play();
            });
        }
    }

    const onHandlePause = () => {
        if (video.current){
            video.current.pause()
            animationTimeline.forEach(animation => {
                animation.pause();
            });
        }
    }

    const onHandleControllerInputUpdate = (newTime) => {
        if (video.current){
            setVideoCurrentTime(newTime);
            video.current.currentTime = newTime;
        }
    }

    const updateAnimationObjectKeyframes = (textElementIndex) => {
        const textElement = textElements[textElementIndex]
        const id = textElement.id
        const keyframes = textElement.keyframes
        const newAnimations = [...animations]
        let animationIndex = newAnimations.findIndex((animation) => animation.target === `#text-wrapper-${id}`);
        if (animationIndex !== -1){
            newAnimations[animationIndex].keyframes = keyframes
        } else {
            newAnimations.push({
                target: `#text-wrapper-${id}`,
                keyframes: keyframes,
                delay: 0,
                easing: "linear"
            })
        }

        animationIndex = newAnimations.findIndex((animation) => animation.target === `#text-wrapper-${id}`);

        console.log(animationIndex)
        console.log(newAnimations)

        newAnimations[animationIndex].keyframes.forEach((keyframe, index) => {
            if (index === 0){
                keyframe.duration = keyframe.timeKF * MILLISECONDS_PER_SECOND
            } else {
                keyframe.duration = (keyframe.timeKF - newAnimations[animationIndex].keyframes[index - 1].timeKF) * MILLISECONDS_PER_SECOND
            }
        });

        setAnimations(newAnimations);
    }

    const getPropertyByPropName = (properties, propName) => {
        const propIndex = properties.findIndex((property) => property.property === propName)
        return parseFloat(properties[propIndex].currentValue)
    }

    const changeTextObjectProperties = (textElementId, properties) => {
        const index = textElements.findIndex((element) => element.id === Number(textElementId));
        const newTextElements = [...textElements];

        const translateX = getPropertyByPropName(properties, "translateX")
        const translateY = getPropertyByPropName(properties, "translateY")
        const fontSize = getPropertyByPropName(properties, "fontSize")
        const scaleX = getPropertyByPropName(properties, "scaleX")
        const scaleY = getPropertyByPropName(properties, "scaleY")
        const rotateX = getPropertyByPropName(properties, "rotateX")
        const rotateY = getPropertyByPropName(properties, "rotateY")
        const rotateZ = getPropertyByPropName(properties, "rotateZ")

        newTextElements[index].posX = translateX
        newTextElements[index].posY = translateY
        newTextElements[index].fontSize = fontSize
        newTextElements[index].scaleX = scaleX
        newTextElements[index].scaleY = scaleY
        newTextElements[index].rotateX = rotateX
        newTextElements[index].rotateY = rotateY
        newTextElements[index].rotateZ = rotateZ

        setTextElements(newTextElements);
    }

    const addZalupa = () =>{
        const tempZalupa = [...animationTimeline]

        tempZalupa.push(anime({
            targets: '.centers',
            keyframes: [
                {
                    translateX: 0,
                    delay: 0,
                    duration: 3000
                },
                {
                    translateX: 300,
                    delay: 0,
                    duration: 4000
                },
                {
                    translateX: 100,
                    delay: 0,
                    duration: 2000
                },
                {
                    translateX: 200,
                    delay: 0,
                    duration: 2000
                }
            ],
            easing: "linear",
            delay: 0
        }))

        setAnimationTimeline(tempZalupa)
        console.log("ZALUPA:")
        console.log(tempZalupa)
    }

  return (
      <>
          <button id="add-zalupa" onClick={() => {addZalupa()}}>Add zalupa</button>
        <button id="add-text" onClick={() => {addText(new TextObject(video.current?.duration))}}>Add Text</button>
          <div id="viewport">
              <VideoBlock ref = {video}
                          onHandleTimeUpdate = {onHandleTimeUpdate}
                          onLoadedMetadata={() => setVideoDuration(video.current.duration)}
              />

              {/*Remove center point at the end of development*/}
              <div className="centers" style={{
                  transform: 'translateX(0px)'
              }}></div>

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
                              transform: `scaleX(${textElement.scaleX}) scaleY(${textElement.scaleY}) rotateX(${textElement.rotateX}deg) rotateY(${textElement.rotateY}deg) rotateZ(${textElement.rotateZ}deg)`
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
                              videoDuration={videoDuration}
                              videoCurrentTime={videoCurrentTime}
                              MILLISECONDS_PER_SECOND={MILLISECONDS_PER_SECOND}
                              onHandlePlay={onHandlePlay}
                              onHandlePause={onHandlePause}
                              onHandleControllerInputUpdate={onHandleControllerInputUpdate}
            />
        <div id="timeline">
            <TimelineRange ref={timelineRange}
                           onHandleRangeUpdate={onHandleRangeUpdate}
                           videoDuration={videoDuration}
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
                                width: `${(videoCurrentTime/videoDuration) * 100}%`,
                            }}
                        ></div>
                        {textElement.keyframes.map((keyframe) => (
                            <div
                                className="text-track-keyframe-area-point"
                                key={keyframe.timeKF}
                                hint={keyframe.timeKF}
                                style={{
                                    left: `${(keyframe.timeKF/videoDuration) * 100}%`,
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


//Add when can upload video
// {video ? (
//     <video id="video" onTimeUpdate={() => { currentTimeToTimeline() }}>
//         <source src={videoSrc} type="video/mp4" />
//         Your browser does not support the video tag.
//     </video>
// ) : (
//     <div id="viewport-empty-video">NO VIDEO</div>
// )}
