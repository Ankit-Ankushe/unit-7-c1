const express = require('express');
const fs = require('fs')
const dns = require('node:dns');
const app = express()

let data = fs.readFileSync('products.json');
let prodData = JSON.parse(data);

app.use(express.json())
const PORT = 7000;
app.post('/getmeip', (req, res) => {
    const url = req.body.website_name;
    console.log(url)

    dns.lookup(url, (err, address, family) => {
        console.log('address: %j family: IPv%s', address, family);
        res.send(`${address}`)
    });

})

// get data
app.get('/products', (req, res) => {
    return res.status(200).send(prodData);
});

// Post Data
app.post('/products/create',(req,res) => {
    var data = req.body;
    prodData.push(data)
    fs.writeFile("products.json", JSON.stringify(prodData), (err) => {
        if (err) throw err;
    });
    return res.send('product added')
})

// Delete data
app.delete('/products/:productId',(req,res)=>{
    const { productId } = req.params;
    console.log("id",productId)
    // let index = null;
    let index = prodData.findIndex(product => product.id == productId);
    // prodData.forEach((prod, i) => {
    //     if (prod.id == productId) {
    //         index = i;
    //     }
    //     if(index == null){
    //         throw new Error('product not found')
    //     }
    //     prodData.splice(index,1)
    // })
    if(index == -1){
        return res.status(404).send({
            message: 'Product not found'
        });
    }
    prodData.splice(index, 1);
    fs.writeFile("products.json", JSON.stringify(prodData), (err) => {
        if (err) throw err;
    });
    res.send('product deleted successfully')
})


// update
app.put('/products/:productId', (req, res) => {
    let id = req.params.productId;
    let index = prodData.findIndex(product => product.id == id);
    if(index == -1){
        return res.status(404).send({
            message: 'Product not found'
        });
    }
    prodData[index] = req.body;
    fs.writeFile("products.json", JSON.stringify(prodData), (err) => {
        if (err) throw err;
    }
    );
    return res.status(200).send({
        message: 'Product updated successfully'
    });
}
);
app.listen(PORT,()=> {
    console.log('server started')
})