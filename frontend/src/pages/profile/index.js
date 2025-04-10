import moment from "moment";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { uploadProfilePic } from "../../apiCalls/unser";
import {showLoader,  hideLoader} from './../../redux/loaderSlice';
import toast from 'react-hot-toast';
import { setUser } from "../../redux/userSlice";




function Profile(){

    const  {user } = useSelector(state => state.userReducer);
    const [image, setImage] = useState('');
    const dispatch = useDispatch();
    



    useEffect(() =>{
        if(user?.profilePic){
            setImage(user.profilePic);
        }
    },[user])

    function getInitials(){
        let f = user?.firstname.toUpperCase()[0];
        let l = user?.lastname.toUpperCase()[0];
        return f + l;
      }

      
      function getFullname(){
        let fname = user?.firstname.at(0).toUpperCase() + user?.firstname.slice(1).toLowerCase();
        let lname = user?.lastname.at(0).toUpperCase() + user?.lastname.slice(1).toLowerCase();
        return fname + " " + lname;
        
      }


    //   const onFileSelect  =async (e) =>{

    //     const file = e.target[0];
     
        
    //     const reader = new FileReader(file);

    //     console.log('file', reader)
    //     reader.readAsDataURL(file);

    //     reader.onloadend = async () => {
    //         setImage(reader.result);
    //     }

    //   }
    





    const onFileSelect = (event) => {
        const file = event.target.files[0]; // ✅ this gives you the first selected file
        if (file && file instanceof Blob) {
          const reader = new FileReader();
      
          reader.onloadend = () => {
            const base64 = reader.result;
            console.log("Base64 string", base64);
            setImage(base64);
            // You can now use this base64 for uploading or preview
          };
      
          reader.readAsDataURL(file); // ✅ safe now
        } else {
          console.error("No valid file selected");
        }
      };
      

      const updateProfilePic = async () =>{
        try{
          dispatch(showLoader());
          const response = await uploadProfilePic(image); 
          dispatch(hideLoader());
          if(response.success){
            toast.success(response.message);
            dispatch(setUser(response.data));
          }
          else{
            toast.error(response.message);
            
          }


        }
        catch(err){
          toast.error(err)
          dispatch(hideLoader());
        }
      
      }




      console.log("image", image)
    

    return(
        <div class="profile-page-container">
        <div class="profile-pic-container">
            {image && <img src={image} 
                 alt="Profile Pic" 
                 class="user-profile-pic-upload" 
            /> }
           {!image && <div class="user-default-profile-avatar">
               {getInitials()}
            </div>}
        </div>

        <div class="profile-info-container">
            <div class="user-profile-name">
                <h1>{getFullname()}</h1>
            </div>
            <div>
                <b>Email: </b>{user?.email}
            </div>
            <div>
                <b>Account Created: </b>{moment(user?.createdAt).format('MMM DD, YYYY')}
            </div>
            <div class="select-profile-pic-container">
                <input type="file" accept="image/*" onChange={onFileSelect}/>
                <button className="upload-image-btn" onClick={updateProfilePic}>Upload</button>
            </div>
        </div>
    </div>

    )
   
}
export default Profile;