import React, { Component } from 'react';
import styles from './InputTodo.scss';
import classnames from 'classnames/bind';

const cx = classnames.bind(styles);

const AddFisrt = ({value, onChange, onInsert}) => {
    const handleKeyPress = (e) => {
        if(e.key ==='Enter') {
            onInsert();
        }
    };
    return (
        <form method="post" action="" onSubmit={function(e) {
            e.preventDefault();
            alert('대지')
            e.target.habit.value = '';
        }.bind(this)}>
            <div className={cx('todo-input')}>
            <input onChange = {onChange}  onKeyPress={handleKeyPress} type="text" name="habit" placeholder="habit name"></input>
            <input className={cx('add-button')} onClick={onInsert} type="submit"></input>
            </div>
        </form>
    )
}

export default AddFisrt;
    

