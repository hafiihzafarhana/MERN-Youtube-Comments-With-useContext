import React, {useState, useRef, useContext, createContext} from 'react'
import { useMainContext } from '../Context/Context'
import {SubCommentBox} from './index'

// membuat context
const showReply = createContext()


export function useOpenReplyMan(){
  return useContext(showReply)
}

function SubPesan({parentKey, subId, pengguna, pesan, likes}) {
  const likeIcon = useRef()
  const numLikes = useRef()

  const [openReply, setOpenReply] = useState(false)

  const {setPesanUpdate} = useMainContext()

  // Membuka button Balas
  const changeOpenReply = () => {
    setOpenReply(!openReply)
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
    fetch('/sub-like-komen',{
      method: 'POST',
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({likesKomen: likes, pesanId:parentKey, subPesanId:subId})
    }) 
    // tidak memerlukan setPesanupdate karena sudah ada innerHTML
  }

  // untuk menghapus pesan
  const deleteReply = () => {
    fetch('/hapus-sub-komen',{
      method: 'POST',
      headers:{"Content-Type": "application/json"},
      body: JSON.stringify({pesanId:parentKey, subPesanId:subId})
    })
    .then(() => {
      setPesanUpdate([1, parentKey])
    })
  }
  console.log(parentKey, subId)
  return (
    <div>
      <section className='pesan-container'>
        <div className='pesan-user'>{pengguna}</div>
        <i className="las la-user"></i>
        <div className="pesan-teks">{pesan}</div>
        <section className="pesan-ikon-container">
          <i className="las la-thumbs-up" ref={likeIcon} onClick={likeComment}></i>
          <div className="like" ref={numLikes}>{likes}</div>
          {pengguna != "Ini Kamu" ? 
            (<div onClick={changeOpenReply} style={{ cursor: 'pointer' }}>Balas</div>) : 
            (<div onClick={deleteReply} style={{ cursor: 'pointer' }}>Hapus</div>)}
        </section>
        {/* context provider */}
        <showReply.Provider value={changeOpenReply}>
          {/* memunculkan pesan balasan yang konsepnya sama dengan top box comment */}
          {openReply && <SubCommentBox autoFocus={true} parentKey={parentKey}/>}
        </showReply.Provider>
      </section>
    </div>
  )
}

export default SubPesan