const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const URLSlugs = require('mongoose-url-slugs');

// add your schemas
// use plugins (for slug)
// register your model
const ArticleSchema = new Schema({
  id: Number,
  title: String,
  url: String,
  description: String,
  userid: String
});

const UserSchema = new Schema({
  id: Number,
  username: String,
  email: String,
  password: {type: String, unique: true, required: true},
});

ArticleSchema.plugin(URLSlugs('title'));

mongoose.model('User', UserSchema);
mongoose.model('Article', ArticleSchema);
mongoose.connect('mongodb://localhost/hw06');
console.log("Connecting to database hw06");
