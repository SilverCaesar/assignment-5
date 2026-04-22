import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TransactionService } from '../../../../core/services/transaction';
import { AuthService } from '../../../../core/services/auth';
import { Transaction } from '../../../../shared/models/transaction';

@Component({
  selector: 'app-add-transaction',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-transaction.html'
})
export class AddTransactionComponent {

  amount: number = 0;
  category: string = '';
  date: string = '';
  notes: string = '';
  type: 'income' | 'expense' = 'expense';

  constructor(
    private transactionService: TransactionService,
    private auth: AuthService
  ) {}

  addTransaction() {
    const user = this.auth.getUser();

    if (!user) {
      console.error('User not logged in');
      return;
    }

    const transaction: Transaction = {
      amount: this.amount,
      category: this.category,
      date: this.date,
      notes: this.notes,
      type: this.type,
      userId: user.uid
    };

    this.transactionService.addTransaction(transaction)
      .then(() => {
        console.log('Transaction added successfully');

        // reset form
        this.amount = 0;
        this.category = '';
        this.date = '';
        this.notes = '';
        this.type = 'expense';
      })
      .catch(err => {
        console.error('Error adding transaction:', err);
      });
  }
}