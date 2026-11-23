'use strict'

import type { TextElement } from "../types";

import React from "react";

interface TextInspectorProps {
    TextObject: TextElement;
    isHidden: boolean;
    onHandleIsHiddenChange: (value: boolean) => void;
    textElements: TextElement[];
    onHandleTextElementsChange: (value: TextElement[]) => void;
    videoCurrentTime: number;
    updateAnimationObjectKeyframes: (index: number) => void;
}

const TextInspector = ({TextObject, isHidden, onHandleIsHiddenChange, textElements, onHandleTextElementsChange, videoCurrentTime, updateAnimationObjectKeyframes}: TextInspectorProps) => {

    const isHiddenChange = () => {
        const newValue = true;
        onHandleIsHiddenChange(newValue);
    };

    const deleteTextElement = (id: number) => {
        const newTextElements = textElements.filter(element => element.id !== id);
        onHandleTextElementsChange(newTextElements);
    };

    const changeTextElementContent = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, id: number) => {
        const index = textElements.findIndex((element) => element.id === id);
        const newTextElements = [...textElements];
        newTextElements[index].content = e.target.value;
        onHandleTextElementsChange(newTextElements);
    };

    // Return value after handling input field limits
    const inputLimits = (target: EventTarget & (HTMLInputElement | HTMLTextAreaElement), value: string) => {

        const min = target.hasOwnProperty("min") ? (target as HTMLInputElement).min : -Infinity;
        const max = target.hasOwnProperty("max") ? (target as HTMLInputElement).max : Infinity;

        if ((value as unknown as number) > (max as number)){
            return max;
        }
        if ((value as unknown as number) < (min as number)){
            return min;
        }

        return value;
    }

    const changeTextElementColor = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, id: number) => {
        const index = textElements.findIndex((element) => element.id === id);
        const newTextElements = [...textElements];
        newTextElements[index].textColor = e.target.value;
        onHandleTextElementsChange(newTextElements);
    };

    const changeTextElementFontSize = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, id: number) => {
        const index = textElements.findIndex((element) => element.id === id);
        const newTextElements = [...textElements];
        newTextElements[index].fontSize = inputLimits(e.target, e.target.value) || 0;
        onHandleTextElementsChange(newTextElements);
    };

    const changeTextElementStrokeThickness = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, id: number) => {
        const index = textElements.findIndex((element) => element.id === id);
        const newTextElements = [...textElements];
        newTextElements[index].strokeThickness = inputLimits(e.target, e.target.value) || 0;
        onHandleTextElementsChange(newTextElements);
    };

    const changeTextElementStrokeColor = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, id: number) => {
        const index = textElements.findIndex((element) => element.id === id);
        const newTextElements = [...textElements];
        newTextElements[index].strokeColor = e.target.value;
        onHandleTextElementsChange(newTextElements);
    };

    const changeTextElementPosition = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, id: number) => {
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

    const changeTextElementSizeXY = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, id: number) => {
        const index = textElements.findIndex((element) => element.id === id);
        const newTextElements = [...textElements];
        const { name, value } = e.target;
        const newScale = parseFloat(inputLimits(e.target, value) as string) || 0;

        if (name === "scale-x") {
            newTextElements[index].scaleX = newScale;
        } else if (name === "scale-y") {
            newTextElements[index].scaleY = newScale;
        }

        onHandleTextElementsChange(newTextElements);
    };

    const changeTextElementRotateXYZ = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, id: number) => {
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
    };

    const changeTextElementOpacity = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, id: number) => {
        const index = textElements.findIndex((element) => element.id === id);
        const newTextElements = [...textElements];
        newTextElements[index].opacity = inputLimits(e.target, e.target.value) || 0;
        onHandleTextElementsChange(newTextElements);
    };

    const toggleCreateKeyframe = (TextObject: TextElement, currentTime: number) => {
        const id = TextObject.id;
        const index = textElements.findIndex((element) => element.id === id);
        const newTextElements = [...textElements];

        if (TextObject.keyframes.some(keyframe => keyframe?.timeKF === videoCurrentTime.toFixed(3))) {
            newTextElements[index].keyframes = newTextElements[index].keyframes.filter(keyframe => keyframe.timeKF !== currentTime.toFixed(3));
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
                opacity: TextObject.opacity,
                textColor: TextObject.textColor,
                strokeColor: TextObject.strokeColor,
                strokeThickness: TextObject.strokeThickness,
                duration: 1000, // Some default value
            });
        }

        newTextElements[index].keyframes.sort((a, b) => (a.timeKF as unknown as number) - (b.timeKF as unknown as number));

        onHandleTextElementsChange(newTextElements);
        updateAnimationObjectKeyframes(index);
    };


    return(
      <>
          <div id="text-inspector" className={`absolute top-[5px] right-[5px] flex min-h-[300px] max-h-[600px] min-w-[200px] max-w-[300px] flex-col overflow-y-auto rounded-[5px] bg-[#2a2a2a] p-[10px] font-normal text-white [&>*]:shrink-0 [&_p]:text-center [&_input]:mb-[5px] ${isHidden ? "invisible" : "visible"}`}>
              <p>Text ID: {TextObject.id}</p>

              <label htmlFor="PosX">Position X:</label>
              <input
                  type="number"
                  id="PosX"
                  name="PosX"
                  required
                  minLength={"1" as unknown as number}
                  maxLength={"4" as unknown as number}
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
                  minLength={"1" as unknown as number}
                  maxLength={"4" as unknown as number}
                  value={TextObject.posY}
                  onChange={(e) => {
                      changeTextElementPosition(e, TextObject.id)
                  }}
              />

              <label htmlFor="content">Content:</label>
              <textarea
                  id="content"
                  name="content"
                  required
                  minLength={"1" as unknown as number}
                  value={TextObject.content}
                  onChange={(e) => changeTextElementContent(e, TextObject.id)}
              />

              <label htmlFor="text-color">Text color:</label>
              <input
                  type="color"
                  id="text-color"
                  name="text-color"
                  required
                  minLength={"7" as unknown as number}
                  maxLength={"7" as unknown as number}
                  value={TextObject.textColor}
                  onChange={(e) => changeTextElementColor(e, TextObject.id)}
              />

              <label htmlFor="font-size">Font size:</label>
              <input
                  type="number"
                  id="font-size"
                  name="font-size"
                  required
                  minLength={"1" as unknown as number}
                  maxLength={"3" as unknown as number}
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
                  minLength={"1" as unknown as number}
                  maxLength={"3" as unknown as number}
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
                  minLength={"1" as unknown as number}
                  maxLength={"3" as unknown as number}
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
                  value={TextObject.rotateX}
                  onChange={(e) => changeTextElementRotateXYZ(e, TextObject.id)}
              />

              <label htmlFor="rotate-y">Rotate Y:</label>
              <input
                  type="number"
                  id="rotate-y"
                  name="rotate-y"
                  required
                  value={TextObject.rotateY}
                  onChange={(e) => changeTextElementRotateXYZ(e, TextObject.id)}
              />

              <label htmlFor="rotate-z">Rotate Z:</label>
              <input
                  type="number"
                  id="rotate-z"
                  name="rotate-z"
                  required
                  value={TextObject.rotateZ}
                  onChange={(e) => changeTextElementRotateXYZ(e, TextObject.id)}
              />

              <label htmlFor="stroke-thickness">Stroke thickness:</label>
              <input
                  type="number"
                  id="stroke-thickness"
                  name="stroke-thickness"
                  required
                  value={TextObject.strokeThickness}
                  onChange={(e) => changeTextElementStrokeThickness(e, TextObject.id)}
              />

              <label htmlFor="stroke-color">Stroke color:</label>
              <input
                  type="color"
                  id="stroke-color"
                  name="stroke-color"
                  required
                  minLength={"7" as unknown as number}
                  maxLength={"7" as unknown as number}
                  value={TextObject.strokeColor}
                  onChange={(e) => changeTextElementStrokeColor(e, TextObject.id)}
              />

              <label htmlFor="opacity">Opacity:</label>
              <input
                  type="number"
                  id="opacity"
                  name="opacity"
                  required
                  min="0"
                  max="1"
                  step="0.01"
                  value={TextObject.opacity}
                  onChange={(e) => changeTextElementOpacity(e, TextObject.id)}
              />

              <button id="toggle-keyframe-button" className="cursor-pointer select-none border-none font-controls text-[length:inherit] [line-height:inherit] [outline:inherit] font-normal text-white mt-[15px] rounded-[5px] bg-[#3d3d3d] p-[5px]" onClick={() => {
                  toggleCreateKeyframe(TextObject, videoCurrentTime)
              }}>
                  {
                      (TextObject.keyframes && TextObject.keyframes.some(keyframe => keyframe?.timeKF === videoCurrentTime.toFixed(3))) ? (
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
                                      RotateZ: {keyframe.rotateZ}<br/>
                                      Opacity^ {keyframe.opacity}
                                  </p>
                              </details>
                          ))}
                      </details>
                  ) : (
                      <></>
                  )
              }

              <button id="delete-button" className="cursor-pointer select-none border-none font-controls text-[length:inherit] [line-height:inherit] [outline:inherit] font-normal text-white mt-[10px] rounded-[5px] bg-[#a22929] p-[5px]" onClick={() => {
                  deleteTextElement(TextObject.id)
                  isHiddenChange()
              }}>Delete
              </button>

              <button id="close-button" className="cursor-pointer select-none border-none font-controls text-[length:inherit] [line-height:inherit] [outline:inherit] font-normal text-white mt-[15px] rounded-[5px] bg-[#3d3d3d] p-[5px]" onClick={() => {
                  isHiddenChange()
              }}>Close
              </button>
          </div>
      </>
    );
};

export default TextInspector;