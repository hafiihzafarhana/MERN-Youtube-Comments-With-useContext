const express = require('express');
const { default: mongoose } = require('mongoose');
// setting heroku install:dotenv dan path
// require("dotenv").config()

// useNewUrlParser berguna untuk menghindari duplikasi database
// selain itu useNewUrlParser merupakan fromat baru dari link connect ke mongoose
mongoose.connect('mongodb://localhost:27017/commentYT', { useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;
db.on('error', err => console.error(err));
db.once('open', () => console.log("db sukses"));

const commentSkema = mongoose.Schema({
    pengguna:String,
    pesan:String,
    likes:Number,
    editable:Boolean,
    balasan: [{
        pengguna:String,
        pesan:String,
        likes:Number,
    }]
})

const CommentModel = mongoose.model("Comment", commentSkema);
// Membangun database di mongo db dan membuat collection serta mengisi data
var id = mongoose.Types.ObjectId();
const newComment = [
    {   _id:mongoose.Types.ObjectId(),
        pengguna:"Malaka L",
        pesan:"Hidup saja sudah cukup",
        likes:49,
        editable:false,
        balasan: [{
            pengguna:"Chengho",
            pesan:"uuuuuuuu",
            likes:99
        }]
    },
];

// CommentModel.insertMany(newComment, (err, data) => {
//     if(err){
//         console.log(err)
//     } else {
//         console.log("data berhasil")
//     }
// })

const app = express();
// const port_no = 5000

// Menangani permintaan posting yang ada di lokal
app.use(express.json());
app.use(express.urlencoded({ extended : true }));

app.get('/', (req,res) => {
    res.send("APP is run")
})

// dapat data di dalam collection. Batasi menjadi 10 data
app.post('/data-comment',(req,res)=>{
    CommentModel.find({}, (err,data)=>{
        if(err){
            throw err;
        } else{
            res.send(data)
        }
    }).limit(10)
})

app.post('/tambah-data',(req,res)=>{
    let pesanPost = req.body.pesanData
    const pesanBaru = new CommentModel({
        pengguna:"Ini Kamu",
        pesan:pesanPost,
        likes:0,
        editable:true,
        balasan: []
    })
    .save();

    res.send('')
})

// intersection observer untuk load lebih banyak data
app.post('/get-more-data', (req,res) => {
    let pesanIncrement = req.body.pesanIncrement;
    CommentModel.find({},(err,data) => {
        if(err) {
            throw err;
        } else {
            res.send(data)
        }
    })
    .skip(pesanIncrement)
    .limit(10)
})

// tambah sub komen dari komen yang ada
app.post('/tambah-sub-komen', (req,res) => {
    let subPesan = req.body.subPesanData;
    let idPesan = req.body.pesanId;

    const subPesanBaru = {
        pengguna:"Ini Kamu",
        pesan:subPesan,
        likes:0,
        editable:true,
        balasan: []
    }
    
    CommentModel.updateOne({_id:idPesan}, {$push:{balasan:subPesanBaru}}, (err, data) => {
        if(err){
            console.log("checkkkk")
            throw err;
        } else{
            // kirim balik empty data
            res.send('')
        }
    })
    // kesalahan taruh res.send disini
    // res.send('')
})

// pengguna ketika ingin update komentar
app.post('/update-comment', (req,res) => {
    let commentId = req.body.commentId;
    CommentModel.findOne({_id:commentId},(err, data) => {
        if(!err){
            res.send(data);
        }
    })
})

// pengguna mengahpus komen
app.post('/hapus-komen', (req,res) => {
    let commentId = req.body.pesanId
    CommentModel.deleteOne({_id:commentId}, (err,data) => {
        if(!err){
            res.send('');
        }
    })
})

// pengguna menghapus sub komen
app.post('/hapus-sub-komen', (req, res) => {
    let pesanId = req.body.pesanId;
    let subPesanId = req.body.subPesanId;
    CommentModel.updateOne({_id:pesanId}, {$pull:{balasan:{_id:subPesanId}}},(err,data) =>{
        if(!err){
            res.send('')
        }
    })
})

// pengguna menyukai dan batal menyukai komen
app.post('/like-komen',(req,res) => {
    let likesKomen = req.body.likesKomen;
    let pesanId = req.body.pesanId;
    CommentModel.updateOne({_id:pesanId},{likes:likesKomen},(err,data) =>{
        if(err){
            throw err;
        }
    })
})

// pengguna menyukai dan batal menyukai sub komen
app.post('/sub-like-komen',(req,res) => {
    let likesKomen = req.body.likesKomen;
    let pesanId = req.body.pesanId;
    let subPesanId = req.body.subPesanId;
    CommentModel.updateOne({_id:pesanId, "balasan._id":subPesanId}, {$set:{"balasan.$.likes" :likesKomen}} ,(err,data) =>{
        if(err){
            throw err;
        }
    })
})

app.listen(process.env.PORT || port_no, (req, res) => {
    console.log(`port running atport number : ${port_no}`)
})