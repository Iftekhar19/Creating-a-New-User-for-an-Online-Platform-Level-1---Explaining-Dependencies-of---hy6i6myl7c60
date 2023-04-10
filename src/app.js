const fs = require("fs");
const express = require("express");
const app = express();
const Joi=require("joi");

// Importing products from products.json file
const userDetails = JSON.parse(
  fs.readFileSync(`${__dirname}/data/userDetails.json`)
);

//Middlewares
app.use(express.json());

// Joi
function validate(req,res,next)
{
  const schema=Joi.object({
    name:Joi.string().required(),
    mail:Joi.string().required(),
    number:Joi.number().required()
  })
  const ans=schema.validate(req.body)
 if(ans.error)
 {
  return  res.status(400).json({
    "status":"failed",
    "message":"invalid user data"
   })
 }

   next();

}


// Write POST endpoint for registering new user
app.post("/api/v1/details",validate,(req,res)=>
{
   return res.status(200).json({
      "status": "Success",

    "message": "User registered successfully",

    "data": {

        "newProduct": {
          ...req.body,
          id:userDetails.length+1
        }
    }
    })
})
// GET endpoint for sending the details of users
app.get("/api/v1/details", (req, res) => {
  res.status(200).json({
    status: "Success",
    message: "Detail of users fetched successfully",
    data: {
      userDetails,
    },
  });
});

// GET endpoint for sending the products to client by id
app.get("/api/v1/userdetails/:id", (req, res) => {
  let { id } = req.params;
  id *= 1;
  const details = userDetails.find((details) => details.id === id);
  if (!details) {
    return res.status(404).send({
      status: "failed",
      message: "Product not found!",
    });
  } else {
    res.status(200).send({
      status: "success",
      message: "Details of users fetched successfully",
      data: {
        details,
      },
    });
  }
});

module.exports = app;
