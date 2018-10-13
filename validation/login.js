const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateLoginInput(data) {
   let errors = {};

   data.email = !isEmpty(data.email) ? data.email : '';
   data.password = !isEmpty(data.password) ? data.password : '';

   if(!Validator.isEmail(data.email)) {
      errors.email = 'Email is invalid';
   }

   if(Validator.isEmpty(data.email)) {
      errors.email = 'Email field is required';
   }

   if(Validator.isEmpty(data.password)) {
      errors.password = 'Password field is required';
   }


   return{
      errors, //return the errors obj, same as errors:errors (ES6 - errors alone)
      isValid: isEmpty(errors), //if obj errors is empty the data is valid
   }
}