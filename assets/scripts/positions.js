// Quản lý chức vụ
export class PositionManager {
    constructor(storage, ui) {
        this.storage = storage;
        this.ui = ui;
        this.currentEditing = null;
        this.init();
    }

    init() {
        document.getElementById("addPositionBtn").addEventListener("click", () => this.openModal());
        document.getElementById("closePositionModal").addEventListener("click", () => this.closeModal());
        document.getElementById("cancelPositionBtn").addEventListener("click", () => this.closeModal());

        document.getElementById("positionForm").addEventListener("submit", (e) => {
            e.preventDefault();
            this.savePosition();
        });
    }

    openModal(pos = null) {
        this.currentEditing = pos;
        const title = document.getElementById("positionModalTitle");
        if (pos) {
            title.textContent = "Chỉnh sửa chức vụ";
            document.getElementById("positionName").value = pos.name;
            document.getElementById("positionLevel").value = pos.level;
        } else {
            title.textContent = "Thêm chức vụ mới";
            document.getElementById("positionForm").reset();
        }
        this.ui.openModal("positionModal");
    }

    closeModal() {
        this.ui.closeModal("positionModal");
        this.currentEditing = null;
    }

    savePosition() {
        const name = document.getElementById("positionName").value.trim();
        const level = Number.parseInt(document.getElementById("positionLevel").value);

        if (!name || !level) return;

        const data = {
            id: this.currentEditing ? this.currentEditing.id : Date.now(),
            name,
            level,
            updatedAt: new Date().toISOString()
        };

        if (this.currentEditing) {
            const index = this.storage.getPositions().findIndex(p => p.id === this.currentEditing.id);
            this.storage.updatePosition(index, data);
            this.ui.showNotification("Cập nhật thành công", "success");
        } else {
            this.storage.addPosition(data);
            this.ui.showNotification("Thêm mới thành công", "success");
        }

        this.closeModal();
        this.renderTable();
        window.dispatchEvent(new Event('dataChanged'));
    }

    deletePosition(id) {
        if (this.storage.getEmployees().some(e => e.positionId === id)) {
            this.ui.showNotification("Không thể xóa chức vụ đang có nhân viên", "error");
            return;
        }
        if (confirm("Xóa chức vụ này?")) {
            this.storage.deletePosition(id);
            this.renderTable();
            this.ui.showNotification("Đã xóa", "success");
            window.dispatchEvent(new Event('dataChanged'));
        }
    }

    renderTable() {
        const tbody = document.getElementById("positionTableBody");
        tbody.innerHTML = "";

        const sorted = [...this.storage.getPositions()].sort((a, b) => a.level - b.level);

        sorted.forEach(pos => {
            const count = this.storage.getEmployees().filter(e => e.positionId === pos.id).length;
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>CV${pos.id.toString().padStart(3, "0")}</td>
                <td>${pos.name}</td>
                <td>Cấp ${pos.level}</td>
                <td>${count}</td>
                <td>
                    <div class="flex gap-2">
                        <button class="btn btn-sm btn-secondary edit-pos-btn" data-id="${pos.id}"><i class="fas fa-edit"></i></button>
                        <button class="btn btn-sm btn-destructive delete-pos-btn" data-id="${pos.id}"><i class="fas fa-trash"></i></button>
                    </div>
                </td>
            `;
            tbody.appendChild(tr);
        });

        tbody.querySelectorAll(".edit-pos-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                const pos = this.storage.getPositions().find(p => p.id == btn.dataset.id);
                this.openModal(pos);
            });
        });

        tbody.querySelectorAll(".delete-pos-btn").forEach(btn => {
            btn.addEventListener("click", () => this.deletePosition(Number(btn.dataset.id)));
        });
    }
}