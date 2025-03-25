// TruthWeb AI
const aiBtn = document.querySelector('.ai-btn');
const aiModal = document.querySelector('.ai-modal');
const aiChat = document.getElementById('ai-chat');
const aiInput = document.getElementById('ai-input');
const aiSubmit = document.getElementById('ai-submit');

aiBtn.addEventListener('click', () => {
  aiModal.classList.add('active');
});

aiModal.addEventListener('click', (e) => {
  if (e.target === aiModal) {
    aiModal.classList.remove('active');
  }
});

aiSubmit.addEventListener('click', async () => {
  const userInput = aiInput.value.trim();
  if (!userInput) return;

  const userMessage = document.createElement('div');
  userMessage.className = 'ai-message user';
  userMessage.textContent = userInput;
  aiChat.appendChild(userMessage);

  try {
    const response = await fetch('/api/ai/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ content: userInput })
    });
    const data = await response.json();

    const aiMessage = document.createElement('div');
    aiMessage.className = 'ai-message';
    aiMessage.textContent = data.response;
    aiChat.appendChild(aiMessage);
  } catch (err) {
    console.error('Error communicating with TruthWeb AI:', err);
  }

  aiChat.scrollTop = aiChat.scrollHeight;
  aiInput.value = '';
});

aiInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    aiSubmit.click();
  }
});
