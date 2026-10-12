import React from 'react';

function counter01(props) {
    let count = 0;
    function addcount() {
        count = count + 1;
        console.log(count);
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

export default counter01;