const express = require ('express');
const {YTDlpWrap, default: YTDlpWrap} = require ('yt-dlp-wrap');
const app = express ();
const YTDlpWrap = new YTDlpWrap('./yt-dlp-wrap')
app.use (express.json());
app.use(express.static('public'));
app.post('/download', async (req, res) => {
  const videoUrl = req.body.url;
  try {
    const metadata = await ytDlpWrap.getVideoInfo(videoUrl);
    res.json({
      title: metadata.title,
      thumbnail: metadata.thumbnail,
      formats: metadata.formats,
      });
  } catch (error) {
    res.status(500).json({ error: 'Gagal mengambil video. Cek link-nya lagi.' });
  }
});
app.listen(3000, () => {
  console.log('Server jalan di http://localhost:3000');
});