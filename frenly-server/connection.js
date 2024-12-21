const express = require('express');
const http = require('http');
const multer = require('multer');
const jwt  = require('jsonwebtoken');
const cors = require('cors');
const { Client } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

// environment variables
const port = process.env.PORT;
const address = process.env.ADDRESS;
const secretKey = process.env.JWT_SECRET_KEY;

// start a connection to postgresql server
const client = new Client({
    user:process.env.DBUSER,
    password:process.env.PASSWORD,
    host:process.env.HOST,
    port:5432,
    database:process.env.DATABASE,
    ssl: {
        rejectUnauthorized: false,
    },
});

client.connect().then(()=>{
        console.log('connected');
    }).catch(e=>{
        console.log('Error connecting the database: ',e.message);
});

// define storage for uploading files
const storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,'uploads/post-files/');
    },
    filename:function(req,file,cb){
        var post = req.body.post;
        var date = Date.now();
        if(file){
          //rename the file to avoid conflict
          cb(null,post.username+'-'+date.toString()+'.'+file.originalname.split('.')[1]);
        }
    }
});

const upload = multer({storage: storage});

const app = express(); //initialize express app

//define cors functionality
var corsOptions = {
    methods : ['GET','POST'],
    credentials:true,
    optionsSuccessStatus:200
};

// defining app middlewares
app.use('/post-images',express.static('uploads/post-images')); // server static files from '/post-images/'
app.use('/post-files',express.static('uploads/post-files')); // server static files from '/post-files/'
app.use('/profile',express.static('uploads/profile')); // server static files from '/profile/'
app.use(express.json());// to parse incoming data to json making the data available in the req
app.use(express.urlencoded({extended:true})); // enable url encoding for form data parsing
app.use(cors(corsOptions));//enable cors

app.options('*',cors()); // enabled cors for all routes
const server = http.createServer(app); // can be user for websockets

//root path
app.get('/',async function(req,res){
    res.send('<h2>Hello to express</h2>');
});

//health 
app.get('/health',async function(req,res){
    res.send('<h2>App is running</h2>');
});

// login api
app.post('/api/v1/login',function(req,res){
    const {username,password} = req.body;
    client.query(`SELECT id,first_name,last_name,username FROM users WHERE username='${username}';`, (err,user)=>{
        if(err){
            res.status(500).json({
                'status':false,
                'data':null,
                'error':err.message,
                'message':'Database error in logging in'
            });
        }else if(user?.rows){
            client.query(`SELECT * FROM posts WHERE author_id=${user.rows[0].id};`,(err,posts)=>{
                if(err){
                    res.status(200).json({
                        'status':true,
                        'data':user.rows[0],
                        'error':err,
                        'message':'Database error in fetching posts'
                    });
                }else{
                    res.status(200).json({
                        'status':true,
                        'data':user.rows[0],
                        'posts':posts.rows,
                    });
                }
            });
        }
    });
});

// registration API
app.post('/api/v1/signup',function (req,res) {
    const formdata = req.body;
    client.query(`SELECT username FROM users WHERE username='${formdata.username}';`,(err,result)=>{
        if(err){
            res.status(500).json({
                'status':false,
                'data':null,
                'error':err,
                'message':'Database error'
            });
        }else {
            if(result?.rows.length > 0){
                res.status(200).json({
                    'status':false,
                    'data':null,
                    'message':'Username already exists'
                });
            }else{
                client.query(`INSERT INTO users(first_name,last_name,username,password) VALUES('${formdata.first_name || ''}','${formdata.last_name || ''}','${formdata.username}','${formdata.password}')`,async(err,result)=>{
                    if(err){
                        res.status(500).json({
                            'status':false,
                            'data':null,
                            'error':err,
                            'message':'Database error'
                        });
                    }else{
                        if(result?.rows.length==0){
                            res.status(200).json({
                                'status':true,
                                'data':formdata,
                                'posts':[],
                                'message':'Registered successfully'
                            });
                        }
                    }
                });
            }
        }
    });
    
});

