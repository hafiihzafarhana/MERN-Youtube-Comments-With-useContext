import React, { createContext, useState, useContext } from 'react'

const MainContext = createContext();

export function useMainContext(){
    return useContext(MainContext)
}

// harus children
export function ContextProvider({children}){
    // state yang berguna untuk memicu permintaan pembaharuan atau penghapusan permintaan pada komen milik pengguna
    const [pesanUpdate, setPesanUpdate] = useState()
    // state ini berbentuk bolean yang akan dirubah ketika menambahkan komentar untuk merefresh 10 komentar pertama
    const [pesanReset, setPesanReset] = useState(false)
    // state yang menyatakan bahwa nilai kenaikan saat ini digunakan pada saat menambah komentar
    const [pesanIncrement, setPesanIncrement] = useState(10)
    const value = {
        pesanReset,
        setPesanReset,
        pesanUpdate,
        setPesanUpdate,
        pesanIncrement,
        setPesanIncrement
    }
    return(
        <>
            <MainContext.Provider value={value}>
                {children}
            </MainContext.Provider>
        </>
    )
}