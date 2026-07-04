# Tài liệu Thiết kế & Kiến trúc Dự án (DESIGN.md)

Tài liệu này mô tả chi tiết kiến trúc thư mục, hệ thống thiết kế (Design System), các hiệu ứng tương tác 3D và chuyển động nâng cao, cũng như quy trình biên dịch và phát triển của dự án portfolio cá nhân của **Nguyễn Hiếu** (**DEV · WEB3 RESEARCHER**).

---

## 1. Tổng quan dự án

Dự án là một trang Portfolio cá nhân độc đáo, kết hợp giữa phát triển phần mềm (Development) và nghiên cứu blockchain (Web3 Research). Trang web được thiết kế theo phong cách tối giản sang trọng hiện đại (**"Editorial Noir"**), sử dụng màu nền tối chủ đạo kết hợp với các hiệu ứng ánh sáng gradient chuyển màu huyền ảo (holographic/glow), cùng các chuyển động 3D tương tác động trực tiếp theo thao tác cuộn trang hoặc di chuyển chuột.

---

## 2. Cấu trúc Thư mục Dự án

Dưới đây là sơ đồ cấu trúc thư mục của dự án và các file mã nguồn cốt lõi:

```text
portfolio/
├── assets/                    # Chứa các tài nguyên tĩnh (hình ảnh, logo, tài liệu PDF, favicons)
│   ├── favicon/               # Favicons cho nhiều nền tảng và thiết bị khác nhau
│   ├── jpeg/                  # Hình ảnh dạng JPEG (ví dụ: mockups dự án)
│   ├── png/                   # Hình ảnh dạng PNG (ví dụ: ảnh chân dung cá nhân, chứng chỉ)
│   │   ├── about/             # Ảnh phần giới thiệu bản thân
│   │   └── certificate/       # Ảnh minh họa các chứng chỉ trực quan
│   ├── svg/                   # Các tài nguyên hình ảnh vector định dạng SVG
│   └── pdf/                   # Chứa CV và bản sao chứng chỉ định dạng PDF để tải về
│
├── css/                       # Chứa file CSS sau khi được biên dịch hoàn chỉnh
│   ├── style.css              # File CSS chính được nạp vào trang HTML
│   └── style.css.map          # Bản đồ mã nguồn (Source Map) phục vụ cho debug CSS
│
├── js/                        # Thư mục chứa các tệp mã nguồn JavaScript đặc thù cho đồ họa và chuyển động
│   ├── hero-frame-babylon.js  # Tạo khung viền 3D hologram tương tác theo con trỏ chuột bằng Babylon.js
│   ├── hero-webgl.js          # Hệ thống hạt 3D nebula bằng Three.js (dùng cho các mục đích thử nghiệm)
│   └── scroll-story.js        # Logic điều khiển Scroll Story (Lenis, Three.js background, GSAP)
│
├── sass/                      # Thư mục chứa mã nguồn SASS được chia mô-đun
│   ├── abstracts/             # Các định nghĩa chung không trực tiếp sinh ra CSS (biến, mixins, tokens)
│   │   ├── _design-tokens.scss# Hệ thống biến CSS (màu nền, stroke, gradient, transitions)
│   │   ├── _mixins.scss       # Định nghĩa các breakpoints Media Queries phục vụ Responsive
│   │   ├── _variables.scss    # Các biến SASS toàn cục hỗ trợ
│   │   └── _utilities.scss    # Lớp tiện ích dùng chung (heading, button, spacing)
│   ├── base/                  # Các thiết lập cơ bản ban đầu cho dự án
│   │   └── _base.scss         # Reset trình duyệt, cài đặt font, cỡ chữ gốc (rem)
│   ├── components/            # Các khối giao diện nhỏ tái sử dụng
│   │   ├── _header.scss       # Thanh điều hướng header cố định, hỗ trợ blur nền
│   │   ├── _footer.scss       # Chân trang với layout bento lấp lánh màu sắc ảo ảnh
│   │   ├── _skills.scss       # Các thẻ hiển thị công nghệ và kỹ năng
│   │   ├── _certificates.scss # Thiết kế thẻ chứng chỉ dạng vé hologram "Admission Ticket" độc đáo
│   │   ├── _mouse-scroll.scss # Hiệu ứng hoạt họa chuột cuộn gợi ý
│   │   └── _scroll-story.scss # Giao diện điều hướng chrome (beacon, orbit) của Scroll Story
│   ├── pages/                 # Kiểu dáng riêng cho từng trang
│   │   ├── _home.scss         # Kiểu dáng chính cho trang chủ (Hero, About, Bento Grid, Manifesto)
│   │   └── _project-case-study.scss # Kiểu dáng dành cho các trang nghiên cứu ca dự án riêng lẻ
│   └── main.scss              # Điểm nạp trung tâm của toàn bộ hệ thống SASS
│
├── index.html                 # Trang đơn (landing page) trung tâm hiển thị toàn bộ Portfolio
├── index.js                   # Xử lý các tương tác giao diện thông thường (menu di động, observer, links)
├── package.json               # Quản lý thư viện phụ thuộc và định nghĩa các lệnh biên dịch/phát triển
├── README.md                  # Tài liệu giới thiệu cơ bản
└── project-1.html, etc.       # Các trang chi tiết dự án dự phòng (Case Study)
```

