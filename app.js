const supabase = supabaseClient.createClient('https://sudchtocfhhwctctqdfk.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN1ZGNodG9jZmhod2N0Y3RxZGZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ1NjY3NDUsImV4cCI6MjA2MDE0Mjc0NX0.S7iBl3zuUJyQ1zbjmOqaWtcaADJpKepxnAvn5xyiv64s');

let currentUser = null;
let chatId = null;
let selectedFriend = null;
let isGroupChat = false;

document.addEventListener('DOMContentLoaded', async () => {
  const { data: { user } } = await supabase.auth.getUser();
  currentUser = user;
  loadFriends();
  loadGroups();
});

async function loadFriends() {
  const { data, error } = await supabase.from('users').select('*');
  const list = document.getElementById('friendList');
  data.forEach(friend => {
    if (friend.id !== currentUser.id) {
      const li = document.createElement('li');
      li.className = 'cursor-pointer text-green-400 hover:underline flex items-center space-x-2';
      li.innerHTML = `<img src="${friend.avatar_url || 'default-avatar.png'}" class="w-8 h-8 rounded-full mr-2 inline-block"><span>${friend.email}</span>`;
      li.onclick = () => openChat(friend);
      list.appendChild(li);
    }
  });
}

async function loadGroups() {
  const { data } = await supabase
    .from('group_members')
    .select('groups (id, name)')
    .eq('user_id', currentUser.id);

  const list = document.getElementById('friendList');
  data.forEach(({ groups }) => {
    const li = document.createElement('li');
    li.textContent = '[Group] ' + groups.name;
    li.className = 'cursor-pointer text-green-200 hover:underline';
    li.onclick = () => openGroupChat(groups.id, groups.name);
    list.appendChild(li);
  });
}

function displayMessage(msg) {
  const div = document.createElement('div');
  div.innerHTML = '<span class="text-sm">' + (msg.sender_id === currentUser.id ? 'You' : msg.sender_id) + '</span>: ' + msg.message;
  document.getElementById('chatMessages').appendChild(div);
}

async function openChat(friend) {
  selectedFriend = friend;
  chatId = [currentUser.id, friend.id].sort().join('-');
  isGroupChat = false;

  document.getElementById('chatWith').textContent = 'Chat with ' + friend.email;
  document.getElementById('chatMessages').innerHTML = '';

  const { data } = await supabase
    .from('messages')
    .select('*')
    .eq('chat_id', chatId)
    .order('created_at', { ascending: true });

  data.forEach(displayMessage);

  supabase.channel(chatId)
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'messages',
      filter: `chat_id=eq.${chatId}`
    }, (payload) => {
      displayMessage(payload.new);
    }).subscribe();
}

async function openGroupChat(groupId, name) {
  chatId = groupId;
  selectedFriend = null;
  document.getElementById('chatWith').textContent = '[Group] ' + name;
  document.getElementById('chatMessages').innerHTML = '';
  isGroupChat = true;

  const { data } = await supabase
    .from('group_messages')
    .select('*')
    .eq('group_id', groupId)
    .order('created_at', { ascending: true });

  data.forEach(displayMessage);

  supabase.channel('group-' + groupId)
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'group_messages',
      filter: `group_id=eq.${groupId}`
    }, (payload) => {
      displayMessage(payload.new);
    }).subscribe();
}

document.getElementById('sendBtn').addEventListener('click', async () => {
  const input = document.getElementById('messageInput');
  const text = input.value.trim();
  if (!text) return;

  if (isGroupChat) {
    await supabase.from('group_messages').insert({
      group_id: chatId,
      sender_id: currentUser.id,
      message: text
    });
  } else {
    await supabase.from('messages').insert({
      chat_id: chatId,
      sender_id: currentUser.id,
      receiver_id: selectedFriend.id,
      message: text
    });
  }
  input.value = '';
});

const button = document.querySelector('#emojiBtn');
const input = document.querySelector('#messageInput');

const picker = new EmojiButton({
  theme: 'dark',
  position: 'top-start'
});

picker.on('emoji', emoji => {
  input.value += emoji;
});

button.addEventListener('click', () => picker.togglePicker(button));