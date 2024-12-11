import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { apiurl } from "../components/assets";

export const NewPost = () => {
  const fileInpup = useRef();
  const [files, setfiles] = useState([]);
  const [caption,setCaption] = useState('');
  const [location,setLocation] = useState('');
  const [searchpeople,setSearchPeople] = useState('');
  const [tags,setTags] = useState([]);
  const [searchresult,setSearchResult] = useState('');


  // handle files selection and preview them 
  const handleFiles = (readfiles) => {    
	const fileData = Object.values(readfiles).map(async (file, index) => {
		// since the FileReader() is an asynchronous function, 
		// we need to wait untill it finishes the file conversion from File() to dataurl
		// hence the use of Promise is here
		return new Promise((resolve)=>{
			var reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = function(){
				resolve({ name: file.name, index: index, file: reader.result,type:file.type });
			}
		});
    });
	// triggers the promise function 
	Promise.all(fileData).then((res)=>{
		setfiles([...files,...res]);
	});
  };

  // to delete an image from the selected images in preview
  const deleteImg = (index) => {
    var raw = files.filter((x, key) => {
      if (key !== index) {
        return x;
      }
	  return null
    });
    setfiles(raw);
  };

  const addtoTags = (user)=>{
	setTags([...tags,user]);
	setSearchPeople('');
	setSearchResult([]);
  }

  const removeTag = (index)=>{
	var temp = tags.filter((x,key)=>{
		if(index!==key){
			return x
		}
		return null;
	});
	setTags(temp);
  }

	const createPost = ()=>{
		const post = {};
		if(files.length>0){
			post.files = files;
			post.caption = caption;
			post.location = location;
			post.tags = tags.map((key)=>{
				return {'username':key.username,'_id':key._id};
			});
		}else{
			alert('Please add at least one file');
		}
		console.log(post);
	};



  // add debouncing effect to the search function while searching for tags
  useEffect(()=>{
	const handleSearchPeople = setTimeout(()=>{
		if(searchpeople){
			axios.post(apiurl+'find-tags',{search:searchpeople}).then((res)=>{
				if(res.data.status){
					setSearchResult(res.data.users);
				}
			}).catch(e=>console.log('Error: ',e.message));
		}
	},2000);

	return ()=>{
		clearTimeout(handleSearchPeople);
	}
  },[searchpeople]);

  // opens a file selector when we navigate to the add post page
  useEffect(() => {
    // fileInpup.current.click();
  });

  return (
    <section id="add-post">
		<div id="selected-images">
			{files.length > 0
			? files.map((file, index) => {
				return (
					<div className="image" key={index} style={{}}>
						{

						}
					<img src={file.file} alt=""></img>
					<button
						className="delete-img-btn"
						onClick={() => deleteImg(index)}>
						<img src="assets/close.png" alt=""></img>
					</button>
					</div>
				);
				})
			: 	<label className="select-input">
					<img src="assets/plus.png" alt="" />
					<p>Add images</p>
					<input type="file" className="file-select" accept="image/*,video/*" onChange={(e)=>{handleFiles(e.target.files);}} multiple ref={fileInpup}></input>
				</label>}
		</div>
		{(files.length && <div id="selected-carousel">
		{files.length > 0
			? files.map((file, index) => {
				return (
				<div className="image" key={index}>
					<img src={file.file} alt=""></img>
				</div>
				);
			}): null
		}
		<label className="add image select-input">
			<img src="assets/plus.png" alt="" ></img>
			<input type="file" className="file-select" accept="image/*,video/*" onChange={(e)=>{handleFiles(e.target.files);}} multiple ref={fileInpup}></input>
		</label>
		</div>) || null}
		
		<div className="post-details">
			<textarea id="" rows={5} value={caption} onChange={(e)=>setCaption(e.target.value)} placeholder="Enter Caption..."></textarea>
			<input type="text" value={location} onChange={(e)=>setLocation(e.target.value)} placeholder="Add a Location"></input>
			<div id="location-suggestions"></div>
		</div>
		<div className="post-details">
			<input type="text" placeholder="Tag people" value={searchpeople} onChange={(e)=>setSearchPeople(e.target.value)}></input>
			<div id="tags-suggestions">{(searchresult.length && searchresult.map((user,index)=>{
				return(
					<div className="tag" key={index} onClick={()=>addtoTags(user)}>
						<img src="assets/user.png" alt="" ></img>
						<span>{user.username}</span>
					</div>
				)
				})) || null}
			</div>
			<div id="tagged-people">{(tags?.length && tags.map((user,index)=>{
				return(
					<div className="tag" key={index} onClick={()=>removeTag(index)}>
						<img src="assets/user.png" alt="" ></img>
						<span>{user.username}</span>
						<img src="assets/close.png" className="cancel-tags" alt=""></img>
					</div>
				)
				})) || null}
			</div>
		</div>

		<div id="create-post-btn">
			<button onClick={()=>createPost()}>Create Post</button>
		</div>
		
      
    </section>
  );
};



