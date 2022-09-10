import React, {useRef, useState} from 'react'
import { useMainContext } from '../Context/Context'
import './../ComponentsCSS/TopBoxComment.css'

function TopBoxComment({autoFocus}) {
  const {setPesanReset, setPesanIncrement} = useMainContext();
  const komentar = useRef()
  // untuk triger underline pada input
  const [showKomenLine, setShowKomenLine] = useState(false)
  // untuk triger button pada input jika di fokus. jika tidak maka hilang
  const [showButton, setShowButton] = useState(false)

  // ketikan teks dimasukan maka akan true, jika kosong maka false
  const [enableBtn, setEnableBtn] = useState(true)

  // ketika click input maka munculkan garis dan button
  const komenFocus = () => {
    setShowKomenLine(true)
    setShowButton(true)
  }

  // ketika mereka tidak click input maka sembunyikan garis
  const komenFokusOut = () => {
    setShowKomenLine(false)
  }

  // jika sebuah input diisi dengan key up, maka ada enable BTN
  const komenStroke = (event) => {
    let pesanSekarang = event.target.value;
    if(pesanSekarang){
      setEnableBtn(false);
    } else{
      setEnableBtn(true)
    }
  }

  const submitKomen = (event) => {
    event.preventDefault();
    fetch('/tambah-data',{
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({pesanData:komentar.current.value})
    })
    .then(()=>{
      // Reset comment dan menambah kenaikan
      setPesanReset(e => !e)
      setPesanIncrement(10)
      // Hapus input teks dan disable  comment btn
      komentar.current.value = "";
      setEnableBtn(true)
    })
  }

  return (
      <form action="">
        <section className='komen-box'>
              <input type="text" autoFocus={autoFocus} placeholder="komen ..." ref={komentar}
              onFocus={komenFocus}
              onBlur={komenFokusOut}
              onKeyUp={komenStroke}
              />
              {showKomenLine && (
                <div className='komen-line'></div>
              )}
        </section>
      {showButton && (
        <>
          <button className='komen-btn send-btn ' disabled={enableBtn} onClick={submitKomen} >Komentar</button>
          <button className='komen-btn' style={{ color: 'gray', backgroundColor: 'transparent' }}
          onClick={(pesan)=>{
            setShowButton(false);
            komentar.current.value=""
          }}
          >Batal</button>
        </>
      )}
      </form>
  )
}

export default TopBoxComment