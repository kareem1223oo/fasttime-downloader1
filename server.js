const express = require('express');
const ytdl = require('ytdl-core');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// خدمة ملفات الواجهة الأمامية (HTML, CSS)
app.use(express.static(path.join(__dirname, 'public')));

// هذا هو الـ API الذي سيقوم بالعمل كله
app.get('/api/download', async (req, res) => {
    const { url } = req.query;

    if (!url) {
        return res.status(400).json({ error: 'الرجاء إدخال رابط يوتيوب' });
    }

    try {
        // التحقق من الرابط
        if (!ytdl.validateURL(url)) {
            return res.status(400).json({ error: 'رابط يوتيوب غير صالح' });
        }

        // جلب معلومات الفيديو
        const info = await ytdl.getInfo(url);

        // اختيار أفضل جودة (فيديو + صوت)
        const format = ytdl.chooseFormat(info.formats, { quality: 'highest', filter: 'audioandvideo' });

        if (!format) {
            throw new Error('لم يتم العثور على جودة مناسبة للتحميل.');
        }

        // إرسال رابط التحميل المباشر إلى موقعك
        res.status(200).json({ downloadUrl: format.url });

    } catch (error) {
        console.error('ytdl-core Error:', error.message);
        res.status(500).json({ error: 'فشل تحليل الفيديو. حاول مرة أخرى.' });
    }
});

app.listen(port, () => {
    console.log(`المساعد يعمل على http://localhost:${port}`);
});
