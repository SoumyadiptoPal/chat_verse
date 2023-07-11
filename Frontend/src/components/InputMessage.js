import React, { useState, useContext, useEffect, useRef } from "react";
import ChatContext from "../context/ChatContext";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import EmojiPicker from "emoji-picker-react";
import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon";
import SendIcon from "@mui/icons-material/Send";
import { storage } from "./firebase.js";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { Modal, Box } from "@mui/material";
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";
import AddIcon from "@mui/icons-material/Add";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const InputMessage = () => {
  const context = useContext(ChatContext);
  const { sendMessages, selectedchat } = context;
  const [value, setValue] = useState();
  const [show, setShow] = useState(false);
  const [show2, setShow2] = useState(false);
  const quillRef = useRef(null);
  const [file, setFile] = useState(null);
  const [tagged,setTagged]=useState("");
  const [show3,setShow3]=useState(false);
  useEffect(() => {
    if (quillRef.current) {
      const quill = quillRef.current.getEditor();
      // Now you have the Quill editor instance, you can use it as needed
      quill.focus();
    }
  }, []);
  const [text, setText] = useState();
  const [progress, setProgress] = useState(0);

  const handleUpload = () => {
    const storageRef = ref(storage, `files/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const prog = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(prog);
      },
      (error) => {
        console.log(error.message);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
          ShowFile(downloadURL);
        });
        setProgress(0);
        setFile(null);
        setShow2(false);
      }
    );
  };

  function getFileType() {
    var filename = file.name;
    const imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp"];
    const videoExtensions = ["mp4", "avi", "mov", "wmv"];
    const documentExtensions = ["doc", "docx", "pdf", "txt"];

    const extension = filename.split(".").pop().toLowerCase();

    if (imageExtensions.includes(extension)) {
      return "image";
    } else if (videoExtensions.includes(extension)) {
      return "video";
    } else if (documentExtensions.includes(extension)) {
      return "document";
    } else {
      return "unknown";
    }
  }

  const ShowFile = async(url) => {
    const quill = quillRef.current.getEditor();
    const type = getFileType();
    var tl = quill.getLength();
    quill.insertText(tl, ` `);
    quill.setSelection(tl, tl);
    if (type === "image") {
      const htmlContent = `<p><img src=${url} alt=""/></p>`;
      const range = quill.getSelection();
      quill.clipboard.dangerouslyPasteHTML(range.index, htmlContent);
      const insertedImage = quill.root.querySelectorAll(
        'img[src="' + url + '"]'
      );
      if (insertedImage) {
        var Image = insertedImage[insertedImage.length - 1];
        Image.setAttribute(
          "style",
          "max-height: 40vh; object-fit: contain; max-width: 50vw;"
        );
      }
    } else if (type === "document") {
      var url2 = "images/docIcon.png";
      const htmlContent = `<p><img src="images/docIcon.png" alt="${url}"/></p>`;
      const range = quill.getSelection();
      quill.clipboard.dangerouslyPasteHTML(range.index, htmlContent);
      const insertedImage = quill.root.querySelectorAll(
        'img[src="' + url2 + '"]'
      );
      if (insertedImage) {
        var Image = insertedImage[insertedImage.length - 1];
        Image.setAttribute("style", "max-height: 8vh; object-fit: contain;");
        const tl = quill.getLength();
        quill.insertText(tl, `File Name: doc.pdf`);
        quill.setSelection(tl, tl);
      }
    } else if (type === "video") {
      const htmlContent = `<p><iframe src="${url}"/></p>`;
      const range = quill.getSelection();
      quill.clipboard.dangerouslyPasteHTML(range.index, htmlContent);
      const video = quill.root.querySelectorAll('iframe[src="' + url + '"]');
      if (video) {
        var vid = video[video.length - 1];
        vid.setAttribute(
          "style",
          "max-height: 40vh; object-fit: contain; max-width: 40vw;"
        );
      }
    }
    tl = quill.getLength();
    quill.insertText(tl, ` `);
    quill.setSelection(tl, tl);
  };
  const handleChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };
  const handleSubmit = () => {
    sendMessages(value);
    setValue(undefined);
  };

  const modules = {
    toolbar: [
      [
        "bold",
        "italic",
        "underline",
        "strike",
        "link",
        { list: "ordered" },
        { list: "bullet" },
        "blockquote",
        "code-block",
      ],
    ],
    clipboard: {
      matchVisual: false, // Disable visual matching
      cleanPastedHTML: false, // Disable HTML sanitization
    },
  };
  const onEmojiClick = (emojiObject, e) => {
    setShow(false);
    const quill = quillRef.current.getEditor();
    const tl = quill.getLength();
    quill.insertText(tl - 1, emojiObject.emoji);
    quill.setSelection(tl + 1, tl + 1);
  };

  const mention = (name) => {
    setShow3(false);
    const quill = quillRef.current.getEditor();
    var tl = quill.getLength();
  var text = '@'+name;
  var color = 'blue';
  quill.insertText(tl-1, text, 'color', color);
  tl = quill.getLength();
  var color='black'
  quill.insertText(tl-1, ' ', 'color', color);
  quill.setSelection(tl+1 , tl+1 );
  };
  return (
    <div>
      <div className="floatingContainer">
        {show && (
          <>
            <button onClick={() => setShow(!show)}>Close</button>
            <EmojiPicker onEmojiClick={onEmojiClick} />
          </>
        )}
      </div>
      <Modal
        open={show2}
        onClose={() => setShow2(!show2)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <input type="file" onChange={handleChange} />
          {progress > 0 && <progress value={progress} max="100" />}
          <button onClick={handleUpload} className="btn1">
            Upload
          </button>
        </Box>
      </Modal>
      {(selectedchat.users) && <Modal
            open={show3}
            onClose={()=>setShow3(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description">
              <Box sx={style}>
                <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
                  <img src='images/grpicon.jpg' style={{height:"80px", width:"80px", borderRadius:"50%"}}/>
                <h2>{selectedchat.chatName}</h2>
                <h3>Participants</h3>
                <div className="addGrp" style={{margin:"auto"}}>
                    {selectedchat.users.map((user)=>(
                        <div className='detail' onClick={()=>{mention(user.name)}}>
                            <div className='profileimg'>
                    <img src={user.pic}/>
                </div>
                <div style={{display:"flex",flexDirection:"column",justifyContent:"center"}}>
                  <div>{user.name}</div>
                  <div>{user.email}</div>
                  </div>
                        </div>
                    ))}
                </div>
                </div>
                </Box>
        </Modal>}
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={value}
        onChange={setValue}
        modules={modules}
      />

      <div style={{ position: "absolute", bottom: "2px" }}>
        <button className="ibtn" onClick={() => setShow(!show)}>
          <InsertEmoticonIcon />
        </button>
        <button
          className="ibtn"
          style={{ border: "1px solid black" }}
          onClick={()=>setShow3(true)}
        >
          <AlternateEmailIcon />
        </button>
        <button onClick={() => setShow2(!show2)}>
          <AddIcon />
        </button>
        <button
          onClick={handleSubmit}
          style={{ position: "fixed", bottom: "0px", right: "20px" }}
        >
          <SendIcon color="primary" />
        </button>
      </div>
    </div>
  );
};

export default InputMessage;
