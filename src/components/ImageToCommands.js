import { useState } from 'react'
import { PALLET } from '../constants/pallet'
import Pallet from './Pallet'
import Commands from './Commands'

const cardStyles = {
  borderRadius: '10px',
  boxShadow: '0px 0px 6px rgba(0, 0, 0, 0.2)',
  width: '138px',
  height: '138px',
  margin: '10px',
  backgroundColor: 'white',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
}

const uploadStyles = {
  wrapper: {
    marginTop: '5px',
    border: '2px dashed #D3D5D7',
    backgroundColor: 'white',
    borderRadius: '5px',
    padding: '5px',
    margin: '10px',
    width: '392px',
  },
  label: {
    width: '100%',
    height: 'calc(100% - 30px)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    padding: '15px',
    wordBreak: 'breakAll',
    textAlign: 'center',
  },
  input: {
    display: 'none'
  }
}

const canvasStyles = {
  width: '128px',
  height: '128px',
  borderRadius: '5px',
}

// Takes pixel with no alpha value
const closestBlock = (color, pallet) => {
  let closest = {}
  let dist
  for (let i = 0; i < pallet.length; i++) {
    dist = Math.pow(color[0] - pallet[i].color[0], 2);
    dist += Math.pow(color[1] - pallet[i].color[1], 2);
    dist += Math.pow(color[2] - pallet[i].color[2], 2);
    dist = Math.sqrt(dist);

    if(!closest.dist || closest.dist > dist){
      closest.dist = dist
      closest.match = pallet[i]
    }
  }
  // returns closest match as RGB array without alpha
  return closest.match;
}

const createCommands = (pallet, context, myImage, outputContext, setCommands) => {
  const { width, height } = myImage
  const data = context.getImageData(0, 0, width, height).data
  const outputData = outputContext.getImageData(0, 0, width, height)
  let out = []
  let row = []
  let x = 0
  let z = height - 1
  // let commandLength = 0

  // chain info
  let chain = {
    block: 'none',
    start: 0,
    stop: 0,
    length: 0,
  }
  let wasRowEnd = false

  for (let i = 0; i < data.length + 4; i += 4) {
    const isRowEnd = (i + 4) % (width * 4) === 0
    const {block, color} = closestBlock([data[i], data[i + 1], data[i + 2]], pallet)

    // change output image to match PALLET
    outputData.data[i] = color[0]
    outputData.data[i + 1] = color[1]
    outputData.data[i + 2] = color[2]
    outputData.data[i + 3] = 255;

    // determine command
    if (block !== chain.block || wasRowEnd) {
      const myZ = wasRowEnd ? z + 1 : z
      const command = chain.length > 0
        ? fillCommand([chain.start, myZ], [chain.stop, myZ], chain.block)
        : setCommand([chain.start, myZ], chain.block)
      row.push(command)
      // commandLength += command.length
      chain.block = block
      chain.start = x === 0 ? 0 : x - 1
      chain.stop = x === 0 ? 0 : x - 1
      chain.length = 0
      wasRowEnd = false
    } else {
      chain.stop++
      chain.length++
    }

    // come back to this
    // if (commandLength > 32000) {
    //   out.push(row.join(''))
    //   row = []
    //   commandLength = 0
    // }

    if (row.length > 10000) {
      if (out.legth === 0) {
        out.push(row.slice(1, row.length).join('\n'))
      } else {
        out.push(row.join('\n'))
      }
      row = []
    }

    if (isRowEnd) {
      wasRowEnd = true
      // new row values
      x = 0
      z--
    }

    // next pixel
    x++
  }
  if (out.length === 0) {
    out.push(row.slice(1, row.length).join('\n'))
  }
  outputContext.putImageData(outputData, 0, 0)
  setCommands(out)
}

const fillCommand = (startArr, endArr, block) => {
  const [startX, startZ, endX, endZ] = [...startArr, ...endArr].map(i => i === 0 ? '' : i)
  return `fill ~${startX} ~ ~${startZ} ~${endX} ~ ~${endZ} ${block}`
}

const setCommand = (startArr, block) => {
  const [startX, startZ] = startArr.map(i => i === 0 ? '' : i)
  return `setblock ~${startX} ~ ~${startZ} ${block}`
}

const ImageToCommands = () => {
  const [pallet, setPallet] = useState(PALLET)
  const [name, setName] = useState(null)
  const [image, setImage] = useState(null)
  const [commands, setCommands] = useState([])

  const handleClick = () => {
    document.getElementById('file-input').click()
  }

  const generate = (fileIn, palletIn) => {
    const file = image || fileIn
    const palletForUse = palletIn || pallet
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onloadend = (e) => {
      const myImage = new Image() // Creates image object
      myImage.src = e.target.result // Assigns converted image to image object
      myImage.onload = (ev) => {
        const myCanvas = document.getElementById('myCanvas') // Creates a canvas object
        const myContext = myCanvas.getContext('2d') // Creates a context object
        myCanvas.width = myImage.width // Assigns image's width to canvas
        myCanvas.height = myImage.height // Assigns image's height to canvas
        myContext.drawImage(myImage, 0, 0) // Draws the image on canvas

        const outputCanvas = document.getElementById('outputCanvas') // Creates a canvas object
        const outputContext = outputCanvas.getContext('2d') // Creates a context object
        outputCanvas.width = myImage.width // Assigns image's width to canvas
        outputCanvas.height = myImage.height // Assigns image's height to canvas
        outputContext.drawImage(myImage, 0, 0) // Draws the image on canvas
        createCommands(palletForUse.filter(i => i.selected), myContext, myImage, outputContext, setCommands)
      }
    }
  }

  const handleChange = (e) => {
    const file = e.target.files[0]
    setName(file.name)
    setImage(file)
    generate(file)
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        justifyContent: 'center',
      }}
    >
      <h3
        style={{
          margin: '20px 0 10px'
        }}
      >
        Convert Image to Minecraft Commands
      </h3>
      <hr width='720px'/>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          width: '100%',
          justifyContent: 'center',
        }}
      >
        <div style={uploadStyles.wrapper}>
          <label
            style={uploadStyles.label}
            onClick={handleClick}
          >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div>
              {name ? name : 'Upload a .png file that is 128 x 128'}
            </div>
            <div
              style={{
                color: 'darkgray',
                fontSize: 'x-small',
                fontStyle: 'italic',
                display: name ? 'block' : 'none',
                marginTop: '10px',
              }}
            >
              (uploaded)
            </div>
          </div>
          </label>
          <input
            id="file-input"
            style={uploadStyles.input}
            type='file'
            onChange={handleChange}
          />
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row'
          }}
        >
        <div style={cardStyles}>
          <canvas style={{display: name ? 'flex' : 'none', ...canvasStyles}} id="myCanvas"></canvas>
        </div>
        <div style={cardStyles}>
          <canvas style={{display: name ? 'flex' : 'none', ...canvasStyles}} id="outputCanvas"></canvas>
        </div>
        </div>
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          width: '100%',
        }}
      >
        <Pallet pallet={pallet} setPallet={setPallet} generate={generate}/>
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          width: '100%',
        }}
      >
        <Commands commands={commands} />
      </div>
    </div>
  )
}

export default ImageToCommands
