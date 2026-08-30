
async function handleDownload() {
  const urlInput = document.getElementById('videoUrl');
  const videoUrl = urlInput.value.trim();
  const resultDiv = document.getElementById('result');
  const searchBtn = document.getElementById('searchBtn');

  if (!videoUrl) {
    resultDiv.innerHTML = '<p class="error-text">Link belum diisi!</p>';
    return;
  }

  // Nonaktifkan tombol + tampilkan animasi loading, biar user tahu proses jalan
  searchBtn.disabled = true;
  searchBtn.textContent = 'Mencari...';
  resultDiv.innerHTML = `
    <div class="loading-eq">
      <span></span><span></span><span></span>
    </div>
    <p class="status-text">Mengambil info video...</p>
  `;

  try {
    const response = await fetch('/download', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: videoUrl }),
    });

    const data = await response.json();

    if (data.error) {
      resultDiv.innerHTML = `<p class="error-text">${data.error}</p>`;
      return;
    }

    resultDiv.innerHTML = `
      <div class="result-card">
        <img src="${data.thumbnail}" alt="Thumbnail video">
        <h3>${data.title}</h3>
        <div class="download-row">
          <a class="dl-btn dl-mp4" href="/fetch?url=${encodeURIComponent(videoUrl)}&type=mp4">⬇ MP4</a>
          <a class="dl-btn dl-mp3" href="/fetch?url=${encodeURIComponent(videoUrl)}&type=mp3">⬇ MP3</a>
        </div>
      </div>
    `;
  } catch (error) {
    resultDiv.innerHTML = '<p class="error-text">Terjadi kesalahan, coba lagi.</p>';
  } finally {
    // Aktifkan lagi tombolnya, apapun hasilnya
    searchBtn.disabled = false;
    searchBtn.textContent = 'Cari Video';
  }
}