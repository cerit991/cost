# 🚀 Next.js Proje Rehberi

Bu modern web uygulaması [Next.js](https://nextjs.org) altyapısı kullanılarak [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) ile oluşturulmuştur.

## ⚡ Hızlı Başlangıç

Geliştirme sunucusunu başlatmak için:

```bash
npm run dev
# alternatif olarak
yarn dev
# veya
pnpm dev
# veya
bun dev
```

Tarayıcınızda [http://localhost:3000](http://localhost:3000) adresini açarak uygulamanızı görüntüleyebilirsiniz.

`app/page.js` dosyasını düzenleyerek sayfayı özelleştirebilirsiniz. Dosyayı kaydettiğinizde sayfa otomatik olarak güncellenir.

Bu proje, Vercel için tasarlanmış modern [Geist](https://vercel.com/font) yazı tipini [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) modülü ile otomatik olarak optimize eder ve yükler.

## 📚 Daha Fazla Bilgi

Next.js hakkında daha fazla bilgi edinmek için:

- [Next.js Dokümantasyonu](https://nextjs.org/docs) - Next.js özellikleri ve API'si hakkında kapsamlı bilgiler
- [Next.js Öğrenme Platformu](https://nextjs.org/learn) - interaktif Next.js eğitimleri

Next.js'e katkıda bulunmak isterseniz [Next.js GitHub deposunu](https://github.com/vercel/next.js) ziyaret edebilirsiniz - geri bildirimleriniz ve katkılarınız memnuniyetle karşılanır!

## 🌐 Vercel ile Yayınlama

Next.js uygulamanızı yayınlamanın en kolay yolu, Next.js'in yaratıcıları tarafından geliştirilen [Vercel Platformu](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) kullanmaktır.

Daha fazla detay için [Next.js yayınlama dokümantasyonunu](https://nextjs.org/docs/app/building-your-application/deploying) inceleyebilirsiniz.

## 🛠️ Proje Yapısı

```
/
├── app/            # Uygulama dosyaları
│   └── page.js     # Ana sayfa bileşeni
├── public/         # Statik dosyalar
├── styles/         # CSS dosyaları
├── components/     # Tekrar kullanılabilir bileşenler
└── package.json    # Proje bağımlılıkları
```

## 💡 İpuçları

- Yeni sayfa eklemek için `app` klasörüne yeni bir dosya ekleyin
- `public` klasörüne statik dosyalarınızı yerleştirin
- Next.js, API Route'ları sayesinde sunucu taraflı fonksiyonlar oluşturmanıza olanak tanır
- Componentleri `components` klasöründe organize edin