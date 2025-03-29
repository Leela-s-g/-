// 留言板功能实现
document.addEventListener('DOMContentLoaded', function() {
    const messageForm = document.getElementById('messageForm');
    const messagesContainer = document.getElementById('messagesContainer');
    const STORAGE_KEY = 'sctp_messages';

    // 从localStorage加载留言
    function loadMessages() {
        const messages = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        messages.forEach(message => displayMessage(message));
    }

    // 保存留言到localStorage
    function saveMessage(message) {
        const messages = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        messages.unshift(message);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    }

    // 创建并显示留言卡片
    function displayMessage(message) {
        const messageCard = document.createElement('div');
        messageCard.className = 'message-card';
        messageCard.innerHTML = `
            <div class="message-header">
                <span class="message-nickname">${escapeHtml(message.nickname)}</span>
                <span class="message-time">${message.time}</span>
            </div>
            <div class="message-content">${escapeHtml(message.content)}</div>
        `;
        messagesContainer.insertBefore(messageCard, messagesContainer.firstChild);
    }

    // HTML转义函数，防止XSS攻击
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // 格式化时间
    function formatDate(date) {
        const options = {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        };
        return new Date(date).toLocaleString('zh-CN', options);
    }

    // 处理表单提交
    messageForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const nickname = document.getElementById('nickname').value.trim();
        const content = document.getElementById('message').value.trim();

        if (!nickname || !content) {
            alert('请填写昵称和留言内容！');
            return;
        }

        const message = {
            nickname,
            content,
            time: formatDate(new Date())
        };

        saveMessage(message);
        displayMessage(message);

        // 清空表单
        messageForm.reset();
    });

    // 页面加载时显示已有留言
    loadMessages();
});