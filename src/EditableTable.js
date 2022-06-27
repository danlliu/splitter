import {React} from 'react';

function UsersTable(props) {
    const {data, setData, columns} = props;
    return (
        <table className="hover">
            <thead>
                <tr>
                    <th width="48px"></th>
                    {columns.map(column => (<th key={column.name}>{column.name}</th>))}
                </tr>
            </thead>
            <tbody>
                {data.map(row => (
                    <tr key={row.id}>
                        <td>
                            <div className="grid-x grid-padding-x align-middle margin-0">
                                <button className="button alert margin-0 radius" style={{padding: "0.25rem", width: "32px", height: "32px"}} onClick={() => setData(data.filter(r => r.id !== row.id))}>(x)</button>
                            </div>
                        </td>
                        {columns.map(column => (
                            <td key={column.name} className="grid-x grid-padding-x align-middle margin-0">
                                <input type="text" className="margin-0 height-100" value={row[column.name]} onChange={e => {
                                    const newData = [...data];
                                    newData[row.id][column.name] = e.target.value;
                                    setData(newData);
                                }}/>
                            </td>
                        ))}
                    </tr>
                ))}
                <tr key={'new'}>
                    <td colSpan={columns.length + 1} className="padding-1">
                        <button className="button margin-0 radius" onClick={() => {
                            const newData = [...data];
                            newData.push({id: newData.length});
                            for (let column of columns) {
                                newData[newData.length - 1][column.name] = '';
                            }
                            setData(newData);
                        }}>(+) Add another person</button>
                    </td>
                </tr>
            </tbody>
        </table>
    );
}

function ItemsTable(props) {
    const {data, setData, users, columns} = props;
    return (
        <table className="hover">
            <thead>
                <tr>
                    <th width="48px"></th>
                    {columns.map(column => (<th key={column.name}>{column.name}</th>))}
                </tr>
            </thead>
            <tbody>
                {data.map(row => (
                    <tr key={row.id}>
                        <td>
                            <div className="grid-x grid-padding-x align-middle margin-0">
                                <button className="button alert margin-0 radius" style={{padding: "0.25rem", width: "32px", height: "32px"}} onClick={() => setData(data.filter(r => r.id !== row.id))}>(x)</button>
                            </div>
                        </td>
                        {columns.map(column => (
                            <td key={column.name}>
                                <div className="grid-x grid-padding-x align-middle margin-0">
                                    <input type={column.type || "text"} className="margin-0 height-100" value={row[column.name]} onChange={e => {
                                        const newData = [...data];
                                        newData[row.id][column.name] = e.target.value;
                                        setData(newData);
                                    }}/>
                                </div>
                            </td>
                        ))}
                        <fieldset style={{margin: "8px"}}>
                            <legend>Who had this item?</legend>
                            {users.map(user => (
                                // checkboxes
                                <>
                                    <input id={`${row.id}-${user.id}`} type="checkbox" checked={row.users.includes(user.id)} onChange={e => {
                                        const newData = [...data];
                                        if (e.target.checked) {
                                            newData[row.id].users.push(user.id);
                                        }
                                        else {
                                            newData[row.id].users = newData[row.id].users.filter(u => u !== user.id);
                                        }
                                        setData(newData);
                                    }}/>
                                    <label for={`${row.id}-${user.id}`}>{user.Name}</label>
                                </>
                                ))}
                        </fieldset>
                    </tr>
                ))}
                <tr key={'new'}>
                    <td colSpan={columns.length + 1} className="padding-1">
                        <button className="button margin-0 radius" onClick={() => {
                            const newData = [...data];
                            newData.push({id: newData.length});
                            for (let column of columns) {
                                newData[newData.length - 1][column.name] = '';
                            }
                            newData[newData.length - 1]['users'] = [];
                            setData(newData);
                        }}>(+) Add another item</button>
                    </td>
                </tr>
            </tbody>
        </table>
    );
}

function GroupCostTable(props) {
    const {data, setData, columns} = props;
    return (
        <table className="hover">
            <thead>
                <tr>
                    <th width="48px"></th>
                    {columns.map(column => (<th key={column.name}>{column.name}</th>))}
                </tr>
            </thead>
            <tbody>
                {data.map(row => (
                    <tr key={row.id}>
                        <td>
                            <div className="grid-x grid-padding-x align-middle margin-0">
                                <button className="button alert margin-0 radius" style={{padding: "0.25rem", width: "32px", height: "32px"}} onClick={() => setData(data.filter(r => r.id !== row.id))}>(x)</button>
                            </div>
                        </td>
                        {columns.map(column => (
                            <td key={column.name}>
                                <div className="grid-x grid-padding-x align-middle margin-0">
                                    <input type={column.type || "text"} className="margin-0 height-100" value={row[column.name]} onChange={e => {
                                        const newData = [...data];
                                        newData[row.id][column.name] = e.target.value;
                                        setData(newData);
                                    }}/>
                                </div>
                            </td>
                        ))}
                    </tr>
                ))}
                <tr key={'new'}>
                    <td colSpan={columns.length + 1} className="padding-1">
                        <button className="button margin-0 radius" onClick={() => {
                            const newData = [...data];
                            newData.push({id: newData.length});
                            for (let column of columns) {
                                newData[newData.length - 1][column.name] = '';
                            }
                            newData[newData.length - 1]['users'] = [];
                            setData(newData);
                        }}>(+) Add another item</button>
                    </td>
                </tr>
                <tr key={'total'}>
                    <td colSpan={columns.length + 1} className="padding-1">
                        <div className="grid-x grid-padding-x align-middle margin-0">
                            <label className="margin-0">Total:</label>
                            <input type="text" className="margin-0 height-100" value={
                                ((num) => {
                                    return '$' + num.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                                })(data.reduce((acc, row) => acc + parseFloat(row.Cost) || 0, 0))
                            } readOnly/>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    );
}

export { UsersTable, ItemsTable, GroupCostTable };