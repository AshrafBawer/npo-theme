const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const LocalStartegy = require('passport-local');
const expressSession = require('express-session');
const expressSanitizer = require('express-sanitizer');
const methodOverride = require('method-override');

// medlewares
const isLoggedIn = require('./middlewares/auth');

// database models
const Admin = require('./models/admin');
const Subscriber = require('./models/newsletter');
const Content = require('./models/content');
const Post = require('./models/blog');
const Donor = require('./models/donor');

// demo data
// const data = require('./models/reset');

// Content.remove({}, (err) => {
//   if (!err) {
//     console.log('Contents removed');
//   }
// });

// Content.create(data, (err, saved) => {
//   if (err) console.log(err);
//   else {
//     console.log(saved);
//   }
// });

// configuration
app.set('view engine', 'ejs');
app.use(express.static(`${__dirname}/public/`));
mongoose.connect('mongodb://localhost/non-profit-theme', { useNewUrlParser: true });
app.use(expressSanitizer());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
mongoose.set('useFindAndModify', false);

// authentication setup
app.use(expressSession({
  secret: 'Success come from the hundred hours of work that no one sees',
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(Admin.serializeUser());
passport.deserializeUser(Admin.deserializeUser());
passport.use(new LocalStartegy(Admin.authenticate()));

// global variables
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

app.get('/', async (req, res) => {
  let data;
  let posts;
  let donors;
  try {
    data = await Content.find({});
    posts = await Post.find({}).limit(3);
    donors = await Donor.find({});
  } catch (err) {
    return err;
  }
  const content = [];
  data.forEach((item) => {
    const title = item.name;
    const value = item.data;
    content[title] = value;
  });
  return res.render('index', { content, posts, donors });
});

// route to subscribe to newsletter
app.post('/newsletter_subscribe', (req, res) => {
  Subscriber.create(req.body, (err, subscriber) => {
    if (err) {
      return err;
    }
    res.redirect('/');
  });
});

// blog routes
app.get('/blog', (req, res) => {
  Post.find({}, (err, posts) => {
    if (err) console.log(err);
    else {
      res.render('blog', { posts });
    }
  });
});

// single post route
app.get('/blog/:id', (req, res) => {
  Post.findById(req.params.id, (err, post) => {
    if (err) console.log(err);
    else {
      res.render('post', { post });
    }
  });
});

// admin routes
// admin login route
app.get('/admin', (req, res) => {
  Admin.find({}, (err, admin) => {
    if (err) {
      return res.redirect('/error');
    }

    if (admin.length === 0) {
      return res.render('register');
    }
    res.render('login');
  });
});

// admin authentication route
app.post('/admin', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/admin',
}));

// admin register route
app.post('/admin/register', (req, res) => {
  Admin.find({}, (err, admin) => {
    if (err) return console.log(err);
    if (admin.length === 0) {
      Admin.register(new Admin({
        username: req.body.username,
        email: req.body.email,
      }), req.body.password, (err, admin) => {
        if (err) {
          return err;
        }
        passport.authenticate('local')(req, res, () => res.redirect('/'));
      });
    } else {
      console.log('Admin is already registered');
    }
  });
});

// admin home panel
app.get('/admin/home', isLoggedIn, (req, res) => {
  Content.find({}, (err, data) => {
    if (err) console.log(err);
    else {
      const content = [];
      data.forEach((item) => {
        const title = item.name;
        const value = item.data;
        content[title] = value;
      });
      res.render('admin/home', { content });
    }
  });
});

// home area update route
app.post('/admin/home', isLoggedIn, (req, res) => {
  req.body.data = req.sanitize(req.body.data);
  Content.findOneAndUpdate({ name: req.body.name },
    { data: req.body.data.trim() }, (err, updated) => {
      if (err) console.log(err);
      else {
        console.log(updated);
        res.send('Updated');
      }
    });
});

// admin blog panel
app.get('/admin/blog', isLoggedIn, (req, res) => {
  Post.find({}, (err, posts) => {
    if (err) console.log(err);
    else {
      return res.render('admin/blog', { posts });
    }
  });
});
// get posts route with ajax
app.get('/posts', isLoggedIn, (req, res) => {
  Post.find({}, (err, posts) => {
    if (err) console.log(err);
    else {
      return res.render('partials/posts', { posts });
    }
  });
});
// create post route
app.post('/admin/blog', isLoggedIn, (req, res) => {
  req.body.body = req.sanitize(req.body.body);
  Post.create({
    title: req.body.title.trim(),
    body: req.body.body.trim(),
    author: req.body.author.trim() !== '' ? req.body.author.trim() : undefined,
    image: req.body.image.trim() !== '' ? req.body.image.trim() : undefined,
  }, (err, createdPost) => {
    if (err) console.log(err);
    else {
      res.send('works');
    }
  });
});

// edit post route form
app.get('/admin/blog/:id/edit', isLoggedIn, (req, res) => {
  Post.findById(req.params.id, (err, foundPost) => {
    if (err) console.log(err);
    else {
      res.render('admin/edit', { post: foundPost });
    }
  });
});

// edit post
app.put('/admin/blog/:id', isLoggedIn, (req, res) => {
  req.body.body = req.sanitize(req.body.body);
  Post.findByIdAndUpdate(req.params.id, {
    title: req.body.title.trim(),
    body: req.body.body.trim(),
    author: req.body.author.trim() !== '' ? req.body.author.trim() : undefined,
    image: req.body.image.trim() !== '' ? req.body.image.trim() : undefined,
  }, (err, updatedPost) => {
    if (err) console.log(err);
    else {
      res.redirect('/admin/blog');
    }
  });
});

// post delete route
app.delete('/admin/blog/:id/delete', isLoggedIn, (req, res) => {
  Post.findByIdAndRemove(req.params.id, (err) => {
    if (!err) {
      res.send('OK');
    } else {
      console.log(err);
    }
  });
});

// Donors routes
app.post('/admin/donor', isLoggedIn, (req, res) => {
  Donor.create({ url: req.body.image }, (err, createdDonor) => {
    if (err) console.log(err);
    else {
      console.log(createdDonor);
      res.redirect('/donors');
    }
  });
});

// a route to get donors with ajax
app.get('/donors', isLoggedIn, (req, res) => {
  Donor.find({}, (err, donors) => {
    if (err) console.log(err);
    else {
      res.render('partials/donors', { donors });
    }
  });
});

// donor delete route
app.delete('/admin/donor/:id/delete', isLoggedIn, (req, res) => {
  Donor.findByIdAndRemove(req.params.id, (err) => {
    if (!err) {
      res.send('Deleted');
    } else {
      console.log(err);
    }
  });
});

app.listen('3000', () => {
  console.log('server started on port 3000');
});
