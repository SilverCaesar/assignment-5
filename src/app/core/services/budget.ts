import { Injectable } from '@angular/core';
import {
  collection,
  addDoc,
  getDocs,
  query,
  where
} from 'firebase/firestore';

import { db } from '../firebase/firebase.config';
import { Budget } from '../../shared/models/budget';

@Injectable({
  providedIn: 'root'
})
export class BudgetService {

  private collectionName = 'budgets';

  // ➕ create budget
  addBudget(budget: Budget) {
    const ref = collection(db, this.collectionName);
    return addDoc(ref, budget);
  }

  // 📥 get budgets for user
  async getBudgets(userId: string): Promise<Budget[]> {
    const ref = collection(db, this.collectionName);
    const q = query(ref, where('userId', '==', userId));

    const snapshot = await getDocs(q);

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Budget[];
  }
}