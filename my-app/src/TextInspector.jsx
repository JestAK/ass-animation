import './App.css';

function TextInspector({TextObject, isHidden, onHandleIsHiddenChange, textElements, onHandleTextElementsChange}) {

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
                  onChange={(e) => {changeTextElementPosition(e, TextObject.id)}}
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
                  onChange={(e) => {changeTextElementPosition(e, TextObject.id)}}
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
                  min="1"
                  value={TextObject.fontSize}
                  onChange={(e) => changeTextElementFontSize(e, TextObject.id)}
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

              <button id="close-button" onClick={() => {
                  console.log("Keyframe added")
              }}>Add keyframe
              </button>

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