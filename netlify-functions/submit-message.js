const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  const { nickname, message } = JSON.parse(event.body);

  if (!nickname || !message) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: '请填写昵称和留言内容！' })
    };
  }

  const repo = 'Leela-s-g/-';
  const path = 'messages.json';

  const newMessage = {
    nickname,
    message,
    time: new Date().toISOString()
  };

  try {
    const response = await fetch(`https://api.github.com/repos/${repo}/contents/${path}`, {
      method: 'GET',
      headers: {
        Authorization: `token ${githubToken}`,
        Accept: 'application/vnd.github.v3+json'
      }
    });

    const data = await response.json();
    const messages = JSON.parse(Buffer.from(data.content, 'base64').toString('utf-8'));
    messages.unshift(newMessage);

    const updatedContent = Buffer.from(JSON.stringify(messages, null, 2)).toString('base64');

    await fetch(`https://api.github.com/repos/${repo}/contents/${path}`, {
      method: 'PUT',
      headers: {
        Authorization: `token ${githubToken}`,
        Accept: 'application/vnd.github.v3+json'
      },
      body: JSON.stringify({
        message: 'Add new message',
        content: updatedContent,
        sha: data.sha
      })
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: '留言已成功提交！' })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: '提交留言时发生错误，请稍后再试。' })
    };
  }
};

const githubToken = process.env.GITHUB_TOKEN;