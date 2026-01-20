# Arabam.com Frontend Assignment

[![Unit Tests](https://github.com/erenkaradeniz/arabamcom-fe-case/actions/workflows/ci.yml/badge.svg)](https://github.com/erenkaradeniz/arabamcom-fe-case/actions/workflows/ci.yml)
![Cloudflare Pages](https://img.shields.io/badge/Deployed_on-Cloudflare_Pages-F38020?style=flat&logo=cloudflare&logoColor=white)
[![Live Demo](https://img.shields.io/badge/demo-online-green.svg?style=flat&logo=safari)](https://arabamcom-fe-case.pages.dev/)

[English](README.en.md) | **Türkçe**

Vue 3 ve TypeScript ile geliştirilmiş, araç ilanlarını listeleme ve detay görüntüleme uygulaması.

## Kurulum & Çalıştırma

```bash
# Bağımlılıkları yükle
npm install

# Geliştirme sunucusunu başlat
npm run dev

# Production build
npm run build

# Testleri çalıştır
npm run test:unit
```

## Teknolojiler

| Kategori      | Teknoloji                  |
| ------------- | -------------------------- |
| Framework     | Vue 3 + TypeScript         |
| State         | Pinia                      |
| Data Fetching | TanStack Query (Vue Query) |
| Styling       | Tailwind CSS v4            |
| Routing       | Vue Router                 |
| i18n          | Vue I18n                   |
| Testing       | Vitest                     |
| Icons         | Lucide Vue                 |

---

## Geliştirme Kararları

### 1. UX Kararı: "Benzer İlanlar" ile Keşif

API'de kategori listesi sunan bir servis olmadığı ve kullanıcıdan ID istemek kötü bir deneyim (UX) olduğu için filtrede `categoryId` kullanılmadı. Bunun yerine, ilan detayında mevcut ilanın kategorisi baz alınarak **"Benzer İlanlar"** listelendi ve içerik keşfi kolaylaştırıldı.

### 2. Görsel Etkileşim ve Erişilebilirlik

Derinlik hissi için `useParallax` hook'u geliştirildi. Ancak erişilebilirlik gözetilerek **prefers-reduced-motion** ayarı aktif olan kullanıcılarda parallax ve ani hover efektleri otomatik olarak devre dışı bırakılır.

### 3. i18n Altyapısı

Gelecekteki ölçeklenebilirlik adına, mevcut veri sadece Türkçe olsa da projeye **Vue I18n** entegrasyonu yapıldı. Proje, kod yapısında değişiklik gerekmeden global kullanıma hazırdır.

### 4. Adaptif UX: Pagination & Infinite Scroll

Uygulama, platform alışkanlıklarına göre şekillenen adaptif bir yapı sunar:

| Platform     | Davranış                                     |
| ------------ | -------------------------------------------- |
| **Masaüstü** | Hızlı erişim ve navigasyon için Pagination   |
| **Mobil**    | Kaydırma alışkanlığına uygun Infinite Scroll |

### 5. Akıllı Görsel Yönetimi: SmartImage

API'den gelen görseller farklı boyutlarda sunulmaktadır. `SmartImage` bileşeni bu durumu akıllıca yönetir:

- **Lazy Loading**: IntersectionObserver ile viewport'a girince yükleme
- **Progressive Fallback**: Tercih edilen boyut yüklenemezse otomatik olarak alt boyuta geçiş
- **Skeleton UI**: Shimmer animasyonu ile yükleme durumu gösterimi
- **Error State**: Tüm boyutlar başarısız olursa hata durumu

### 6. URL-Tabanlı Filtre State'i (Deep Linking)

Filtreler URL query parametrelerinde tutulur. Bu sayede:

- Filtrelenmiş sonuçlar paylaşılabilir link olarak gönderilebilir
- Tarayıcı geri/ileri navigasyonu filtre durumunu korur
- Sayfa yenilemesinde filtre durumu kaybolmaz

### 7. Vue Query ile Veri Yönetimi

Veri çekme işlemleri için `@tanstack/vue-query` kullanıldı:

- **Caching**: `staleTime` ile gereksiz API çağrıları önlenir
- **Optimistic Updates**: `keepPreviousData` ile sayfa geçişlerinde veri kaybolmaz
- **Infinite Query**: Mobil için sonsuz scroll desteği

### 8. Dark Mode Desteği

Modern ve göz yormayan bir karanlık tema entegre edildi. CSS değişkenleri ve Tailwind dark mode sınıfları ile tutarlı tema yönetimi sağlandı.

### 9. Test Altyapısı (Vitest)

Kod güvenilirliği için Vitest kullanılarak kritik composable fonksiyonları (`useAdvertDisplay`, `useFilterStore`) ve UI bileşenleri (`AdvertControls`, `HomeView`) için birim testleri yazıldı.

### 10. Reusable UI Bileşenleri

Kod tekrarını önlemek için `BaseAccordion` (animasyonlu paneller), `BaseDrawer` (mobil menü) ve `BaseSkeleton` gibi temel UI bileşenleri modüler hale getirildi.

### 11. Performans Optimizasyonları

Görsel lazy loading, liste görünümüne dönüşte Scroll Position Restore ve agresif veri önbellekleme stratejileri ile Lighthouse performans metriklerine uygun bir yapı kuruldu.

### 12. Global Error Handling

Merkezi hata yönetimi için `useGlobalError` composable'ı ve `GlobalError` bileşeni geliştirildi. API hataları veya beklenmeyen durumlar tek noktadan yakalanarak kullanıcıya tutarlı bir hata ekranı sunulur.

### 13. Breadcrumb Navigasyonu ile Benzer İlanlara Hızlı Erişim

Detay sayfasında kullanıcı deneyimini artırmak için breadcrumb navigasyonu akıllı hale getirildi:

- Breadcrumb üzerindeki kategori ismine tıklandığında, sayfa otomatik olarak **"Benzer İlanlar"** bölümüne yumuşak bir şekilde kayar.
- Bu özellik sadece benzer ilanlar mevcutsa aktif olur; aksi takdirde kategori ismi normal metin olarak kalır.

---

## Proje Yapısı

```
src/
├── components/          # Tekrar kullanılabilir UI bileşenleri
│   ├── advert/          # İlan ile ilgili bileşenler
│   ├── common/          # Genel bileşenler (SmartImage, GlobalError)
│   └── ui/              # Base UI bileşenleri (Accordion, Drawer, Skeleton)
├── composables/         # UI'dan bağımsız iş mantığı
│   ├── useAdverts.ts    # İlan veri yönetimi (Vue Query)
│   ├── useParallax.ts   # Parallax efekti
│   ├── useGallery.ts    # Galeri navigasyonu
│   └── ...
├── services/            # API istekleri ve veri yönetimi
├── stores/              # Pinia global state
├── types/               # TypeScript tanımları
├── utils/               # Yardımcı fonksiyonlar
├── i18n/                # Dil dosyaları (tr, en)
├── views/               # Sayfa bileşenleri
├── router/              # Vue Router yapılandırması
└── __tests__/           # Vitest birim testleri
```

---

## Lisans

Bu proje Arabam.com Frontend Assessment için geliştirilmiştir.
