/*global chrome*/
import React, { Component } from 'react';
const AppPopup = () => {

  const goSolarity = () => {
    chrome.tabs.create({active: true, url: "https://solarity-frontend.vercel.app/iframe/connect"});
  }

  const goTwitter = () => {
    chrome.tabs.create({active: true, url: "https://twitter.com/"});
  }

  return (
    <div style={{minWidth: "350px", minHeight: "550px", backgroundColor: "#25282C"}}>
      <div
        style={{display: "flex", alignItems: "center", justifyContent: "center", paddingTop: "12px", paddingBottom: "12px", borderBottom: "1px solid #6f6f6f"}}
      >
        <div style={{color: "#e2e2e2", fontSize: "20px"}}>
          Solarity Extension
        </div>
      </div>
      <div>
        <div style={{display: "flex", justifyContent: "center", paddingTop: "80px"}}>
          <img src={"/first.png"} width={100} height={100}/>
        </div>
        <div style={{color: "#f2f2f2", textAlign: "center", fontSize: "25px", paddingTop: "20px"}}>
          Metaverse Windows
        </div>
        <div style={{paddingTop: "50px", justifyContent: "center", display: "flex"}}>
          <div style={{color: "#e2e2e2", display: "flex", fontSize: "15px", textAlign: "center"}}>Set up your room on your profile</div>
        </div>
        <div style={{paddingTop: "5px", paddingLeft: "20px", paddingRight: "20px"}}>
          <button onClick={goTwitter} style={{fontSize: "16px", fontWeight: "bold", borderRadius: "10px", borderWidth: "0px", color: "#3f3f3f", backgroundColor: "#e3e3e3", padding: "10px", width: "100%", cursor: "pointer"}}>Go to Twitter</button>
        </div>
        <div style={{padding: "20px"}}>
          <div style={{color: "#f2f2f2", textAlign: "center", fontSize: "15px", marginBottom: "5px"}}>
            Or go to our app
          </div>
          <button onClick={goSolarity} style={{fontSize: "16px", fontWeight: "bold", borderRadius: "10px", borderWidth: "0px", backgroundColor: "#6163ff", padding: "10px", width: "100%", color: "#f3f3f3", cursor: "pointer"}}>Go to Solarity</button>
        </div>
      </div>
    </div>
  );
}

export default AppPopup;