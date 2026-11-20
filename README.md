# What is this for?

I've encountered a problem: I need keyframe animation for ASS subtitles like in video editors, but any plugins for all of the subtitle editor doesn't have such functionality and conveniece. So I decided to make my own app with video editor-ish UI and which generate me fully-done .ass file.

# Launching

1. Go to `App` folder with `cd .../App`
2. Run `npm run build` or `npm run dev` for development preview

# Using instruction

1. Choose video you want to use for your animation
2. Add text and double click to open text inspector
3. In text inspector you can change text`s parameters and create/delete keyframes
4. After you set up your animation - click on render subtitles button to generate your .ass subtitles
5. Click download button to get your .ass file
