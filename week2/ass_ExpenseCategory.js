function calculateTotalSpentByCategory(transactions) {
    let otp = [{}];
    for (let i of transactions) 
    {
        const category = transactions.category;
        const amount = transactions.price;

        if(otp[category])
        {
           otp[amount] = otp[amount]+price;
        }
        else {
            otp[amount] = price;
        }

    }
    const result =[];
    for (let j in otp)
    {
        result.push( {
            category : j,
            total_price : otp[j]
        });
    }

  return result;
}

