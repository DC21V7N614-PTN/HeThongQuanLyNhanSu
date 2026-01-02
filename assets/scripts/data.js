// Dữ liệu mặc định
export const defaultDepartments = [
    { id: 1, name: "Phòng Kỹ thuật", description: "Phát triển sản phẩm và công nghệ" },
    { id: 2, name: "Phòng Kinh doanh", description: "Bán hàng và chăm sóc khách hàng" },
    { id: 3, name: "Phòng Nhân sự", description: "Quản lý nhân viên và tuyển dụng" },
    { id: 4, name: "Phòng Tài chính", description: "Quản lý tài chính và kế toán" },
    { id: 5, name: "Phòng Marketing", description: "Tiếp thị và quảng bá thương hiệu" },
];

export const defaultPositions = [
    { id: 1, name: "Giám đốc", level: 1 },
    { id: 2, name: "Phó giám đốc", level: 2 },
    { id: 3, name: "Trưởng phòng", level: 3 },
    { id: 4, name: "Phó phòng", level: 4 },
    { id: 5, name: "Nhân viên chính", level: 5 },
    { id: 6, name: "Nhân viên", level: 6 },
    { id: 7, name: "Thực tập sinh", level: 7 },
];

export const sampleEmployees = [{
        id: "NV001",
        fullName: "Nguyễn Văn An",
        email: "an.nguyen@company.com",
        phone: "0901234567",
        departmentId: 1,
        positionId: 3,
        startDate: "2023-01-15",
        salary: 15000000,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: "NV002",
        fullName: "Trần Thị Bình",
        email: "binh.tran@company.com",
        phone: "0901234568",
        departmentId: 2,
        positionId: 5,
        startDate: "2023-02-01",
        salary: 12000000,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    }
];