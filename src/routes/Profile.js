import { updateProfile } from "@firebase/auth";
import { collection, getDocs, orderBy, query, where } from "@firebase/firestore";
import { authService, dbService } from "myBase";
import React, { useEffect, useState } from "react";
import {useHistory} from "react-router-dom";

const Profile = ({ userObj,refreshUser }) =>{
    const history = useHistory();
    const [newDisplayName,setNewDispalyname]= useState(userObj.displayName);
    const onLogOutClick = () => {
        authService.signOut()
        history.push("/")
        refreshUser();
    };
    const getMyNweets = async() =>{
        const nweets = await getDocs(
            query(
                collection(dbService,"nweets"),
                where("createorId","==",userObj.uid),
                orderBy("createdAt","desc")
            )
        )
        console.log(nweets.docs.map((d)=>d.data()));
        
    };
    useEffect(()=>{
        getMyNweets();
    },[]);
    const onChange = (event) => {
        const {
            target:{value},
        }=event;
        setNewDispalyname(value);
    };
    const onSubmit = async(event) => {
        event.preventDefault()
        if(userObj.displayName !== newDisplayName){
            await updateProfile(await authService.currentUser,{
                displayName: newDisplayName
            });
            refreshUser();
        }
    } 
    return (
        <div className="container">
            <form onSubmit={onSubmit} className="profileForm">
                <input
                    type="text"
                    placeholder="Display name"
                    value={newDisplayName}
                    autoFocus
                    onChange={onChange}
                    className="formInput"
                />
                <input
                    type="submit"
                    value="Update Profile"
                    className="formBtn"
                    style={{
                        marginTop: 10,
                    }}
                />
            </form>
            <span className="formBtn cancelBtn logOut" onClick={onLogOutClick}>
                Log Out
            </span>
        </div>
    );
};


export default Profile;