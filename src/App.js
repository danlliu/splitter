import './App.css';
import { React, useCallback, useState } from 'react';

import { UsersTable, ItemsTable, GroupCostTable } from './EditableTable';

function App() {
    const [inputMode, setInputMode] = useState(0);
    const [showCalculations, setShowCalculations] = useState(false);

    const [users, setUsers] = useState([]);
    const [items, setItems] = useState([]);
    const [groupCosts, setGroupCosts] = useState([]);
    const [finalData, setFinalData] = useState([]);

    useCallback(() => {
        // Clear `users` property for all items.
        let newItems = [...items];
        for (let item of newItems) {
            item.users = [];
        }
        setItems(newItems);
    }, [users]);

    let calculate = () => {
        // Split the bill!
        let foodCosts = {};
        let totalFoodCost = 0;
        // For each item, split the cost evenly among each user.
        for (let item of items) {
            let cost = parseFloat(item.Cost) / item.users.length;
            for (let user of item.users) {
                if (!foodCosts[user]) {
                    foodCosts[user] = 0;
                }
                foodCosts[user] += cost;
                totalFoodCost += cost;
            }
        }
        // Calculate total group cost (from groupCosts)
        let groupCost = 0;
        for (let cost of groupCosts) {
            // cost.Cost is a string lmao
            groupCost += parseFloat(cost.Cost);
        }
        console.log(groupCost);
        // Calculate proportion of group cost for each user
        let splitGroupCosts = {};
        for (let user in foodCosts) {
            splitGroupCosts[user] = foodCosts[user] / totalFoodCost * groupCost;
        }
        console.log(splitGroupCosts);
        // Calculate final cost for each user
        let finalCosts = {};
        for (let user in splitGroupCosts) {
            finalCosts[user] = splitGroupCosts[user] + foodCosts[user];
        }

        // Create final data

        let newFinalData = [];
        // This is currency so round to 2 decimal points, add a dollar sign, and ensure we have two decimal places.
        let formatCurrency = (num) => {
            return '$' + num.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }
        // let roundTo2DecimalPoints = (num) => "$" + (Math.round(num * 100) / 100).toString();
        for (let user in finalCosts) {
            newFinalData.push({
                User: users[user].Name,
                FoodCost: formatCurrency(foodCosts[user]),
                GroupCost: formatCurrency(splitGroupCosts[user]),
                TotalCost: formatCurrency(finalCosts[user])
            });
        }
        setFinalData(newFinalData);
        console.log(newFinalData);
    };

    return (
        <div className="App">
            {
                inputMode === 0 && <div className="padding-2">
                    <h2>Party Members</h2>
                    <UsersTable data={users} setData={setUsers} columns={[{ name: 'Name' }]} />
                    <button className="button radius margin-1" onClick={() => setInputMode(1)}>Step 2: Enter Items</button>
                </div>
            }
            {
                inputMode === 1 && <div className="padding-2">
                    <h2>Receipt Items</h2>
                    <p>Enter one item at a time, along with who had that <i>single</i> item (multiple people indicates that they split an item.</p>
                    <p>For example, if User A and User B both had Item X, Item X will show up twice in the list.</p>
                    <ItemsTable data={items} setData={setItems} users={users} columns={[{ name: 'Item', width: '50%' }, { name: 'Cost', type: "number" }]} />
                    <button className="button radius margin-1" onClick={() => setInputMode(0)}>Back to Step 1: Edit Users</button>
                    <button className="button radius margin-1" onClick={() => setInputMode(2)}>Step 3: Group Costs</button>
                </div>
            }
            {
                inputMode === 2 && <div className="padding-2">
                    <h2>Group Costs</h2>
                    <p>Enter all costs pertaining to the party (ex. tips, service charges, etc.)</p>
                    <GroupCostTable data={groupCosts} setData={setGroupCosts} columns={[{name: "Description"}, { name: 'Cost', type: "number" }]} />
                    <button className="button radius margin-1" onClick={() => setInputMode(1)}>Back to Step 2: Edit Items</button>
                    <button className="button radius margin-1" onClick={() => setInputMode(3)}>Step 4: Split Bill</button>
                </div>
            }
            {
                inputMode === 3 && <div className="padding-2">
                    <h2>Split Bill</h2>
                    <p>Yay, we can do the math for you.</p>
                    <button className="button radius margin-1" onClick={() => {calculate(); setShowCalculations(true)}}>Click here to run the math</button>
                    {
                        showCalculations && <div className="padding-2">
                            <table className="hover">
                                <thead>
                                    <tr>
                                        <th>User</th>
                                        <th>Food Cost</th>
                                        <th>Group Cost</th>
                                        <th>Total Cost</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        finalData.map((data, index) => {
                                            return <tr key={index}>
                                                <td>{data.User}</td>
                                                <td>{data.FoodCost}</td>
                                                <td>{data.GroupCost}</td>
                                                <td>{data.TotalCost}</td>
                                            </tr>
                                        })
                                    }
                                    <tr key={'total'}>
                                        <td style={{backgroundColor: '#ccc', fontWeight: 'bold'}}>Total</td>
                                        {(() => {
                                            let totalFoodCost = 0;
                                            let totalGroupCost = 0;
                                            let formatCurrency = (num) => {
                                                return '$' + num.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                                            }
                                            for (let data of finalData) {
                                                totalFoodCost += parseFloat(data.FoodCost.replace('$', ''));
                                                totalGroupCost += parseFloat(data.GroupCost.replace('$', ''));
                                            }
                                            // Give each td grey background.
                                            return [
                                                <td style={{backgroundColor: '#ccc', fontWeight: 'bold'}}>{formatCurrency(totalFoodCost)}</td>,
                                                <td style={{backgroundColor: '#ccc', fontWeight: 'bold'}}>{formatCurrency(totalGroupCost)}</td>,
                                                <td style={{backgroundColor: '#ccc', fontWeight: 'bold'}}>{formatCurrency(totalFoodCost + totalGroupCost)}</td>
                                            ];
                                        })()}
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    }
                    <br/>
                    <button className="button radius margin-1" onClick={() => {setInputMode(2); setShowCalculations(false);}}>Back to Step 3: Group Costs</button>
                </div>
            }
        </div>
    );
}

export default App;
