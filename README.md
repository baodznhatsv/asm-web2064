# Susan Shop - Website Bán Hàng Trực Tuyến

Website thương mại điện tử được xây dựng bằng Vanilla JavaScript, tuân thủ các thực hành hiện đại và sử dụng tính năng ES6+.

## 🛍️ Tính Năng

### Dành Cho Khách Hàng

- **Duyệt Sản Phẩm**: Xem tất cả sản phẩm theo danh mục
- **Chi Tiết Sản Phẩm**: Xem đầy đủ thông tin với các biến thể, giá cả và tình trạng tồn kho
- **Giỏ Hàng**: Thêm sản phẩm, cập nhật số lượng, xóa sản phẩm
- **Xác Thực Người Dùng**: Đăng nhập và đăng ký an toàn
- **Lọc & Tìm Kiếm**: Lọc sản phẩm theo danh mục và khoảng giá
- **Thanh Toán**: Quy trình đặt hàng hoàn chỉnh với thông tin giao hàng
- **Xác Nhận Đơn Hàng**: Trang cảm ơn sau khi thanh toán thành công

### Dành Cho Quản Trị

- **Bảng Điều Khiển**: Tổng quan về doanh số, đơn hàng, khách hàng và doanh thu
- **Quản Lý Danh Mục**: Tạo, sửa và xóa danh mục sản phẩm
- **Quản Lý Sản Phẩm**: Thêm, sửa và xóa sản phẩm với đầy đủ thông tin
- **Quản Lý Đơn Hàng**: Xem và cập nhật trạng thái đơn hàng
- **Quản Lý Khách Hàng**: Xem thông tin khách hàng và lịch sử đặt hàng
- **Thống Kê**:
  - Tổng số sản phẩm và tồn kho
  - Tổng đơn hàng và doanh thu
  - Sản phẩm bán chạy nhất
  - Cảnh báo hàng tồn kho thấp

## 🌐 Đa Ngôn Ngữ

Website hỗ trợ 2 ngôn ngữ:

- 🇻🇳 **Tiếng Việt** - Ngôn ngữ mặc định
- 🇬🇧 **English**

Người dùng có thể chuyển đổi ngôn ngữ bất kỳ lúc nào thông qua menu navigation.

## 📁 Cấu Trúc Dự Án

```
susan-shop/
├── data/                    # File dữ liệu JSON (giả lập database)
│   ├── categories.json
│   ├── products.json
│   ├── product-variants.json
│   ├── orders.json
│   ├── order-details.json
│   └── users.json
├── scripts/                 # Modules JavaScript
│   ├── api.js              # API utility để fetch dữ liệu
│   ├── auth.js             # Quản lý xác thực
│   ├── cart.js             # Quản lý giỏ hàng
│   ├── utils.js            # Các hàm tiện ích
│   ├── i18n.js             # Hỗ trợ đa ngôn ngữ
│   ├── translations.js     # Các bản dịch
│   ├── main.js              # Logic trang chủ
│   ├── products.js          # Logic trang sản phẩm
│   ├── product-detail.js    # Trang chi tiết sản phẩm
│   ├── cart-page.js         # Trang giỏ hàng
│   ├── checkout.js          # Quá trình thanh toán
│   ├── login.js             # Chức năng đăng nhập
│   ├── register.js          # Chức năng đăng ký
│   └── thank-you.js         # Xác nhận đơn hàng
├── admin/                   # Trang quản trị
│   ├── dashboard.html       # Bảng điều khiển admin
│   ├── categories.html      # Quản lý danh mục
│   ├── products.html        # Quản lý sản phẩm
│   ├── orders.html          # Quản lý đơn hàng
│   ├── customers.html       # Quản lý khách hàng
│   ├── statistics.html      # Thống kê & báo cáo
│   └── admin-*.js           # Scripts cho các trang admin
├── styles/                  # File CSS
│   ├── styles.css           # Stylesheet chính
│   └── admin.css            # Styles cho admin panel
├── images/                  # Hình ảnh sản phẩm
├── index.html               # Trang chủ
├── products.html            # Danh sách sản phẩm
├── product-detail.html      # Chi tiết sản phẩm
├── cart.html                # Giỏ hàng
├── checkout.html            # Trang thanh toán
├── login.html               # Trang đăng nhập
├── register.html            # Trang đăng ký
└── thank-you.html           # Xác nhận đơn hàng
└── README.md                # File này
```

## 🗄️ Cấu Trúc Cơ Sở Dữ Liệu

Dự án sử dụng file JSON để giả lập database với cấu trúc sau:

### Categories (Danh Mục)

- `id`: ID danh mục
- `name`: Tên danh mục
- `parent_id`: ID danh mục cha (null cho danh mục chính)

### Products (Sản Phẩm)

- `id`: ID sản phẩm
- `name`: Tên sản phẩm
- `cate_id`: ID danh mục
- `detail`: Mô tả sản phẩm
- `image`: Tên file hình ảnh

### Product Variants (Biến Thể Sản Phẩm)

- `id`: ID biến thể
- `product_id`: ID sản phẩm
- `variant_name`: Tên/mô tả biến thể
- `price`: Giá
- `quantity`: Số lượng tồn kho
- `image`: Hình ảnh biến thể

### Orders (Đơn Hàng)

- `id`: ID đơn hàng
- `user_id`: ID khách hàng
- `created_date`: Ngày đặt hàng
- `status`: Trạng thái đơn hàng (pending, shipped, completed, cancelled)

### Order Details (Chi Tiết Đơn Hàng)

