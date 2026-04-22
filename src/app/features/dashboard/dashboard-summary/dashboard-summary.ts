import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TransactionService } from '../../../core/services/transaction';
import { AuthService } from '../../../core/services/auth';
import { Transaction } from '../../../shared/models/transaction';

@Component({
  selector: 'app-dashboard-summary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard-summary.html'
})
export class DashboardSummaryComponent implements OnInit {

  transactions: Transaction[] = [];

  totalIncome = 0;
  totalExpense = 0;
  balance = 0;

  constructor(
    private transactionService: TransactionService,
    private auth: AuthService
  ) {}

  ngOnInit() {
    const user = this.auth.getUser();
    if (!user) return;

    this.transactionService.getTransactionsOnce(user.uid)
      .then(data => {
        this.transactions = data;
        this.calculateSummary();
      });
  }

  calculateSummary() {
    this.totalIncome = 0;
    this.totalExpense = 0;

    this.transactions.forEach(t => {
      if (t.type === 'income') {
        this.totalIncome += Number(t.amount);
      } else {
        this.totalExpense += Number(t.amount);
      }
    });

    this.balance = this.totalIncome - this.totalExpense;
  }
}