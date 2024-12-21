
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
        console.log('connection');
    }).catch(e=>{
        console.log('Error connecting the database: ',e.message);
});
client.query(`
	CREATE TABLE likes(
		id SERIAL PRIMARY KEY,
		post_id INT NOT NULL,
		user_id INT NOT NULL,
		created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
		CONSTRAINT fk_post FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
		CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
		CONSTRAINT unique_post_user UNIQUE (post_id,user_id)
	);
	`,(err,result)=>{
		if(err){
			console.log(err.message);
		}else{
			console.log(result);
		}
		client.end();
	});