- `id`: ID chi tiết đơn hàng
- `order_id`: ID đơn hàng
- `product_id`: ID sản phẩm
- `quantity`: Số lượng đặt hàng
- `unit_price`: Đơn giá

### Users (Người Dùng)

- `id`: ID người dùng
- `name`: Tên người dùng
- `email`: Địa chỉ email
- `phone`: Số điện thoại
- `address`: Địa chỉ
- `password`: Mật khẩu (đã hash trong môi trường production)
- `role`: Vai trò người dùng (member, admin)

## 🚀 Bắt Đầu

### Yêu Cầu

- Trình duyệt web hiện đại (Chrome, Firefox, Edge, Safari)
- Web server local (để test)

### Cài Đặt

1. Clone hoặc download repository
2. Mở project trong code editor của bạn
3. Khởi động web server local:

#### Sử dụng Python

```bash
python -m http.server 8000
```

#### Sử dụng Node.js

```bash
npx http-server
```

#### Sử dụng PHP

```bash
php -S localhost:8000
```

4. Mở trình duyệt và truy cập `http://localhost:8000`

### Tài Khoản Mặc Định

#### Tài Khoản Admin

- Email: `john@example.com`
- Mật khẩu: `password123`

#### Tài Khoản Thành Viên

- Email: `jane@example.com` hoặc `bob@example.com`
- Mật khẩu: `password123`

## 💻 Công Nghệ Sử Dụng

### Frontend

- **HTML5**: Semantic markup
- **CSS3**: Styling hiện đại với flexbox và grid
- **Vanilla JavaScript**: Không phụ thuộc framework
- **ES6+ Features**:
  - Arrow functions
  - Template literals
  - Destructuring
  - Spread operator
  - Classes và modules
  - Async/await
  - Fetch API

### Thư Viện

- **Font Awesome**: Icons
- **LocalStorage API**: Lưu trữ dữ liệu phía client
- **Fetch API**: HTTP requests cho dữ liệu

## 📝 Tính Năng Chính Đã Triển Khai

### Hệ Thống Module (ES6)

Tất cả JavaScript được tổ chức thành modules sử dụng ES6 import/export:

- Kiến trúc modular
- Khả năng tái sử dụng code
- Dễ bảo trì hơn

### Quản Lý Local Storage

- Giỏ hàng lưu trữ qua các session
- Quản lý trạng thái xác thực người dùng
- Lưu trữ lịch sử đơn hàng

### Thiết Kế Responsive

- Tiếp cận mobile-first
- Layout grid linh hoạt
- Giao diện thân thiện với touch

### Thực Hành JavaScript Hiện Đại

- Arrow functions cho cú pháp ngắn gọn
- Template literals cho string interpolation
- Async/await cho các thao tác bất đồng bộ
- Classes cho code hướng đối tượng
- Destructuring cho việc gán biến sạch sẽ

## 🎨 Triết Lý Thiết Kế

- **Giao Diện Sạch**: Thiết kế tối giản tập trung vào khả năng sử dụng
- **Trải Nghiệm Người Dùng**: Điều hướng trực quan và phản hồi rõ ràng
- **Hiệu Suất**: Code được tối ưu và xử lý dữ liệu hiệu quả
- **Khả Năng Truy Cập**: HTML semantic và ARIA labels phù hợp

## 📋 Checklist Tính Năng

### ✅ Các Tính Năng Đã Hoàn Thành

#### Phía Khách Hàng

- [x] Danh sách sản phẩm với danh mục
- [x] Xem chi tiết sản phẩm với biến thể
- [x] Chức năng giỏ hàng
- [x] Đăng ký người dùng
- [x] Đăng nhập/đăng xuất
- [x] Lọc sản phẩm theo danh mục và giá
- [x] Quá trình thanh toán
- [x] Trang xác nhận đơn hàng

#### Phía Quản Trị

- [x] Bảng điều khiển với thống kê
- [x] Quản lý danh mục (CRUD)
- [x] Quản lý sản phẩm (CRUD)
- [x] Quản lý đơn hàng với cập nhật trạng thái
- [x] Quản lý khách hàng
- [x] Thống kê và báo cáo
- [x] Hiển thị số lượng sản phẩm được đặt mua
- [x] Thống kê doanh thu
- [x] Cảnh báo hàng tồn kho

## 🔒 Vấn Đề Bảo Mật

- Kiểm tra đầu vào
- Xác thực email và số điện thoại
- Yêu cầu mật khẩu
- Kiểm tra xác thực cho các trang được bảo vệ
- Kiểm tra ủy quyền admin

## 🚧 Cải Tiến Trong Tương Lai

- Tích hợp gateway thanh toán
- Thông báo email
- Đánh giá và xếp hạng sản phẩm
- Chức năng yêu thích
- Tìm kiếm nâng cao
- Gợi ý sản phẩm
- Tích hợp mạng xã hội

## 📄 Giấy Phép

Dự án này được tạo cho mục đích giáo dục như một phần của khóa học WEB2064.

## 👥 Tác Giả

Trần Ngọc Bảo - PD11383

## 📞 Liên Hệ

Để đặt câu hỏi hoặc hỗ trợ, vui lòng liên hệ:

- Email: info@susanshop.com
- Điện thoại: +1 234 567 8900

---

**Lưu ý**: Đây là dự án mô phỏng sử dụng JavaScript phía client và file JSON để lưu trữ dữ liệu. Trong môi trường sản xuất, hãy triển khai các dịch vụ backend, kết nối database và các biện pháp bảo mật phù hợp.
