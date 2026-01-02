// Báo cáo và Cài đặt
import { formatCurrency, downloadFile, formatDate } from './utils.js';

export class ReportManager {
    constructor(storage, ui) {
        this.storage = storage;
        this.ui = ui;
        this.init();
    }

    init() {
        // Xuất & In
        document.getElementById("exportCSVBtn").addEventListener("click", () => this.exportToCSV());
        document.getElementById("exportJSONBtn").addEventListener("click", () => this.exportToJSON());
        document.getElementById("printReportBtn").addEventListener("click", () => this.printReport());

        // Cài đặt (Sao lưu/Khôi phục)
        document.getElementById("backupBtn").addEventListener("click", () => this.backupData());
        document.getElementById("restoreBtn").addEventListener("click", () => document.getElementById("restoreFile").click());
        document.getElementById("restoreFile").addEventListener("change", (e) => this.restoreData(e.target.files[0]));
        document.getElementById("clearDataBtn").addEventListener("click", () => {
            if (confirm("Dữ liệu sẽ mất vĩnh viễn. Tiếp tục?")) this.storage.clear();
        });
    }

    generateAll() {
        this.generateDepartmentStats();
        this.generatePositionStats();
        this.generateSalaryStats();
    }

    generateDepartmentStats() {
        const container = document.getElementById("departmentStats");
        container.innerHTML = "";

        this.storage.getDepartments().forEach(dept => {
            const emps = this.storage.getEmployees().filter(e => e.departmentId === dept.id);
            const avg = emps.length ? emps.reduce((s, e) => s + (e.salary || 0), 0) / emps.length : 0;

            const div = document.createElement("div");
            div.className = "stat-item p-3 border rounded mb-2";
            div.innerHTML = `
                <div class="flex justify-between"><strong>${dept.name}</strong> <span>${emps.length} nhân viên</span></div>
                <div class="text-sm text-gray-500">Lương TB: ${formatCurrency(avg)}</div>
            `;
            container.appendChild(div);
        });
    }

    generatePositionStats() {
        const container = document.getElementById("positionStats");
        container.innerHTML = "";

        [...this.storage.getPositions()].sort((a, b) => a.level - b.level).forEach(pos => {
            const emps = this.storage.getEmployees().filter(e => e.positionId === pos.id);
            const avg = emps.length ? emps.reduce((s, e) => s + (e.salary || 0), 0) / emps.length : 0;

            const div = document.createElement("div");
            div.className = "stat-item p-3 border rounded mb-2";
            div.innerHTML = `
                <div class="flex justify-between"><strong>${pos.name}</strong> <span>${emps.length} nhân viên</span></div>
                <div class="text-sm text-gray-500">Lương TB: ${formatCurrency(avg)}</div>
            `;
            container.appendChild(div);
        });
    }

    generateSalaryStats() {
        const container = document.getElementById("salaryStats");
        const salaries = this.storage.getEmployees().map(e => e.salary || 0).filter(s => s > 0);

        if (!salaries.length) {
            container.innerHTML = "<p>Chưa có dữ liệu lương</p>";
            return;
        }

        const total = salaries.reduce((a, b) => a + b, 0);
        const stats = [
            { label: "Tổng quỹ lương", val: total },
            { label: "Trung bình", val: total / salaries.length },
            { label: "Thấp nhất", val: Math.min(...salaries) },
            { label: "Cao nhất", val: Math.max(...salaries) }
        ];

        container.innerHTML = "";
        stats.forEach(s => {
            const div = document.createElement("div");
            div.className = "flex justify-between p-3 border rounded mb-2";
            div.innerHTML = `<strong>${s.label}</strong> <span style="color:var(--color-accent)">${formatCurrency(s.val)}</span>`;
            container.appendChild(div);
        });
    }

    exportToCSV() {
        const headers = ["Mã NV", "Họ tên", "Email", "Lương"];
        const rows = this.storage.getEmployees().map(e => [e.id, `"${e.fullName}"`, e.email, e.salary || 0].join(","));
        downloadFile([headers.join(","), ...rows].join("\n"), "employees.csv", "text/csv");
        this.ui.showNotification("Xuất CSV thành công", "success");
    }

    exportToJSON() {
        const data = {
            employees: this.storage.getEmployees(),
            departments: this.storage.getDepartments(),
            positions: this.storage.getPositions()
        };
        downloadFile(JSON.stringify(data, null, 2), "hr-data.json", "application/json");
        this.ui.showNotification("Xuất JSON thành công", "success");
    }

    printReport() {
        window.print();
    }

    backupData() {
        this.exportToJSON();
    }

    restoreData(file) {
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                if (data.employees && data.departments) {
                    if (confirm("Ghi đè dữ liệu cũ?")) {
                        this.storage.restore(data);
                        this.ui.showNotification("Khôi phục thành công", "success");
                        setTimeout(() => location.reload(), 1000);
                    }
                }
            } catch (err) {
                this.ui.showNotification("File lỗi", "error");
            }
        };
        reader.readAsText(file);
    }
}