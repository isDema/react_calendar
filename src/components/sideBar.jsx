import React, {useState} from 'react'
import { useSelector, useDispatch} from 'react-redux';
import AliasModal from './aliasModal';
import { addAlias, removeAlias } from '../redux/aliasSlice';


export default function SideBar(){

    const alias = useSelector((state) => state.alias.alias);
    const dispatch = useDispatch();

    const [newAlias, setNewAlias] = useState(null);



    function handleAddAlias() {
        setNewAlias({
            id: Date.now(),
            title: '',
            desc: '',
            start: new Date(),
            end: new Date(),
        });
    }

    return(
        <div>
            <div className="sd-header">
                <h1>Alias</h1>
                <button className="sd-header-button" onClick={handleAddAlias}>+</button>
            </div>
            <div className="sd-body">
                <ul>
                    {alias.map((item) => (
                        <li
                            key={item.id}
                            draggable
                            onDragStart={e => {
                                e.dataTransfer.setData('application/json', JSON.stringify(item));
                            }}
                        >
                            {item.title}
                        </li>
                    ))}
                </ul>
            </div>

            <AliasModal
                newAlias={newAlias}
                onTitleChange={(e) => setNewAlias({...newAlias, title: e.target.value})}
                onDescChange={(e) => setNewAlias({...newAlias, desc: e.target.value})}
                onStartTimeChange={(e) => setNewAlias({...newAlias, start: new Date(newAlias.start.setHours(e.target.value.split(':')[0], e.target.value.split(':')[1]))})}
                onEndTimeChange={(e) => setNewAlias({...newAlias, end: new Date(newAlias.end.setHours(e.target.value.split(':')[0], e.target.value.split(':')[1]))})}
                onAdd={() => {
                    dispatch(addAlias(newAlias));
                    setNewAlias(null);
                }}
                onClose={() => setNewAlias(null)}
                onRemove={() => {
                    dispatch(removeAlias(newAlias));
                    setNewAlias(null);
                }}
            />
        </div>
    )
}