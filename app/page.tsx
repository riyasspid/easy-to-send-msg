"use client"
import { useState } from "react";

type Messages = {
  text :string;
};

export default function Page(){
  const [messages, setMessages] = useState<Messages[]>([]);
  const [showMessage, setShowMessage] = useState<boolean>(false);
  const [clireq, setClireq] = useState<number>(1)
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";

  const sendMessage = async (e:any) => {
    e.preventDefault();
    const form = e.target
    const formData = new FormData(form);
    const message = formData.get("message")?.toString()
    if(!message){
      alert("Enter a message")
      return;
    }
    else{
      const response = await fetch(`${apiUrl}/send`,{
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify({
          text:message
        }),
      });
      const data = await response.json();
      alert(data.result);
      if(data.result == "success"){
        form.reset()
      }
    }
   }
   async function fetchMessage() {
    try{
    const response = await fetch(`${apiUrl}/fetch`,
      {
        method:"POST",
        headers: {
          "Content-Type" : "application/json"
        },
        body:JSON.stringify({
          "clireq":clireq
        })
      }
    )
    const data = await response.json(); 
    setMessages(data.messages)
    setShowMessage(true)
    }
    catch(err){
      alert(err);
    }
    
   }
  return(
    <div className="pt-10 w-full flex flex-col justify-items-center">
    <form onSubmit={sendMessage} className="grid grid-row justify-items-center gap-10">
      <textarea
      className="border rounded-xl p-2 w-100"
      name="message"
      placeholder="Enter your message"
      />
      <button
      className="bg-black text-white h-10 w-30 rounded-3xl hover:bg-black/70 transfrom transtion-all duration-200"  
      type="submit">submit</button>
    </form>
    <div className="flex">
    <div className="flex mx-auto place-items-center h-[100px] w-[200px]">
    <button
    className="bg-black mx-auto mt-5 text-white h-10 w-10 rounded-3xl hover:bg-black/70 transfrom transtion-all duration-200"
    onClick={() => setClireq(clireq+1)}>+</button>
    <div className="mx-auto bg-black text-center place-content-center text-white text-2xl mt-5 h-20 w-20 rounded-full"><p>{clireq}</p></div>
    <button
    className="bg-black mx-auto mt-5 text-white h-10 w-10 rounded-3xl hover:bg-black/70 transfrom transtion-all duration-200"
    onClick={() => {{if(clireq > 0){setClireq(clireq-1)}}}}>-</button>
    </div>
    </div>
    <button
    className="bg-black mx-auto mt-5 text-white h-10 w-50 rounded-3xl hover:bg-black/70 transfrom transtion-all duration-200"
    onClick={() => fetchMessage()}>Show all messages</button>
    {showMessage && messages.length>0 && (<div className="flex flex-col">
      {
        messages.map((msg,index)=>(
          <p className="mx-auto mt-5" key={index}>{msg.text}</p>
        ))
      }
    </div>)
    }
    </div>
  )
}