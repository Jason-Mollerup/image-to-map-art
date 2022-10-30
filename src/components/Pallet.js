import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'

const selectStyles = {
  select: {
    fontSize: 'x-small',
    padding: '3px 6px',
    marginRight: '10px',
    border: '1px solid mediumaquamarine',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  clear: {
    fontSize: 'x-small',
    padding: '3px 6px',
    border: '1px solid lightcoral',
    borderRadius: '5px',
    cursor: 'pointer',
  }
}

const palletStyles = {
  wrapper: {
    borderBottom: '0.08em solid #D3D5D7',
    margin: '10px',
    paddingBottom: '5px',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: 'calc(100% - 20px)'
  },
  header: {
    marginRight: '10px',
  }
}

const Pallet = ({ pallet, setPallet, generate }) => {
  const handleClick = (index) => {
    const temp = structuredClone(pallet)
    temp[index].selected = !temp[index].selected
    setPallet(temp)
    generate(null, temp)
  }

  const selectAll = () => {
    const temp = structuredClone(pallet)
    setPallet(temp.map((i) => {
      i.selected = true
      return i
    }))
    generate(null, temp)
  }

  const deselectAll = () => {
    const temp = structuredClone(pallet)
    setPallet(temp.map((i) => {
      i.selected = false
      return i
    }))
    generate(null, temp)
  }

  return (
    <div
      style={{
        borderRadius: '10px',
        boxShadow: '0px 0px 6px rgba(0, 0, 0, 0.2)',
        margin: '10px',
        paddingTop: '5px',
        paddingBottom: '5px',
        backgroundColor: 'white',
        width: '720px',
      }}
    >
      <div style={palletStyles.wrapper}>
        <div style={palletStyles.header}>Pallet</div>
        <div style={selectStyles.select} onClick={selectAll}>select all</div>
        <div style={selectStyles.clear} onClick={deselectAll}>clear all</div>
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '180px 180px 180px 180px',
        }}
      >
        {pallet.map(({block, color, selected}, index) => {
          return (
            <div key={block}
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'left',
                marginTop: '5px',
                marginRight: '10px',
                marginBottom: '5px',
                marginLeft: '10px',
              }}
            >
              <div
                style={{
                  backgroundColor: `rgba(${color.join(', ')}, 1)`,
                  borderRadius: '5px',
                  marginRight: '10px',
                  width: '16px',
                  height: '16px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  cursor: 'pointer',
                }}
                onClick={() => handleClick(index)}
              >
                {
                  selected
                    ? null
                    : <FontAwesomeIcon icon={faXmark} color={'red'} />
                }
              </div>
              <div
                style={{
                  textTransform: 'capitalize',
                  alignSelf: 'center',
                  fontSize: 'x-small',
                }}
              >
                {block.split('_').join(' ')}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Pallet