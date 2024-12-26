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
        }else if(user.rows.length){
            client.query(`SELECT p.*,l.count AS like_count,u.first_name,u.last_name,u.username FROM posts p LEFT JOIN likes_count l ON p.id=l.post_id LEFT JOIN users u ON p.author_id=u.id WHERE author_id=${user.rows[0].id};`,(err,posts)=>{
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
        }else{
            res.status(200).json({
                'status':false,
                'message':'Incorrect Username'
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
                client.query(`INSERT INTO users(first_name,last_name,username,password) VALUES('${formdata.first_name}','${formdata.last_name}','${formdata.username}','${formdata.password}')`,async(err,result)=>{
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
                                'data':result.rows,
                                'message':'Registered successfully. Please login'
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
    client.query(`
        UPDATE users SET ${formdata.username? `username=${formdata.username},`: ''}
                         ${formdata.first_name? `first_name=${formdata.first_name},`:''}
                         ${formdata.last_name? `last_name=${formdata.last_name},`:''} 
                         ${formdata.password? `password=${formdata.password},`:''}
                         1=1 WHERE id=${formdata.id};
        `,(err,result)=>{
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
            client.query(`SELECT p.*,l.count AS like_count,u.first_name,u.last_name,u.username FROM posts p LEFT JOIN likes_count l ON p.id=l.post_id LEFT JOIN users u ON p.author_id=u.id WHERE author_id=${user_id};`,(err,posts)=>{
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
app.post('/api/v1/create-post',upload.any('post_content'),async(req,res)=>{
    const post = req.body.post;
    post.post_content = req.files.map((file)=>{return `/post-files/${file.filename.toString()}`});
    const values = [
        post.user_id,
        post.post_content,
        post.caption,
        post.hashtags?.map((h)=>{return h}),
        post.location
    ];
    await client.query('BEGIN;');
    const newPost = await client.query(`INSERT INTO posts(author_id,post_content,caption,hashtags,location) VALUES($1, $2, $3, $4, $5) RETURNING id;`,values);
    const post_id = newPost.rows[0].id;
    await client.query(`INSERT INTO likes_count (post_id,count) VALUES (${post_id}, 0);`);
    const result = await client.query('COMMIT;');
    if(result){
        res.status(200).json({
            'status':true,
            'message':'Post Created successfully'
        });
    }else{
        res.status(200).json({
            'status':false,
            'data':null,
            'message':'Server Error in creating post'
        });
    }
});

// from frontend if post is already liked
// >>> delete query in the likes table and update query in the posts table to decrement count
// from frontend if post is not liked
// >>> insert query with on conflict do nothing and update query in the posts table to increment count
// api to add a like to a post
app.post('/api/v1/like-post',async(req,res)=>{
    const {post_id,user_id,like} = req.body;
    if(like===true){
        //to like the post
        await client.query('BEGIN;');
        await client.query(`INSERT INTO likes(post_id,user_id) VALUES(${post_id},${user_id}) ON CONFLICT DO NOTHING;`);
        await client.query(`UPDATE posts SET like_count=like_count+1 WHERE id=${post_id};`);
        const result = await client.query('COMMIT;');
        if(result){
            res.status(200).json({
                'status':true,
                'data':null,
                'message':'liked'
            });
        }else{
            res.status(200).json({
                'status':false,
                'data':null,
                'message':'Error in liking post'
            });
        }
    }else if(like===false){
        // to unlike the post
        await client.query('BEGIN;');
        await client.query(`DELETE FROM likes WHERE post_id = ${post_id} AND user_id = ${user_id};`);
        await client.query(`UPDATE posts SET like_count=GREATEST(like_count-1,0) WHERE id=${post_id};`);
        const result = await client.query('COMMIT;');
        if(result){
            res.status(200).json({
                'status':true,
                'data':null,
                'message':'unliked'
            });
        }else{
            res.status(500).json({
                'status':false,
                'error':err.message,
                'message':'Database error'
            });
        }
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

//api for feed posts
app.post('/api/v1/feed-posts',(req,res)=>{
    const {preferences,user_id} = req.body;
    client.query(`
                SELECT u.id,u.username, 
                        p.*,
                        l.user_id AS liked_acc_id
                FROM posts p
                INNER JOIN users u ON u.id=p.author_id
                LEFT JOIN likes l ON p.id=l.post_id AND l.user_id=${user_id} 
                ORDER BY p.created_at DESC;
                `,(err,result)=>{
        if(err){
            res.status(500).json({
                'status':false,
                'error':err.message,
                'message':'Database error'
            });
        }else{
            res.status(200).json({
                'status':true,
                'data':result.rows
            });
        }
    });
});

// WHERE p.created_at >= NOW() - INTERVAL '2 days'
// to get posts on search based on search queries or for feeds based on user's preferences
// search: 'any array of string', category: 'post' / 'account' / 'videos' / 'tags
app.post('/api/v1/search',(req,res)=>{
    const {search} = req.body;
    // client.query(`SELECT u.id,u.username,u.first_name,u.last_name, p.* FROM users u LEFT JOIN posts p ON u.id=p.author_id WHERE p.caption ~* '.*${preferences}.*';`,(err,result)=>{
    client.query(`SELECT u.id,u.username, p.*,l.count AS like_count FROM posts p INNER JOIN users u ON u.id=p.author_id LEFT JOIN likes_count l ON p.id=l.post_id WHERE u.username='${search}' OR p.caption ~* '.*${search}.*';`,(err,posts)=>{
        if(err){
            res.status(500).json({
                'status':false,
                'error':err,
                'message':'Database error'
            });
        }else{
            client.query(`SELECT id,username,first_name,last_name FROM users WHERE username ~* '.*${search}.*';`,(err,accounts)=>{
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
                            'posts':posts.rows,
                            'accounts':accounts.rows
                        },
                    });
                }
            });
        }
    });
});

//searches users to tag into while creating new posts
app.post('/api/v1/find-tags',(req,res)=>{
    const {search} = req.body;
    const values = [`.*${search}.*`,`.*${search}.*`,`.*${search}.*`];
    client.query(`SELECT id,username,first_name,last_name FROM users WHERE username ~* $1 OR first_name ~* $2 OR last_name ~* $3;`,values,(err,result)=>{
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
    client.query(`SELECT u.id,u.username,u.first_name,u.last_name, p.*, l.count AS like_count FROM users u LEFT JOIN posts p ON u.id=p.author_id LEFT JOIN likes_count l ON p.id=l.post_id WHERE u.username='${req.params.username}';`,(err,result)=>{
        if(err){
            res.status(500).json({
                'status':false,
                'data':null,
                'error':err.message,
                'message':'Database error'
            });
        }else if(result.rows.length){
            var {id,first_name,last_name,username} = result.rows[0];
            res.status(200).json({
                'status':true,
                'data':{id,first_name,last_name,username},
                'posts':result.rows[0].author_id? result.rows:[],
                'message':'success'
            });
        }
    });
});

//to get contacts or friends
app.post('/api/v1/get-contacts',(req,res)=>{
    client.query(`SELECT id,username,first_name|| ' ' || last_name AS name FROM users;`,(err,result)=>{
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

//api for change password
app.post('/api/v1/change-password',(req,res)=>{
    client.query(`SELECT id,username,password FROM users WHERE username='${req.body.username}';`,(err,user)=>{
        if(err){
            res.status(500).json({
                'status':false,
                'data':null,
                'error':err.message,
                'message':'Database error'
            });
        }else{
            if(user.rows.length==1){
                const {id,username,password} = user.rows[0];
                if(req.body.oldPass == password){
                    client.query(`UPDATE users SET password=${req.body.newPass} WHERE id=${id};`,(err,result)=>{
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
                                'data':null,
                                'message':'Password updated successfully'
                            });
                        }
                    });
                }else{
                    res.status(200).json({
                        'status':false,
                        'data':null,
                        'message':'Incorrect old Password.'
                    });
                }
            }
        }
    })
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