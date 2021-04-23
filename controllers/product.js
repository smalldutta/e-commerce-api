const _ = require('lodash');
const formidable = require('formidable');
const fs = require('fs');
const Product = require('../models/product');
const { errorHandler } = require('../helpers/dbErrorHandler');

exports.create = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse( req, (err, fields, files) => {
    if (err) {
      res.status(400)
         .json({
           error: "Image could not be uploaded"
         });    
    }

    // check for all fields
    const {
      name,
      description,
      price,
      category,
      quantity,
      shipping
  } = fields;

  if (
      !name ||
      !description ||
      !price ||
      !category ||
      !quantity ||
      !shipping
  ) {
      return res.status(400).json({
          error: "All fields are required"
      });
  }

    let product = new Product(fields);

    if (files.photo) {
      if(files.photo.size > 1000000 ) {
        return res.json({
          error: "Image should be less than 1mb"
        });
      }
      product.photo.data = fs.readFileSync(files.photo.path);
      product.photo.contentType = files.photo.type;
    }
    product.save( (err, result) => {
      if (err) {
        return res.staus(400).json({
            error: errorHandler(err)
        });
      }
      res.json(result);
    });
  });
}