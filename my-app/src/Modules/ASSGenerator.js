const generateASS = (video, framesData) => {

    console.log("START GENERATE")
    console.log(framesData)

    const videoOffsetX = video.videoWidth / 2
    const videoOffsetY = video.videoHeight / 2

    const assBeginning = `[Script Info]\n
    ; Script generated by ASS Animation\n
    ; www.github.com/JestAK/ass-animation\n
    ScriptType: v4.00+\n
    PlayResX: ${video.videoWidth}\n
    PlayResY: ${video.videoHeight}\n
    WrapStyle: 2\n\n
    [V4+ Styles]\n
    Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding\n
    Style: ASS Animation,Arial,20,&H00FFFFFF,&H000000FF,&H00000000,&H00000000,0,0,0,0,100,100,0,0,1,2,0,2,10,10,10,1\n\n
    [Events]\n
    Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
    `
    console.log("FINISH GENERATE INFO")

    let dialogues = framesData.map(data => {
        console.log("CREATING DIALOGUE")
        if (data.opacity){
            return `Dialogue: 0,${data.startTime},${data.endTime},ASS Animation,Animation ID${data.id},0,0,0,,{\\pos(${data.posX + videoOffsetX},${data.posY + videoOffsetY})\\fs${data.fontSize}\\fscx${data.scaleX * 100}\\fscy${data.scaleY * 100}\\frz${data.rotateZ}\\frx${data.rotateX}\\fry${data.rotateY}\\c&H${data.textColor}\\3c&H${data.strokeColor}&\\bord${data.strokeThickness}\\1a&H${data.opacity}&\\2a&H${data.opacity}&\\3a&H${data.opacity}&\\4a&H${data.opacity}&}${data.content}`
        }
        return ""
    })

    const result = assBeginning + dialogues.join("\n")
    return new Blob([result], {type: 'text/plain'})
}

export default generateASS


