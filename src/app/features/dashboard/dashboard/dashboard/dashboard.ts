import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from '../../../../core/services/auth';
import { TransactionService } from '../../../../core/services/transaction';
import { Transaction } from '../../../../shared/models/transaction';
import { Budget } from '../../../../shared/models/budget';
import { BudgetService } from '../../../../core/services/budget';

import { Chart } from 'chart.js/auto';
import { DashboardSummaryComponent } from '../../dashboard-summary/dashboard-summary';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterOutlet, RouterLink, DashboardSummaryComponent],
  templateUrl: './dashboard.html'
})
export class DashboardComponent implements OnInit {

  dataReady = false;

  budgets: Budget[] = [];

  budgetWarnings: string[] = [];

  chart: any;
  

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
    this.dataReady = true;

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

    this.createChart();
  }

  createChart() {
  const labels = Object.keys(this.categoryTotals);
  const data = Object.values(this.categoryTotals);

  if (!this.transactions.length) return;

  const canvas = document.getElementById('categoryChart') as HTMLCanvasElement;
  if (!canvas) return;

  this.chart = new Chart('categoryChart', {
    type: 'pie',
    data: {
      labels: labels,
      datasets: [
        {
          data: data
        }
      ]
    },
    options: {
      responsive: true
    }
  });
}
}