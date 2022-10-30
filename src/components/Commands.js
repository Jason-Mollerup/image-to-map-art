import { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCopy } from '@fortawesome/free-regular-svg-icons'

const commandsStyles = {
  borderRadius: '10px',
  boxShadow: '0px 0px 6px rgba(0, 0, 0, 0.2)',
  margin: '10px',
  paddingTop: '5px',
  paddingBottom: '5px',
  backgroundColor: 'white',
  width: '720px',
  height: '300px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
}

const pageNavStyles = {
  navWrapper: {
    display: 'flex',
    overflowX: 'auto',
    padding: '10px',
  },
  wrapper: {
    backgroundColor: 'white',
    borderRadius: '100px',
    boxShadow: '0px 0px 3px rgba(0, 0, 0, 0.3)',
    fontSize: 'small',
    margin: '4px',
    padding: '4px',
    width: '18px',
    height: '18px',
    cursor: 'pointer',
  },
  wrapperCurrent: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: '100px',
    boxShadow: '0px 0px 3px rgba(0, 0, 0, 0.3)',
    fontSize: 'small',
    margin: '4px',
    padding: '4px',
    width: '18px',
    height: '18px',
    cursor: 'pointer',
  },
  inner: {
    width: '18px',
    height: '18px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  }
}

const textareaStyles = {
  overflowY: 'auto',
  padding: '10px',
  width: 'calc(100% - 40px)',
  flexGrow: 1,
  resize: 'none',
  borderRadius: '5px',
  border: '0.08em solid #D3D5D7',
  fontSize: 'small',
  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
}

const Commands = ({ commands }) => {
  const pages = commands.length
  const [page, setPage] = useState(0)
  const [currentCommands, setCurrentCommands] = useState(commands)
  const [command, setCommand] = useState(commands[0])

  useEffect(() => {
    setCommand(commands[0])
    setCurrentCommands(commands)
  }, [commands])

  const handleClick = (pageNumber) => {
    setPage(pageNumber)
    setCommand(currentCommands[pageNumber])
  }

  const handleTextChange = (e) => {
    const tempCommands = currentCommands.slice()
    tempCommands[page] = e.target.value
    setCurrentCommands(tempCommands)
    setCommand(e.target.value)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(command);
    window.alert('Copied command to clipboard')
  }

  const setPageNav = () => {
    const pagesNav = []
    for (let i = 0; i < pages; i++) {
      pagesNav.push(
        <div
          style={i === page ? pageNavStyles.wrapperCurrent : pageNavStyles.wrapper}
          key={`page${i}`}
          onClick={() => handleClick(i)}
        >
          <div style={pageNavStyles.inner}>
            {i + 1}
          </div>
        </div>
      )
    }
    return pagesNav
  }

  return (
    <div style={commandsStyles}>
      <div
        style={{
          margin: '10px',
          display: 'flex',
          flexDirection: 'row',
        }}
      >
        <div style={{paddingRight: '10px'}}>
          {currentCommands.length > 0 ? `Commands: ${currentCommands.length}` : 'Commands:'}
        </div>
        <div
          style={{
            cursor: 'pointer',
            display: command ? 'block' : 'none'
          }}
          onClick={handleCopy}
        >
          <FontAwesomeIcon icon={faCopy} />
        </div>
      </div>
      <textarea
        style={textareaStyles}
        value={command}
        spellCheck={false}
        onChange={handleTextChange}
      />
      <div style={pageNavStyles.navWrapper}>
        {currentCommands ? setPageNav() : null}
      </div>
    </div>
  )
}

export default Commands