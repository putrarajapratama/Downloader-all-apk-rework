
async function handleDownload() {
  // 1. Ambil teks yang diketik user di kotak input
  const urlInput = document.getElementById('videoUrl');
  const videoUrl = urlInput.value;

  const resultDiv = document.getElementById('result');

 
  if (!videoUrl) {
    resultDiv.innerHTML = '<p style="color:red">Link belum diisi!</p>';
    return;
  }

  
  resultDiv.innerHTML = '<p>Mencari video...</p>';

  try {
    
    const response = await fetch('/download', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: videoUrl }),
    });

    const data = await response.json();

    
    if (data.error) {
      resultDiv.innerHTML = `<p style="color:red">${data.error}</p>`;
      return;
    }

    resultDiv.innerHTML = `
  <h3>${data.title}</h3>
  <img src="${data.thumbnail}" width="200"><br>
  <a href="/fetch?url=${encodeURIComponent(videoUrl)}&type=mp4">
    <button>Download MP4</button>
  </a>
  <a href="/fetch?url=${encodeURIComponent(videoUrl)}&type=mp3">
    <button>Download MP3</button>
  </a>
`;

  } catch (error) {
    resultDiv.innerHTML = '<p style="color:red">Terjadi kesalahan, coba lagi.</p>';
  }
}