### Các liên kết file cốt lõi:
- **Tập tin HTML chính**: [index.html](file:///d:/DoAnCaNhan/portfolio/index.html)
- **Tập tin Javascript giao diện**: [index.js](file:///d:/DoAnCaNhan/portfolio/index.js)
- **Tập tin cấu hình dự án**: [package.json](file:///d:/DoAnCaNhan/portfolio/package.json)
- **Điểm nạp phong cách chính**: [sass/main.scss](file:///d:/DoAnCaNhan/portfolio/sass/main.scss)

---

## 3. Hệ thống Thiết kế Giao diện (UI Design System)

Hệ thống giao diện được xây dựng nhất quán thông qua thiết lập Design Tokens và các lớp tiện ích:

### 3.1. Design Tokens
Định nghĩa tại [_design-tokens.scss](file:///d:/DoAnCaNhan/portfolio/sass/abstracts/_design-tokens.scss), đóng vai trò cấu trúc nền tảng cho giao diện **"Editorial Noir"**:
*   **Màu nền chủ đạo (`--page-bg: #050508`)**: Tông xanh đen vũ trụ sâu thẳm, tạo độ tương phản tốt nhất cho các hiệu ứng phát sáng.
*   **Mặt phẳng nâng cao (`--page-elevated: #0c0e14`)**: Dùng cho các thẻ, panel nổi lên trên nền chính.
*   **Màu chữ**: Chữ chính (`--text-primary: #f1f5f9`) mang sắc xám trắng dịu mắt, chữ phụ (`--text-muted: rgba(226, 232, 240, 0.55)`) giảm độ sáng để phân tách phân cấp thông tin.
*   **Đường viền siêu mảnh (`--stroke-hairline: rgba(255, 255, 255, 0.08)`)**: Tạo độ tinh tế cho các đường lưới và viền hộp mà không gây xao nhãng.
*   **Dải chuyển màu thương hiệu (`--gradient-brand`)**: Sự kết hợp mượt mà của 3 gam màu công nghệ cao: Cyan (`#38bdf8`) → Rose (`#f472b6`) → Lavender (`#a78bfa`).
*   **Hiệu ứng làm mờ chuyển động mượt (`--ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1)`)**: Tối ưu tốc độ mở rộng menu và hiệu ứng hover.

### 3.2. Typography (Phông chữ)
Cấu hình tại [_base.scss](file:///d:/DoAnCaNhan/portfolio/sass/base/_base.scss):
*   Sử dụng phông chữ **`DM Sans`** cho phần lớn văn bản, thẻ kỹ năng, văn bản mô tả, và nút bấm nhằm đảm bảo khả năng đọc tốt ở các kích thước nhỏ.
*   Sử dụng phông chữ **`Syne`** với độ dày cực lớn (`font-weight: 800`) cho các tiêu đề chính (`h1`, `h2`), tạo điểm nhấn nghệ thuật mạnh mẽ, cá tính và đậm chất tạp chí kỹ thuật số.

### 3.3. Các thành phần giao diện đặc trưng (Components)
*   **Thanh điều hướng Header** ([_header.scss](file:///d:/DoAnCaNhan/portfolio/sass/components/_header.scss)):
    Sử dụng hiệu ứng `backdrop-filter: blur` để tạo lớp kính mờ phía trên nội dung. Khi cuộn trang qua một ngưỡng nhất định, lớp `.header--scrolled` được kích hoạt thông qua mã JS trong [index.js](file:///d:/DoAnCaNhan/portfolio/index.js#L30-L41) để chuyển header sang nền tối hơn và tăng độ đổ bóng, giúp giữ nguyên độ tương phản và không bị lẫn vào nội dung trang.
*   **Thẻ Chứng chỉ Hologram** ([_certificates.scss](file:///d:/DoAnCaNhan/portfolio/sass/components/_certificates.scss)):
    Được thiết kế dưới hình dạng một chiếc vé vào cửa độc đáo (**"Admission Ticket"**). Thẻ bao gồm:
    *   Đường răng cưa đục lỗ tách biệt phần cuống vé (`.cert-ticket__perforation`).
    *   Tem xác nhận nghiêng góc (`.cert-ticket__stamp`) và mã vạch trang trí (`.cert-ticket__barcode`).
    *   Lớp phủ chuyển sắc đa chiều tương tác (`.cert-ticket__holo`) chạy hiệu ứng xoay tròn vô tận (`cert-holo-rotate`), kết hợp viền sáng phản quang (`.cert-ticket__edge`), tạo cảm giác như một thẻ hologram vật lý thực sự.
*   **Thẻ Kỹ năng Chips** ([_skills.scss](file:///d:/DoAnCaNhan/portfolio/sass/components/_skills.scss)):
    Hiển thị các công cụ kỹ thuật và kỹ năng mềm dưới dạng chip bo tròn tinh tế, tự động thu nhỏ khoảng cách và kích thước font chữ khi màn hình chuyển sang chế độ di động.

---

## 4. Hệ thống Chuyển động và Tương tác 3D (Animations & 3D Effects)

Dự án sở hữu các tính năng chuyển động nâng cao được thiết lập tối ưu để không ảnh hưởng tới hiệu năng và trải nghiệm người dùng:

### 4.1. Hệ thống cuộn trang Scroll Story
Thiết lập chính trong tệp [scroll-story.js](file:///d:/DoAnCaNhan/portfolio/js/scroll-story.js) và kiểu dáng trong [_scroll-story.scss](file:///d:/DoAnCaNhan/portfolio/sass/components/_scroll-story.scss). Hiệu ứng chỉ kích hoạt trên các màn hình có chiều rộng $\ge 901\text{px}$ và không kích hoạt khi người dùng cấu hình giảm hiệu ứng chuyển động (`prefers-reduced-motion: reduce`).

Các thành phần giao diện phục vụ Scroll Story bao gồm:
1.  **Lenis Smooth Scroll**: Cung cấp khả năng cuộn trang quán tính mượt mà trên mọi trình duyệt, đồng bộ hóa chu kỳ hoạt họa của thư viện GSAP.
2.  **Màn nền 3D Canvas (Three.js)**:
    Vẽ trực tiếp lên `#scroll-story-canvas`. Nó bao gồm 3 mô hình dạng khung dây (wireframe):
    *   *Icosahedron* (Màu ngọc lục bảo Cyan - `0x5eead4`)
    *   *TorusKnot* (Màu hồng Rose - `0xf472b6`)
    *   *Octahedron* (Màu tím Lavender - `0xc4b5fd`)
    Khi người dùng cuộn chuột, góc nhìn camera trong Three.js (`camera.position.z`) và độ xoay của các khối dây sẽ liên tục thay đổi theo tỷ lệ cuộn (`scrollProg`) và chương nội dung hiện tại (`narrativePhase`), tạo không gian đa chiều chiều sâu cho trang web.
3.  **Vòng quay tiến trình cuộn Orbit (`.story-orbit`)**:
    Một đĩa tròn nhỏ nằm ở góc trên bên phải màn hình, sử dụng thuộc tính CSS `conic-gradient` được liên tục cập nhật biến `--p` đại diện cho phần trăm tiến trình cuộn trang từ `0` đến `1` thông qua sự kiện `onUpdate` của GSAP ScrollTrigger.
4.  **Cột Beacon dẫn đường (`.story-beacon`)**:
    Nằm dọc bên cạnh trái màn hình hiển thị các chương hiện tại (Intro, About, Work, Proof, Contact). Khi scroll tới chương nào, beacon tương ứng sẽ tự động kích hoạt trạng thái `.is-active` và làm nổi bật tiêu đề chương đó.
5.  **Trượt ngang danh sách Dự án (Horizontal Projects Carousel)**:
    Khi người dùng cuộn chuột ở vùng dự án `#projects`, GSAP ScrollTrigger sẽ thực hiện khóa cứng màn hình theo chiều dọc (`pin: true`) và dịch chuyển tịnh tiến danh sách thẻ dự án `.projects__grid` theo trục X bằng giá trị chiều rộng tràn của khối nội dung (`will-change: transform`), mang tới trải nghiệm xem dự án theo chiều ngang độc đáo trước khi tiếp tục cuộn xuống.

### 4.2. Khung ảnh Hologram 3D Hero Section
Cài đặt trong [hero-frame-babylon.js](file:///d:/DoAnCaNhan/portfolio/js/hero-frame-babylon.js):
*   Tạo ra một canvas đồ họa 3D riêng biệt đặt ngay phía sau ảnh chân dung cá nhân ở Hero Section thông qua công nghệ **Babylon.js**.
*   Sử dụng một camera trực giao (`ORTHOGRAPHIC_CAMERA`) giúp ánh xạ chính xác kích thước pixel trên màn hình với đơn vị tọa độ 3D trong Babylon.
*   Bằng cách lắng nghe sự kiện di chuyển chuột `mousemove` trên vùng `.home-hero`, khung viền chữ nhật phát sáng Cyan (`StandardMaterial` kết hợp bộ lọc phát quang `GlowLayer`) xung quanh ảnh chân dung sẽ tự động xoay nhẹ (`rotation.x` và `rotation.z`) bám theo tọa độ chuột của người dùng, đi kèm hiệu ứng nhịp đập ánh sáng mờ ảo (`pulse`).

---

## 5. Quy trình Biên dịch và Phát triển (Build & Dev Pipeline)

Quy trình biên dịch và phát triển được quản lý tự động thông qua tập tin cấu hình [package.json](file:///d:/DoAnCaNhan/portfolio/package.json):

### 5.1. Các thư viện công cụ hỗ trợ phát triển (devDependencies):
*   `sass`: Công cụ biên dịch tệp `.scss` thành mã CSS thuần chất lượng cao.
*   `autoprefixer`: Tự động thêm các tiền tố nhà sản xuất (vendor prefixes như `-webkit-`, `-moz-`) để đảm bảo các thuộc tính CSS mới hoạt động ổn định trên nhiều phiên bản trình duyệt cũ.
*   `postcss-cli`: Chạy quy trình tối ưu hóa CSS sau biên dịch.
*   `live-server`: Khởi tạo một máy chủ ảo nội bộ chạy trực tiếp trang web trên trình duyệt và tự động làm mới trang (live reload) mỗi khi có thay đổi mã nguồn.
*   `npm-run-all`: Hỗ trợ chạy nhiều tác vụ NPM đồng thời hoặc tuần tự một cách ngắn gọn.

### 5.2. Các câu lệnh phát triển cốt lõi (NPM Scripts):
*   **Biên dịch SASS liên tục**:
    ```bash
    npm run compile:scss
    # Thực thi: sass --watch sass/main.scss css/style.css
    ```
    Theo dõi mọi thay đổi trong thư mục `sass` và tự động cập nhật lại file `css/style.css`.
*   **Tự động tương thích trình duyệt (PostCSS)**:
    ```bash
    npm run prefix:css
    # Thực thi: postcss --use autoprefixer -b 'last 10 versions' css/style.css -o css/style.css
    ```
    Tự động chèn các tiền tố tương thích trình duyệt cho 10 phiên bản gần nhất vào file `style.css`.
*   **Nén tối ưu hóa CSS**:
    ```bash
    npm run compress:css
    # Thực thi: sass css/style.css css/style.css --style=compressed
    ```
    Nén nhỏ dung lượng file CSS tối đa trước khi đưa sản phẩm lên môi trường chạy thực tế.
*   **Xây dựng bản phân phối hoàn chỉnh**:
    ```bash
    npm run build
    # Thực thi: npm-run-all prefix:css compress:css
    ```
    Chạy tuần tự quy trình bổ sung tiền tố tương thích trình duyệt và nén file CSS để sẵn sàng triển khai.
*   **Môi trường chạy phát triển (Local Development)**:
    ```bash
    npm run dev
    # Thực thi: npm-run-all --parallel compile:scss serve
    ```
    Chạy song song quá trình theo dõi thay đổi SASS và khởi chạy máy chủ Live Server nội bộ ở cổng `5500`.

---
*Tài liệu được cập nhật tự động vào tháng 7 năm 2026.*
