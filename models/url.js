const mongoose = require('mongoose');
// https://github.com/ramiel/mongoose-sequence
const AutoIncrement = require('mongoose-sequence')(mongoose);

const urlSchema = new mongoose.Schema({
  original_url: {
    type: String,
    required: true
  }
});

urlSchema.plugin(AutoIncrement, {inc_field: 'short_url'});
module.exports = mongoose.model('Url', urlSchema);