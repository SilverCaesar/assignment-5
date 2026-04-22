import { Injectable } from '@angular/core';

import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  query,
  where,
  onSnapshot
} from 'firebase/firestore';

import { db } from '../firebase/firebase.config';
import { Transaction } from '../../shared/models/transaction';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  private collectionName = 'transactions';

  // ➕ CREATE
  addTransaction(transaction: Transaction, userId: string) {
  const ref = collection(db, this.collectionName);

  return addDoc(ref, {
    ...transaction,
    userId
  });
}

  // 📥 READ (one-time fetch)
  async getTransactionsOnce(userId: string): Promise<Transaction[]> {
    const ref = collection(db, this.collectionName);
    const q = query(ref, where('userId', '==', userId));

    const snapshot = await getDocs(q);

    return this.mapSnapshot(snapshot);
  }

  // 📡 REAL-TIME READ (optional but powerful for dashboard)
  getTransactionsRealtime(userId: string, callback: (data: Transaction[]) => void) {
    const ref = collection(db, this.collectionName);
    const q = query(ref, where('userId', '==', userId));

    return onSnapshot(q, (snapshot) => {
      const data = this.mapSnapshot(snapshot);
      
      callback(data);
    });
  }

  // ✏️ UPDATE
  updateTransaction(id: string, data: Partial<Transaction>) {
    const ref = doc(db, this.collectionName, id);
    return updateDoc(ref, data);
  }

  // 🗑 DELETE
  deleteTransaction(id: string) {
    const ref = doc(db, this.collectionName, id);
    return deleteDoc(ref);
  }

  private mapSnapshot(snapshot: any): Transaction[] {
  return snapshot.docs.map((doc: any) => ({
    id: doc.id,
    ...doc.data()
  })) as Transaction[];
}
}