document.addEventListener('DOMContentLoaded', function() {
    const messageForm = document.getElementById('messageForm');
    const messagesContainer = document.getElementById('messagesContainer');

    async function fetchMessages() {
        try {
            const response = await fetch('/.netlify/functions/submit-message');
            const data = await response.json();
            data.forEach(message => displayMessage(message));
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    }

    function displayMessage(message) {
        const messageCard = document.createElement('div');
        messageCard.className = 'message-card';
        messageCard.innerHTML = `
            <div class="message-header">
                <span class="message-nickname">${escapeHtml(message.nickname)}</span>
                <span class="message-time">${message.time}</span>
            </div>
            <div class="message-content">${escapeHtml(message.message)}</div>
        `;
        messagesContainer.insertBefore(messageCard, messagesContainer.firstChild);
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    messageForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const nickname = document.getElementById('nickname').value.trim();
        const content = document.getElementById('message').value.trim();

        if (!nickname || !content) {
            alert('请填写昵称和留言内容！');
            return;
        }

        const message = {
            nickname,
            message: content,
            time: new Date().toISOString()
        };

        try {
            const response = await fetch('/.netlify/functions/submit-message', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(message)
            });

            if (response.ok) {
                displayMessage(message);
                messageForm.reset();
            } else {
                alert('提交留言时发生错误，请稍后再试。');
            }
        } catch (error) {
            console.error('Error submitting message:', error);
        }
    });

    fetchMessages();
});
