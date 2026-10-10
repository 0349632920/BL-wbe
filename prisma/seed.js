const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Bắt đầu seed...");

  // 1. Tạo admin
  const adminPass = await bcrypt.hash("admin123", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@blreview.com" },
    update: {},
    create: {
      email: "admin@blreview.com",
      username: "admin",
      password: adminPass,
      role: "ADMIN"
    }
  });
  console.log("✅ Admin:", admin.username);

  // 2. Tạo user thường
  const userPass = await bcrypt.hash("user123", 10);
  const user1 = await prisma.user.upsert({
    where: { email: "fan01@example.com" },
    update: {},
    create: {
      email: "fan01@example.com",
      username: "fanbl01",
      password: userPass
    }
  });
  console.log("✅ User:", user1.username);

  // 3. Tạo truyện mẫu
  const truyenData = [
    {
      slug: "yeu-em-tu-cai-nhin-dau-tien",
      ten: "Yêu Em Từ Cái Nhìn Đầu Tiên",
      tacGia: "Tác giả ABC",
      hoaSi: "Họa sĩ XYZ",
      moTa: "Câu chuyện tình yêu học đường ngọt ngào giữa hai chàng trai. Một bên lạnh lùng, một bên hoạt bát — liệu họ có đến được với nhau?",
      theLoai: ["Đam mỹ", "Học đường"],
      tags: ["Ngọt", "HE", "Hài"],
      warning: [],
      trangThai: "Hoàn thành",
      quocGia: "KR"
    },
    {
      slug: "hoc-duong-ngot-ngao",
      ten: "Học Đường Ngọt Ngào",
      tacGia: "Tác giả XYZ",
      moTa: "Tình yêu tuổi học trò trong sáng, đầy cảm xúc.",
      theLoai: ["Đam mỹ", "Học đường"],
      tags: ["Học đường", "Ngọt"],
      warning: [],
      trangThai: "Đang ra",
      quocGia: "JP"
    },
    {
      slug: "nguoc-dai-tinh-yeu",
      ten: "Ngược Đãi Tình Yêu",
      tacGia: "Tác giả DEF",
      moTa: "Một câu chuyện đầy nước mắt, khi tình yêu bị thử thách bởi hiểu lầm và định kiến.",
      theLoai: ["Đam mỹ", "Ngược"],
      tags: ["Ngược", "BE", "Tâm lý"],
      warning: ["18+", "Ngược", "SE"],
      trangThai: "Hoàn thành",
      quocGia: "CN"
    },
    {
      slug: "co-dai-duyen",
      ten: "Cổ Đại Duyên",
      tacGia: "Tác giả GHI",
      moTa: "Chuyện tình giữa một vị vương gia và thư sinh nghèo.",
      theLoai: ["Đam mỹ", "Cổ đại"],
      tags: ["Cổ đại", "HE", "Sủng"],
      warning: [],
      trangThai: "Đang ra",
      quocGia: "CN"
    },
    {
      slug: "trinh-tham-dem-toi",
      ten: "Trinh Thám Đêm Tối",
      tacGia: "Tác giả JKL",
      moTa: "Thám tử và cảnh sát cùng phá án, tình cảm nảy sinh trong nguy hiểm.",
      theLoai: ["Đam mỹ", "Trinh thám"],
      tags: ["Trinh thám", "Hành động", "HE"],
      warning: ["Bạo lực"],
      trangThai: "Đang ra",
      quocGia: "JP"
    }
  ];

  const truyens = [];
  for (const data of truyenData) {
    const t = await prisma.truyen.upsert({
      where: { slug: data.slug },
      update: {},
      create: data
    });
    truyens.push(t);
    console.log("✅ Truyện:", t.ten);
  }

  // 4. Tạo review mẫu
  await prisma.review.create({
    data: {
      userId: user1.id,
      truyenId: truyens[0].id,
      tieuDe: "Tuyệt vời, đáng đọc!",
      noiDung: "Truyện này mình đọc một mạch luôn. Nhân vật dễ thương, plot chặt chẽ, cảm xúc dâng trào. Highly recommend!",
      diemNoiDung: 9,
      diemNhanVat: 9.5,
      diemCamXuc: 9,
      diemTong: 9.2,
      spoiler: false
    }
  });

  // Cập nhật điểm trung bình cho truyện
  await prisma.truyen.update({
    where: { id: truyens[0].id },
    data: {
      diemTB: 9.2,
      diemNoiDungTB: 9,
      diemNhanVatTB: 9.5,
      diemCamXucTB: 9,
      soReview: 1,
      luotXem: 150
    }
  });

  console.log("🎉 Seed xong!");
}

main()
  .catch(e => {
    console.error("❌ Lỗi seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
