import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TransactionService } from '../../../core/services/transaction';
import { AuthService } from '../../../core/services/auth';
import { Transaction } from '../../../shared/models/transaction';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-transaction-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './transaction-list.html'
})
export class TransactionListComponent implements OnInit {
  selectedTransaction: Transaction | null = null;

  transactions: Transaction[] = [];

  constructor(
    private transactionService: TransactionService,
    private auth: AuthService
  ) {}

  ngOnInit() {
    this.loadTransactions();
  }

  loadTransactions() {
    const user = this.auth.getUser();

    if (!user) return;

    this.transactionService.getTransactionsOnce(user.uid)
      .then(data => {
        this.transactions = data;
      })
      .catch(err => {
        console.error('Error loading transactions:', err);
      });
  }

  deleteTransaction(id: string) {
    this.transactionService.deleteTransaction(id)
      .then(() => {
        // remove locally for instant UI update
        this.transactions = this.transactions.filter(t => t.id !== id);
      })
      .catch(err => {
        console.error('Delete failed:', err);
      });
  }

  editTransaction(transaction: Transaction) {
  this.selectedTransaction = { ...transaction };
}

  updateTransaction() {
  if (!this.selectedTransaction || !this.selectedTransaction.id) return;

  const { id, ...data } = this.selectedTransaction;

  this.transactionService.updateTransaction(id, data)
    .then(() => {
      // update local list
      const index = this.transactions.findIndex(t => t.id === id);
      if (index !== -1) {
        this.transactions[index] = this.selectedTransaction!;
      }

      this.selectedTransaction = null;
    })
    .catch(err => {
      console.error('Update failed:', err);
    });
}
}