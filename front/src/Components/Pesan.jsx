import React, {useState, useRef, useContext, createContext} from 'react'
import { useMainContext } from '../Context/Context'
import {CommentsBox, SubPesan} from './index'

// membuat context
const showReply = createContext()

export function useOpenReplyMan(){
  return useContext(showReply)
}

function Pesan({pengguna, editable, pesan, likes, balasan, useKey}) {
  const likeIcon = useRef()
  const numLikes = useRef()

  const [arrowUp, setArrowUp] = useState(false)
  const [openReply, setOpenReply] = useState(false)

  // Membuka button Balas
  const changeOpenReply = () => {
    setOpenReply(!openReply)
  }

  const {setPesanUpdate} = useMainContext()

  // mengatur arah panah saat kolom komentar di click
  const arrUp= (<i className="las la-caret-up"></i>)
  const changeArrow = () => {
    setArrowUp(!arrowUp)
  }

  // atur like dan penambahan jumlah suka
  let toggleLike = false;
  const likeComment = () => {
    toggleLike = !toggleLike;
    if(toggleLike){
      likes++;
      likeIcon.current.style.color = "yellow"
    }
    else{
      likes--;
      likeIcon.current.style.color = "gray"
    }
    numLikes.current.innerHTML = likes;
    
    // kirim nilai like ke database
    fetch('/like-komen',{
      method: 'POST',
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({likesKomen: likes, pesanId:useKey})
    }) 
    // tidak memerlukan setPesanupdate karena sudah ada innerHTML
  }

  // untuk menghapus pesan
  const deleteReply = (event) => {
    // event.preventDefault();
    fetch('/hapus-komen',{
      method: 'post',
      headers:{"Content-Type": "application/json"},
      body: JSON.stringify({pesanId:useKey})
    })
    .then(() => {
      setPesanUpdate([2, useKey])
    })
  }

  return (
    <div>
      <section className='pesan-container'>
        <div className='pesan-user'>{pengguna}</div>
        <i className="las la-user"></i>
        <div className="pesan-teks">{pesan}</div>
        <section className="pesan-ikon-container">
          <i className="las la-thumbs-up" ref={likeIcon} onClick={likeComment}></i>
          <div className="like" ref={numLikes}>{likes}</div>
          {!editable ? 
            (<div onClick={changeOpenReply} style={{ cursor: 'pointer' }}>Balas</div>) : 
            (<div onClick={deleteReply} style={{ cursor: 'pointer' }}>Hapus</div>)}
        </section>
        {/* context provider */}
        {/*  */}
        <showReply.Provider value={{ changeOpenReply }}>
          {/* memunculkan pesan balasan yang konsepnya sama dengan top box comment */}
          {/* Jadi, changeOpenReply akan melakukan buka dan tutup pada komen. Dan dengan adanya useContext dapat memilih dimana yang harus di buka dan di tutup pada komponen CommentsBox */}
          {openReply && <CommentsBox autoFocus={true} useKey={useKey}  />}
        </showReply.Provider>
        {balasan.length > 0 && (
          <section className='panah-balasan' onClick={changeArrow}>
              {arrowUp == true ? (arrUp) : (<i className="las la-caret-down"></i>)}
              <div>Lihat {balasan.length} balasan</div>
          </section>
        )}
        {arrowUp && (
          <section className='sub-pesan'>
              {balasan.length > 0 && (
                balasan.map((e) => (
                  <SubPesan key={e._id} parentKey={useKey} subId={e._id} pengguna={e.pengguna} pesan={e.pesan} likes={e.likes}/>
                ))
              )}
          </section>
        )}
      </section>
    </div>
  )
}

export default Pesan