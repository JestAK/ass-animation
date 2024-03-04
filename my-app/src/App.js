import anime from "animejs";

import TextInspector from "./TextInspector";
import './App.css';
import React, {useEffect, useState} from "react";
import Draggable from "react-draggable";

function App() {

    class TextObject {
        constructor() {
            this.id = textIdCounter;
            this.posX = 0;
            this.posY = 0;
            this.content = `Text ID - ${textIdCounter}`;
            this.keyframes = [];
            this.textColor = "#ffffff";
            this.fontSize = 20;
            this.strokeThickness = 3;
            this.strokeColor = "#000000"
            setTextIdCounter(textIdCounter + 1)
        }
    }

    //initialise variables
    const [video, setVideo] = useState(null);
    const [timelineRange, setTimelineRange] = useState(null);
    const [textElements, setTextElements] = useState([]);
    const [textIdCounter, setTextIdCounter] = useState(0);
    const [isHidden, setIsHidden] = useState(true);
    const [selectedTextObject, setSelectedTextObject] = useState({})

    //get video and timeline-range
    useEffect(() => {
        const videoElement = document.getElementById('video')
        setVideo(videoElement)

        const tlRange = document.getElementById('timeline-range')
        setTimelineRange(tlRange)
    }, []);

    const addText = (newTextElement) => {
        const newTextElements = [...textElements];
        newTextElements.push(newTextElement);
        setTextElements(newTextElements);
    };

    const timelineToCurrentTime = () => {
        video.currentTime = video.duration * (timelineRange.value / 100);
    }

    const currentTimeToTimeline = () => {
        timelineRange.value = (video.currentTime / video.duration) * 100;
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
        }

        setSelectedTextObject(foundObject)
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
        <button id="add-text" onClick={() => {addText(new TextObject())}}>Add Text</button>
          <div id="viewport">
              <video id="video" onTimeUpdate={() => {
                  currentTimeToTimeline()
              }}>
                  <source src={require('./prikolyas.mp4')} type="video/mp4"/>
                  Your browser does not support the video tag.
              </video>

              {textElements.map((textElement) => (
                  <Draggable
                      bounds="parent"
                      key={textElement.id}
                      position={{ x: textElement.posX, y: textElement.posY }}
                      onDrag={(event, data) => {
                      handleTextPosChange(event, data, textElement.id)
                      getSelectedTextObject(textElement.id)
                  }}>
                      <pre style={{position: 'absolute',
                             color: textElement.textColor,
                             fontSize: `${textElement.fontSize}px`,
                             WebkitTextStrokeWidth: `${textElement.strokeThickness}px`,
                             WebkitTextStrokeColor: textElement.strokeColor,
                      }}
                         className="subtitle-text"
                         onDoubleClick={() => {
                             getSelectedTextObject(textElement.id)
                             setIsHidden(false)
                         }}>
                          {textElement.content}
                      </pre>
                  </Draggable>
              ))}

              <TextInspector TextObject={selectedTextObject}
                             isHidden={isHidden}
                             onHandleIsHiddenChange={onHandleIsHiddenChange}
                             textElements={textElements}
                             onHandleTextElementsChange={onHandleTextElementsChange}
              />
          </div>
          <div id="controllers">
              <button id="stop-button" onClick={() => {
                  video.pause()
              }}>STOP
              </button>
              <button id="play-button" onClick={() => {
                  video.play()
              }}>PLAY
              </button>
              <button id="plus-5sec-button" onClick={() => {
                  video.currentTime = video.currentTime + 5
              }}>+ 5 SEC
              </button>
              <button id="minus-5sec-button" onClick={() => {
                  video.currentTime = video.currentTime - 5}}>- 5 SEC</button>
        </div>
        <div id="timeline">
          <input
              type="range"
              id="timeline-range"
              min={0}
              max={100}
              step="0.1"
              defaultValue={0}
              onInput={() => {timelineToCurrentTime()}}
          />

            {textElements.map((textElement) => (
                <div className="text-track" key={textElement.id}>
                    <div className="text-track-id" onClick={() => {
                        getSelectedTextObject(textElement.id)
                        setIsHidden(false)
                    }}>ID: {textElement.id}</div>
                    <div className="text-track-keyframe-area"></div>
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