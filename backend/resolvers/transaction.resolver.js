import Transaction from "../models/transaction.model.js";

const transactionResolver = {
  Query: {
    transactions: async (_ , __ , context) => {
      try {
        if(!context.getUser()) throw new Error("Unauthorized");

        const userId = await context.getUser().id;
        const transaction = await Transaction.find({ userId });
        return transaction;
      } catch (error) {
        console.error("Error getting transactions: " , error);
        throw new Error("Error getting transactions");
      }
    },
    transactuion: async(_ , {transactionId } , ) => {
      try {
        const transaction = await Transaction.findById(transactionId);
        return transaction;
      } catch (error) {
        console.error("Error getting transaction: " , error);
        throw new Error("Error getting transaction");
      }
    },
    // TODO => ADD categoryStatistics query
  },
  Mutation: {
    createTransaction: async(_ , { input  } , context) => {
      try {
        const newTransaction = new Transaction(
          {...input , userI : context.getUser()._id }
        )

        await newTransaction.save();
        return newTransaction;
      } catch (error) {
        console.error("Error getting transaction: " , error);
        throw new Error("Error getting transaction");
      }
    },
    
    updateTransaction: async(_ , { input }) => {
      try{
        const updatedTransaction = await Transaction.findByIdAndUpdate(input.transactionId , input, {new:true});
        return updatedTransaction;
      }catch(error){
        console.error("Error getting transaction: " , error);
        throw new Error("Error getting transaction");
      }
    },
    
    deleteTransaction: async(_ , { input  }) => {
      try{
        const updatedTransaction = await Transaction.findByIdAndDelete(input.transactionId , input, {new:true});
        return updatedTransaction;
      }catch(error){
        console.error("Error getting transaction: " , error);
        throw new Error("Error getting transaction");
      }
    }
  },
  // TODO => ADD Transaction/user relation
}

export default transactionResolver;