const path = require('path');
const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 4000;

// Load existing data from output.json if it exists
let arr = [];
if (fs.existsSync('output.json')) {
    const data = fs.readFileSync('output.json');
    arr = JSON.parse(data);
}

app.use(express.static(path.join(__dirname,'public')));
app.use(express.json()); // Add this line to parse JSON bodies

app.get('/gettask',(req,res)=>{
    const {task} = req.query;
    res.send(task);
});

app.post('/storeData', (req, res) => {
    try {
        const { arr: newArr } = req.body;
        console.log("Received data to store:", newArr);
        // Append new data to the existing array
        arr.push(...newArr);

        // Write the updated array back to output.json
        fs.writeFileSync("output.json", JSON.stringify(arr));
        console.log("Data stored successfully!");
        res.send("Data stored successfully!");
    } catch (err) {
        console.error("Error storing data:", err);
        res.status(500).send("Error storing data");
    }
});


app.listen(PORT,()=>{
    console.log(`http://localhost:`+PORT);
});
