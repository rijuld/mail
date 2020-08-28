document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  load_mailbox('inbox');
//submit email
  document.querySelector('#compose-form').onsubmit = ()=>{
   
    const recipients= document.querySelector('#compose-recipients').value;
    const subject= document.querySelector('#compose-subject').value;
    const body= document.querySelector('#compose-body').value;
    //API POST for email
    
    fetch('/emails', {
  method: 'POST',
  body: JSON.stringify({
      recipients:recipients ,
      subject: subject,
      body: body
  })
})
.then(response => response.json())
.then(result => {

    // Print result
    console.log(result);
    load_mailbox('sent');


});
return false;
  }



  

  // By default, load the inbox
  
});




function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';
  document.querySelector('#x-view').style.display = 'none';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#x-view').style.display = 'none';
  if (mailbox==="inbox"){
       

  
          fetch('/emails/inbox')
          .then(response => response.json())
          .then(emails => {
              // Print emails
              console.log(emails);

              // ... do something else with emails ...
              emails.forEach((email)=> {
                  const element = document.createElement('div');
                  element.innerHTML = `From:${email.sender}    Subject:${email.subject}<br> Time:${email.timestamp}`;

                  element.addEventListener('click', function() {
                      console.log("This element has been clicked")
                      fetch(`/emails/${email.id}`, {
                        method: 'PUT',
                        body: JSON.stringify({
                            read: true
                        })
                      })


                      xview(email);




                  });
                  console.log(element)
                  if (email.read===true){
                  element.style.backgroundColor = "#E0E0E0";}
                  document.querySelector('#emails-view').appendChild(element);
              });

          });

    
  }

  if (mailbox==="archive"){
       

  
          fetch('/emails/archive')
          .then(response => response.json())
          .then(emails => {
              // Print emails
              console.log(emails);

              // ... do something else with emails ...
              emails.forEach((email)=> {
                
                  const element = document.createElement('div');
                  element.innerHTML = `From:${email.sender}   Subject:${email.subject}<br> Time:${email.timestamp}`;

                  element.addEventListener('click', function() {
                      console.log("This element has been clicked")
                      xview(email);

                  });
                  console.log(element)
                  document.querySelector('#emails-view').appendChild(element);
                


              });

          });

    
  }

  if (mailbox==="sent"){
          

  
          fetch('/emails/sent')
          .then(response => response.json())
          .then(emails => {
              // Print emails
              console.log(emails);

              // ... do something else with emails ...
              emails.forEach((email)=> {
                
                  const element = document.createElement('div');
                  element.innerHTML = `From:${email.sender}   Subject:${email.subject}<br> Time:${email.timestamp}`;
                  element.addEventListener('click', function() {
                      console.log("This element has been clicked")
                      vview(email);

                  });
                  console.log(element)
                  document.querySelector('#emails-view').appendChild(element);
                


              });

          });

    
  }




 




  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
}

function xview(email) {
  if (email.archived===false){
    document.querySelector('#xunar').style.display = 'none';
    document.querySelector('#xar').style.display = 'block';

  }
  else{
    document.querySelector('#xar').style.display = 'none';
    document.querySelector('#xunar').style.display = 'block';
  }
  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#x-view').style.display = 'block';


  
  document.querySelector("#a").innerHTML = `From:${email.sender}<br>To:${email.recipients}<br>Subject:${email.subject}`;
  document.querySelector("#d").innerHTML = `body:${email.body}<hr>${email.timestamp}`;
  
  
  
  var p=email.id;
  
  document.querySelector('#xar').addEventListener('submit', () => d(p));
  function d(p){
    fetch(`/emails/${p}`, {
      method: 'PUT',
      body: JSON.stringify({
          archived: true

      })
    })
    return false;
  }
  document.querySelector('#xunar').addEventListener('submit', () => c(p));
  function c(p){
    fetch(`/emails/${p}`, {
      method: 'PUT',
      body: JSON.stringify({
          archived: false
      })
    })
    return false;
  }
  document.querySelector('#reply').addEventListener('click', () => reply(email));


  
  
}
function reply(email) {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';
  document.querySelector('#x-view').style.display = 'none';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = email.sender;
  document.querySelector('#compose-subject').value = `Re:${email.subject}`;
  document.querySelector('#compose-body').value = `On ${email.timestamp} ${email.sender} wrote:`;
}
function vview(email) {
  
    document.querySelector('#xunar').style.display = 'none';
    document.querySelector('#xar').style.display = 'none';
    document.querySelector('#reply').style.display = 'none';

  
  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#x-view').style.display = 'block';


  
  document.querySelector("#a").innerHTML = `From:${email.sender}<br>To:${email.recipients}<br>Subject:${email.subject}`;
  document.querySelector("#d").innerHTML = `body:${email.body}<hr>${email.timestamp}`;
  
  
  
  


  
  
}



