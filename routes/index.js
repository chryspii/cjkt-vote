var express = require('express');
var router = express.Router();
const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient
const ObjectID = mongodb.ObjectID

// insert mongodb uri
const dbUrl = 'mongodb://'
let db

MongoClient.connect(dbUrl, {useNewUrlParser: true}, (err, client) => {
  if (err) console.log('Unable to connect to the Server', err)
  db = client.db('cjkt')
})

router.get('/', function(req, res, next) {
  if(req.session.vote == 1) {
    alert = 1;
  } else if(req.session.vote == 2) {
    alert = 2;
  } else {
    alert = 0
  }

  if(req.session.login) {
    res.render('index', { page: 'index', alert: alert});
  } else {
    res.render('login', { page: 'login'});
  }
})

router.get('/login', function(req, res, next) {
  if(req.session.login) {
    res.render('index', { page: 'index'});
  } else {
    res.render('login', { page: 'login'});
  }
});

router.post('/login', function(req, res, next) {
  var email = req.body.email;

  db.collection("voter").findOne({"email": email}, (err, result) => {
    if(err) res.status(400).send({status: 'error', message: err});
    if(result) {
      var hour = 3600000;
      req.session.cookie.expires = new Date(Date.now() + hour);
      req.session.cookie.maxAge = hour;
      req.session.login = email;

      res.send({status: 'ok'})
    } else {
      res.send({status: 'no data'})
    }
  })
});

router.get('/presenter', function(req, res, next) {
  // name list
  var list_name = [
    '',
  ]

  // univ list
  var list_univ = [
    '',
  ]

  // title list
  var list_title = [
    ''
  ]

  // number list
  var list_num = [
    ''
  ]

  list = new Array()
  for(i = 0; i < list_name.length; i++) {
    list.push({
      id    : i,
      num   : list_num[i],
      univ  : list_univ[i],
      name  : list_name[i],
      title : list_title[i]
    })
  }

  if(req.session.login) {
    var voter = req.session.login;

    db.collection("voter").findOne({"email": voter}, (err, result) => {
      if(err) res.status(400).send({status: 'error', message: err});
      if(result.vote1 == null) {
        req.session.total_presenter_vote = 2
      } else if(result.vote2 == null) {
        req.session.total_presenter_vote = 1
      } else {
        req.session.total_presenter_vote = 0
      }

      res.render('presenter', { page: 'presenter', list: list, total: req.session.total_presenter_vote});
    })
  } else {
    res.render('login', { page: 'login'});
  }
})

router.post('/vote-presenter-new', function(req, res, next) {
  var id = req.body.data_id;
  var name = req.body.data_name;
  var voter = req.session.login;

  db.collection("voter").findOne({"email": voter}, (err, result) => {
    if(err) res.status(400).send({status: 'error', message: err});
    if(result.vote1 == null) {
      var data = {
        vote1  : name
      }

      db.collection("voter").findOneAndUpdate({"email": voter}, {$set: data}, (err1, result1) => {
        if(err1) res.status(400).send({status: 'error', message: err1});
        req.session.total_presenter_vote = 1;
        res.send({status: 'ok', vote: 1})
      })
    } else if(result.vote2 == null) {
      var data = {
        vote2  : name
      }

      db.collection("voter").findOne({"email": voter, "vote1": name}, (err1, result1) => {
        if(err1) res.status(400).send({status: 'error', message: err1});
        if(result1) {
          res.send({status: 'same', vote: 1})
        } else {
          db.collection("voter").findOneAndUpdate({"email": voter}, {$set: data}, (err, result) => {
            if(err) res.status(400).send({status: 'error', message: err});
            req.session.total_presenter_vote = 0;
            req.session.vote = 1
            res.send({status: 'ok', vote: 2})
          })
        }
      })
    }
  })
});

router.get('/revote-presenter-new', function(req, res, next) {
  var voter = req.session.login;

  var data = {
    vote1: null,
    vote2: null
  }

  db.collection("voter").findOneAndUpdate({"email": voter}, {$set: data}, (err1, result1) => {
    if(err1) res.status(400).send({status: 'error', message: err1});
    req.session.total_presenter_vote = 2;
    res.send({status: 'ok', vote: 1})
  })
})

router.get('/questioner', function(req, res, next) {
  // name list
  var list_name = [
    '',
  ]

  // univ list
  var list_univ = [
    '',
  ]

  list = new Array()
  for(i = 0; i < list_name.length; i++) {
    list.push({
      id    : i,
      name  : list_name[i],
      univ  : list_univ[i]
    })
  }
  
  if(req.session.login) {
    var voter = req.session.login;

    db.collection("voter").findOne({"email": voter}, (err, result) => {
      if(err) res.status(400).send({status: 'error', message: err});
      if(result.vote3 == null) {
        req.session.total_questioner_vote = 2
      } else if(result.vote4 == null) {
        req.session.total_questioner_vote = 1
      } else {
        req.session.total_questioner_vote = 0
      }

      res.render('questioner', { page: 'questioner', list: list, total: req.session.total_questioner_vote});
    })
  } else {
    res.render('login', { page: 'login'});
  }
})

