import React, {useEffect, useRef, useState} from 'react'
import {Pesan} from './Components/index'
import './ComponentsCSS/Pesan.css'
import { useMainContext } from './Context/Context';

function PesanGulir() {
  const [pesan, setPesan] = useState([]);
  const [showBottomBar, setShowBottomBar] = useState(true)
  const arr = [{nama:"hafi"},{nama:"ihza"}]

  // ketika Boolean dari MainContext berubah, maka re-render list pesan
  const {pesanReset, pesanIncrement, setPesanIncrement, pesanUpdate} = useMainContext()
  // Meyakinkan nilai increment berada di callback function untuk intersection observer update
  const pesanIncrementRef = useRef(pesanIncrement)
  // muat 10 konten pertama. Dilakukan ini baik aplikasi dimulai atau tambah komentar. Akan ada dependency nya yaitu pesanReset
  useEffect(() => {
    setShowBottomBar(true);
    fetch("/data-comment",{
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({limitNum:10})
    })
    .then(res => res.json())
    .then(komen => {setPesan(komen)});

  }, [pesanReset])

  // depedency:pesanUpdate
  // jika di delete atau ditambah komentar maka rendering lagi
  useEffect(() => {
    if(pesanUpdate){
      // jika pesanUpdate[0] adalah 1 adalah update. jika selain itu, maka hapus
      if(pesanUpdate[0] === 1){
        fetch("/update-comment",{
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({commentId:pesanUpdate[1]})
        })
        .then(res => res.json())
        .then(commentData => {
          updateKomen(commentData)
        })
      } else if(pesanUpdate[0] === 2){
        deleteKomen()
      }
    }
  }, [pesanUpdate])

  function updateKomen(commentData){
    let pesanSekarang = [...pesan]
    if(commentData){
      let indexPesanSekarang = pesanSekarang.findIndex(pesan => pesan._id === commentData._id)
      pesanSekarang.splice(indexPesanSekarang, 1, commentData)
      setPesan(pesanSekarang)
    }
  }

  function deleteKomen(){
    let pesanSekarang = [...pesan]
    let indexPesanSekarang = pesanSekarang.findIndex(pesan => pesan._id === pesanUpdate[1])
    pesanSekarang.splice(indexPesanSekarang, 1)
    setPesan(pesanSekarang)
  }

  // intersection observer: membantu untuk mengatur infinite loop
  const observer = useRef(new IntersectionObserver(entries => {
    const first = entries[0];
    if(first.isIntersecting){
      fetch("get-more-data",{
        method:"POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({pesanIncrement:pesanIncrementRef.current})
      })
      .then(res => res.json())
      .then(pesan => {
        if(pesan.length > 0){
          setTimeout(() => {
            setPesan(prevState => [...prevState, ...pesan])
          }, 3000);
        } else{

          setTimeout(() =>{
            setShowBottomBar(false)
          },3000)
        }
          
        // Gunakan pesan.length apabila tidak ada 10 komen/pesan yang lainya
        setPesanIncrement(prevState => prevState+=pesan.length)
      })
    }
  }),{threshold: 1});

  // Kenaikan komentar awal adalah yang terbaru
  useEffect(() => {
    pesanIncrementRef.current = pesanIncrement;
  },[pesanIncrement])

  // state bottom bar akan berisi element bottombar jsx
  const [bottomBar, setBottomBar] = useState(null)

  useEffect(() => {
    const currentBottomBar = bottomBar;
    const currentObserver = observer.current;
    if(currentBottomBar){
      currentObserver.observe(currentBottomBar)
    }

    // fungsi pembersihan. Fungsi ini dipanggil apabila pada penggunaan useEffect selanjutnya pada useEffect ini tidak diinisialisasi dengan nilai (null)
    return () => {
      if(currentBottomBar){
        currentObserver.unobserve(currentBottomBar)
      }
    }
  }, [bottomBar])

  return (
    <div>
      {pesan.map((e)=>(
        <Pesan key={Math.random()} useKey={e._id} pengguna={e.pengguna} editable={e.editable} pesan={e.pesan} likes={e.likes} balasan={e.balasan} />
      ))}
      {pesan.length > 9 && showBottomBar ? (
        <div className="bottom-bar" ref={setBottomBar}>
          <div className="loader"></div>
        </div>
      ) : (null)}
    </div>
  )
}

export default PesanGulir