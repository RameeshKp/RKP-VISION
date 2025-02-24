import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    Button,
    FlatList,
    TouchableOpacity,
    Alert,
    StyleSheet,
    SafeAreaView,
    Image,
    Keyboard,
} from 'react-native';
import {
    addExpense,
    getMonthlyExpenses,
    getTotalMonthlyExpense,
    editExpense,
    deleteExpense,
} from '../actions/database';
import { screenSize } from '../constants/screens';
import { useNavigation } from '@react-navigation/native';
import { Images } from '../constants/images';
import { Fonts } from '../constants/fonts';
import { formatDate, isValidNumber } from '../actions/common';

interface Expense {
    id: number;
    description: string;
    amount: number;
    date: string;
}

const Expense: React.FC = () => {
    const [description, setDescription] = useState<string>('');
    const [amount, setAmount] = useState<string>('');
    const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [total, setTotal] = useState<number>(0);

    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();
    const navigation: any = useNavigation();

    useEffect(() => {
        loadExpenses();
    }, []);

    const loadExpenses = async () => {
        try {
            const expensesList = await getMonthlyExpenses(
                String(currentMonth).padStart(2, '0'),
                String(currentYear)
            );
            const totalExpense = await getTotalMonthlyExpense(
                String(currentMonth).padStart(2, '0'),
                String(currentYear)
            );
            setExpenses(expensesList);
            setTotal(totalExpense);
        } catch (error) {
            console.log('Error loading expenses:', error);
        }
    };

    const handleAddOrEditExpense = async () => {
        Keyboard.dismiss()
        if (!description || !amount) {
            Alert?.alert('Please enter both description and amount');
            return;
        }

        const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

        try {
            if (selectedExpense) {
                // If editing an expense
                await editExpense(selectedExpense.id, description, parseFloat(amount), date);
                setSelectedExpense(null); // Clear selected expense after editing
            } else {
                // If adding a new expense
                await addExpense(description, parseFloat(amount), date);
            }

            setDescription('');
            setAmount('');
            loadExpenses();
        } catch (error) {
            console.log('Error adding/editing expense:', error);
        }
    };

    const handleDeleteExpense = (id: number) => {
        Alert.alert('Delete Expense', 'Are you sure you want to delete this expense?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Delete',
                style: 'destructive',
                onPress: async () => {
                    try {
                        await deleteExpense(id);
                        loadExpenses();
                    } catch (error) {
                        console.log('Error deleting expense:', error);
                    }
                },
            },
        ]);
    };

    const handleEditExpense = (expense: Expense) => {
        setSelectedExpense(expense);
        setDescription(expense.description);
        setAmount(expense.amount.toString());
    };
    const checkExpenseSubmit = () => {
        if (isValidNumber(amount) && description?.length > 1) {
            return true
        } else {
            return false
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={{
                padding: 20,
                width: screenSize.width,
                justifyContent: 'flex-start',
                alignItems: 'center',
                borderBottomWidth: 1,
                borderBottomColor: 'grey',
                flexDirection: 'row'
            }}>
                <TouchableOpacity
                    style={{
                    }}
                    onPress={() => navigation.goBack()}>
                    <Image
                        source={Images.down}
                        style={{
                            height: 13,
                            width: 21,
                            resizeMode: 'contain',
                            transform: [{ rotate: '90deg' }],
                        }}
                    />

                </TouchableOpacity>
                <View style={{
                    width: screenSize.width - 61,
                    alignItems: 'center',
                }}>
                    <Text style={{
                        fontFamily: Fonts.semiBold_SF,
                        color: '#000000',
                        fontSize: 20,
                        textTransform: 'uppercase'
                    }}>My Expense </Text>
                </View>
            </View>
            <View style={{
                marginTop: 20,
                paddingHorizontal: 20
            }}>
                <TextInput
                    style={styles.input}
                    placeholder="Description"
                    value={description}
                    onChangeText={setDescription}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Amount"
                    keyboardType="numeric"
                    value={amount}
                    onChangeText={setAmount}
                />

                <TouchableOpacity
                    disabled={!checkExpenseSubmit()}
                    style={{
                        backgroundColor: '#096fab',
                        width: '100%',
                        borderColor: '#096fab',
                        borderWidth: 1,
                        borderRadius: 5,
                        padding: 10,
                        justifyContent: 'center',
                        alignItems: 'center',
                        opacity: checkExpenseSubmit() ? 1 : 0.5
                    }}
                    onPress={handleAddOrEditExpense}>
                    <Text style={{
                        color: '#FFFFFF',
                        fontSize: 14,
                        fontFamily: Fonts.bold,
                        textTransform: 'uppercase'
                    }}> {selectedExpense ? 'Edit Expense' : ' Add Expense '}</Text>
                </TouchableOpacity>

            </View>


            <Text style={styles.totalText}>Total Expense for this Month: ₹{total}</Text>

            <FlatList
                data={expenses?.reverse()}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.expenseItem}>
                        <View>
                            <Text style={{
                                fontFamily: Fonts.medium,
                                fontSize: 14,
                                width: screenSize.width - 100
                            }}>{item.description}</Text>
                            <Text style={{
                                fontFamily: Fonts.regular,
                                fontSize: 14,
                                marginVertical: 5,
                                width: screenSize.width - 100
                            }}>{formatDate(item.date)}</Text>
                            <Text style={{
                                fontFamily: Fonts.regular,
                                fontSize: 14,
                                color: '#014014',
                                width: screenSize.width - 100
                            }}>₹ {item.amount}</Text>
                        </View>
                        <View style={styles.buttonsContainer}>
                            <TouchableOpacity
                                onPress={() => handleEditExpense(item)}
                            >

                                <Image source={Images.edit} style={{
                                    width: 20,
                                    height: 20,
                                    resizeMode: 'contain'
                                }}></Image>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => handleDeleteExpense(item.id)}
                            >
                                <Image source={Images.delete} style={{
                                    width: 20,
                                    height: 20,
                                    left: 10,
                                    resizeMode: 'contain'
                                }}></Image>
                            </TouchableOpacity>
                        </View>
                    </View>
                )
                }
            />
        </SafeAreaView >
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
    },
    totalText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginVertical: 20,
        paddingHorizontal: 20
    },
    expenseItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 0,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        alignItems: 'center',
        paddingVertical: 10,
        marginHorizontal: 20
    },
    buttonsContainer: {
        flexDirection: 'row',
    },


    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default Expense;
 