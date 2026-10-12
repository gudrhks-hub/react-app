import React, { useState } from 'react';

function counter02(props) {
    const [count, setcount] = useState(0);
    function addcount() {
        const newCount = count +1;
        setcount(newCount);
        console.log(newCount);
    }
    return (
        <>
          <p>카운트 : {count} </p>
          <div>
            <button type='button' onClick={addcount}>증가</button>
            </div>  
        </>
    );
}

export default counter02;