//update user details
app.post('/api/v1/update-details',(req,res)=>{
    const formdata = req.body;
    const {username} = formdata;
    client.query(``,(err,result)=>{
        if(err){
            res.status(500).json({
                'status':false,
                'data':null,
                'error':err.message,
                'message':'Database error'
            });
        }else{
            res.status(200).json({
                'status':true,
                'data':user,
                'message':'Updated successfully'
            });
                
        }
    });
});

// getposts by logged in user
app.post('/api/v1/refresh-profile',(req,res)=>{
    const {user_id} = req.body;
    client.query(`SELECT id,username,first_name,last_name FROM users WHERE id=${user_id};`,(err,user)=>{
        if(err){
            res.status(500).json({
                'status':false,
                'data':null,
                'error':err,
                'message':'Database error in fetching user data'
            });
        }else{
            client.query(`SELECT * FROM posts WHERE author_id=${user_id};`,(err,posts)=>{
                if(err){
                    res.status(500).json({
                        'status':false,
                        'data':null,
                        'error':err,
                        'message':'Database error in fetching posts'
                    });
                }else{
                    res.status(200).json({
                        'status':true,
                        'data':user.rows[0],
                        'posts':posts.rows,
                    });
                }
            });
        }
    });
    
});
//SELECT u.id,u.username,u.first_name,u.last_name, p.* FROM users u LEFT JOIN posts p ON u.id=p.author_id WHERE u.id=${user_id};
// create post api
app.post('/api/v1/create-post',upload.any('post_content'),(req,res)=>{
    const post = req.body.post;
    post.post_content = req.files.map((file)=>{return '/post-files/'+file.filename});
    const sqlquery = `
        INSERT INTO posts(author_id,post_content,caption,hashtags,location,created_at) 
        VALUES($1, $2, $3, $4, $5, $6);`;
        const values = [
            post.user_id,
            req.files.map((f)=>{return `/post-files/${f.filename.toString()}`}),
            post.caption,
            post.hashtags.map((h)=>{return h}),
            post.location,
            post.time,
        ]
    client.query(sqlquery,values,(err,result)=>{
        if(err){
            res.status(500).json({
                'status':false,
                'data':null,
                'error':err,
                'message':'Database error'
            });
        }else{
            if(result?.rows){
                res.status(200).json({
                    'status':true,
                    'data':result.rows,
                    'message':'Post Created successfully'
                });
            }
        }
    });
});

// api to add a like to a post
app.post('/api/v1/like-post',(req,res)=>{
    const {post_id,user_id,like} = req.body.data;
    if(like===true){
        client.query(`INSERT INTO likes(post_id,user_id) VALUES(${post_id,user_id});`,(err,result)=>{
            if(err){
                res.status(500).json({
                    'status':false,
                    'error':err,
                    'message':'Database error'
                });
            }else{
                res.status(500).json({
                    'status':true,
                    'data':null,
                });
            }
        });
    }else if(like===false){
        client.query(`DELETE FROM likes WHERE post_id=${post_id} AND user_id=${user_id});`,(err,result)=>{
            if(err){
                res.status(500).json({
                    'status':false,
                    'error':err,
                    'message':'Database error'
                });
            }else{
                res.status(500).json({
                    'status':true,
                    'data':null,
                });
            }
        });
    }
});

// api to add a like to a post
app.post('/api/v1/comment-post',(req,res)=>{
    const {post_id,user_id,comment} = req.body.data;
    client.query(`INSERT INTO comments(post_id,user_id,comment) VALUES(${post_id,user_id,comment});`,(err,result)=>{
        if(err){
            res.status(500).json({
                'status':false,
                'error':err,
                'message':'Database error'
            });
        }else{
            res.status(500).json({
                'status':true,
                'data':null,
            });
        }
    });
});

