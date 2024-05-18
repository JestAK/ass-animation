import '../App.css';
import React from "react";

const TextInspector = ({TextObject, isHidden, onHandleIsHiddenChange, textElements, onHandleTextElementsChange, videoCurrentTime, updateAnimationObjectKeyframes}) => {

    const isHiddenChange = () => {
        const newValue = true
        onHandleIsHiddenChange(newValue)
    }

    const deleteTextElement = (id) => {
        const newTextElements = textElements.filter(element => element.id !== id)
        onHandleTextElementsChange(newTextElements)
        console.log(textElements)
    }

    const changeTextElementContent = (e, id) => {
        const index = textElements.findIndex((element) => element.id === id);
        const newTextElements = [...textElements];
        newTextElements[index].content = e.target.value;
        onHandleTextElementsChange(newTextElements)
    }

    const changeTextElementColor = (e, id) => {
        const index = textElements.findIndex((element) => element.id === id);
        const newTextElements = [...textElements];
        newTextElements[index].textColor = e.target.value;
        onHandleTextElementsChange(newTextElements)
    }

    const changeTextElementFontSize = (e, id) => {
        const index = textElements.findIndex((element) => element.id === id);
        const newTextElements = [...textElements];
        newTextElements[index].fontSize = e.target.value;
        onHandleTextElementsChange(newTextElements)
    }

    const changeTextElementStrokeThickness = (e, id) => {
        const index = textElements.findIndex((element) => element.id === id);
        const newTextElements = [...textElements];
        newTextElements[index].strokeThickness = e.target.value;
        onHandleTextElementsChange(newTextElements)
    }

    const changeTextElementStrokeColor = (e, id) => {
        const index = textElements.findIndex((element) => element.id === id);
        const newTextElements = [...textElements];
        newTextElements[index].strokeColor = e.target.value;
        onHandleTextElementsChange(newTextElements)
    }

    const changeTextElementPosition = (e, id) => {
        const index = textElements.findIndex((element) => element.id === id);
        const newTextElements = [...textElements];
        const { name, value } = e.target;
        const newPosition = parseFloat(value) || 0;

        if (name === "PosX") {
            newTextElements[index].posX = newPosition;
        } else if (name === "PosY") {
            newTextElements[index].posY = newPosition;
        }

        onHandleTextElementsChange(newTextElements);
    };

    const toggleCreateKeyframe = (TextObject, currentTime) => {
        const id = TextObject.id;
        const index = textElements.findIndex((element) => element.id === id);
        const newTextElements = [...textElements];

        if (TextObject.keyframes.some(keyframe => keyframe?.timeKF === videoCurrentTime.toFixed(3))) {
            newTextElements[index].keyframes = newTextElements[index].keyframes.filter(keyframe => keyframe.timeKF !== currentTime.toFixed(3))
        } else {
            newTextElements[index].keyframes.push({
                timeKF: currentTime.toFixed(3),
                translateX: TextObject.posX,
                translateY: TextObject.posY,
                fontSize: TextObject.fontSize,
                scaleX: TextObject.scaleX,
                scaleY: TextObject.scaleY,
                rotateX: TextObject.rotateX,
                rotateY: TextObject.rotateY,
                rotateZ: TextObject.rotateZ,
                duration: 1000, // Some default value
            });
        }

        newTextElements[index].keyframes.sort((a, b) => a.timeKF - b.timeKF);

        console.log("Keyframe added")
        console.log(newTextElements[index].keyframes)
        console.log(newTextElements)

        onHandleTextElementsChange(newTextElements);
        updateAnimationObjectKeyframes(index);
    }

    const changeTextElementSizeXY = (e, id) => {
        const index = textElements.findIndex((element) => element.id === id);
        const newTextElements = [...textElements];
        const { name, value } = e.target;
        const newScale = parseFloat(value) || 0;

        if (name === "scale-x") {
            newTextElements[index].scaleX = newScale;
        } else if (name === "scale-y") {
            newTextElements[index].scaleY = newScale;
        }

        onHandleTextElementsChange(newTextElements);
    }

    const changeTextElementRotateXYZ = (e, id) => {
        const index = textElements.findIndex((element) => element.id === id);
        const newTextElements = [...textElements];
        const { name, value } = e.target;
        const newRotate = parseFloat(value) || 0;

        if (name === "rotate-x") {
            newTextElements[index].rotateX = newRotate;
        } else if (name === "rotate-y") {
            newTextElements[index].rotateY = newRotate;
        } else if (name === "rotate-z") {
            newTextElements[index].rotateZ = newRotate;
        }

        onHandleTextElementsChange(newTextElements);
    }


    return(
      <>
          <div id="text-inspector" style={{visibility: isHidden ? 'hidden' : 'visible'}}>
              <p>Text ID: {TextObject.id}</p>

              <label htmlFor="PosX">Position X:</label>
              <input
                  type="number"
                  id="PosX"
                  name="PosX"
                  required
                  minLength="1"
                  maxLength="4"
                  value={TextObject.posX}
                  onChange={(e) => {
                      changeTextElementPosition(e, TextObject.id)
                  }}
              />

              <label htmlFor="PosY">Position Y:</label>
              <input
                  type="number"
                  id="PosY"
                  name="PosY"
                  required
                  minLength="1"
                  maxLength="4"
                  value={TextObject.posY}
                  onChange={(e) => {
                      changeTextElementPosition(e, TextObject.id)
                  }}
              />

              <label htmlFor="content">Content:</label>
              <textarea
                  id="content"
                  name="content"
                  required minLength="1"
                  value={TextObject.content}
                  onChange={(e) => changeTextElementContent(e, TextObject.id)}
              />

              <label htmlFor="text-color">Text color:</label>
              <input
                  type="color"
                  id="text-color"
                  name="text-color"
                  required minLength="7"
                  maxLength="7"
                  value={TextObject.textColor}
                  onChange={(e) => changeTextElementColor(e, TextObject.id)}
              />

              <label htmlFor="font-size">Font size:</label>
              <input
                  type="number"
                  id="font-size"
                  name="font-size"
                  required
                  minLength="1"
                  maxLength="3"
                  min="0"
                  value={TextObject.fontSize}
                  onChange={(e) => changeTextElementFontSize(e, TextObject.id)}
              />

              <label htmlFor="scale-x">Scale X:</label>
              <input
                  type="number"
                  id="scale-x"
                  name="scale-x"
                  required
                  minLength="1"
                  maxLength="3"
                  min="0"
                  step="0.01"
                  value={TextObject.scaleX}
                  onChange={(e) => changeTextElementSizeXY(e, TextObject.id)}
              />

              <label htmlFor="scale-y">Scale Y:</label>
              <input
                  type="number"
                  id="scale-y"
                  name="scale-y"
                  required
                  minLength="1"
                  maxLength="3"
                  min="0"
                  step="0.01"
                  value={TextObject.scaleY}
                  onChange={(e) => changeTextElementSizeXY(e, TextObject.id)}
              />

              <label htmlFor="rotate-x">Rotate X:</label>
              <input
                  type="number"
                  id="rotate-x"
                  name="rotate-x"
                  required
                  minLength="1"
                  value={TextObject.rotateX}
                  onChange={(e) => changeTextElementRotateXYZ(e, TextObject.id)}
              />

              <label htmlFor="rotate-y">Rotate Y:</label>
              <input
                  type="number"
                  id="rotate-y"
                  name="rotate-y"
                  required
                  minLength="1"
                  value={TextObject.rotateY}
                  onChange={(e) => changeTextElementRotateXYZ(e, TextObject.id)}
              />

              <label htmlFor="rotate-z">Rotate Z:</label>
              <input
                  type="number"
                  id="rotate-z"
                  name="rotate-z"
                  required
                  minLength="1"
                  value={TextObject.rotateZ}
                  onChange={(e) => changeTextElementRotateXYZ(e, TextObject.id)}
              />

              <label htmlFor="stroke-thickness">Stroke thickness:</label>
              <input
                  type="number"
                  id="stroke-thickness"
                  name="stroke-thickness"
                  required
                  minLength="1"
                  maxLength="2"
                  min="0"
                  value={TextObject.strokeThickness}
                  onChange={(e) => changeTextElementStrokeThickness(e, TextObject.id)}
              />

              <label htmlFor="stroke-color">Stroke color:</label>
              <input
                  type="color"
                  id="stroke-color"
                  name="stroke-color"
                  required
                  minLength="7"
                  maxLength="7"
                  value={TextObject.strokeColor}
                  onChange={(e) => changeTextElementStrokeColor(e, TextObject.id)}
              />

              <button id="toggle-keyframe-button" onClick={() => {
                  toggleCreateKeyframe(TextObject, videoCurrentTime)
              }}>
                  {
                      (TextObject.keyframes && TextObject.keyframes.some(keyframe => keyframe?.time === videoCurrentTime.toFixed(3))) ? (
                          "Delete keyframe"
                      ) : (
                          "Add keyframe"
                      )
                  }
              </button>

              {
                  (TextObject.keyframes && TextObject.keyframes.length) ? (
                      <details>
                          <summary>Show all keyframes</summary>
                          {TextObject.keyframes.map((keyframe, index) => (
                              <details key={keyframe.timeKF}>
                                  <summary>Keyframe {index}</summary>
                                  <p>Time: {keyframe.timeKF}<br/>
                                      X: {keyframe.translateX}<br/>
                                      Y: {keyframe.translateY}<br/>
                                      Font size: {keyframe.fontSize}<br/>
                                      ScaleX: {keyframe.scaleX}<br/>
                                      ScaleY: {keyframe.scaleY}<br/>
                                      RotateX: {keyframe.rotateX}<br/>
                                      RotateY: {keyframe.rotateY}<br/>
                                      RotateZ: {keyframe.rotateZ}
                                  </p>
                              </details>
                          ))}
                      </details>
                  ) : (
                      <></>
                  )
              }

              <button id="delete-button" onClick={() => {
                  deleteTextElement(TextObject.id)
                  isHiddenChange()
              }}>Delete
              </button>

              <button id="close-button" onClick={() => {
                  isHiddenChange()
              }}>Close
              </button>
          </div>
      </>
    );
}

export default TextInspector;