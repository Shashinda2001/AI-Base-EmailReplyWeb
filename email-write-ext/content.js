console.log("Test log: Script is running successfully.");

function findComposeToolbar(){
  const selectors =[
    '.btC', // Gmail compose toolbar
    '.aDh', // Gmail compose toolbar
    '[role="toolbar"]', // General toolbar role
    '.gU.Up', // Gmail compose toolbar
  ];
    for (const selector of selectors) {
         
       
            const toolbar = document.querySelector(selector);
            if (toolbar) {
                console.log("Compose toolbar found:", selector);
                return toolbar;
            }  
            return null; // Return null if no toolbar is found
        
    }
}

function getEmailContent(){
    const selectors =[
  '.h7',
  '.a3s.aiL',
  '.gmail_quote',
  '[role="presentation"]'
    ];
      for (const selector of selectors) {
           const content = document.querySelector(selector);
           if (content) {
               console.log("Email content found:", selector);
               return content.innerText.trim();   
           }
           return ''; // Return empty string if no content is found
           
      }
  }

function createAIButton(){

    const button = document.createElement('div');
    button.className = 'T-I J-J5-Ji aoO v7 T-I-atl L3 ai-reply-button'; // Matches Send button
    button.style.marginRight = '8px'; // Space from the next button
    button.style.cursor = 'pointer';
     
    button.style.textAlign = 'center'; // Ensure centered text
    button.textContent = 'AI Reply';
    button.setAttribute('role', 'button');
    button.setAttribute('data-tooltip', 'Generate AI reply');
    return button;
}


function injectButton(){
    const existingButton = document.querySelector('.ai-reply-button');
    if (existingButton) existingButton.remove(); // Remove existing button if present

    const toolbar =findComposeToolbar();
    if (!toolbar){
console.log("Compose toolbar not found. Exiting script.");
        return;
    }  
    console.log("Compose toolbar found. Injecting button.");
    const button = createAIButton();
    button.classList.add('ai-reply-button');

    button.addEventListener('click', async () => {
        console.log("AI Reply button clicked.");
        try{
           button.innerHTML = `Generating...`;
           button.disabled=true; // Disable button during processing

           const emailContent = getEmailContent(); // Function to get email content
           const response = await fetch('http://localhost:8080/api/email/generate',{
                 method: 'POST',
                 headers: {
                     'Content-Type': 'application/json',
                 },
                    body: JSON.stringify( {
                        emailContent:emailContent,
                        tone:"professional",
                        type:""
                    
                    }),
           });
           if (!response.ok) {
               throw new Error('Network response was not ok');
           }
           const generatedReply= await response.text();
           const composeBox = document.querySelector('[role="textbox"][g_editable="true"]');
           if(composeBox){
            composeBox.focus(); // Focus on the compose box
            document.execCommand('insertText', false, generatedReply); // Insert the generated reply
           }else{
            
            console.error("Compose box not found. Cannot insert reply.");
           }


        }catch (error) {
            console.log(error);
            alert("Error in AI Reply button click handler");
        }
        finally{
            button.innerHTML = `AI Reply`;
            button.disabled=false; // Re-enable button after processing
        }
        // Add your AI reply logic here
    });
    toolbar.insertBefore(button, toolbar.firstChild); // Insert button at the beginning of the toolbar  
    
    

}

const observer = new MutationObserver((mutations) => { 
   for(const mutation of mutations) {
    const addedNodes = Array.from(mutation.addedNodes);
    const hasComposeElements = addedNodes.some(node =>
     node.nodeType === Node.ELEMENT_NODE &&
     (node.matches('.aDh, .btC,[role="dialog"]') || node.querySelector('.aDh, .btC,[role="dialog"]'))
    );

    if (hasComposeElements) {
      console.log("Compose elements detected. Running script...");
      setTimeout(injectButton, 500); // Delay to ensure elements are fully loaded
       
    }
   }
});

observer.observe(document.body, { childList: true, subtree: true });