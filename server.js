require('dotenv').config();
const PORT= 3030 || process.env.PORT;
const express =  require('express');
const socketIO  = require('socket.io');
const axios = require('axios');
const app = express();
app.use(express.json());
const server = app.listen(PORT,()=>{
    console.log(`connect to PORT:${PORT}`)
});

const socketHandler = socketIO(server);

socketHandler.on("connection",(socket)=>{
    

    socket.on('connect_error',()=>{
        console.log("connection error!")
      });

    socket.on('disconnect',()=>{
      console.log("client Disconnected!")
    });

    console.log("client Connected");


 
        socket.emit("crypto","Hello World Client!");


   
})

const productlist = () => {


axios.get(process.env.LIST_URL, { headers: {
    "x-messari-api-key": process.env.API_KEY,
  },
}).then((response) => {
const priceList = response.data.data.map((item)=>{
  return {
    id:item.id,
    name:item.symbol,
    price: item.metrics.market_data.price_usd,
  };
});
   socketHandler.emit('crypto',priceList);
}).catch(err=>{
console.log(err); 
socketHandler.emit("crypto",{
  error: true,
  message: "Error Fetching Data from APi"
});
});

};


setInterval(() => {
  productlist()
}, 60000 );






app.get('/cryptos/profile/',(req,res)=>{
  

    res.json({ error:true, message:"Missing Crypto Id in the API URL"});

})




app.get('/cryptos/profile/v1/:id',(req,res)=>{


  const cryptoId = req.params.id;

  axios.get(`${process.env.BASE_URL_v1}/${cryptoId}/profile`, { headers: {
    "x-messari-api-key": process.env.API_KEY,
  },
}).then((responseData) => {
res.json(responseData.data.data);
}).catch(err=>{
  console.log(err); 
  socketHandler.emit("crypto",{
    error: true,
    message: "Error Fetching Data from APi"
  });
  });



})

app.get('/cryptos/profile/v2/:id',(req,res)=>{


  const cryptoId = req.params.id;

  axios.get(`${process.env.BASE_URL_v2}/${cryptoId}/profile`, { headers: {
    "x-messari-api-key": process.env.API_KEY,
  },
}).then((responseData) => {
res.json(responseData.data.data);
}).catch(err=>{
  console.log(err); 
  socketHandler.emit("crypto",{
    error: true,
    message: "Error Fetching Data from APi"
  });
  });



})



app.get('/cryptos/market-data/:id',(req,res)=>{


  const cryptoId = req.params.id;

  axios.get(`${process.env.BASE_URL}/${cryptoId}/metrics/market-data`, { headers: {
    "x-messari-api-key": process.env.API_KEY,
  },
}).then((responseData) => {
res.json(responseData.data.data);
}).catch(err=>{
  console.log(err); 
  socketHandler.emit("crypto",{
    error: true,
    message: "Error Fetching Data from APi"
  });
  });



})

  

