// truthwebfeedbackend.js

// Configuration
const BACKEND_URL = 'http://localhost:5000'; // Update this to your backend URL in production
const token = localStorage.getItem('token'); // Assuming token is stored in localStorage after login

// WebSocket Setup
const socket = io(BACKEND_URL, {
  auth: { token }
});

// Utility Functions
function createFeedItem(post) {
  const newPost = document.createElement('div');
  newPost.className = 'feed-item';
  newPost.setAttribute('data-id', post._id);
  newPost.style.opacity = '0';
  newPost.innerHTML = `
    <div class="feed-item-header">
      <i class="fas fa-user-circle feed-avatar"></i>
      <div class="feed-user-info">
        <span class="feed-user">${post.userId.username}</span>
        <span class="feed-handle">@${post.userId.handle}</span>
        <span class="feed-time">${new Date(post.createdAt).toLocaleString()}</span>
      </div>
    </div>
    <p class="feed-content">${post.content}</p>
    ${post.media && post.media.length ? `<div class="feed-media"><img src="${post.media[0]}" alt="Media"></div>` : ''}
    <div class="feed-actions">
      <button><i class="far fa-comment"></i> ${post.comments.length}</button>
      <button class="retweet-btn"><i class="fas fa-retweet"></i> ${post.retweets.length}</button>
      <button class="like-btn"><i class="far fa-heart"></i> <span class="like-count">${post.likes.length}</span></button>
      <button><i class="fas fa-share"></i></button>
    </div>
  `;
  return newPost;
}

function createAdItem(ad) {
  const newAd = document.createElement('div');
  newAd.className = 'ad-item';
  newAd.style.opacity = '0';
  newAd.innerHTML = `
    <div class="feed-item-header">
      <i class="fas fa-ad feed-avatar"></i>
      <div class="feed-user-info">
        <span class="feed-user">TruthWeb Ads</span>
        <span class="feed-time">Sponsored</span>
      </div>
    </div>
    <p class="feed-content">${ad.content}</p>
    <div class="feed-media"><img src="${ad.media}" alt="Ad"></div>
    <a href="${ad.ctaLink}" class="btn w-full">${ad.ctaText}</a>
  `;
  return newAd;
}

// Feed Initialization and Infinite Scroll
let page = 1;
const feedContainer = document.getElementById('feed-container');
const scrollLoader = document.querySelector('.scroll-loader');

async function loadMorePosts() {
  scrollLoader.classList.add('active');
  try {
    const response = await fetch(`${BACKEND_URL}/api/posts?page=${page}&limit=10`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to fetch posts');
    const data = await response.json();

    data.posts.forEach(post => {
      const newPost = createFeedItem(post);
      feedContainer.appendChild(newPost);
      setTimeout(() => { newPost.style.opacity = '1'; }, 10);
    });

    if (data.ad) {
      const newAd = createAdItem(data.ad);
      feedContainer.appendChild(newAd);
      setTimeout(() => { newAd.style.opacity = '1'; }, 10);
    }

    page++;
  } catch (err) {
    console.error('Error loading posts:', err);
  } finally {
    scrollLoader.classList.remove('active');
  }
}

function initializeFeed() {
  // Initial load
  loadMorePosts();

  // Infinite scroll observer
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      loadMorePosts();
    }
  }, { threshold: 0.1 });
  observer.observe(scrollLoader);

  // WebSocket events
  socket.on('newPost', (post) => {
    const newPost = createFeedItem(post);
    feedContainer.insertBefore(newPost, feedContainer.firstChild);
    setTimeout(() => { newPost.style.opacity = '1'; }, 10);
  });

  socket.on('postDeleted', (postId) => {
    const postElement = document.querySelector(`.feed-item[data-id="${postId}"]`);
    if (postElement) postElement.remove();
  });
}