// to get posts on search based on search queries or for feeds based on user's preferences
// search: 'any array of string', category: 'post' / 'account' / 'videos' / 'tags
app.post('/api/v1/search',(req,res)=>{
    const {search,category} = req.body;
    client.query(`SELECT u.id,u.username,u.first_name,u.last_name, p.* FROM users u LEFT JOIN posts p ON u.id=p.author_id WHERE u.username='${search}';`,(err,result)=>{
        if(err){
            res.status(500).json({
                'status':false,
                'error':err,
                'message':'Database error'
            });
        }else{
            res.status(200).json({
                'status':true,
                'data':{
                    'posts':result.rows,
                    'accounts':[]
                },
            });
        }
    });
    // mongo.then(async(db)=>{
    //     var posts = posts = await db.collection('posts').find({$text:{$search:search.join(" ")}}).toArray();
    //     var accounts = accounts = await db.collection('users').find({$text:{$search:search.join(" ")}},{projection:{username:1,_id:1}}).toArray();
    //     var result = {posts:posts,accounts:accounts};
    //     if(result.posts.length || result.accounts.length){
    //         res.status(200).json({
    //             'status':true,
    //             'data':result,
    //             'message':'success'
    //         });
    //     }else{
    //         res.status(200).json({
    //             'status':false,
    //             'data':null,
    //             'message':'Unable to fetch posts'
    //         });
    //     }
    // }).catch(e=>{
    //     console.log('Error fetching posts: ',e.message);
    //     res.status(500).json({
    //         'status':false,
    //         'message':e.message
    //     });
    // });
});

//searches users to tag into while creating new posts
app.post('/api/v1/find-tags',(req,res)=>{
    const re = new RegExp(req.body.search);
    client.query(`SELECT id,username,first_name,last_name FROM users WHERE username ~* '.*${req.body.search}.*' OR first_name ~* '.*${req.body.search}.*' OR last_name ~* '.*${req.body.search}.*';`,(err,result)=>{
        if(err){
            res.status(500).json({
                'status':false,
                'data':null,
                'error':err.message,
                'message':'Database error'
            });
        }else{
            res.status(200).json({
                'status':true,
                'data':result.rows,
                'message':'success'
            });
        }
    });
});

// to fetch user deatils 
app.get('/api/v1/get-user/:username',(req,res)=>{
    client.query(`SELECT u.id,u.username,u.first_name,u.last_name, p.* FROM users u LEFT JOIN posts p ON u.id=p.author_id WHERE u.username='${req.params.username}';`,(err,result)=>{
        if(err){
            res.status(500).json({
                'status':false,
                'data':null,
                'error':err.message,
                'message':'Database error'
            });
        }else{
            var userdata = result.rows[0];
            res.status(200).json({
                'status':true,
                'data':{id:userdata.id,first_name:userdata.first_name,last_name:userdata.last_name,username:userdata.username},
                'posts':result.rows,
                'message':'success'
            });
        }
    });
});

//to get contacts or friends
app.post('/api/v1/get-contacts',(req,res)=>{
    client.query(`SELECT id,username,first_name,last_name FROM users;`,(err,result)=>{
        if(err){
            res.status(500).json({
                'status':false,
                'data':null,
                'error':err.message,
                'message':'Database error'
            });
        }else{
            res.status(200).json({
                'status':true,
                'data':result.rows,
                'message':'success'
            });
        }
    });
});


// to find users
app.get('/api/v1/find-users/:next', function(req,res){
    client.query(`SELECT id,username,first_name,last_name FROM users LIMIT 10 OFFSET ${req.params.next};`,(err,result)=>{
        if(err){
            res.status(500).json({
                'status':false,
                'data':null,
                'error':err.message,
                'message':'Database error'
            });
        }else{
            res.status(200).json({
                'status':true,
                'data':result.rows,
                'message':'success'
            });
        }
    });
});

app.listen(port,address,function(){
    console.log(`Server listening at http://${address}:${port}`);
});