router.post('/vote-questioner-new', function(req, res, next) {
  var id = req.body.data_id;
  var name = req.body.data_name;
  var voter = req.session.login;

  db.collection("voter").findOne({"email": voter}, (err, result) => {
    if(err) res.status(400).send({status: 'error', message: err});
    if(result.vote3 == null) {
      var data = {
        vote3  : name
      }

      db.collection("voter").findOneAndUpdate({"email": voter}, {$set: data}, (err1, result1) => {
        if(err1) res.status(400).send({status: 'error', message: err1});
        req.session.total_questioner_vote = 1;
        res.send({status: 'ok', vote: 1})
      })
    } else if(result.vote4 == null) {
      var data = {
        vote4  : name
      }

      db.collection("voter").findOne({"email": voter, "vote3": name}, (err1, result1) => {
        if(err1) res.status(400).send({status: 'error', message: err1});
        if(result1) {
          res.send({status: 'same', vote: 1})
        } else {
          db.collection("voter").findOneAndUpdate({"email": voter}, {$set: data}, (err, result) => {
            if(err) res.status(400).send({status: 'error', message: err});
            req.session.total_questioner_vote = 0;
            req.session.vote = 2
            res.send({status: 'ok', vote: 2})
          })
        }
      })
    }
  })
});

router.get('/revote-questioner-new', function(req, res, next) {
  var voter = req.session.login;

  var data = {
    vote3: null,
    vote4: null
  }

  db.collection("voter").findOneAndUpdate({"email": voter}, {$set: data}, (err1, result1) => {
    if(err1) res.status(400).send({status: 'error', message: err1});
    req.session.total_questioner_vote = 2;
    res.send({status: 'ok', vote: 1})
  })
})

router.get('/presenter-result', function(req, res, next) {
  db.collection("voter").aggregate([{$group: {_id: "$vote1", count: {$sum: 1}}}, {$sort: {count: -1}}]).toArray((err, result) => {
    if(err) res.status(400).send({status: 'error', message: err});
    db.collection("voter").aggregate([{$group: {_id: "$vote2", count: {$sum: 1}}}, {$sort: {count: -1}}]).toArray((err1, result1) => {
      if(err1) res.status(400).send({status: 'error', message: err1});
      var data1 = result;
      var data2 = result1;
      
      const qwe = Object.values([...data1, ...data2].reduce((acc, { _id, count }) => {
        acc[_id] = { _id, count: (acc[_id] ? acc[_id].count : 0) + count  };
        return acc;
      }, {}));

      asd = []
      asd_null = []
      qwe.forEach((element, index) => {
        if(element._id == null) {
          asd_null.push({
            _id   : 'Not Vote',
            count : element.count
          })
        } else {
          asd.push({
            _id   : element._id,
            count : element.count
          })
        }
      });

      asd.sort(function (a, b) {
        return b.count - a.count;
      });
      
      res.render('presenter-result', { page: 'presult', list: asd, novote: asd_null});
    })
  })
})

router.get('/questioner-result', function(req, res, next) {
  db.collection("voter").aggregate([{$group: {_id: "$vote3", count: {$sum: 1}}}, {$sort: {count: -1}}]).toArray((err, result) => {
    if(err) res.status(400).send({status: 'error', message: err});
    db.collection("voter").aggregate([{$group: {_id: "$vote4", count: {$sum: 1}}}, {$sort: {count: -1}}]).toArray((err1, result1) => {
      if(err1) res.status(400).send({status: 'error', message: err1});
      var data1 = result;
      var data2 = result1;
      
      const qwe = Object.values([...data1, ...data2].reduce((acc, { _id, count }) => {
        acc[_id] = { _id, count: (acc[_id] ? acc[_id].count : 0) + count  };
        return acc;
      }, {}));

      asd = []
      asd_null = []
      qwe.forEach((element, index) => {
        if(element._id == null) {
          asd_null.push({
            _id   : 'Not Vote',
            count : element.count
          })
        } else {
          asd.push({
            _id   : element._id,
            count : element.count
          })
        }
      });

      asd.sort(function (a, b) {
        return b.count - a.count;
      });
      
      res.render('presenter-result', { page: 'presult', list: asd, novote: asd_null});
    })
  })
})

module.exports = router;
