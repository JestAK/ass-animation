// Numeric inputs retain their original string values; assertions at arithmetic
// sites preserve JavaScript coercion without introducing runtime conversions.
export type NumericValue = number | string;

export interface AnimatedProperties {
    translateX: number;
    translateY: number;
    fontSize: NumericValue;
    scaleX: number;
    scaleY: number;
    rotateX: number;
    rotateY: number;
    rotateZ: number;
    opacity: NumericValue;
    textColor: string;
    strokeColor: string;
    strokeThickness: NumericValue;
}

export interface Keyframe extends AnimatedProperties {
    timeKF: string;
    duration: number;
}

export interface TextElement extends Omit<AnimatedProperties, 'translateX' | 'translateY'> {
    id: number;
    posX: number;
    posY: number;
    content: string;
    keyframes: Keyframe[];
}

export interface AnimationObject {
    target: AnimatedProperties;
    animeElementId: number;
    keyframes: Keyframe[];
    delay: number;
    ease: string;
}

export interface RenderFrame extends Omit<TextElement, 'keyframes'> {
    startTime: string;
    endTime: string;
}
