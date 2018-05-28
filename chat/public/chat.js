const socket = io();

const main = () => {
  const message = document.getElementById('message');
  const handle = document.getElementById('handle');
  const output = document.getElementById('output');
  const feedback = document.getElementById('feedback');
  const sendButton = document.getElementById('send');

  console.log(feedback);
  sendButton.addEventListener('click', function(evt){
    evt.preventDefault();
    feedback.innerHTML = "";
    const data = {message: message.value, handle: handle.value};
    socket.emit('chat', data);
  });

  message.addEventListener('keyup',function(evt){
    evt.preventDefault();
    const data = {handle:handle.value};
    socket.emit('typing',data);
  });
};

socket.on('chat',function(data){
  output.innerHTML += '<p><strong>' + data.handle +': </strong>' + data.message+'</p>';
});
socket.on('typing', function(data){
  feedback.innerHTML += '<p> <em>'+ data.handle + ' is typing .. </em></p>';
});
document.addEventListener('DOMContentLoaded', () => {
	main();
});
