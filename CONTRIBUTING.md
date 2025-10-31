# Contributing to QianlunShop | Berkontribusi ke QianlunShop

<div align="center">

**Thank you for considering contributing to QianlunShop!**  
**Terima kasih telah mempertimbangkan untuk berkontribusi ke QianlunShop!**

</div>

---

## 📋 Table of Contents | Daftar Isi

1. [Code of Conduct | Kode Etik](#code-of-conduct--kode-etik)
2. [Getting Started | Memulai](#getting-started--memulai)
3. [How to Contribute | Cara Berkontribusi](#how-to-contribute--cara-berkontribusi)
4. [Development Workflow | Alur Kerja Pengembangan](#development-workflow--alur-kerja-pengembangan)
5. [Coding Standards | Standar Coding](#coding-standards--standar-coding)
6. [Commit Message Guidelines | Panduan Commit Message](#commit-message-guidelines--panduan-commit-message)
7. [Pull Request Process | Proses Pull Request](#pull-request-process--proses-pull-request)
8. [Issue Guidelines | Panduan Issue](#issue-guidelines--panduan-issue)

---

## 📜 Code of Conduct | Kode Etik

### English
By participating in this project, you agree to abide by our Code of Conduct:

- **Be respectful:** Treat everyone with respect and kindness
- **Be constructive:** Provide helpful feedback and suggestions
- **Be collaborative:** Work together towards common goals
- **Be inclusive:** Welcome diverse perspectives and experiences
- **Be professional:** Maintain professionalism in all interactions

### Bahasa Indonesia
Dengan berpartisipasi dalam proyek ini, Anda setuju untuk mematuhi Kode Etik kami:

- **Bersikap hormat:** Perlakukan semua orang dengan hormat dan baik
- **Bersikap konstruktif:** Berikan feedback dan saran yang membantu
- **Bersikap kolaboratif:** Bekerja sama menuju tujuan bersama
- **Bersikap inklusif:** Sambut perspektif dan pengalaman yang beragam
- **Bersikap profesional:** Jaga profesionalisme dalam semua interaksi

---

## 🚀 Getting Started | Memulai

### Prerequisites | Prasyarat

**EN:** Before contributing, ensure you have:  
**ID:** Sebelum berkontribusi, pastikan Anda memiliki:

- Git installed | Git terinstal
- Modern web browser | Browser web modern
- Code editor (VS Code recommended) | Editor kode (VS Code direkomendasikan)
- Basic knowledge of HTML, CSS, JavaScript | Pengetahuan dasar HTML, CSS, JavaScript

### Setting Up Development Environment | Menyiapkan Environment Development

```bash
# 1. Fork the repository on GitHub
# 1. Fork repositori di GitHub

# 2. Clone your fork | Clone fork Anda
git clone https://github.com/YOUR-USERNAME/QianlunShop.git
cd QianlunShop

# 3. Add upstream remote | Tambah remote upstream
git remote add upstream https://github.com/1412240028/QianlunShop.git

# 4. Create a new branch | Buat branch baru
git checkout -b feature/your-feature-name

# 5. Start development server | Mulai server development
# Use VS Code Live Server or Python HTTP server
python -m http.server 8000
```

---

## 💡 How to Contribute | Cara Berkontribusi

### Ways to Contribute | Cara Untuk Berkontribusi

#### 1. 🐛 Report Bugs | Laporkan Bug
**EN:** Found a bug? Help us fix it!  
**ID:** Menemukan bug? Bantu kami memperbaikinya!

- Check if the bug is already reported in [Issues](https://github.com/1412240028/QianlunShop/issues)
- Create a new issue with detailed description
- Include steps to reproduce
- Add screenshots if applicable

#### 2. ✨ Suggest Features | Sarankan Fitur
**EN:** Have an idea? We'd love to hear it!  
**ID:** Punya ide? Kami ingin mendengarnya!

- Check if the feature is already requested
- Create a feature request issue
- Explain the use case and benefits
- Provide examples if possible

#### 3. 📝 Improve Documentation | Tingkatkan Dokumentasi
**EN:** Documentation can always be better!  
**ID:** Dokumentasi selalu bisa lebih baik!

- Fix typos and grammatical errors
- Add missing information
- Improve explanations
- Add examples and tutorials

#### 4. 💻 Submit Code | Submit Kode
**EN:** Ready to code? Follow our workflow!  
**ID:** Siap coding? Ikuti alur kerja kami!

- Fix bugs
- Implement features
- Optimize performance
- Add tests

---

## 🔄 Development Workflow | Alur Kerja Pengembangan

### Step-by-Step Process | Proses Step-by-Step

#### Step 1: Sync Your Fork | Sinkronkan Fork Anda

```bash
# Fetch latest changes from upstream
git fetch upstream

# Merge upstream main into your main
git checkout main
git merge upstream/main

# Push updates to your fork
git push origin main
```

#### Step 2: Create Feature Branch | Buat Branch Fitur

```bash
# Create and checkout new branch
git checkout -b feature/your-feature-name

# Branch naming conventions:
# feature/  - New features | Fitur baru
# fix/      - Bug fixes | Perbaikan bug
# docs/     - Documentation | Dokumentasi
# style/    - Styling changes | Perubahan styling
# refactor/ - Code refactoring | Refactoring kode
# test/     - Adding tests | Menambah tes
```

#### Step 3: Make Your Changes | Buat Perubahan

**EN:** Write clean, well-documented code following our [Coding Standards](#coding-standards--standar-coding).

**ID:** Tulis kode yang bersih dan terdokumentasi dengan baik mengikuti [Standar Coding](#coding-standards--standar-coding) kami.

#### Step 4: Test Your Changes | Tes Perubahan Anda

**EN:** Before committing, ensure:  
**ID:** Sebelum commit, pastikan:

- [ ] Code works as expected | Kode berfungsi sesuai harapan
- [ ] No console errors | Tidak ada error di console
- [ ] Responsive on all devices | Responsif di semua perangkat
- [ ] No broken links | Tidak ada link rusak
- [ ] LocalStorage works correctly | LocalStorage berfungsi dengan benar

#### Step 5: Commit Your Changes | Commit Perubahan

```bash
# Stage your changes
git add .

# Commit with descriptive message
git commit -m "feat: add checkout confirmation modal"

# See commit message guidelines below
```

#### Step 6: Push to Your Fork | Push ke Fork Anda

```bash
# Push your branch
git push origin feature/your-feature-name
```

#### Step 7: Create Pull Request | Buat Pull Request

1. Go to your fork on GitHub
2. Click "Compare & pull request"
3. Fill out the PR template
4. Wait for review

---

## 📏 Coding Standards | Standar Coding

### HTML Standards

```html
<!-- ✅ Good | Baik -->
<div class="product-card" data-id="p001" data-price="8750000">
  <img src="image.jpg" alt="Descriptive alt text">
  <h3>Product Name</h3>
</div>

<!-- ❌ Bad | Buruk -->
<div class="product-card">
  <img src="image.jpg">
  <h3>Product Name</h3>
</div>
```

**Rules | Aturan:**
- Use semantic HTML | Gunakan HTML semantik
- Always include alt text for images | Selalu sertakan alt text untuk gambar
- Use data attributes for dynamic content | Gunakan data attributes untuk konten dinamis
- Proper indentation (2 spaces) | Indentasi yang tepat (2 spasi)

### CSS Standards

```css
/* ✅ Good | Baik */
.product-card {
  display: flex;
  flex-direction: column;
  background: var(--bg-secondary);
  border-radius: 12px;
  transition: all 0.3s ease;
}

/* ❌ Bad | Buruk */
.product-card { display: flex; background: #1a1a1a; }
```

**Rules | Aturan:**
- Use CSS custom properties (variables) | Gunakan CSS custom properties (variabel)
- Follow BEM naming convention | Ikuti konvensi penamaan BEM
- Mobile-first approach | Pendekatan mobile-first
- Group related properties | Kelompokkan properti terkait
- Comment complex sections | Beri komentar pada bagian kompleks

### JavaScript Standards

```javascript
// ✅ Good | Baik
function addToCart(product) {
  if (!product || !product.id) {
    console.error("Invalid product");
    return false;
  }
  
  const cart = new Cart();
  cart.add(product);
  updateCartCount();
  showToast(`${product.name} added to cart`);
  return true;
}

// ❌ Bad | Buruk
function addToCart(p) {
  cart.add(p);
}
```

**Rules | Aturan:**
- Use descriptive variable names | Gunakan nama variabel yang deskriptif
- Add JSDoc comments for functions | Tambahkan komentar JSDoc untuk fungsi
- Handle errors gracefully | Tangani error dengan baik
- Use ES6+ features (const, let, arrow functions) | Gunakan fitur ES6+
- Avoid global variables | Hindari variabel global
- Use modules for code organization | Gunakan modul untuk organisasi kode

### File Organization | Organisasi File

```
QianlunShop/
├── pages/           # HTML pages
├── css/             # Stylesheets
├── js/              # JavaScript modules
├── assets/
│   ├── images/      # Image assets
│   └── icons/       # Icon assets
└── docs/            # Documentation
```

---

## 📝 Commit Message Guidelines | Panduan Commit Message

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types | Tipe

**EN / ID:**
- `feat` - New feature | Fitur baru
- `fix` - Bug fix | Perbaikan bug
- `docs` - Documentation | Dokumentasi
- `style` - Formatting, missing semicolons, etc. | Formatting, semicolon, dll.
- `refactor` - Code refactoring | Refactoring kode
- `test` - Adding tests | Menambah tes
- `chore` - Maintenance tasks | Tugas maintenance

### Examples | Contoh

```bash
# Feature
git commit -m "feat(cart): add checkout confirmation modal"

# Bug fix
git commit -m "fix(search): resolve case-sensitive search issue"

# Documentation
git commit -m "docs(readme): update installation instructions"

# Style
git commit -m "style(css): improve button hover effects"

# Refactor
git commit -m "refactor(cart): simplify cart item removal logic"
```

### Best Practices | Praktik Terbaik

**EN:**
- Use present tense ("add feature" not "added feature")
- Keep subject line under 50 characters
- Capitalize subject line
- Don't end subject with a period
- Use body to explain what and why, not how

**ID:**
- Gunakan present tense ("add feature" bukan "added feature")
- Jaga baris subjek di bawah 50 karakter
- Kapitalkan baris subjek
- Jangan akhiri subjek dengan titik
- Gunakan body untuk menjelaskan apa dan mengapa, bukan bagaimana

---

## 🔀 Pull Request Process | Proses Pull Request

### Before Submitting | Sebelum Submit

**EN:** Ensure your PR:  
**ID:** Pastikan PR Anda:

- [ ] Follows coding standards | Mengikuti standar coding
- [ ] Includes descriptive commit messages | Menyertakan pesan commit yang deskriptif
- [ ] Updates documentation if needed | Memperbarui dokumentasi jika diperlukan
- [ ] Has been tested | Telah dites
- [ ] Doesn't break existing functionality | Tidak merusak fungsionalitas yang ada

### PR Template | Template PR

```markdown
## Description | Deskripsi
Brief description of the changes made.

## Type of Change | Tipe Perubahan
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Code refactoring

## Screenshots (if applicable) | Screenshot (jika ada)
Add screenshots here

## Testing | Pengujian
Describe how you tested your changes

## Checklist | Checklist
- [ ] My code follows the project's style guidelines
- [ ] I have performed a self-review of my code
- [ ] I have commented my code where necessary
- [ ] My changes generate no new warnings
- [ ] I have tested my changes
```

### Review Process | Proses Review

**EN:**
1. Maintainers will review your PR within 48 hours
2. Address any requested changes
3. Once approved, your PR will be merged
4. Your contribution will be acknowledged

**ID:**
1. Maintainer akan mereview PR Anda dalam 48 jam
2. Tangani setiap perubahan yang diminta
3. Setelah disetujui, PR Anda akan di-merge
4. Kontribusi Anda akan diakui

---

## 🐛 Issue Guidelines | Panduan Issue

### Bug Report Template | Template Laporan Bug

```markdown
**Describe the bug | Deskripsikan bug:**
A clear description of what the bug is.

**To Reproduce | Cara Reproduksi:**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '...'
3. Scroll down to '...'
4. See error

**Expected behavior | Perilaku yang diharapkan:**
What you expected to happen.

**Screenshots | Screenshot:**
If applicable, add screenshots.

**Environment | Environment:**
 - OS: [e.g. Windows 10]
 - Browser: [e.g. Chrome 120]
 - Version: [e.g. 1.0.0]

**Additional context | Konteks tambahan:**
Any other context about the problem.
```

### Feature Request Template | Template Permintaan Fitur

```markdown
**Is your feature request related to a problem? | Apakah permintaan fitur terkait masalah?**
A clear description of what the problem is.

**Describe the solution you'd like | Deskripsikan solusi yang Anda inginkan:**
A clear description of what you want to happen.

**Describe alternatives you've considered | Deskripsikan alternatif yang Anda pertimbangkan:**
Any alternative solutions or features you've considered.

**Additional context | Konteks tambahan:**
Any other context or screenshots about the feature request.
```

---

## 🏆 Recognition | Penghargaan

### English
All contributors will be:
- Listed in our Contributors section
- Acknowledged in release notes
- Given credit in documentation
- Featured on our website (for major contributions)

### Bahasa Indonesia
Semua kontributor akan:
- Terdaftar di bagian Kontributor
- Diakui dalam catatan rilis
- Diberi kredit dalam dokumentasi
- Ditampilkan di website kami (untuk kontribusi besar)

---

## 📞 Need Help? | Butuh Bantuan?

### English
If you have questions about contributing:
- Check our [Documentation](DOCUMENTATION.md)
- Open a [Discussion](https://github.com/1412240028/QianlunShop/discussions)
- Contact the maintainers
- Join our community chat

### Bahasa Indonesia
Jika Anda memiliki pertanyaan tentang kontribusi:
- Periksa [Dokumentasi](DOCUMENTATION.md) kami
- Buka [Diskusi](https://github.com/1412240028/QianlunShop/discussions)
- Hubungi maintainer
- Bergabung dengan chat komunitas kami

---

## 🙏 Thank You! | Terima Kasih!

<div align="center">

**Your contributions make QianlunShop better for everyone!**  
**Kontribusi Anda membuat QianlunShop lebih baik untuk semua orang!**

**Happy Coding! | Selamat Coding!** 🚀

</div>

---

<div align="center">

[⬆ Back to Top | Kembali ke Atas](#contributing-to-qianlunshop--berkontribusi-ke-qianlunshop)

</div>
