// Quản lý nhân viên
import { formatDate, isValidEmail, isValidPhone } from './utils.js';

export class EmployeeManager {
    constructor(storage, ui) {
        this.storage = storage;
        this.ui = ui;
        this.currentEditing = null;
        this.init();
    }

    init() {
        this.setupListeners();
        this.renderTable();
    }

    setupListeners() {
        document.getElementById("addEmployeeBtn").addEventListener("click", () => this.openModal());
        document.getElementById("closeModal").addEventListener("click", () => this.closeModal());
        document.getElementById("cancelBtn").addEventListener("click", () => this.closeModal());

        document.getElementById("employeeForm").addEventListener("submit", (e) => {
            e.preventDefault();
            this.saveEmployee();
        });

        document.getElementById("employeeSearch").addEventListener("input", () => this.renderTable());
        document.getElementById("departmentFilter").addEventListener("change", () => this.renderTable());
        document.getElementById("positionFilter").addEventListener("change", () => this.renderTable());
    }

    openModal(employee = null) {
        this.currentEditing = employee;
        const modalTitle = document.getElementById("modalTitle");
        const form = document.getElementById("employeeForm");

        if (employee) {
            modalTitle.textContent = "Chỉnh sửa nhân viên";
            this.populateForm(employee);
        } else {
            modalTitle.textContent = "Thêm nhân viên mới";
            form.reset();
            document.querySelectorAll(".form-error").forEach(el => el.textContent = "");
        }

        this.populateDropdowns('department', 'position');
        this.ui.openModal("employeeModal");
    }

    closeModal() {
        this.ui.closeModal("employeeModal");
        this.currentEditing = null;
    }

    populateDropdowns(...selectIds) {
        const departments = this.storage.getDepartments();
        const positions = this.storage.getPositions();

        selectIds.forEach(id => {
            const el = document.getElementById(id);
            if (!el) return;
            const currentVal = el.value;
            el.innerHTML = `<option value="">Chọn ${id === 'department' ? 'phòng ban' : 'chức vụ'}</option>`;

            const list = id === 'department' ? departments : positions;
            list.forEach(item => {
                const opt = document.createElement("option");
                opt.value = item.id;
                opt.textContent = item.name;
                el.appendChild(opt);
            });
            if (this.currentEditing) el.value = currentVal;
        });
    }

    populateForm(employee) {
        document.getElementById("employeeId").value = employee.id;
        document.getElementById("fullName").value = employee.fullName;
        document.getElementById("email").value = employee.email;
        document.getElementById("phone").value = employee.phone || "";
        document.getElementById("department").value = employee.departmentId;
        document.getElementById("position").value = employee.positionId;
        document.getElementById("startDate").value = employee.startDate;
        document.getElementById("salary").value = employee.salary || "";
    }

    saveEmployee() {
        if (!this.validateForm()) return;

        const employeeData = {
            id: document.getElementById("employeeId").value.trim(),
            fullName: document.getElementById("fullName").value.trim(),
            email: document.getElementById("email").value.trim(),
            phone: document.getElementById("phone").value.trim(),
            departmentId: Number.parseInt(document.getElementById("department").value),
            positionId: Number.parseInt(document.getElementById("position").value),
            startDate: document.getElementById("startDate").value,
            salary: document.getElementById("salary").value ? Number.parseFloat(document.getElementById("salary").value) : null,
            updatedAt: new Date().toISOString(),
            createdAt: this.currentEditing ? this.currentEditing.createdAt : new Date().toISOString(),
        };

        if (this.currentEditing) {
            const index = this.storage.getEmployees().findIndex(e => e.id === this.currentEditing.id);
            if (index !== -1) this.storage.updateEmployee(index, employeeData);
            this.ui.showNotification("Cập nhật thành công", "success");
        } else {
            this.storage.addEmployee(employeeData);
            this.ui.showNotification("Thêm mới thành công", "success");
        }

        this.closeModal();
        this.renderTable();
        window.dispatchEvent(new Event('dataChanged')); // Notify dashboard
    }

    validateForm() {
        let isValid = true;
        const id = document.getElementById("employeeId").value.trim();
        const email = document.getElementById("email").value.trim();


        if (!id) isValid = false;
        if (!this.currentEditing && this.storage.getEmployees().some(e => e.id === id)) {
            document.getElementById("employeeIdError").textContent = "Mã đã tồn tại";
            isValid = false;
        }

        if (!isValidEmail(email)) {
            document.getElementById("emailError").textContent = "Email không hợp lệ";
            isValid = false;
        }

        return isValid;
    }

    deleteEmployee(id) {
        if (confirm("Bạn có chắc muốn xóa nhân viên này?")) {
            this.storage.deleteEmployee(id);
            this.renderTable();
            this.ui.showNotification("Đã xóa nhân viên", "success");
            window.dispatchEvent(new Event('dataChanged'));
        }
    }

    renderTable() {
        const tbody = document.getElementById("employeeTableBody");
        const searchTerm = document.getElementById("employeeSearch").value.toLowerCase();
        const deptFilter = document.getElementById("departmentFilter").value;
        const posFilter = document.getElementById("positionFilter").value;

        const filtered = this.storage.getEmployees().filter(emp => {
            const matchSearch = !searchTerm || emp.fullName.toLowerCase().includes(searchTerm) || emp.id.toLowerCase().includes(searchTerm);
            const matchDept = !deptFilter || emp.departmentId.toString() === deptFilter;
            const matchPos = !posFilter || emp.positionId.toString() === posFilter;
            return matchSearch && matchDept && matchPos;
        });

        tbody.innerHTML = filtered.length ? "" : `<tr><td colspan="7" class="text-center">Không có dữ liệu</td></tr>`;

        filtered.forEach(emp => {
            const dept = this.storage.getDepartments().find(d => d.id === emp.departmentId);
            const pos = this.storage.getPositions().find(p => p.id === emp.positionId);

            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${emp.id}</td>
                <td>${emp.fullName}</td>
                <td>${emp.email}</td>
                <td>${dept ? dept.name : "N/A"}</td>
                <td>${pos ? pos.name : "N/A"}</td>
                <td>${formatDate(emp.startDate)}</td>
                <td>
                    <div class="flex gap-2">
                        <button class="btn btn-sm btn-secondary edit-emp-btn" data-id="${emp.id}"><i class="fas fa-edit"></i></button>
                        <button class="btn btn-sm btn-destructive delete-emp-btn" data-id="${emp.id}"><i class="fas fa-trash"></i></button>
                    </div>
                </td>
            `;
            tbody.appendChild(tr);
        });


        tbody.querySelectorAll(".edit-emp-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                const emp = this.storage.getEmployees().find(e => e.id === btn.dataset.id);
                this.openModal(emp);
            });
        });

        tbody.querySelectorAll(".delete-emp-btn").forEach(btn => {
            btn.addEventListener("click", () => this.deleteEmployee(btn.dataset.id));
        });
    }

    updateFilters() {

        const deptSelect = document.getElementById("departmentFilter");
        const posSelect = document.getElementById("positionFilter");


        deptSelect.innerHTML = '<option value="">Tất cả phòng ban</option>';
        posSelect.innerHTML = '<option value="">Tất cả chức vụ</option>';

        this.storage.getDepartments().forEach(d => {
            deptSelect.innerHTML += `<option value="${d.id}">${d.name}</option>`;
        });
        this.storage.getPositions().forEach(p => {
            posSelect.innerHTML += `<option value="${p.id}">${p.name}</option>`;
        });
    }
}