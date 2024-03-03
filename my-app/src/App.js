import TextInspector from "./TextInspector";
import './App.css';
import React, {useEffect, useState} from "react";
import Draggable from "react-draggable";

function App() {

    class TextObject {
        static idCounter = 0;
        constructor() {
            this.id = TextObject.idCounter++;
            this.posX = 0;
            this.posY = 0;
            this.content = `Text ID - ${textIdCounter}`;
            this.keyframes = [];
            this.strokeThickness = 3;
        }
    }

    //initialise variables
    const [video, setVideo] = useState(null);
    const [timelineRange, setTimelineRange] = useState(null);
    const [textElements, setTextElements] = useState([]);
    const [textIdCounter, setTextIdCounter] = useState(0);
    const [isHidden, setIsHidden] = useState(false);
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
        newTextElement.id = textIdCounter;
        newTextElements.push(newTextElement);
        setTextElements(newTextElements);
        setTextIdCounter(textIdCounter + 1)
    };

    const timelineToCurrentTime = () => {
        video.currentTime = video.duration * (timelineRange.value / 100);
    }

    const currentTimeToTimeline = () => {
        timelineRange.value = (video.currentTime / video.duration) * 100;
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
                  <Draggable bounds="parent">
                      <p key={textElement.id}
                         style={{position: 'absolute', top: textElement.top, left: textElement.left}}
                         className="subtitle-text">
                          {textElement.content}
                      </p>
                  </Draggable>
              ))}

              <TextInspector />
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
        </div>
      </>
  );
}


export default App;
