import React,{useEffect} from 'react'

const CreateMsg = ({content, id}) => {
    useEffect(() => {
    modify();
    var myDiv = document.getElementById("MsgCont");
            myDiv.scrollTop = myDiv.scrollHeight;
    }, [])
    
    const modify=()=>{
        var div=document.getElementById(id);
        const insertedImage = div.querySelectorAll('img');
        if(insertedImage)
        {
            for(var i=0;i<insertedImage.length;i++)
            {
                var image=insertedImage[i];
                image.onclick=download;
            }
        }
        const link = div.querySelectorAll('a');
        if(link[0]){
        const url=link[0].href;
        console.log(url);
        if (url !== '') {
            const linkId="preview"+id;
            const previewContainer = document.getElementById(linkId);
            previewContainer.innerHTML = `<iframe src="${url}" style="width: 50vw"></iframe>`;
          }
        }
    }
    function download(e){
        e.preventDefault();
        console.log("Clicked");
        var link = document.createElement("a");
        console.log(e.target.src);
        if(e.target.alt){
          link.href = e.target.alt;
         link.download = "filename";
         link.style.display = "none"; 
         document.body.appendChild(link); 
         link.click(); 
         document.body.removeChild(link);
        }
        else{
          link.href = e.target.src;
         link.download = "filename";
         link.style.display = "none"; 
         document.body.appendChild(link); 
         link.click(); document.body.removeChild(link);
        }
      }
      
    
    return <div id={id} dangerouslySetInnerHTML={{ __html: content }}/>;
}

export default CreateMsg