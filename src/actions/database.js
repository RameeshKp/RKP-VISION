import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase({ name: 'expenses.db', location: 'default' });

// Create the expenses table
db.transaction((tx) => {
    tx.executeSql(
        `CREATE TABLE IF NOT EXISTS expenses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      description TEXT,
      amount REAL,
      date TEXT
    )`,
        [],
        () => console.log('Table created successfully'),
        (error) => console.log('Error creating table:', error)
    );
});

// Function to add an expense
export const addExpense = (description, amount, date) => {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                'INSERT INTO expenses (description, amount, date) VALUES (?, ?, ?)',
                [description, amount, date],
                (_, result) => resolve(result),
                (_, error) => reject(error)
            );
        });
    });
};

// Function to get expenses for a given month
export const getMonthlyExpenses = (month, year) => {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                `SELECT * FROM expenses WHERE strftime('%m', date) = ? AND strftime('%Y', date) = ?`,
                [month, year],
                (_, { rows }) => resolve(rows.raw()),
                (_, error) => reject(error)
            );
        });
    });
};

// Function to get the total amount for a given month
export const getTotalMonthlyExpense = (month, year) => {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                `SELECT SUM(amount) AS total FROM expenses WHERE strftime('%m', date) = ? AND strftime('%Y', date) = ?`,
                [month, year],
                (_, { rows }) => resolve(rows.item(0).total || 0),
                (_, error) => reject(error)
            );
        });
    });
};
export const editExpense = (id, description, amount, date) => {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                `UPDATE expenses SET description = ?, amount = ?, date = ? WHERE id = ?`,
                [description, amount, date, id],
                (_, result) => resolve(result),
                (_, error) => reject(error)
            );
        });
    });
};

// Function to delete an expense
export const deleteExpense = (id) => {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                `DELETE FROM expenses WHERE id = ?`,
                [id],
                (_, result) => resolve(result),
                (_, error) => reject(error)
            );
        });
    });
};