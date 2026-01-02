// Quản lý lưu trữ dữ liệu
import { defaultDepartments, defaultPositions, sampleEmployees } from './data.js';

export class Storage {
    constructor() {
        this.employees = JSON.parse(localStorage.getItem("employees")) || [];
        this.departments = JSON.parse(localStorage.getItem("departments")) || defaultDepartments;
        this.positions = JSON.parse(localStorage.getItem("positions")) || defaultPositions;

        if (this.employees.length === 0) {
            this.employees = sampleEmployees;
            this.save();
        }
    }

    save() {
        localStorage.setItem("employees", JSON.stringify(this.employees));
        localStorage.setItem("departments", JSON.stringify(this.departments));
        localStorage.setItem("positions", JSON.stringify(this.positions));
    }

    getEmployees() { return this.employees; }
    getDepartments() { return this.departments; }
    getPositions() { return this.positions; }

    addEmployee(emp) {
        this.employees.push(emp);
        this.save();
    }
    updateEmployee(index, emp) {
        this.employees[index] = emp;
        this.save();
    }
    deleteEmployee(id) {
        this.employees = this.employees.filter(e => e.id !== id);
        this.save();
    }

    addDepartment(dept) {
        this.departments.push(dept);
        this.save();
    }
    updateDepartment(index, dept) {
        this.departments[index] = dept;
        this.save();
    }
    deleteDepartment(id) {
        this.departments = this.departments.filter(d => d.id !== id);
        this.save();
    }

    addPosition(pos) {
        this.positions.push(pos);
        this.save();
    }
    updatePosition(index, pos) {
        this.positions[index] = pos;
        this.save();
    }
    deletePosition(id) {
        this.positions = this.positions.filter(p => p.id !== id);
        this.save();
    }

    restore(data) {
        this.employees = data.employees;
        this.departments = data.departments;
        this.positions = data.positions;
        this.save();
    }

    clear() {
        localStorage.clear();
        location.reload();
    }
}