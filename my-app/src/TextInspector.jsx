import './App.css';

function TextInspector({TextObject, isHidden}) {

    return(
      <>
          <div id="text-inspector" style={{ visibility: isHidden ? 'hidden' : 'visible' }}>
              <p>Text ID</p>

              <label htmlFor="PosX">Position X:</label>
              <input type="number" id="PosX" name="PosX" required minLength="4" maxLength="8" size="10"/>

              <label htmlFor="PosY">Position Y:</label>
              <input type="number" id="PosY" name="PosY" required minLength="4" maxLength="8" size="10"/>

              <label htmlFor="content">Content:</label>
              <input type="text" id="content" name="content" required minLength="4" maxLength="8" size="10"/>

              <label htmlFor="stroke-thickness">Stroke thickness:</label>
              <input type="number" id="stroke-thickness" name="stroke-thickness" required minLength="4" maxLength="8"
                     size="10"/>

              <button id="delete-button">Delete</button>
              <button id="close-button" onClick={() => {console.log("Hello")}}>Close</button>
          </div>
      </>
    );
}

export default TextInspector;