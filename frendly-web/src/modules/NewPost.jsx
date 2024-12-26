import axios from "axios";
import { useContext, useEffect, useRef, useState } from "react";
import { apiurl } from "../components/assets";
import { useSelector } from "react-redux";
import { AppContext } from "../Context";

export const NewPost = ({position}) => {
	const { user } = useSelector((state) => state.user);
	const {setIsloading } = useContext(AppContext);
	const fileInpup = useRef();
	const [files, setfiles] = useState([]);
	const [caption, setCaption] = useState("");
	const [location, setLocation] = useState("");
	const [searchpeople, setSearchPeople] = useState("");
	const [tags, setTags] = useState([]);
	const [searchresult, setSearchResult] = useState("");
	const [hashtags,setHashtags] = useState('');
	const [filestoSubmit,setFilestoSubmit] = useState();

	// handle files selection and preview them
	const handleFiles = (readfiles) => {
		if(readfiles.length>10){
			alert('Please select upto 10 files');
			return
		}
		
		const fileData = Object.values(readfiles).map(async (file, index) => {
			// since the FileReader() is an asynchronous function,
			// we need to wait untill it finishes the file conversion from File() to dataurl
			// hence the use of Promise is here
			return new Promise((resolve) => {
				var reader = new FileReader();
				reader.readAsDataURL(file);
				reader.onload = function () {
					if(file.size < 25000000){
						resolve({
							name: file.name,
							index: index,
							file: reader.result,
							type: file.type.split('/')[0],
						});
					}
				};
			});
		});
		// triggers the promise function
		Promise.all(fileData).then((res) => {
			setfiles([...files, ...res]);
			setFilestoSubmit(readfiles);
		});
	};

	// to delete an image from the selected images in preview
	const deleteImg = (index) => {
		var raw = files.filter((x, key) => {
			if (key !== index) {
				return x;
			}
			return null;
		});
		setfiles(raw);
	};

	// add people to tags
	const addtoTags = (user) => {
		setTags([...tags, user]);
		setSearchPeople("");
		setSearchResult([]);
	};

	// remove people from tags
	const removeTag = (index) => {
		var temp = tags.filter((x, key) => {
			if (index !== key) {
				return x;
			}
			return null;
		});
		setTags(temp);
	};

	// reset the form if user wants to start over
	const resetForm = ()=>{
		setfiles([]);
		setCaption("");
		setLocation("");
		setHashtags('');
		setSearchPeople("");
		setTags([]);
		setSearchResult("");
		setFilestoSubmit();
	}

	// create post modify details for the post
	const createPost = () => {
		if (files.length > 0) {
			
			if(user?.username){
				const post = {};
				setIsloading(true);
				post.caption = caption;
				post.hashtags = hashtags.length? hashtags.split(' ').map((key)=>{ if(key[0]!=='#') return '#'+key; else return key; }):[''];
				post.location = location;
				post.created_at = new Date().toDateString() + new Date().toLocaleDateString();
				post.comments = 0;
				post.likes = 0;
				post.profile_img = user.profile_img;
				post.username = user.username;
				post.user_id = user.id;
				post.tags = tags.map((key) => {return key.username;});
			
				// make an api request to create the post
				axios.post(apiurl + "create-post", { post: post,post_content:filestoSubmit },{headers:{'Content-Type': 'multipart/form-data'}}).then((res) => {
					setIsloading(false);
					if (res.data.status) {
						alert(res.data.message);
						resetForm();// resets the form after the post has been created successfully
					}
				}).catch((e) => {
					console.log(e.message);
					setIsloading(false);
				});
			}else{
				alert('Please Login or Signup');
			}
		} else {
			alert("Please add at least one file");
		}
	};

	// add debouncing effect to the search function while searching for tags
	useEffect(() => {
		const handleSearchPeople = setTimeout(() => {
			if (searchpeople) {
				axios.post(apiurl + "find-tags", { search: searchpeople })
					.then((res) => {
						if (res.data.status) {
							setSearchResult(res.data.data);
						}
					})
					.catch((e) => console.log("Error: ", e.message));
			}
		}, 1000);

		return () => {
			clearTimeout(handleSearchPeople);
		};
	}, [searchpeople]);

	return (
		<div id="add-post" className="container" style={{zIndex:'20',inset:'0 0 0 0',left:position['NewPost']}}>
			<div id="selected-images">
				{files.length > 0 ? (
					files.map((file, index) => {
						return (
							<div className="image" key={index} style={{}}>
								{file.type==='image'?
								<img src={file.file} alt=""></img>:
								file.type==='video'?
								<video src={file.file} controls></video>
								:null}
								<button className="delete-img-btn" onClick={() => deleteImg(index)}>
									<img src="assets/close.png" alt=""></img>
								</button>
							</div>
						);
					})
				) : (
					<label className="select-input">
						<img src="assets/plus.png" alt="" />
						<p>Add upto 10 files</p>
						<input type="file" className="file-select" accept="image/*,video/mp4" onChange={(e)=>{handleFiles(e.target.files);}} multiple ref={fileInpup}></input>
					</label>
				)}
			</div>
			{(files.length && (
				<div id="selected-carousel">
					{files.length > 0
						? files.map((file, index) => {
							return (
								<div className="image" key={index}>
									{file.type==='image'?
								<img src={file.file} alt=""></img>:
								file.type==='video'?
								<video src={file.file}></video>
								:null}
								</div>
							);
						}): null}
					<label className="add image select-input">
						<img src="assets/plus.png" alt=""></img>
						<input type="file" className="file-select" accept="image/*,video/*" onChange={(e) => {handleFiles(e.target.files);}} multiple ref={fileInpup}></input>
					</label>
				</div>
			)) ||null}

			<div className="post-details">
				<textarea id="" rows={5} value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="Enter Caption..."></textarea>
				<textarea id="" rows={3} value={hashtags} onChange={(e) => setHashtags(e.target.value)} placeholder="#hashtag #post #frendly"></textarea>
				<input type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Add a Location"></input>
				<div id="location-suggestions"></div>
			</div>
			<div className="post-details">
				<input type="text" placeholder="Tag people" value={searchpeople} onChange={(e) => setSearchPeople(e.target.value)}></input>
				<div id="tags-suggestions">
					{((searchpeople && searchresult?.length) &&
						searchresult.map((user, index) => {
							return (
								<div className="tag" key={index} onClick={() => addtoTags(user)}>
									<img src="assets/user.png" alt=""></img>
									<span>{user.username}</span>
								</div>
							);
						})) || null}
				</div>
				<div id="tagged-people">
					{(tags?.length &&
						tags.map((user, index) => {
							return (
								<div className="tag" key={index} onClick={() => removeTag(index)}>
									<img src="assets/user.png" alt=""></img>
									<span>{user.username}</span>
									<img src="assets/close.png" className="cancel-tags" alt=""></img>
								</div>
							);
						})) || null}
				</div>
			</div>

			<div id="create-post-btn">
				<button onClick={() => createPost()}>Create Post</button>
			</div>
		</div>
	);
};

