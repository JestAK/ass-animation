import { useRef } from "react";
import Draggable, { type DraggableEventHandler } from "react-draggable";
import type { TextElement } from "../types";

interface DraggableTextProps {
    textElement: TextElement;
    onDrag: DraggableEventHandler;
    onInspect: () => void;
}

export default function DraggableText({ textElement, onDrag, onInspect }: DraggableTextProps) {
    // Each mounted subtitle owns a stable DOM ref, including in React StrictMode.
    const nodeRef = useRef<HTMLDivElement>(null);

    return (
        <Draggable
            bounds="#viewport"
            position={{ x: textElement.posX, y: textElement.posY }}
            nodeRef={nodeRef}
            handle="[data-drag-handle]"
            onDrag={onDrag}
        >
            <div
                ref={nodeRef}
                className="absolute"
                id={`text-wrapper-${textElement.id}`}
            >
                <pre
                    style={{
                        color: textElement.textColor,
                        fontSize: `${textElement.fontSize}px`,
                        WebkitTextStrokeWidth: `${textElement.strokeThickness}px`,
                        WebkitTextStrokeColor:
                            textElement.strokeColor,
                        transform: `scaleX(${textElement.scaleX}) scaleY(${textElement.scaleY}) rotateX(${textElement.rotateX}deg) rotateY(${textElement.rotateY}deg) rotateZ(${textElement.rotateZ}deg)`,
                        opacity: textElement.opacity,
                    }}
                    data-drag-handle
                    className="m-0 cursor-move touch-none origin-bottom select-none font-controls text-[20px] font-bold text-white [-webkit-text-stroke:3px_black] [paint-order:stroke_fill]"
                    onDoubleClick={onInspect}
                >
                    {textElement.content}
                </pre>
            </div>
        </Draggable>
    );
}
