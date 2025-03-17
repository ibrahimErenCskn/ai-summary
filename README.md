# AI Özet - Yapay Zeka Destekli Not Alma ve Özetleme Uygulaması

AI Özet, metinlerinizi yapay zeka ile analiz ederek önemli noktaları özetleyen, hızlı ve kullanımı kolay bir not alma uygulamasıdır. Google'ın Gemini AI teknolojisini kullanarak metinlerinizi anlamlandırır ve özetler.

## Özellikler

- ✏️ Hızlı ve kolay not alma
- 🤖 Yapay zeka destekli metin analizi ve özetleme
- 📝 Özetin uzunluğunu ve detay seviyesini ayarlama
- 🏷️ Otomatik başlık önerileri
- 💾 Notları yerel depolama ile saklama (backend kullanılmıyor)
- 🎨 Sade ve odaklı kullanıcı arayüzü

## Başlarken

### Gereksinimler

- Node.js 18.0.0 veya daha yüksek bir sürüm
- Google Gemini API anahtarı (https://aistudio.google.com/app/apikey adresinden ücretsiz alabilirsiniz)

### Kurulum

1. Projeyi klonlayın:

```bash
git clone https://github.com/yourusername/ai-summary.git
cd ai-summary
```

2. Bağımlılıkları yükleyin:

```bash
npm install
```

3. `.env.local.example` dosyasını `.env.local` olarak kopyalayın ve Gemini API anahtarınızı ekleyin:

```bash
cp .env.local.example .env.local
```

4. `.env.local` dosyasını düzenleyerek `NEXT_PUBLIC_GEMINI_API_KEY` değişkenine API anahtarınızı ekleyin.

5. Geliştirme sunucusunu başlatın:

```bash
npm run dev
```

6. Tarayıcınızda [http://localhost:3000](http://localhost:3000) adresini açarak uygulamayı kullanmaya başlayın.

## Kullanım

1. "Yeni Not" butonuna tıklayarak yeni bir not oluşturun.
2. Not içeriğini yazın veya yapıştırın.
3. "Başlık Öner" butonuna tıklayarak yapay zeka tarafından önerilen başlığı kullanabilirsiniz.
4. Özet uzunluğunu ve detay seviyesini ayarlayın.
5. "Özet Oluştur" butonuna tıklayarak metninizin özetini oluşturun.
6. "Notu Kaydet" butonuna tıklayarak notunuzu kaydedin.

## Teknolojiler

- [Next.js](https://nextjs.org/) - React framework
- [TypeScript](https://www.typescriptlang.org/) - Tip güvenliği
- [Tailwind CSS](https://tailwindcss.com/) - Stil
- [Google Gemini AI](https://ai.google.dev/) - Yapay zeka modeli

## Lisans

MIT
