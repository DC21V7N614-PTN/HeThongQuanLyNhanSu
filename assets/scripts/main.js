// Entry Point
import { Storage } from './storage.js';
import { UI } from './ui.js';
import { EmployeeManager } from './employees.js';
import { DepartmentManager } from './departments.js';
import { PositionManager } from './positions.js';
import { ReportManager } from './reports.js';

class App {
    constructor() {
        this.storage = new Storage();
        this.ui = new UI();

        this.employees = new EmployeeManager(this.storage, this.ui);
        this.departments = new DepartmentManager(this.storage, this.ui);
        this.positions = new PositionManager(this.storage, this.ui);
        this.reports = new ReportManager(this.storage, this.ui);

        this.initDashboard();
        this.setupEvents();
    }

    initDashboard() {
        this.updateDashboardCounts();
    }

    setupEvents() {

        window.addEventListener('dataChanged', () => {
            this.updateDashboardCounts();

            this.employees.updateFilters();
        });


        window.addEventListener('pageChanged', (e) => {
            if (e.detail.pageId === 'reports') {
                this.reports.generateAll();
            } else if (e.detail.pageId === 'departments') {
                this.departments.renderTable();
            } else if (e.detail.pageId === 'positions') {
                this.positions.renderTable();
            } else if (e.detail.pageId === 'employees') {
                this.employees.renderTable();
                this.employees.updateFilters();
            }
        });
    }

    updateDashboardCounts() {
        document.getElementById("totalEmployees").textContent = this.storage.getEmployees().length;
        document.getElementById("totalDepartments").textContent = this.storage.getDepartments().length;
        document.getElementById("totalPositions").textContent = this.storage.getPositions().length;
    }
}


document.addEventListener("DOMContentLoaded", () => {
    window.hrApp = new App();
});