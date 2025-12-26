const API = "http://localhost:3000";

let currentConversation = null;

async function loadConversations() {
  const res = await fetch(API + "/conversations");
  const data = await res.json();

  const ul = document.getElementById("conversations");
  ul.innerHTML = "";

  data.forEach(conv => {
    const li = document.createElement("li");
    li.textContent = conv.contactId.phone;
    li.onclick = () => selectConversation(conv);
    ul.appendChild(li);
  });
}

async function selectConversation(conv) {
  currentConversation = conv;
  document.getElementById("chat-header").innerText = conv.contactId.phone;
  document.getElementById("to").value = conv.contactId.phone;
  loadMessages();
}

async function loadMessages() {
  if (!currentConversation) return;

  const res = await fetch(API + "/messages/" + currentConversation._id);
  const data = await res.json();

  const div = document.getElementById("messages");
  div.innerHTML = "";

  data.forEach(m => {
    const msg = document.createElement("div");
    msg.className = "msg " + m.direction;
    msg.innerText = m.body;
    div.appendChild(msg);
  });

  div.scrollTop = div.scrollHeight;
}

document.getElementById("send").onclick = async () => {
  if (!currentConversation) return;

  const body = document.getElementById("text").value;
  if (!body) return;

  await fetch(API + "/messages/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      to: document.getElementById("to").value,
      body,
      conversationId: currentConversation._id
    })
  });

  document.getElementById("text").value = "";
  loadMessages();
};

setInterval(loadMessages, 3000);
loadConversations();

document.getElementById("sendTemplate").onclick = async () => {
  const to = document.getElementById("templateNumber").value;
  const template = document.getElementById("templateName").value;
  const variables = document.getElementById("templateVars").value
    .split(",")
    .map(v => v.trim())
    .filter(Boolean);

  await fetch(API + "/messages/template", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ to, template, variables })
  });

  alert("Template enviado com sucesso");
};

