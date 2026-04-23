import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from '../../../../core/services/auth';
import { TransactionService } from '../../../../core/services/transaction';
import { Transaction } from '../../../../shared/models/transaction';
import { Budget } from '../../../../shared/models/budget';
import { BudgetService } from '../../../../core/services/budget';

import { Chart } from 'chart.js/auto';
import { DashboardSummaryComponent } from '../../dashboard-summary/dashboard-summary';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

import { DecimalPipe } from '@angular/common';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterOutlet, RouterLink, DashboardSummaryComponent, MatCardModule, MatButtonModule, DecimalPipe],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit {
  @ViewChild('chartCanvas') chartCanvas!: ElementRef;
  @ViewChild('incomeExpenseCanvas') incomeExpenseCanvas!: ElementRef;

  dataReady = false;

  budgets: Budget[] = [];

  budgetWarnings: string[] = [];

  chart: any;
  incomeExpenseChart: any;
  

  transactions: Transaction[] = [];

  totalIncome = 0;
  totalExpense = 0;
  balance = 0;

  categoryTotals: { [key: string]: number } = {};

  constructor(
    public auth: AuthService,
    private router: Router,
    private transactionService: TransactionService,
    private budgetService: BudgetService
  ) {}

ngOnInit() {
  const user = this.auth.getUser();
  if (!user) return;

  Promise.all([
    this.transactionService.getTransactionsOnce(user.uid),
    this.budgetService.getBudgets(user.uid)
  ]).then(([transactions, budgets]) => {

    this.transactions = transactions;
    this.budgets = budgets;

    this.calculateSummary();

    // wait for view + data
    setTimeout(() => {
      this.createChart();
      this.createIncomeExpenseChart();
    });

  });
}


  logout() {
    this.auth.logout().then(() => {
      this.router.navigate(['/login']);
    });
  }

  calculateSummary() {
    this.totalIncome = 0;
    this.totalExpense = 0;
    this.categoryTotals = {};

    this.transactions.forEach(t => {

      if (t.type === 'income') {
        this.totalIncome += Number(t.amount);
      } else {
        this.totalExpense += Number(t.amount);
      }

      if (!this.categoryTotals[t.category]) {
        this.categoryTotals[t.category] = 0;
      }

      this.categoryTotals[t.category] += Number(t.amount);
    });

    this.balance = this.totalIncome - this.totalExpense;


    this.budgetWarnings = [];

    this.budgets.forEach(budget => {

      const spent = this.categoryTotals[budget.category] || 0;

      if (spent > budget.limit) {
        this.budgetWarnings.push(
          `${budget.category} budget exceeded! (${spent}/${budget.limit})`
        );
      } else if (spent > budget.limit * 0.8) {
        this.budgetWarnings.push(
          `${budget.category} is nearing budget (${spent}/${budget.limit})`
        );
      }


    });

  }

  createChart() {
  if (!this.chartCanvas) return;

  const labels = Object.keys(this.categoryTotals);
  const data = Object.values(this.categoryTotals);

  if (this.chart) {
    this.chart.destroy();
  }

  const ctx = this.chartCanvas.nativeElement.getContext('2d');

  if (!ctx) return;

  this.chart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels,
      datasets: [{ data }]
    },
    options: {
      responsive: true
    }
  });
}

createIncomeExpenseChart() {
  if (!this.incomeExpenseCanvas) return;

  if (this.incomeExpenseChart) {
    this.incomeExpenseChart.destroy();
  }

  const ctx = this.incomeExpenseCanvas.nativeElement.getContext('2d');

  if (!ctx) return;

  this.incomeExpenseChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Income', 'Expense'],
      datasets: [
        {
          data: [this.totalIncome, this.totalExpense]
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: false
        }
      }
    }
  });
}


}