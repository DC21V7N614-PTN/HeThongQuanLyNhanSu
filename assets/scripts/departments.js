// Quản lý phòng ban
export class DepartmentManager {
    constructor(storage, ui) {
        this.storage = storage;
        this.ui = ui;
        this.currentEditing = null;
        this.init();
    }

    init() {
        document.getElementById("addDepartmentBtn").addEventListener("click", () => this.openModal());
        document.getElementById("closeDepartmentModal").addEventListener("click", () => this.closeModal());
        document.getElementById("cancelDepartmentBtn").addEventListener("click", () => this.closeModal());

        document.getElementById("departmentForm").addEventListener("submit", (e) => {
            e.preventDefault();
            this.saveDepartment();
        });
    }

    openModal(dept = null) {
        this.currentEditing = dept;
        const title = document.getElementById("departmentModalTitle");

        if (dept) {
            title.textContent = "Chỉnh sửa phòng ban";
            document.getElementById("departmentName").value = dept.name;
            document.getElementById("departmentDescription").value = dept.description || "";
        } else {
            title.textContent = "Thêm phòng ban mới";
            document.getElementById("departmentForm").reset();
        }
        this.ui.openModal("departmentModal");
    }

    closeModal() {
        this.ui.closeModal("departmentModal");
        this.currentEditing = null;
    }

    saveDepartment() {
        const name = document.getElementById("departmentName").value.trim();
        const description = document.getElementById("departmentDescription").value.trim();

        if (!name) return;

        const data = {
            id: this.currentEditing ? this.currentEditing.id : Date.now(),
            name,
            description,
            updatedAt: new Date().toISOString()
        };

        if (this.currentEditing) {
            const index = this.storage.getDepartments().findIndex(d => d.id === this.currentEditing.id);
            this.storage.updateDepartment(index, data);
            this.ui.showNotification("Cập nhật thành công", "success");
        } else {
            this.storage.addDepartment(data);
            this.ui.showNotification("Thêm mới thành công", "success");
        }

        this.closeModal();
        this.renderTable();
        window.dispatchEvent(new Event('dataChanged'));
    }

    deleteDepartment(id) {
        if (this.storage.getEmployees().some(e => e.departmentId === id)) {
            this.ui.showNotification("Không thể xóa phòng ban đang có nhân viên", "error");
            return;
        }
        if (confirm("Xóa phòng ban này?")) {
            this.storage.deleteDepartment(id);
            this.renderTable();
            this.ui.showNotification("Đã xóa", "success");
            window.dispatchEvent(new Event('dataChanged'));
        }
    }

    renderTable() {
        const tbody = document.getElementById("departmentTableBody");
        tbody.innerHTML = "";

        this.storage.getDepartments().forEach(dept => {
            const count = this.storage.getEmployees().filter(e => e.departmentId === dept.id).length;
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>PB${dept.id.toString().padStart(3, "0")}</td>
                <td>${dept.name}</td>
                <td>${dept.description || "N/A"}</td>
                <td>${count}</td>
                <td>
                    <div class="flex gap-2">
                         <button class="btn btn-sm btn-secondary edit-dept-btn" data-id="${dept.id}"><i class="fas fa-edit"></i></button>
                        <button class="btn btn-sm btn-destructive delete-dept-btn" data-id="${dept.id}"><i class="fas fa-trash"></i></button>
                    </div>
                </td>
            `;
            tbody.appendChild(tr);
        });


        tbody.querySelectorAll(".edit-dept-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                const dept = this.storage.getDepartments().find(d => d.id == btn.dataset.id);
                this.openModal(dept);
            });
        });

        tbody.querySelectorAll(".delete-dept-btn").forEach(btn => {
            btn.addEventListener("click", () => this.deleteDepartment(Number(btn.dataset.id)));
        });
    }
}