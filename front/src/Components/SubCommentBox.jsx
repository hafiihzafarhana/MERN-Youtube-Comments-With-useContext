import React, {useRef, useState} from 'react'
import './../ComponentsCSS/TopBoxComment.css'
import { useOpenReplyMan } from './SubPesan'
import { useMainContext } from '../Context/Context'

function SubCommentBox({autoFocus, parentKey}) {
    // useOpenReply harus dideklarasikan di dalam React internal file dulu. dengan cara:
    const {changeOpenReply} = useOpenReplyMan()
    // useMainContext: untuk update komentar setelah di send
    const {setPesanUpdate} = useMainContext()

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
    // changeOpenReply()
    fetch('/tambah-sub-komen',{
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({subPesanData: komentar.current.value, pesanId:parentKey})
    })
    .then(() => {
      setPesanUpdate([1, parentKey])
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
          onClick={()=>{
            setShowButton(false);
            komentar.current.value=""
            changeOpenReply()
        }}
        >Batal</button>
        </>
      )}
      </form>
  )
}

export default SubCommentBox