// Search Functionality
function initializeSearch() {
  const searchInput = document.querySelector('.search-input');
  const searchResults = document.querySelector('.search-results');
  const searchableContent = [];

  document.querySelectorAll('h1, h2, h3, p, a').forEach(element => {
    const text = element.textContent.trim();
    if (text) {
      searchableContent.push({
        text: text.toLowerCase(),
        element,
        href: element.tagName === 'A' ? element.getAttribute('href') : null
      });
    }
  });

  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    searchResults.innerHTML = '';
    searchResults.classList.remove('active');

    if (query.length > 0) {
      const results = searchableContent.filter(item => item.text.includes(query));
      if (results.length > 0) {
        results.forEach(result => {
          const div = document.createElement('div');
          div.classList.add('search-result-item');
          div.textContent = result.text.slice(0, 50) + (result.text.length > 50 ? '...' : '');
          div.addEventListener('click', () => {
            if (result.href) window.location.href = result.href;
            else result.element.scrollIntoView({ behavior: 'smooth' });
            searchResults.classList.remove('active');
            searchInput.value = '';
          });
          searchResults.appendChild(div);
        });
        searchResults.classList.add('active');
      } else {
        const noResult = document.createElement('div');
        noResult.classList.add('search-result-item');
        noResult.textContent = 'No results found';
        searchResults.appendChild(noResult);
        searchResults.classList.add('active');
      }
    }
  });

  document.addEventListener('click', (e) => {
    if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
      searchResults.classList.remove('active');
    }
  });
}

// Compose Functionality
function initializeCompose() {
  const composeBtn = document.querySelector('.compose-btn');
  const composeModal = document.querySelector('.compose-modal');
  const postForm = document.getElementById('post-form');
  const postContent = document.getElementById('post-content');

  composeBtn.addEventListener('click', () => {
    composeModal.classList.add('active');
  });

  composeModal.addEventListener('click', (e) => {
    if (e.target === composeModal) {
      composeModal.classList.remove('active');
    }
  });

  postForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const content = postContent.value.trim();
    if (!content) return;

    try {
      const response = await fetch(`${BACKEND_URL}/api/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ content })
      });
      if (!response.ok) throw new Error('Failed to create post');
      const post = await response.json();

      const newPost = createFeedItem(post);
      feedContainer.insertBefore(newPost, feedContainer.firstChild);
      setTimeout(() => { newPost.style.opacity = '1'; }, 10);

      postForm.reset();
      composeModal.classList.remove('active');
    } catch (err) {
      console.error('Error creating post:', err);
    }
  });
}

// TruthWeb AI Functionality
function initializeAI() {
  const aiBtn = document.querySelector('.ai-btn');
  const aiModal = document.querySelector('.ai-modal');
  const aiChat = document.getElementById('ai-chat');
  const aiInput = document.getElementById('ai-input');
  const aiSubmit = document.getElementById('ai-submit');

  // Initial AI message
  const initialMessage = document.createElement('div');
  initialMessage.className = 'ai-message';
  initialMessage.textContent = "Hey there, Pioneer! I'm TruthWeb AI, your guide to navigating the TruthWeb universe. Ask me anything—marketplace tips, feed insights, or even the meaning of life (just kidding on that last one... or am I?). What's on your mind?";
  aiChat.appendChild(initialMessage);

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
      const response = await fetch(`${BACKEND_URL}/api/ai/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ content: userInput })
      });
      if (!response.ok) throw new Error('Failed to chat with AI');
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
}

// Scroll Effects
function initializeScrollEffects() {
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const header = document.querySelector('.sticky-header');
    const footerMenu = document.querySelector('.footer-menu');
    const currentScroll = window.scrollY;

    if (currentScroll > lastScroll && currentScroll > 50) {
      header.classList.add('hidden');
      footerMenu.classList.add('hidden');
    } else if (currentScroll < lastScroll) {
      header.classList.remove('hidden');
      footerMenu.classList.remove('hidden');
      header.classList.toggle('scrolled', currentScroll > 50);
    }
    lastScroll = currentScroll;
  });
}

// Export initialization functions for use in index.html
window.initializeFeed = initializeFeed;
window.initializeSearch = initializeSearch;
window.initializeCompose = initializeCompose;
window.initializeAI = initializeAI;
window.initializeScrollEffects = initializeScrollEffects;
