const Pallet = ({ pallet, setPallet }) => {
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
      <div
        style={{
          borderBottom: '0.08em solid #D3D5D7',
          margin: '10px',
          paddingBottom: '5px',
        }}
      >
        Pallet
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '180px 180px 180px 180px',
        }}
      >
        {pallet.map(({block, color}, index) => {
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
                }}
              ></div>
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