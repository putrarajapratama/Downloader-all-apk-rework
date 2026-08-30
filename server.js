const express = require('express');
const YTDlpWrap = require('yt-dlp-wrap').default;

const app = express();
const ytDlpWrap = new YTDlpWrap('./yt-dlp.exe');

app.use(express.json());
app.use(express.static('public'));

app.post('/download', async (req, res) => {
  const videoUrl = req.body.url;
  try {
    const metadata = await ytDlpWrap.getVideoInfo([
  videoUrl,
  '--extractor-args', 'youtube:player_client=android'
]);
    res.json({
      title: metadata.title,
      thumbnail: metadata.thumbnail,
      formats: metadata.formats,
    });
    } catch (error) {
    console.error('DETAIL ERROR:', error); // baris baru, buat lihat apa masalahnya
    res.status(500).json({ error: 'Gagal mengambil video. Cek link-nya lagi.' });
  }
});

app.listen(3000, () => {
  console.log('Server jalan di http://localhost:3000');
});

// Endpoint khusus untuk proses download file (video/audio)
app.get('/fetch', async (req, res) => {
  const videoUrl = req.query.url;
  const type = req.query.type; // 'mp3' atau 'mp4'

  try {
    if (type === 'mp3') {
      // Set header supaya browser tahu ini file yang harus di-download
      res.setHeader('Content-Disposition', 'attachment; filename="audio.mp3"');
      // -x = extract audio only, --audio-format mp3 = convert ke mp3
      ytDlpWrap.execStream([
        videoUrl,
        '-x', '--audio-format', 'mp3',
        '--extractor-args', 'youtube:player_client=android',
        '-o', '-' // '-o -' artinya kirim hasilnya langsung (stream), bukan simpan ke file di server
      ]).pipe(res);
    } else {
      res.setHeader('Content-Disposition', 'attachment; filename="video.mp4"');
      ytDlpWrap.execStream([
        videoUrl,
        '-f', 'best[ext=mp4]',
        '--extractor-args', 'youtube:player_client=android',
        '-o', '-'
      ]).pipe(res);
    }
  } catch (error) {
    console.error('DETAIL ERROR FETCH:', error);
    res.status(500).send('Gagal download file.');
  }
});