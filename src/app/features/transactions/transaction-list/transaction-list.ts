import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TransactionService } from '../../../core/services/transaction';
import { AuthService } from '../../../core/services/auth';
import { Transaction } from '../../../shared/models/transaction';
import { Observable, Subscription } from 'rxjs';
import { switchMap, filter } from 'rxjs/operators';
import { ChangeDetectorRef } from '@angular/core';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-transaction-list',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatButtonModule],
  templateUrl: './transaction-list.html',
  styleUrls: ['./transaction-list.css']
})
export class TransactionListComponent implements OnInit, OnDestroy {

  selectedTransaction: Transaction | null = null;
  transactions: Transaction[] = [];

  // filters
searchTerm = '';
selectedType: 'all' | 'income' | 'expense' = 'all';

startDate: string = '';
endDate: string = '';

minAmount: number | null = null;
maxAmount: number | null = null;

// filtered list
filteredTransactions: Transaction[] = [];

  private sub?: Subscription;

  constructor(
    private transactionService: TransactionService,
    private auth: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

ngOnInit() {
  console.log('LIST COMPONENT STARTED');

  this.auth.user$.subscribe(user => {
    console.log('🔥 USER EMITTED IN LIST:', user);

    if (!user) return;

    console.log('👉 FETCHING TRANSACTIONS FOR:', user.uid);

    this.transactionService.getTransactionsRealtime(user.uid, (data) => {
      console.log('📦 TRANSACTIONS RECEIVED:', data);
      this.transactions = [...data];
      this.cdr.detectChanges();
      this.applyFilters();
    });
  });
}

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }

  deleteTransaction(id: string) {
    this.transactionService.deleteTransaction(id);
  }

  editTransaction(transaction: Transaction) {
    this.selectedTransaction = { ...transaction };
  }

  updateTransaction() {
    if (!this.selectedTransaction?.id) return;

    const { id, ...data } = this.selectedTransaction;

    this.transactionService.updateTransaction(id, data)
      .then(() => {
        this.selectedTransaction = null;
      });
  }

  cancelEdit() {
    this.selectedTransaction = null;
  }

  trackById(index: number, item: Transaction) {
  return item.id;
}

applyFilters() {
  let result = [...this.transactions];

  // 🔎 search (category + notes)
  if (this.searchTerm.trim()) {
    const term = this.searchTerm.toLowerCase();

    result = result.filter(t =>
      t.category.toLowerCase().includes(term) ||
      (t.notes ?? '').toLowerCase().includes(term)
    );
  }

  // 🧾 type filter
  if (this.selectedType !== 'all') {
    result = result.filter(t => t.type === this.selectedType);
  }

  // 📅 date filter
  if (this.startDate) {
    result = result.filter(t => t.date >= this.startDate);
  }

  if (this.endDate) {
    result = result.filter(t => t.date <= this.endDate);
  }

  // 💰 amount filter
  if (this.minAmount !== null) {
    result = result.filter(t => Number(t.amount) >= this.minAmount!);
  }

  if (this.maxAmount !== null) {
    result = result.filter(t => Number(t.amount) <= this.maxAmount!);
  }

  this.filteredTransactions = result;
}

onFilterChange() {
  this.applyFilters();
}
}