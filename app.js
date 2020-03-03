const express = require('express');
const koneksi = require('./config/database');
const bodyParser = require('body-parser');
const app = express();
const PORT = 5000;

//set body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended:false }))

app.get('/', (req, res) => {
    return res.status(200).json({pesan: 'wow berhasil'})
});

app.get('/api/bootcamps', (req, res) => {
    var statement = "SELECT * FROM bootcamp";
    koneksi.query(statement, (err, rows, field) => {
        if(err) {
            return res.status(500).json({message: 'Ada Kesalahan'})
        }
        res.status(200).json({Success: true, data: rows})
    });
});

app.post('/api/bootcamp/insert', (req, res) => {
    const data = { ...req.body };
    var statement = "INSERT INTO bootcamp SET ?";
    koneksi.query(statement,data, (err, rows, field) => {
        if (err) {
            return res.status(500).json({ message: "Gagal Insert Data", error: err})
        }
        res.status(201).json({ Success: true, message: "Berhasil!" });
    });
});

app.delete('/api/bootcamp/delete/:id', (req, res) => {
    var statement1 = "SELECT * FROM bootcamp WHERE id = ?";
    var statement2 = "DELETE FROM bootcamp WHERE id = ?";
    koneksi.query(statement1, req.params.id, (err, rows, field) => {
        if (err) {
            return res.status(500).json({ message: "Gagal", error: err});
        }
        if(!rows.length){
            return res.status(500).json({ message: `ID ${req.params.id} tidak ditemukan!`});
        }

        koneksi.query(statement2, req.params.id, (err, rows, field) => {
            if (err) throw err
            if (rows.affectedRows == 1){
                return res.status(200).json({ Success: true, message: "Data terhapus"})
            }
        })
    });
});

app.put('/api/bootcamp/update/:id', (req, res) => {
    var statement1 = "SELECT * FROM bootcamp WHERE id = ?";
    var statement2 = "UPDATE bootcamp SET ? WHERE id = ?";
    const data = { ...req.body };

    koneksi.query(statement1, req.params.id, (err, rows, field) => {
        if (err) {
            return res.status(500).json({ message: "Gagal", error: err});
        }
        if(!rows.length){
            return res.status(500).json({ message: `ID ${req.params.id} tidak ditemukan!`});
        }

        koneksi.query(statement2, [data, req.params.id], (err, rows, field) => {
            if (err) throw err

            if (rows.affectedRows == 1) {
                return res.status(200).json({ Success: true, message: "Berhasil update"})
            }

        })
    });
});

app.listen(PORT, () => console.log(`Server running at port: ${PORT}`))