import anime from "animejs";

import TextInspector from "./TextInspector";
import './App.css';
import React, {useEffect, useRef, useState} from "react";
import Draggable from "react-draggable";

function App() {

    class TextObject {
        constructor(endTime) {
            this.id = textIdCounter;
            this.posX = 0;
            this.posY = 0;
            this.content = `Text ID - ${textIdCounter}`;
            this.startTime = 0;
            this.endTime = endTime;
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
    const MILISECONDS_PER_SECOND = 1000;
    const [video, setVideo] = useState({});
    const [videoCurrentTime, setVideoCurrentTime] = useState(0);
    const [videoDuration, setVideoDuration] = useState(0);
    const [timelineRange, setTimelineRange] = useState({});
    const [textElements, setTextElements] = useState([]);
    const [textIdCounter, setTextIdCounter] = useState(0);
    const [isHidden, setIsHidden] = useState(true);
    const [selectedTextObject, setSelectedTextObject] = useState({});
    const isAllowChangeTimeline = useRef(true);
    const animationTimeline = anime.timeline({
        easing: "linear",
        direction: "normal",
        autoplay: false,
    });

    //get video and timeline-range
    useEffect(() => {
        const videoElement = document.getElementById('video');
        setVideo(videoElement);

        const tlRange = document.getElementById('timeline-range');
        setTimelineRange(tlRange);
    }, []);

    animationTimeline.add({
        targets: ".centers",
        translateX: 300,
        scale: 3,
        duration: 1000,
        loop: false,
    });

    if(video){
        video.currentTime = videoCurrentTime;
    }

    if(timelineRange){
        timelineRange.value = (videoCurrentTime / videoDuration) * 100;
    }


    const addText = (newTextElement) => {
        const newTextElements = [...textElements];
        newTextElements.push(newTextElement);
        setTextElements(newTextElements);
    };

    const timelineToCurrentTime = () => {
        video.currentTime = video.duration * (timelineRange.value / 100);
        console.log(video.currentTime)
    }

    const currentTimeToTimeline = () => {
        animationTimeline.seek((timelineRange.value / 100) * animationTimeline.duration);
        timelineRange.value = (video.currentTime / video.duration) * 100;
        isAllowChangeTimeline.current = false;
    }

    const onHandleIsHiddenChange = (newValue) => {
        setIsHidden(newValue)
    }

    const onHandleTextElementsChange = (newValue) => {
        setTextElements(newValue)
        console.log(textElements)
    }

    const getSelectedTextObject = (id) => {
        const foundObject = textElements.find(obj => obj.id === id);

        if (!foundObject) {
            alert(`Object not found with id: ${id}`);
        } else {
            setSelectedTextObject(foundObject)
        }
    }

    const handleTextPosChange = (event, data, id) => {
        const index = textElements.findIndex((element) => element.id === id);
        const newTextElements = [...textElements];
        console.log(data)
        newTextElements[index].posX = data.x
        newTextElements[index].posY = data.y
        console.log(newTextElements[index].posX)
        console.log(data.x)

        setTextElements(newTextElements);
    }

  return (
      <>
        <button id="add-text" onClick={() => {addText(new TextObject(video?.duration))}}>Add Text</button>
          <div id="viewport">
              <video id="video"
                     onTimeUpdate={() => {
                        // currentTimeToTimeline()
                        setVideoCurrentTime(video.currentTime)
                     }}
                     onLoadedData={() => {
                         setVideoDuration(video.duration);
                     }}
              >
                  <source src={require('./prikolyas.mp4')} type="video/mp4"/>
                  Your browser does not support the video tag.
              </video>

              {/*Remove center point at the end of development*/}
              <div className="centers"></div>

              {textElements.map((textElement) => (
                  <Draggable
                      bounds="#viewport"
                      key={textElement.id}
                      defaultPosition={{x: 500, y: 500}}
                      position={{ x: textElement.posX, y: textElement.posY }}
                      onDrag={(event, data) => {
                          handleTextPosChange(event, data, textElement.id)
                          getSelectedTextObject(textElement.id)
                      }}
                  >
                      <div className="draggable-wrapper"
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
              />
          </div>
          <div id="controllers">
              <button id="stop-button" onClick={() => {
                  video.pause()
                  playPause.pause()
              }}>STOP
              </button>
              <button id="play-button" onClick={() => {
                  video.play()
                  playPause.play()
              }}>PLAY
              </button>
              <button id="plus-5sec-button" onClick={() => {
                  video.currentTime = video.currentTime + 5
              }}>+ 5 SEC
              </button>
              <button id="minus-5sec-button" onClick={() => {
                  video.currentTime = video.currentTime - 5}}>- 5 SEC</button>
              <input
                  type="number"
                  min="0"
                  max={videoDuration || 0}
                  step={1/MILISECONDS_PER_SECOND}
                  value={videoCurrentTime.toFixed(3)}
                  onChange={(e) => {
                      // video.currentTime = Number(e.target.value);
                      setVideoCurrentTime(Number(e.target.value))
                  }}
              />
        </div>
        <div id="timeline">
          <input
              type="range"
              id="timeline-range"
              min="0"
              max="100"
              step={100/(videoDuration * MILISECONDS_PER_SECOND) || 1}
              defaultValue={0}
              onInput={() => {
                  // if (isAllowChangeTimeline){
                  //     console.log("timeline-range onInput used")
                  //     timelineToCurrentTime();
                  // } else{
                  //     isAllowChangeTimeline.current = true;
                  // }
                  animationTimeline.seek((timelineRange.value / 100) * animationTimeline.duration);
                  setVideoCurrentTime(videoDuration * (timelineRange.value / 100))
              }}
              onChange={() => {
                  // console.log("timeline-range onChange used")
                  // console.log(timelineRange.value);
                  // animationTimeline.seek((timelineRange.value / 100) * animationTimeline.duration);
              }}
          />

            {textElements.map((textElement) => (
                <div className="text-track" key={textElement.id}>
                    <div className="text-track-id" onClick={() => {
                        getSelectedTextObject(textElement.id)
                        setIsHidden(false)
                    }}>ID: {textElement.id}</div>
                    <div className="text-track-keyframe-area">
                        {textElement.keyframes.map((keyframe) => (
                            <div
                                className="text-track-keyframe-area-point"
                                key={keyframe.time}
                                hint={keyframe.time}
                                style={{
                                    left: `${(keyframe.time/video.duration) * 100}%`,
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

const playPause = anime({
    targets: '.draggable-wrapper',
    keyframes: [
        {translateY: -40},
        {translateX: 250},
        {translateY: 40},
        {translateX: 0},
        {translateY: 0}
    ],
    duration: 4000,
    easing: 'easeOutElastic(1, .8)',
    loop: true,
    autoplay: false
});

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
